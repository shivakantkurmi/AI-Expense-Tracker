const express = require("express");
const router = express.Router();

const {
  addExpense,
  getAllExpense,
//   updateExpense,
  deleteExpense,
  downloadExpenseExcel
} = require("../controllers/expenseController");

const protect = require("../middleware/authMiddleware");

router.use(protect);
router.post("/add", addExpense);
router.get("/all", getAllExpense);
// router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);
router.get("/downloadexcel", downloadExpenseExcel);

module.exports = router;
