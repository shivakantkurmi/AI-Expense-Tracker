import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import IncomeTransactions from '../../components/Income/IncomeTransactions';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import { LuPlus, LuTrash2 } from 'react-icons/lu';
import Modal from '../../components/common/Modal';
import AddIncomeForm from '../../components/Income/AddIncomeForm';

const Income = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);

  const fetchIncomeDetails = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(`${API_PATHS.INCOME.GET_ALL_INCOME}`);
      if (response.data) {
        setIncomeData(response.data);
      }
    } catch (error) {
      console.log('Fetch error:', error.response ? error.response.status : error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIncome = async (income) => {
    try {
      const response = await axiosInstance.post(`${API_PATHS.INCOME.ADD_INCOME}`, income);
      if (response.data) {
        setIncomeData((prev) => [...prev, response.data]);
        setOpenAddIncomeModal(false);
      }
    } catch (error) {
      console.log('Add income error:', error.response ? error.response.status : error.message);
    }
  };

  const deleteIncome = async (id) => {
    try {
      const url = API_PATHS.INCOME.DELETE_INCOME(id);
      console.log('Delete URL:', url);
      const response = await axiosInstance.delete(url);
      console.log('Delete response:', response.status);
      setIncomeData((prev) => prev.filter((item) => item._id !== id));
      setOpenDeleteAlert({ show: false, data: null });
    } catch (error) {
      console.log('Delete error:', error.response ? { status: error.response.status, data: error.response.data } : error.message);
    }
  };

  const handleDownloadIncomeDetails = async () => {
    try {
      const url = API_PATHS.INCOME.DOWNLOAD_INCOME;
      console.log('Download URL:', url);
      const response = await axiosInstance.get(url, { responseType: 'blob' });
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'income_details.xlsx');
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
    fetchIncomeDetails();
  }, []);

  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <IncomeTransactions
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModal(true)}
              onDeleteIncome={(id) => setOpenDeleteAlert({ show: true, data: id })}
              onSeeMore={() => console.log('See More clicked')}
            />
          </div>
        </div>
        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >
          <AddIncomeForm onAddIncome={handleAddIncome} />
        </Modal>
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Confirm Delete"
        >
          <div className="p-4">
            <p>Are you sure you want to delete this income entry?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
                onClick={() => setOpenDeleteAlert({ show: false, data: null })}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                onClick={() => deleteIncome(openDeleteAlert.data)}
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
        <button
          className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
          onClick={handleDownloadIncomeDetails}
        >
          Download Income Details
        </button>
      </div>
    </DashboardLayout>
  );
};

export default Income;
