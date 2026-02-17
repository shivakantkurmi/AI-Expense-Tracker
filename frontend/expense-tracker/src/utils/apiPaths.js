import dotenv from "dotenv";
dotenv.config();

export const BASE_URL = process.env.BASE_URL;


export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    GET_USER_INFO: "/api/auth/getUser",
  },
  DASHBOARD: {
    GET_DATA: "/api/dashboard",
  },
  INCOME: {
    ADD_INCOME: "/api/income/add",
    GET_ALL_INCOME: "/api/income/get",
    DELETE_INCOME: (incomeId) => `/api/income/${incomeId}`,
    DOWNLOAD_INCOME: "/api/income/downloadexcel",
  },
  EXPENSE: {
    ADD_EXPENSE: "/api/expenses/add",
    GET_ALL_EXPENSE: "/api/expenses/all",
    DELETE_EXPENSE: (expenseId) => `/api/expenses/${expenseId}`,
    DOWNLOAD_EXPENSE: "/api/expenses/downloadexcel",
  },
};