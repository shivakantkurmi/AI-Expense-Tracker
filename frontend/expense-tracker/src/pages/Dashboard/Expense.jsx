// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const Expense = () => {
//   const navigate = useNavigate();

//   // State for expenses and form
//   const [expenses, setExpenses] = useState([
//     { id: 1, amount: 200, category: 'Food', date: '2025-06-24' },
//     { id: 2, amount: 300, category: 'Travel', date: '2025-06-23' },
//   ]);
//   const [newExpense, setNewExpense] = useState({ category: '', amount: '', date: '' });
//   const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

//   const navigateTo = (path) => {
//     navigate(path);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token'); // Clear token on logout
//     console.log('Logged out');
//     navigate('/login');
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewExpense((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddExpense = (e) => {
//     e.preventDefault();
//     if (newExpense.category && newExpense.amount && newExpense.date) {
//       const newEntry = {
//         id: Date.now(), // Unique ID based on timestamp
//         category: newExpense.category,
//         amount: newExpense.amount,
//         date: newExpense.date,
//       };
//       setExpenses((prev) => [...prev, newEntry]);
//       setNewExpense({ category: '', amount: '', date: '' }); // Reset form
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-900 text-white">
//       {/* Side Menu */}
//       <div className="w-64 bg-gray-800 p-4">
//         <h2 className="text-2xl font-bold mb-6">Expense Tracker</h2>
//         <ul className="space-y-4">
//           <li
//             className="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer"
//             onClick={() => navigateTo('/dashboard')}
//           >
//             🏠 Home
//           </li>
//           <li
//             className="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer"
//             onClick={() => navigateTo('/income')}
//           >
//             💰 Income
//           </li>
//           <li
//             className="flex items-center p-2 hover:bg-red-700 rounded cursor-pointer"
//             onClick={handleLogout}
//           >
//             🚪 Logout
//           </li>
//         </ul>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-8">
//         <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
//           Expense
//         </h1>
//         <div className="bg-gray-800 p-6 rounded-lg shadow-md">
//           <h3 className="text-lg font-semibold text-gray-300">Total Expenses</h3>
//           <p className="text-2xl font-bold text-red-300">₹{totalExpenses}</p>
//         </div>
//         <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-md">
//           <h3 className="text-lg font-semibold text-gray-300">Expense List</h3>
//           <ul className="mt-4 space-y-4">
//             {expenses.map((expense) => (
//               <li key={expense.id} className="text-gray-200">
//                 ₹{expense.amount} - {expense.category} ({expense.date})
//               </li>
//             ))}
//           </ul>
//         </div>
//         <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-md">
//           <h3 className="text-lg font-semibold text-gray-300">Add Expense</h3>
//           <form onSubmit={handleAddExpense} className="mt-4 space-y-4">
//             <input
//               type="text"
//               name="category"
//               value={newExpense.category}
//               onChange={handleInputChange}
//               placeholder="Category (e.g., Food)"
//               className="w-full p-2 bg-gray-700 text-white rounded"
//               required
//             />
//             <input
//               type="number"
//               name="amount"
//               value={newExpense.amount}
//               onChange={handleInputChange}
//               placeholder="Amount"
//               className="w-full p-2 bg-gray-700 text-white rounded"
//               required
//             />
//             <input
//               type="date"
//               name="date"
//               value={newExpense.date}
//               onChange={handleInputChange}
//               className="w-full p-2 bg-gray-700 text-white rounded"
//               required
//             />
//             <button
//               type="submit"
//               className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
//             >
//               Add Expense
//             </button>
//           </form>
//         </div>
//         <button
//           className="mt-6 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
//           onClick={() => navigateTo('/dashboard')}
//         >
//           Back to Home
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Expense;



import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import ExpenseTransactions from '../../components/Expense/ExpenseTransactions';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import { LuPlus, LuTrash2 } from 'react-icons/lu';
import Modal from '../../components/common/Modal';
import AddExpenseForm from '../../components/Expense/AddExpenseForm'; 

const Expense = () => {
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

  const fetchExpenseDetails = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(`${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`);
      if (response.data) {
        setExpenseData(response.data);
      }
    } catch (error) {
      console.log('Fetch error:', error.response ? error.response.status : error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (expense) => {
    try {
      const response = await axiosInstance.post(`${API_PATHS.EXPENSE.ADD_EXPENSE}`, expense);
      if (response.data) {
        setExpenseData((prev) => [...prev, response.data]);
        setOpenAddExpenseModal(false);
      }
    } catch (error) {
      console.log('Add expense error:', error.response ? error.response.status : error.message);
    }
  };

  const deleteExpense = async (id) => {
    try {
      const url = API_PATHS.EXPENSE.DELETE_EXPENSE(id);
      console.log('Delete URL:', url);
      const response = await axiosInstance.delete(url);
      console.log('Delete response:', response.status);
      setExpenseData((prev) => prev.filter((item) => item._id !== id));
      setOpenDeleteAlert({ show: false, data: null });
    } catch (error) {
      console.log('Delete error:', error.response ? { status: error.response.status, data: error.response.data } : error.message);
    }
  };

  const handleDownloadExpenseDetails = async () => {
    try {
      const url = API_PATHS.EXPENSE.DOWNLOAD_EXPENSE;
      console.log('Download URL:', url);
      const response = await axiosInstance.get(url, { responseType: 'blob' });
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'expense_details.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      console.log('Download successful');
    } catch (error) {
      console.log('Download error:', error.response ? { status: error.response.status, data: error.response.data } : error.message);
    }
  };

  useEffect(() => {
    fetchExpenseDetails();
  }, []);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <ExpenseTransactions
              transactions={expenseData}
              onAddExpense={() => setOpenAddExpenseModal(true)}
              onDeleteExpense={(id) => setOpenDeleteAlert({ show: true, data: id })}
            />
          </div>
        </div>
        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Confirm Delete"
        >
          <div className="p-4">
            <p>Are you sure you want to delete this expense entry?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
                onClick={() => setOpenDeleteAlert({ show: false, data: null })}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                onClick={() => deleteExpense(openDeleteAlert.data)}
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
        <button
          className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
          onClick={handleDownloadExpenseDetails}
        >
          Download Expense Details
        </button>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
