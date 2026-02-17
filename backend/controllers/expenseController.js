const Expense = require("../models/Expense");
const ExcelJS = require("exceljs");

exports.addExpense = async (req, res) => {
  const { icon, category, amount, date } = req.body;

  if (!req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!category || !amount) {
    return res.status(400).json({ message: "category and amount are required." });
  }

  try {
    const newExpense = new Expense({
      user: req.user.id,
      icon,
      category,
      amount,
      date: date ? new Date(date) : new Date(),
    });

    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add expense." });
  }
};


exports.getAllExpense = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch expenses." });
  }
};

// Update an existing expense
// exports.updateExpense = async (req, res) => {
//   const { id } = req.params;
//   const { icon, category, amount, date } = req.body;

//   if (!category || !amount) {
//     return res.status(400).json({ message: "category and amount are required." });
//   }

//   try {
//     const existingExpense = await Expense.findOne({ _id: id, user: req.user.id });

//     if (!existingExpense) {
//       return res.status(404).json({ message: "Expense not found." });
//     }

//     existingExpense.icon = icon ?? existingExpense.icon;
//     existingExpense.category = category;
//     existingExpense.amount = amount;
//     existingExpense.date = date ? new Date(date) : existingExpense.date;

//     const updatedExpense = await existingExpense.save();
//     res.status(200).json(updatedExpense);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to update expense." });
//   }
// };

// Delete an expense
exports.deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Expense.findOneAndDelete({ _id: id, user: req.user.id });

    if (!deleted) {
      return res.status(404).json({ message: "Expense not found." });
    }

    res.status(200).json({ message: "Expense deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete expense." });
  }
};

// Download expenses as Excel file
exports.downloadExpenseExcel = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Expenses");

    worksheet.columns = [
      { header: "category", key: "category", width: 25 },
      { header: "Amount", key: "amount", width: 15 },
      { header: "Date", key: "date", width: 20 },
    ];

    expenses.forEach((item) => {
      worksheet.addRow({
        category: item.category,
        amount: item.amount,
        date: item.date.toISOString().split("T")[0],
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="expense_details.xlsx"'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate Excel file." });
  }
};
