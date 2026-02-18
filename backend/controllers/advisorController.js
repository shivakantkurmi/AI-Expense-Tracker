const { GoogleGenerativeAI } = require("@google/generative-ai");
const Expense = require("../models/Expense");
const Income = require("../models/Income");
const moment = require("moment");

// ────────────────────────────────────────────────
// Robust date range parser
// ────────────────────────────────────────────────
const getDateRange = (question) => {
  const q = question.toLowerCase().trim();
  const today = new Date();
  const thisYear = today.getFullYear();
  const thisMonth = today.getMonth();

  // 1. All-time keywords
  if (/all\s*time|lifetime|overall|total\s*(expense|expenses|income)|everything/gi.test(q)) {
    return { startDate: null, endDate: null, period: "All Time", isAllTime: true };
  }

  // 2. Month range (jan 2025 to march 2025, january to march, etc.)
  const months = {
    jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2,
    apr: 3, april: 3, may: 4, jun: 5, june: 5, jul: 6, july: 6,
    aug: 7, august: 7, sep: 8, september: 8, oct: 9, october: 9,
    nov: 10, november: 10, dec: 11, december: 11,
  };
  const monthKeys = Object.keys(months).join("|");
  const rangeRegex = new RegExp(
    `(?:between|from)?\\s*(${monthKeys})(?:\\s*(\\d{4}))?\\s*(?:to|and|-)\\s*(${monthKeys})(?:\\s*(\\d{4}))?`,
    "i"
  );
  const rangeMatch = q.match(rangeRegex);

  if (rangeMatch) {
    const startMonth = months[rangeMatch[1].toLowerCase()];
    const startYear = rangeMatch[2] ? parseInt(rangeMatch[2]) : thisYear;
    const endMonth   = months[rangeMatch[3].toLowerCase()];
    const endYear   = rangeMatch[4] ? parseInt(rangeMatch[4]) : startYear;

    const start = new Date(startYear, startMonth, 1);
    const end   = new Date(endYear, endMonth + 1, 0, 23, 59, 59);

    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && start <= end) {
      return {
        startDate: start,
        endDate: end,
        period: `${rangeMatch[1].charAt(0).toUpperCase() + rangeMatch[1].slice(1)} ${startYear} to ${rangeMatch[3].charAt(0).toUpperCase() + rangeMatch[3].slice(1)} ${endYear}`,
        isAllTime: false,
      };
    }
  }

  // 3. Standalone year (e.g. "in 2025", "expenses 2024", "2023 total")
  const yearOnlyMatch = q.match(/\b(20\d{2})\b/);
  if (yearOnlyMatch) {
    const yr = parseInt(yearOnlyMatch[1]);
    if (yr >= 2000 && yr <= thisYear + 10) {  // reasonable range to avoid nonsense years
      const start = new Date(yr, 0, 1);
      const end = yr === thisYear ? today : new Date(yr, 11, 31, 23, 59, 59);
      return {
        startDate: start,
        endDate: end,
        period: yr.toString(),
        isAllTime: false,
      };
    }
  }

  // 4. Single month-year (e.g. "january 2025", "expenses march")
  const singleMonthRegex = new RegExp(`\\b(${monthKeys})\\b(?:\\s*(\\d{4}))?`, "i");
  const singleMatch = q.match(singleMonthRegex);
  if (singleMatch) {
    const mName = singleMatch[1].toLowerCase();
    const m = months[mName];
    const yr = singleMatch[2] ? parseInt(singleMatch[2]) : thisYear;
    const start = new Date(yr, m, 1);
    const end = new Date(yr, m + 1, 0, 23, 59, 59);
    return { startDate: start, endDate: end, period: `${mName.charAt(0).toUpperCase() + mName.slice(1)} ${yr}`, isAllTime: false };
  }

  // 5. Relative periods (last N ...)
  const relMatch = q.match(/(\d+)\s*(day|days|week|weeks|month|months|year|years)/i);
  if (relMatch) {
    const num = parseInt(relMatch[1], 10);
    const unit = relMatch[2].toLowerCase();
    let start;
    if (unit.startsWith("day")) start = moment().subtract(num, "days").startOf("day").toDate();
    else if (unit.startsWith("week")) start = moment().subtract(num, "weeks").startOf("week").toDate();
    else if (unit.startsWith("month")) start = moment().subtract(num, "months").startOf("month").toDate();
    else if (unit.startsWith("year")) start = moment().subtract(num, "years").startOf("year").toDate();
    if (start) {
      return {
        startDate: start,
        endDate: today,
        period: `Last ${num} ${unit.charAt(0).toUpperCase() + unit.slice(1)}${num > 1 ? 's' : ''}`,
        isAllTime: false,
      };
    }
  }

  // 6. Named: this/last month
  if (q.includes("this month") || q.includes("current month")) {
    return { startDate: new Date(thisYear, thisMonth, 1), endDate: today, period: "This Month", isAllTime: false };
  }
  if (q.includes("last month") || q.includes("previous month")) {
    const start = new Date(thisYear, thisMonth - 1, 1);
    const end = new Date(thisYear, thisMonth, 0, 23, 59, 59);
    return { startDate: start, endDate: end, period: "Last Month", isAllTime: false };
  }

  // Default fallback
  return {
    startDate: new Date(thisYear, thisMonth, 1),
    endDate: today,
    period: "This Month",
    isAllTime: false,
  };
};

