import React, { useState } from 'react';
import { IoMdDocument } from 'react-icons/io';
import { LuArrowDown, LuTrash2, LuPlus, LuArrowLeft } from 'react-icons/lu';

const ExpenseTransactions = ({ transactions, onAddExpense, onDeleteExpense }) => {
  const transactionList = Array.isArray(transactions) ? transactions : [];
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = transactionList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(transactionList.length / itemsPerPage);

  const handleBackToDashboard = () => (window.location.href = '/dashboard');

  return (
    <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl shadow-2xl p-4 sm:p-6 border border-red-100">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 sm:mb-8 gap-4">
        <h5 className="text-xl sm:text-2xl font-bold text-red-900">Expense Transactions</h5>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <button
            className="bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-red-700 flex items-center justify-center space-x-2 transition"
            onClick={handleBackToDashboard}
          >
            <LuArrowLeft />
            <span className="text-sm sm:text-base">Back</span>
          </button>

          <button
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2 transition"
            onClick={onAddExpense}
          >
            <LuPlus />
            <span className="text-sm">Add Expense</span>
          </button>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-5">
        {currentTransactions.map((item) => (
          <ExpenseTransactionCard
            key={item._id}
            title={item.category || "Expense"}
            icon={item.icon ? item.icon : <IoMdDocument className="text-red-500" />}
            date={new Date(item.date).toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" })}
            amount={item.amount}
            onDelete={() => onDeleteExpense(item._id)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-lg text-sm ${
                currentPage === page
                  ? "bg-red-700 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ExpenseTransactionCard = ({ title, icon, date, amount, onDelete }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-5 bg-white rounded-xl border border-gray-100 hover:bg-red-50 transition gap-3">
      <div className="flex items-center space-x-3 sm:space-x-5">
        <div className="p-2 sm:p-3 bg-red-100 rounded-full">{icon}</div>
        <div>
          <h6 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h6>
          <p className="text-xs sm:text-sm text-gray-600">{date}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-auto">
        <div
          className="flex items-center space-x-2 p-2 rounded-lg text-red-600"
          style={{
            background: "linear-gradient(135deg, rgba(239, 68, 68, 0.4), rgba(239, 68, 68, 0.1))",
            backdropFilter: "blur(10px)",
          }}
        >
          <LuArrowDown />
          <span className="text-sm sm:text-lg font-bold">-₹{amount}</span>
        </div>

        <button onClick={onDelete} className="text-red-500 hover:text-red-700">
          <LuTrash2 className="text-base sm:text-lg" />
        </button>
      </div>
    </div>
  );
};

export default ExpenseTransactions;
