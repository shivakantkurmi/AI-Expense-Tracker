const Income = require("../models/Income");
const User = require("../models/User");
const ExcelJS = require("exceljs");


exports.addIncome = async (req, res) => {
  const {icon,source,amount,date} = req.body;

  if (!req.user.id) {
  return res.status(401).json({ message: "Unauthorized" });
}

  if (!source || !amount) {
    return res.status(400).json({ message: "Source and amount are required." });
  }

  try {
    const newIncome = new Income({
      user: req.user.id,
      icon,
      source,
      amount,
      date : date ? new Date(date) : new Date()
    });

    const savedIncome = await newIncome.save();
    res.status(201).json(savedIncome);
  } catch (error) {
    res.status(500).json({ message: "Failed to add income."});
  }
};

exports.getAllIncome = async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch incomes."  });
  }
};

exports.deleteIncome = async (req, res) => {
  const { id } = req.params;

  try {
    await Income.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Income deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete income."  });
  }
};

exports.downloadIncomeExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    const incomes = await Income.find({ user: userId }).sort({ date: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Income");

    worksheet.columns = [
      { header: "Source", key: "source", width: 25 },
      { header: "Amount", key: "amount", width: 15 },
      { header: "Date", key: "date", width: 20 }
    ];

    incomes.forEach((item) => {
      worksheet.addRow({
        source: item.source,
        amount: item.amount,
        date: item.date.toISOString().split("T")[0]
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="income_details.xlsx"'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};