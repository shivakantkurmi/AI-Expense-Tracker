const { GoogleGenerativeAI } = require("@google/generative-ai");
const Expense = require("../models/Expense");
const Income = require("../models/Income");

// Parse date range from user question
const getDateRange = (question) => {
  const lowerQ = question.toLowerCase();
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  let startDate = new Date(year, month, 1); // Default: this month
  let period = "This Month";

  // Check for "last month" / "previous month"
  if (lowerQ.includes("last month") || lowerQ.includes("previous month")) {
    const lastMonth = new Date(year, month - 1, 1);
    const lastMonthEnd = new Date(year, month, 0);
    return { startDate: lastMonth, endDate: lastMonthEnd, period: "Last Month" };
  }

  // Check for numeric patterns like "2 months", "5 days", "3 weeks"
  const numberMatch = question.match(/(\d+)\s*(month|months|week|weeks|day|days)/i);
  if (numberMatch) {
    const num = parseInt(numberMatch[1]);
    const unit = numberMatch[2].toLowerCase();

    if (unit.includes("month")) {
      startDate = new Date(today.getTime() - num * 30 * 24 * 60 * 60 * 1000);
      period = `Last ${num} Month${num > 1 ? "s" : ""}`;
    } else if (unit.includes("week")) {
      startDate = new Date(today.getTime() - num * 7 * 24 * 60 * 60 * 1000);
      period = `Last ${num} Week${num > 1 ? "s" : ""}`;
    } else if (unit.includes("day")) {
      startDate = new Date(today.getTime() - num * 24 * 60 * 60 * 1000);
      period = `Last ${num} Day${num > 1 ? "s" : ""}`;
    }
    return { startDate, endDate: today, period };
  }

  // Check for specific phrases
  if (lowerQ.includes("this week") || lowerQ.includes("week")) {
    startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    period = "Last 7 Days";
  } else if (lowerQ.includes("30 day") || lowerQ.includes("past month")) {
    startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    period = "Last 30 Days";
  } else if (lowerQ.includes("quarterly")) {
    startDate = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
    period = "Last 3 Months";
  } else if (lowerQ.includes("6 month")) {
    startDate = new Date(today.getTime() - 180 * 24 * 60 * 60 * 1000);
    period = "Last 6 Months";
  } else if (lowerQ.includes("this year")) {
    startDate = new Date(year, 0, 1);
    period = "This Year";
  } else if (lowerQ.includes("last year")) {
    startDate = new Date(year - 1, 0, 1);
    period = "Last Year";
  }
  // Default: this month (already set above)

  return { startDate, endDate: today, period };
};

