const express = require("express");
const router = express.Router();

const {
  addIncome,
  getAllIncome,
  deleteIncome,
  downloadIncomeExcel
} = require("../controllers/incomeController");

const protect = require("../middleware/authMiddleware");

router.use(protect);
router.post("/add", addIncome);
router.get("/get", getAllIncome);
router.delete("/:id", deleteIncome);
router.get("/downloadexcel", downloadIncomeExcel);

module.exports = router;

