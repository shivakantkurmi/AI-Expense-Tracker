import React, { useState } from 'react';
import { IoMdDocument } from 'react-icons/io';
import { LuArrowUp, LuTrash2, LuPlus, LuArrowLeft } from 'react-icons/lu';

const IncomeTransactions = ({ transactions, onAddIncome, onDeleteIncome }) => {
  const transactionList = Array.isArray(transactions) ? transactions : [];
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = transactionList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(transactionList.length / itemsPerPage);

  const handleBackToDashboard = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-2xl p-4 sm:p-6 border border-indigo-100">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 sm:mb-8 gap-4">
        <h5 className="text-xl sm:text-2xl font-bold text-indigo-900">Income Transactions</h5>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <button
            className="bg-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-indigo-700 flex items-center justify-center space-x-2 transition"
            onClick={handleBackToDashboard}
          >
            <LuArrowLeft />
            <span className="text-sm sm:text-base">Back</span>
          </button>

          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center space-x-2 transition"
            onClick={onAddIncome}
          >
            <LuPlus />
            <span className="text-sm">Add Income</span>
          </button>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-5">
        {currentTransactions.map((item) => (
          <IncomeTransactionCard
            key={item._id}
            title={item.source || "Income"}
            icon={item.icon ? item.icon : <IoMdDocument className="text-indigo-500" />}
            date={new Date(item.date).toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" })}
            amount={item.amount}
            onDelete={() => onDeleteIncome(item._id)}
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
                  ? "bg-indigo-700 text-white"
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

const IncomeTransactionCard = ({ title, icon, date, amount, onDelete }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-5 bg-white rounded-xl border border-gray-100 hover:bg-indigo-50 transition gap-3">
      <div className="flex items-center space-x-3 sm:space-x-5">
        <div className="p-2 sm:p-3 bg-indigo-100 rounded-full">{icon}</div>
        <div>
          <h6 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h6>
          <p className="text-xs sm:text-sm text-gray-600">{date}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-auto">
        <div
          className="flex items-center space-x-2 p-2 rounded-lg text-green-600"
          style={{
            background: "linear-gradient(135deg, rgba(34, 197, 94, 0.4), rgba(34, 197, 94, 0.1))",
            backdropFilter: "blur(10px)",
          }}
        >
          <LuArrowUp />
          <span className="text-sm sm:text-lg font-bold">+₹{amount}</span>
        </div>

        <button onClick={onDelete} className="text-red-500 hover:text-red-700">
          <LuTrash2 className="text-base sm:text-lg" />
        </button>
      </div>
    </div>
  );
};

export default IncomeTransactions;
