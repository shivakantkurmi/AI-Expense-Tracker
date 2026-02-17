const Income = require("../models/Income");
const Expense = require("../models/Expense");

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(now.getDate() - 60);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const allIncome = await Income.find({ user: userId }).sort({ date: -1 });
    const allExpense = await Expense.find({ user: userId }).sort({ date: -1 });

    const totalIncome = allIncome.reduce((sum, item) => sum + item.amount, 0);
    const totalExpense = allExpense.reduce((sum, item) => sum + item.amount, 0);
    const totalBalance = totalIncome - totalExpense;

    // Income: Last 60 days
    const incomesLast60Days = allIncome.filter(item => new Date(item.date) >= sixtyDaysAgo);
    const totalIncomeLast60Days = incomesLast60Days.reduce((sum, item) => sum + item.amount, 0);

    // Expense: Last 30 days
    const expensesLast30Days = allExpense.filter(item => new Date(item.date) >= thirtyDaysAgo);
    const totalExpenseLast30Days = expensesLast30Days.reduce((sum, item) => sum + item.amount, 0);

    const recentTransactions = [
      ...allIncome.map(item => ({ ...item._doc, type: "income" })),
      ...allExpense.map(item => ({ ...item._doc, type: "expense" }))
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    res.status(200).json({
      totalBalance,
      totalIncome,
      totalExpense,
      last30DaysExpense: {
        total: totalExpenseLast30Days,
        transactions: expensesLast30Days
      },
      last60DaysIncome: {
        total: totalIncomeLast60Days,
        transactions: incomesLast60Days
      },
      recentTransactions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load dashboard data" });
  }
};
