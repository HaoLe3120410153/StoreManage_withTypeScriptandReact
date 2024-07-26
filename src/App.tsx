import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/HomePage/Home";
import ProductManagement from "./components/ProductsPage/ProductsManagement";
import Login from "./components/Auth/LogIn/Login";
import Register from "./components/Auth/Register/Register";
import ProductDetail from "./components/ProductsPage/ProductDetail/ProductDetail";
import ProductCategory from "./components/ProductsPage/ProductCategory/ProductCategory";
import MainLayout from './layouts/MainLayout';
import UserManager from "./components/User/UserManager";
import './App.css';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/product-management" element={<ProductManagement />} />
                    <Route path="/users" element={<UserManager />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/productdetail/:category/:productId" element={<ProductDetail />} />
                    <Route path="/category/:category" element={<ProductCategory />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
