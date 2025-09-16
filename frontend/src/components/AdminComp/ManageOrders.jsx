import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ManageOrders = ({ dashboardData }) => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [userSearch, setUserSearch] = useState("");
    const [userID, setUserID] = useState(null);
    const [allOrders, setAllOrders] = useState([]);
    const [sortBy, setSortBy] = useState("total_price DESC");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Number of orders per page
    const location = useLocation();
    const userIDFromURL = new URLSearchParams(location.search).get("userID");

    useEffect(() => {
        if (userIDFromURL) {
            setUserID(userIDFromURL);
        }
    }, [userIDFromURL]);

    const fetchUserOrders = async (userID) => {
        try {
            const body = { user_id: userID };
            const response = await fetch("http://localhost:5001/api/getOrder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
                setError(null);
            } else {
                setError("No orders found for this user.");
            }
        } catch (error) {
            setError("An error occurred.");
            console.error(error);
        }
    };

    const fetchAllOrders = async () => {
        try {
            const body = { sortBy };
            const response = await fetch("http://localhost:5001/api/getAllOrders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (response.ok) {
                const data = await response.json();
                setAllOrders(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearchOrders = async () => {
        if (!userSearch) return;
        try {
            const response = await fetch("http://localhost:5001/api/getUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userSearch }),
            });
            if (response.ok) {
                const data = await response.json();
                setUserID(data.user_id);
                setUserSearch("");
            } else {
                setError("User not found.");
                setUserID(null);
                setOrders([]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const toggleOrderCompletion = async (orderID, currentStatus) => {
        try {
            const response = await fetch("http://localhost:5001/api/updateOrderStatus", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderID, currentStatus }),
            });
            if (response.ok) {
                fetchUserOrders(userID);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const totalPages = Math.ceil(allOrders.length / itemsPerPage);

    const paginatedOrders = allOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (direction) => {
        if (direction === "next" && currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        } else if (direction === "prev" && currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    useEffect(() => {
        fetchAllOrders();
        if (userID) {
            fetchUserOrders(userID);
        }
    }, [userID, sortBy]);

    return (
        <div className="p-4 flex flex-col items-center gap-8">
            <h1 className="text-3xl font-bold text-center mb-6">Manage Orders</h1>

            {/* User Orders Section */}
            <div className="w-full max-w-3xl">
                <div className="flex flex-col items-center mb-6">
                    <input
                        type="text"
                        className="w-full md:w-3/4 p-2 border border-gray-300 rounded mb-2"
                        placeholder="Search for a user's orders"
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded w-3/4 md:w-auto"
                        onClick={handleSearchOrders}
                    >
                        Search
                    </button>
                </div>
                {error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : orders.length === 0 ? (
                    <p className="text-center">No orders found for this user.</p>
                ) : (
                    orders.map((order) => (
                        <div key={order.order_id} className="border p-4 rounded-lg shadow-md mb-4">
                            <div className="flex justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold">Order ID: {order.order_id}</h2>
                                    <p className="text-sm">Username: {order.username}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">
                                        Total Price: ${order.total_price.toFixed(2)}
                                    </p>
                                    <p className="text-sm">Total Items: {order.total_items}</p>
                                </div>
                            </div>
                            <button
                                className={`mt-2 ${order.completed ? "bg-red-500" : "bg-blue-500"} text-white px-4 py-2 rounded`}
                                onClick={() => toggleOrderCompletion(order.order_id, order.completed)}
                            >
                                Mark as {order.completed ? "IN PROGRESS" : "COMPLETE"}
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* All Orders Section */}
            <div className="w-full max-w-3xl">
                <h2 className="text-xl font-bold text-center mb-4">All Orders</h2>
                <div className="bg-white shadow-lg rounded p-4 overflow-y-auto max-h-96">
                    {paginatedOrders.map((order) => (
                        <div key={order.order_id} className="border p-4 rounded-lg shadow-md mb-4">
                            <div className="flex justify-between">
                                <div>
                                    <p className="font-semibold">Order ID: {order.order_id}</p>
                                    <p>Username: {order.username}</p>
                                </div>
                                <div>
                                    <p>Total Price: ${order.total_price.toFixed(2)}</p>
                                    <p>Total Items: {order.total_items}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-4">
                    <button
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange("prev")}
                    >
                        Previous
                    </button>
                    <span className="text-sm font-semibold">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange("next")}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageOrders;
