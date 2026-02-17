import React, { useState } from 'react';

const AddIncomeForm = ({ onAddIncome }) => {
  const [formData, setFormData] = useState({
    icon: '📄',
    source: '',
    amount: '',
    date: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddIncome(formData);
    setFormData({ icon: '📄', source: '', amount: '', date: '' });
  };

  const iconOptions = [
    { value: '📄', label: 'Document' },
    { value: '💵', label: 'Cash' },
    { value: '💳', label: 'Card' },
    { value: '👛', label: 'Wallet' },
    { value: '🎁', label: 'Gift' },
    { value: '💸', label: 'Money Bill' },
    { value: '🐷', label: 'Piggy Bank' },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-2xl p-4 sm:p-6 border border-indigo-100 space-y-4 sm:space-y-6"
    >
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-indigo-900">Add New Income</h2>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Icon</label>
          <select
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            className="w-full p-2 bg-gray-100 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
          >
            {iconOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value} {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Source</label>
          <input
            type="text"
            name="source"
            value={formData.source}
            onChange={handleChange}
            placeholder="Source (e.g., Salary)"
            className="w-full p-2 bg-gray-100 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
            required
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="w-full p-2 bg-gray-100 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
            required
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 bg-gray-100 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 sm:py-2.5 rounded-lg font-medium transition duration-300 transform hover:scale-105 text-sm sm:text-base"
        >
          Add Income
        </button>
      </div>
    </form>
  );
};

export default AddIncomeForm;
