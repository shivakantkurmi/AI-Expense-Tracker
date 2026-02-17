import React from "react";
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
import UserProvider from "./context/UserContext";
import cookieManager from "./utils/cookieManager";
import FinancialAdvisor from "./components/FinancialAdvisor/FinancialAdvisor";
const App = () =>{
    return(
        <UserProvider>
        <div>
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
            <FinancialAdvisor />
        </div>
        </UserProvider>

    )
};

export default App;

const Root = ()=>{
    // Check if token exist 
    const isAuthenticated=!!cookieManager.get("token");

    //if person is authenticated open dashborad but if not redirect to login/signup pages
    return isAuthenticated ? (<Navigate to="/dashboard"/>) : (<Navigate to="/login"/>);
};