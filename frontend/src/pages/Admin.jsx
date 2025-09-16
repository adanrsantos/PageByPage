import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from '../components/AdminComp/Dashboard';
import ManageUsers from '../components/AdminComp/ManageUsers';
import ManageProducts from '../components/AdminComp/ManageProducts';
import ManageOrders from '../components/AdminComp/ManageOrders';
// import Settings from '../components/AdminComp/Settings';

const Admin = ({ userID, userName }) => {
    const location = useLocation();
    const currentPath = location.pathname;

    const [dashboardData, setDashboardData] = useState({
        total_orders: 0,
        total_listings: 0,
        total_users: 0
    });

    const fetchDashboard = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/dashboard", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                setDashboardData(data[0]); // Assuming data is returned as an array of objects
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line
        fetchDashboard();
    }, []);
    
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white flex flex-col fixed h-full">
                <div className="p-6 pt-24">
                    <h2 className="text-2xl font-bold">Admin Panel</h2>
                </div>
                <nav className="flex-1 ml-6">
                    <ul>
                        <li className={`text-gray-300 hover:text-white mb-4 cursor-pointer ${
                            currentPath === "/admin/dashboard" ? "underline" : ""
                        }`}>
                            <Link to="/admin/dashboard">Dashboard</Link>
                        </li>
                        <li className={`text-gray-300 hover:text-white mb-4 cursor-pointer ${
                            currentPath === "/admin/manage-users" ? "underline" : ""
                        }`}>
                            <Link to="/admin/manage-users">Manage Users</Link>
                        </li>
                        <li className={`text-gray-300 hover:text-white mb-4 cursor-pointer ${
                            currentPath === "/admin/manage-products" ? "underline" : ""
                        }`}>
                            <Link to="/admin/manage-products">Manage Products</Link>
                        </li>
                        <li className={`text-gray-300 hover:text-white mb-4 cursor-pointer ${
                            currentPath === "/admin/manage-orders" ? "underline" : ""
                        }`}>
                            <Link to="/admin/manage-orders">Manage Orders</Link>
                        </li>
                        {/* <li className={`text-gray-300 hover:text-white mb-4 cursor-pointer ${
                            currentPath === "/admin/settings" ? "underline" : ""
                        }`}>
                            <Link to="/admin/settings">Settings</Link>
                        </li> */}
                    </ul>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 bg-gray-100 mt-20 ml-64 pl-6 pr-6 pb-6 overflow-auto">
                <Routes>
                    <Route path="dashboard" element={<Dashboard userID={userID} userName={userName} dashboardData={dashboardData}/>} />
                    <Route path="manage-users" element={<ManageUsers userID={userID} dashboardData={dashboardData} fetchDashboard={fetchDashboard}/>} />
                    <Route path="manage-products" element={<ManageProducts userID={userID} dashboardData={dashboardData} fetchDashboard={fetchDashboard}/>} />
                    <Route path="manage-orders" element={<ManageOrders userID={userID} dashboardData={dashboardData} fetchDashboard={fetchDashboard}/>} />
                    {/* <Route path="settings" element={<Settings />} /> */}
                </Routes>
            </main>
        </div>
    );
};

export default Admin;