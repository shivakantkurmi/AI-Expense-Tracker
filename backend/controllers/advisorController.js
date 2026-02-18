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

  // All-time
  if (/all\s*time|lifetime|overall|total\s*(expense|expenses|income)|everything/gi.test(q)) {
    return { startDate: null, endDate: null, period: "All Time", isAllTime: true };
  }

  // Standalone year
  const yearOnlyMatch = q.match(/\b(20\d{2})\b/);
  if (yearOnlyMatch) {
    const yr = parseInt(yearOnlyMatch[1]);
    if (yr >= 2000 && yr <= thisYear + 10) {
      const start = new Date(yr, 0, 1);
      const end = yr === thisYear ? today : new Date(yr, 11, 31, 23, 59, 59);
      return { startDate: start, endDate: end, period: yr.toString(), isAllTime: false };
    }
  }

  // Month range
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

  // Single month-year
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

  // Relative periods
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

  // Named: this/last month
  if (q.includes("this month") || q.includes("current month")) {
    return { startDate: new Date(thisYear, thisMonth, 1), endDate: today, period: "This Month", isAllTime: false };
  }
  if (q.includes("last month") || q.includes("previous month")) {
    const start = new Date(thisYear, thisMonth - 1, 1);
    const end = new Date(thisYear, thisMonth, 0, 23, 59, 59);
    return { startDate: start, endDate: end, period: "Last Month", isAllTime: false };
  }

  // Default
  return {
    startDate: new Date(thisYear, thisMonth, 1),
    endDate: today,
    period: "This Month",
    isAllTime: false,
  };
};

