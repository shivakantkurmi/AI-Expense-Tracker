import React from "react";
import { IoMdDocument } from "react-icons/io";
import { LuArrowDown, LuArrowRight } from "react-icons/lu";

const ExpenseTransactions = ({ transactions, onSeeMore }) => {
  const transactionList = Array.isArray(transactions) ? transactions : [];

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-2xl p-4 sm:p-6 border border-indigo-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
        <h5 className="text-xl sm:text-2xl font-bold text-indigo-900">
          Recent Expenses
        </h5>
        <button
          className="bg-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-indigo-700 transition duration-300 flex items-center justify-center space-x-2 sm:space-x-3 transform hover:scale-105"
          onClick={onSeeMore}
        >
          <span className="text-sm sm:text-base font-medium">See All</span>
          <LuArrowRight className="text-base sm:text-lg" />
        </button>
      </div>

      <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-5">
        {transactionList.length > 0 ? (
          transactionList.slice(0, 5).map((item, index) => (
            <ExpenseInfoCard
              key={index}
              title={item.category || "Uncategorized"}
              icon={item.icon ? item.icon : <IoMdDocument className="text-indigo-500" />}
              date={new Date(item.date).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
              amount={Math.abs(item.amount).toFixed(2)}
            />
          ))
        ) : (
          <div className="text-center py-4 sm:py-6">
            <p className="text-xs sm:text-sm text-gray-600">No expenses to show.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ExpenseInfoCard = ({ title, icon, date, amount }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-5 bg-white rounded-xl border border-gray-100 hover:bg-indigo-50 transition duration-300 transform hover:-translate-y-1 hover:shadow-md gap-4 sm:gap-0">
      <div className="flex items-center space-x-4 sm:space-x-5">
        <div className="p-2 sm:p-3 bg-indigo-100 rounded-full">{icon}</div>
        <div>
          <h6 className="text-base sm:text-lg font-semibold text-gray-900">
            {title}
          </h6>
          <p className="text-xs sm:text-sm text-gray-600">{date}</p>
        </div>
      </div>

      <div
        className="flex items-center space-x-2 p-2 rounded-lg text-red-600 self-end sm:self-auto"
        style={{
          background: "linear-gradient(135deg, rgba(239, 68, 68, 0.4), rgba(239, 68, 68, 0.1))",
          backdropFilter: "blur(10px)",
        }}
      >
        <LuArrowDown />
        <span className="text-base sm:text-lg font-bold">-₹{amount}</span>
      </div>
    </div>
  );
};

export default ExpenseTransactions;