// ────────────────────────────────────────────────
// Controller
// ────────────────────────────────────────────────
const advisorController = {
  getAdvice: async (req, res) => {
    try {
      const { question, intent = "data" } = req.body;
      const userId = req.user?.id;

      if (!userId) return res.status(401).json({ success: false, message: "Not authenticated" });
      if (!question?.trim()) return res.status(400).json({ success: false, message: "Question required" });

      let financialContext = "(General advice mode – no user data loaded)";
      let period = "N/A";  // ← Safe default to prevent ReferenceError
      let stats = {};

      if (intent === "data") {
        const { startDate, endDate, period: detectedPeriod, isAllTime } = getDateRange(question);
        period = detectedPeriod;

        const periodFilter = { user: userId };
        if (!isAllTime && startDate && endDate) {
          periodFilter.date = { $gte: startDate, $lte: endDate };
        }

        const [periodExpenses, periodIncome, allExpenses, allIncome] = await Promise.all([
          Expense.find(periodFilter).lean(),
          Income.find(periodFilter).lean(),
          Expense.find({ user: userId }).lean(),
          Income.find({ user: userId }).lean(),
        ]);

        const sum = (arr) => arr.reduce((acc, item) => acc + (Number(item?.amount) || 0), 0);

        const periodExp = sum(periodExpenses);
        const periodInc = sum(periodIncome);
        const totalExp  = sum(allExpenses);
        const totalInc  = sum(allIncome);
        const netPeriod = periodInc - periodExp;

        const byCategory = periodExpenses.reduce((acc, e) => {
          const cat = e.category || "Uncategorized";
          acc[cat] = (acc[cat] || 0) + Number(e.amount || 0);
          return acc;
        }, {});

        const categoryLines = Object.entries(byCategory)
          .sort(([,a], [,b]) => b - a)
          .map(([cat, amt]) => `• ${cat}: ₹${Math.round(amt)}`)
          .join("\n") || "→ NO EXPENSE CATEGORIES RECORDED IN THIS PERIOD";

        const bySource = periodIncome.reduce((acc, i) => {
          const src = i.source || "Uncategorized";
          acc[src] = (acc[src] || 0) + Number(i.amount || 0);
          return acc;
        }, {});

        const incomeLines = Object.entries(bySource)
          .map(([src, amt]) => `• ${src}: ₹${Math.round(amt)}`)
          .join("\n") || "→ NO INCOME SOURCES RECORDED IN THIS PERIOD";

        financialContext = `
REQUESTED PERIOD: ${period}
DATE RANGE: ${isAllTime ? "All recorded history" : `${moment(startDate).format("D MMM YYYY")} – ${moment(endDate).format("D MMM YYYY")}`}

EXPENSES THIS PERIOD: ₹${Math.round(periodExp)} (${periodExpenses.length} transactions) ${periodExpenses.length === 0 ? " → PERIOD HAS NO RECORDS AT ALL" : ""}
INCOME THIS PERIOD:   ₹${Math.round(periodInc)} (${periodIncome.length} transactions) ${periodIncome.length === 0 ? " → PERIOD HAS NO RECORDS AT ALL" : ""}
NET THIS PERIOD:      ₹${Math.round(netPeriod)}

EXPENSE CATEGORIES THIS PERIOD:
${categoryLines}

INCOME SOURCES THIS PERIOD:
${incomeLines}

ALL-TIME TOTALS — ONLY USE WHEN QUESTION EXPLICITLY SAYS "all time", "total ever", "lifetime", "overall", "entire history":
Expenses: ₹${Math.round(totalExp)}
Income:   ₹${Math.round(totalInc)}
Net savings: ₹${Math.round(totalInc - totalExp)}
        `.trim();

        stats = {
          periodExpense: periodExp,
          periodIncome: periodInc,
          totalExpense: totalExp,
          totalIncome: totalInc,
          netPeriod,
        };
      }

      // ────────────────────────────────────────────────
      // Gemini – extreme anti-hallucination
      // ────────────────────────────────────────────────
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          temperature: 0.0,   // deterministic
          topP: 0.6,
          maxOutputTokens: 300,
        },
      });

      const systemPrompt = `You are a ZERO-HALLUCINATION, STRICTLY FACTUAL finance assistant. You are FORBIDDEN from inventing, guessing, estimating, assuming, reusing, or falling back to ANY number, category, or figure from a different period or section.

MANDATORY RULES – VIOLATING ANY RULE IS UNACCEPTABLE:

1. Use ONLY data that appears EXACTLY in the snapshot below – nothing else.
2. If the snapshot shows "→ PERIOD HAS NO RECORDS AT ALL" or "→ NO ... RECORDED" for the requested period → you MUST start your entire answer with EXACTLY one of these sentences and NOTHING BEFORE IT:
   - "No records found for ${period} in your data."
   - "₹0 recorded for ${period} in your data."
   - "No expenses or income recorded in ${period}."
3. NEVER use ALL-TIME numbers for a specific period unless the question contains "all time", "total ever", "lifetime", "overall", "entire history".
4. If the requested period has no data → do NOT give advice, explanations, comparisons, or suggestions. Just report the absence of data.
5. Bold **only** numbers and ₹ amounts that are directly copied from the snapshot.
6. Be extremely concise. No fluff. No creative language.

Snapshot (THIS IS THE ONLY DATA YOU ARE ALLOWED TO USE):
${financialContext}

Question:
"${question}"

Answer following these rules exactly – no exceptions, no workarounds, no creativity.`;

      const result = await model.generateContent(systemPrompt);
      const advice = result.response.text().trim();

      return res.json({
        success: true,
        question,
        advice,
        period,  // now always defined
        stats: intent === "data" ? stats : undefined,
      });
    } catch (err) {
      console.error("Advisor error:", err);
      let message = "Failed to generate response.";
      if (err.message?.includes("API key")) message = "Gemini API key issue.";
      if (err.status === 429 || err.message?.includes("quota")) message = "Rate limit / quota exceeded.";
      return res.status(500).json({ success: false, message });
    }
  },
};

module.exports = advisorController;