// ────────────────────────────────────────────────
// Controller – merged data + advice in one
// ────────────────────────────────────────────────
const advisorController = {
  getAdvice: async (req, res) => {
    try {
      const { question } = req.body;
      const userId = req.user?.id;

      if (!userId) return res.status(401).json({ success: false, message: "Not authenticated" });
      if (!question?.trim()) return res.status(400).json({ success: false, message: "Question required" });

      console.log(`Advisor called - Question: "${question}"`);

      // Always fetch full data (AI decides what to use)
      const [allExpenses, allIncome] = await Promise.all([
        Expense.find({ user: userId }).lean(),
        Income.find({ user: userId }).lean(),
      ]);

      const sum = (arr) => arr.reduce((acc, item) => acc + (Number(item?.amount) || 0), 0);

      const totalExp = sum(allExpenses);
      const totalInc = sum(allIncome);
      const netSavings = totalInc - totalExp;

      // Monthly summaries for advanced questions
      const monthlySummaries = {};
      allExpenses.forEach((exp) => {
        const monthKey = moment(exp.date).format("YYYY-MM");
        if (!monthlySummaries[monthKey]) monthlySummaries[monthKey] = { expenses: 0, income: 0 };
        monthlySummaries[monthKey].expenses += Number(exp.amount || 0);
      });

      allIncome.forEach((inc) => {
        const monthKey = moment(inc.date).format("YYYY-MM");
        if (!monthlySummaries[monthKey]) monthlySummaries[monthKey] = { expenses: 0, income: 0 };
        monthlySummaries[monthKey].income += Number(inc.amount || 0);
      });

      const monthlyLines = Object.entries(monthlySummaries)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, { expenses, income }]) => {
          const net = income - expenses;
          const rate = income > 0 ? ((net / income) * 100).toFixed(1) : "0.0";
          return `• ${month}: Exp ₹${Math.round(expenses)}, Inc ₹${Math.round(income)}, Net ₹${Math.round(net)}, Rate ${rate}%`;
        })
        .join("\n") || "→ NO MONTHLY RECORDS";

      const byCategory = allExpenses.reduce((acc, e) => {
        const cat = e.category || "Uncategorized";
        acc[cat] = (acc[cat] || 0) + Number(e.amount || 0);
        return acc;
      }, {});

      const categoryLines = Object.entries(byCategory)
        .sort(([,a], [,b]) => b - a)
        .map(([cat, amt]) => `• ${cat}: ₹${Math.round(amt)}`)
        .join("\n") || "→ NO CATEGORIES";

      const bySource = allIncome.reduce((acc, i) => {
        const src = i.source || "Uncategorized";
        acc[src] = (acc[src] || 0) + Number(i.amount || 0);
        return acc;
      }, {});

      const incomeLines = Object.entries(bySource)
        .map(([src, amt]) => `• ${src}: ₹${Math.round(amt)}`)
        .join("\n") || "→ NO SOURCES";

      // Period-specific (for data questions)
      const { startDate, endDate, period: detectedPeriod, isAllTime } = getDateRange(question);
      const period = detectedPeriod;

      const periodFilter = { user: userId };
      if (!isAllTime && startDate && endDate) {
        periodFilter.date = { $gte: startDate, $lte: endDate };
      }

      const [periodExpenses, periodIncome] = await Promise.all([
        Expense.find(periodFilter).lean(),
        Income.find(periodFilter).lean(),
      ]);

      const periodExp = sum(periodExpenses);
      const periodInc = sum(periodIncome);
      const netPeriod = periodInc - periodExp;
      const savingsRate = periodInc > 0 ? ((netPeriod / periodInc) * 100).toFixed(1) : "0.0";

      // ────────────────────────────────────────────────
      // Full context
      // ────────────────────────────────────────────────
      const financialContext = `
DETECTED PERIOD: ${period}
DATE RANGE: ${isAllTime ? "All recorded history" : `${moment(startDate).format("D MMM YYYY")} – ${moment(endDate).format("D MMM YYYY")}`}

EXPENSES THIS PERIOD: ₹${Math.round(periodExp)} (${periodExpenses.length} transactions) ${periodExpenses.length === 0 ? " → NO EXPENSES IN THIS PERIOD" : ""}
INCOME THIS PERIOD:   ₹${Math.round(periodInc)} (${periodIncome.length} transactions) ${periodIncome.length === 0 ? " → NO INCOME IN THIS PERIOD" : ""}
NET THIS PERIOD:      ₹${Math.round(netPeriod)}
SAVINGS RATE THIS PERIOD: **${savingsRate}%**

EXPENSE CATEGORIES THIS PERIOD:
${categoryLines}

INCOME SOURCES THIS PERIOD:
${incomeLines}

MONTHLY BREAKDOWN (all months with data):
${monthlyLines}

ALL-TIME TOTALS:
Expenses: ₹${Math.round(totalExp)}
Income:   ₹${Math.round(totalInc)}
Net savings: ₹${Math.round(netSavings)}
      `.trim();

      // ────────────────────────────────────────────────
      // Gemini – AI decides data vs general advice
      // ────────────────────────────────────────────────
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          temperature: 0.2,
          topP: 0.9,
          maxOutputTokens: 600,
        },
      });

      const systemPrompt = `You are an advanced finance assistant that intelligently merges data analysis and advice.

MANDATORY RULES:

1. ALWAYS check if the question requires user data (e.g., totals, percentages, categories, most expensive month, savings rate, etc.) → use the snapshot.
2. If the question is purely general (e.g., "how to save more", "50/30/20 rule") → ignore the snapshot and give timeless advice.
3. For percentage/savings questions → use SAVINGS RATE THIS PERIOD directly.
4. For "most expensive month" or similar → use MONTHLY BREAKDOWN to identify.
5. If period has no data ("→ NO ...") → start with "No records found for [period] in your data." and do NOT give advice.
6. When data exists → report key facts first, then 1-2 actionable advice tips based on the data.
7. Bold **only** numbers and ₹ amounts from the snapshot.
8. Be concise and helpful.

Snapshot:
${financialContext}

Question:
"${question}"

Answer:`;

      const result = await model.generateContent(systemPrompt);
      const advice = result.response.text().trim();

      return res.json({
        success: true,
        question,
        advice,
        period,
        stats: {
          periodExpense: periodExp,
          periodIncome: periodInc,
          totalExpense: totalExp,
          totalIncome: totalInc,
          netPeriod,
          savingsRate,
        },
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