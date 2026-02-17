import React, { useEffect, useState } from 'react';
import { LuPlus, LuTrash2 } from 'react-icons/lu';
import CustomBarChart from '../DashBoard/Last30DaysExpense';

const IncomeOverview = ({ transactions, onAddIncome, onDeleteIncome }) => {
  const [chartData, setChartData] = useState([]);

  const prepareIncomeBarChartData = (transactions) => {
    const now = new Date();
    const last30Days = {};
    transactions.forEach((trans) => {
      const transDate = new Date(trans.date);
      const daysDiff = Math.floor((now - transDate) / (1000 * 60 * 60 * 24));
      if (daysDiff <= 30) {
        const dateStr = transDate.toISOString().split('T')[0];
        last30Days[dateStr] = (last30Days[dateStr] || 0) + Number(trans.amount);
      }
    });
    return Object.entries(last30Days).map(([date, amount]) => ({ date, amount }));
  };

  useEffect(() => {
    const result = prepareIncomeBarChartData(transactions);
    setChartData(result);
  }, [transactions]);

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-lg p-4 sm:p-6 border border-indigo-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
        <div>
          <h5 className="text-base sm:text-lg font-semibold text-indigo-900">Income Overview</h5>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Track your earnings over time and analyze your income trends
          </p>
        </div>
        <button
          className="bg-indigo-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center space-x-2 transition duration-300"
          onClick={onAddIncome}
        >
          <LuPlus className="text-sm sm:text-base" />
          <span className="text-xs sm:text-sm">Add Income</span>
        </button>
      </div>

      <div className="mt-4 sm:mt-6">
        <CustomBarChart data={chartData} />
      </div>

      <div className="mt-4 sm:mt-6">
        <h5 className="text-base sm:text-lg font-semibold text-indigo-900">Income List</h5>
        <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
          {transactions.map((trans) => (
            <li
              key={trans._id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-3 rounded-lg shadow-md hover:bg-indigo-50 transition duration-200 gap-2"
            >
              <span className="text-xs sm:text-sm text-gray-800">
                ₹{trans.amount} - {trans.source} ({new Date(trans.date).toLocaleDateString()})
              </span>
              <button
                className="text-red-500 hover:text-red-700 self-end sm:self-auto"
                onClick={() => onDeleteIncome(trans._id)}
              >
                <LuTrash2 className="text-base sm:text-lg" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default IncomeOverview;
