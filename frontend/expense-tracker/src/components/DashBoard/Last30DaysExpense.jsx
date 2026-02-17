import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Last30DaysExpense = ({ transactions }) => {
  const transactionList = Array.isArray(transactions) ? transactions : [];

  const getCategoryTotals = () => {
    const totals = {};
    transactionList.forEach((t) => {
      const category = t.category || "Uncategorized";
      totals[category] = (totals[category] || 0) + Math.abs(t.amount);
    });
    return totals;
  };

  const categoryData = getCategoryTotals();
  const categories = Object.keys(categoryData);
  const amounts = Object.values(categoryData);

  const chartData = {
    labels: categories,
    datasets: [
      {
        label: "Expenses by Category",
        data: amounts,
        backgroundColor: "rgba(239, 68, 68, 0.6)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(239, 68, 68, 0.8)",
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Expenses Over Last 30 Days",
      },
    },
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-2xl p-4 sm:p-6 border border-indigo-100">
      <div className="mb-5 sm:mb-8">
        <h5 className="text-xl sm:text-2xl font-bold text-indigo-900">
          Last 30 Days Expenses
        </h5>
      </div>

      <div className="mt-4 sm:mt-6">
        {transactionList.length > 0 ? (
          <div className="h-64 sm:h-80 relative">
            <Bar data={chartData} options={chartOptions} />
          </div>
        ) : (
          <div className="text-center py-4 sm:py-6">
            <p className="text-xs sm:text-sm text-gray-600">
              No expenses to show for the last 30 days.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Last30DaysExpense;