const advisorController = {
  getAdvice: async (req, res) => {
    try {
      const { question } = req.body;
      const userId = req.user?.id;

      console.log("📊 Advisor Request - User ID:", userId);
      console.log("✓ Token verified - User authenticated");

      if (!userId) {
        console.error("❌ No user ID found - Authentication failed");
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (!question || !question.trim()) {
        return res.status(400).json({ message: "Question is required" });
      }

      if (!process.env.GEMINI_API_KEY) {
        console.error("❌ GEMINI_API_KEY is not set");
        return res.status(500).json({
          message: "Gemini API key is not configured. Please set GEMINI_API_KEY in your backend .env file."
        });
      }

      // Parse time period from question
      const { startDate, endDate, period } = getDateRange(question);
      console.log(`📅 Fetching data for period: ${period}`);

      // Fetch data for selected period and all-time
      const [periodExpenses, periodIncome, allExpenses, allIncome] = await Promise.all([
        Expense.find({
          user: userId,
          date: { $gte: startDate, $lte: endDate }
        })
          .lean()
          .exec(),
        Income.find({
          user: userId,
          date: { $gte: startDate, $lte: endDate }
        })
          .lean()
          .exec(),
        Expense.find({ user: userId }).lean().exec(),
        Income.find({ user: userId }).lean().exec()
      ]);

      console.log(`✓ Found ${periodExpenses.length} expenses, ${periodIncome.length} income for ${period}`);

      // Calculate period statistics
      const periodExpenseTotal = periodExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
      const periodIncomeTotal = periodIncome.reduce((sum, inc) => sum + (inc.amount || 0), 0);

      // Calculate all-time totals
      const totalExpenses = allExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
      const totalIncome = allIncome.reduce((sum, inc) => sum + (inc.amount || 0), 0);
      const savings = totalIncome - totalExpenses;

      // Segment by category and source
      const expensesByCategory = {};
      periodExpenses.forEach(exp => {
        const cat = exp.category || "Uncategorized";
        expensesByCategory[cat] = (expensesByCategory[cat] || 0) + (exp.amount || 0);
      });

      const incomeBySource = {};
      periodIncome.forEach(inc => {
        const src = inc.source || "Uncategorized";
        incomeBySource[src] = (incomeBySource[src] || 0) + (inc.amount || 0);
      });

      const highestSpend = Object.entries(expensesByCategory).sort(([, a], [, b]) => b - a)[0];

      // Create concise financial context optimized for AI analysis
      const categoryDetails = Object.entries(expensesByCategory)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5) // Top 5 categories only
        .map(([cat, amt]) => `${cat}: ₹${amt.toFixed(0)}`)
        .join(" | ");

      const incomeDetails = Object.entries(incomeBySource)
        .map(([src, amt]) => `${src}: ₹${amt.toFixed(0)}`)
        .join(" | ");

      const savingsRate = ((periodIncomeTotal - periodExpenseTotal) / periodIncomeTotal * 100).toFixed(1);

      const userFinancialContext = `**Period:** ${period}
**Income:** ₹${periodIncomeTotal.toFixed(0)} | **Expenses:** ₹${periodExpenseTotal.toFixed(0)} | **Saved:** ₹${(periodIncomeTotal - periodExpenseTotal).toFixed(0)} (${savingsRate}%)
**Top Spending:** ${categoryDetails}
**Income Sources:** ${incomeDetails || "None"}`;

      console.log("✓ Financial data analyzed");

      // Initialize Gemini with gemini-2.5-flash
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const systemPrompt = `You are a financial advisor. Answer directly and concisely.

RULES:
- Maximum 3 key points or recommendations
- Use **bold** for numbers only
- Keep total response under 150 words
- Be actionable and specific
- Reference their actual data from the context
- Use emoji sparingly (max 2)`;

      const fullPrompt = `${systemPrompt}

FINANCIAL DATA:
${userFinancialContext}

Question: "${question}"

Provide 2-3 specific, actionable financial tips based on their data:`;

      console.log("🤖 Calling Gemini 2.5 Flash API...");

      const result = await Promise.race([
        model.generateContent(fullPrompt),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 25000))
      ]);

      console.log("✓ API response received");

      if (!result || !result.response) {
        return res.status(500).json({ message: "Failed to generate response from AI" });
      }

      const advice = result.response.text();
      console.log("✓ Advice generated, length:", advice.length);

      res.status(200).json({
        success: true,
        question: question,
        advice: advice,
        period: period,
        userStats: {
          periodExpenses: periodExpenseTotal,
          periodIncome: periodIncomeTotal,
          totalExpenses,
          totalIncome,
          savings,
          expensesByCategory
        },
        timestamp: new Date()
      });
    } catch (error) {
      console.error("❌ Error:", error.message);

      let msg = "Error generating financial advice";
      if (error.message.includes("API key")) {
        msg = "Invalid Gemini API key. Check your .env file.";
      } else if (error.message.includes("quota")) {
        msg = "API quota exceeded. Try again later.";
      } else if (error.message.includes("Timeout")) {
        msg = "Request took too long. Please try again.";
      } else if (error.message.includes("429")) {
        msg = "Too many requests. Wait a moment and retry.";
      }

      res.status(500).json({
        message: msg,
        error: process.env.NODE_ENV === "development" ? error.message : undefined
      });
    }
  }
};

module.exports = advisorController;
