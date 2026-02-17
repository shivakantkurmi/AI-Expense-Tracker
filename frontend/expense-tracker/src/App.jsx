import React, { useContext } from "react";
import{
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";
import Profile from "./pages/Dashboard/Profile";
import UserProvider, { UserContext } from "./context/UserContext";
import cookieManager from "./utils/cookieManager";
import FinancialAdvisor from "./components/FinancialAdvisor/FinancialAdvisor";

const AppContent = () => {
  const { user } = useContext(UserContext);
  const isAuthenticated = !!cookieManager.get("token") && user;

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Root />}/>
          <Route path="/login" exact element={<Login />}/>
          <Route path="/signUp" exact element={<SignUp />}/>
          <Route path="/dashboard" exact element={<Home />}/>
          <Route path="/income" exact element={<Income />}/>
          <Route path="/expense" exact element={<Expense />}/>
          <Route path="/profile" exact element={<Profile />}/>
        </Routes>
      </Router>
      {isAuthenticated && <FinancialAdvisor />}
    </>
  );
};

const App = () => {
  return (
    <UserProvider>
      <div>
        <AppContent />
      </div>
    </UserProvider>
  );
};

export default App;

const Root = ()=>{
    const isAuthenticated=!!cookieManager.get("token");
    return isAuthenticated ? (<Navigate to="/dashboard"/>) : (<Navigate to="/login"/>);
};