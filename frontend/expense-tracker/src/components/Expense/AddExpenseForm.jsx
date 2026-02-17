import React, { useState } from 'react';

const AddExpenseForm = ({ onAddExpense }) => {
  const [formData, setFormData] = useState({
    icon: '🍔',
    category: '',
    amount: '',
    date: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddExpense(formData);
    setFormData({ icon: '🍔', category: '', amount: '', date: '' });
  };

  const iconOptions = [
    { value: '🍔', label: 'Food' },
    { value: '🛒', label: 'Groceries' },
    { value: '🚗', label: 'Transport' },
    { value: '🏠', label: 'Rent' },
    { value: '💡', label: 'Utilities' },
    { value: '🎮', label: 'Entertainment' },
    { value: '💊', label: 'Health' },
    { value: '🧾', label: 'Bills' },
    { value: '👕', label: 'Clothing' },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-br from-red-50 to-white rounded-2xl shadow-2xl p-4 sm:p-6 border border-red-100 space-y-4 sm:space-y-6"
    >
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-red-900">Add New Expense</h2>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Icon</label>
          <select
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            className="w-full p-2 bg-gray-100 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
          >
            {iconOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value} {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category (e.g., Food)"
            className="w-full p-2 bg-gray-100 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
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
            className="w-full p-2 bg-gray-100 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
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
            className="w-full p-2 bg-gray-100 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 sm:py-2.5 rounded-lg font-medium transition duration-300 transform hover:scale-105 text-sm sm:text-base"
        >
          Add Expense
        </button>
      </div>
    </form>
  );
};

export default AddExpenseForm;
