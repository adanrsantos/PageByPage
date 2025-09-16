import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Dashboard = ({ userID, userName, dashboardData }) => {
    const [discountData, setDiscountData] = useState({
        name: "",
        description: "",
        discount_percent: 0,
        start_date: "",
        end_date: ""
    });
    const [discountHistory, setDiscountHistory] = useState([]);

    const fetchDiscountHistory = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/getDiscounts", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                setDiscountHistory(data); // Assuming data is an array of discount objects
            }
        } catch (error) {
            console.error("Error fetching discount history:", error);
        }
    };

    const handleCreateDiscount = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/createDiscounts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(discountData),
            });

            if (response.ok) {
                fetchDiscountHistory(); // Refresh the discount history
                setDiscountData({
                    name: "",
                    description: "",
                    discount_percent: 0,
                    start_date: "",
                    end_date: ""
                });
            } else {
                console.error("Failed to create discount");
            }
        } catch (error) {
            console.error("Error creating discount:", error);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line
        fetchDiscountHistory(); // Fetch the discount history on initial load
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold text-center mb-8">Welcome, {userName}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Users Box */}
                <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                    <h2 className="text-2xl font-semibold mb-4">Total Users</h2>
                    <p className="text-3xl font-bold">{dashboardData.total_users}</p>
                    <p className="text-blue-100 mt-4 hover:text-white">
                        <Link to="/admin/manage-users">View/Edit</Link>
                    </p>
                </div>
                {/* Total Listings Box */}
                <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                    <h2 className="text-2xl font-semibold mb-4">Total Listings</h2>
                    <p className="text-3xl font-bold">{dashboardData.total_listings}</p>
                    <p className="text-blue-100 mt-4 hover:text-white">
                        <Link to="/admin/manage-products">View/Edit</Link>
                    </p>
                </div>
                {/* Total Orders Box */}
                <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                    <h2 className="text-2xl font-semibold mb-4">Total Orders</h2>
                    <p className="text-3xl font-bold">{dashboardData.total_orders}</p>
                    <p className="text-blue-100 mt-4 hover:text-white">
                        <Link to="/admin/manage-orders">View/Edit</Link>
                    </p>
                </div>
            </div>

            {/* Discount Section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Create Discount Form (Left) */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">Create Discount</h2>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Discount Name</label>
                        <input
                            type="text"
                            value={discountData.name}
                            onChange={(e) => setDiscountData({ ...discountData, name: e.target.value })}
                            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Description</label>
                        <textarea
                            value={discountData.description}
                            onChange={(e) => setDiscountData({ ...discountData, description: e.target.value })}
                            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Discount Percent</label>
                        <input
                            type="number"
                            value={discountData.discount_percent}
                            onChange={(e) => setDiscountData({ ...discountData, discount_percent: e.target.value })}
                            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                            min="0"
                            max="100"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Start Date</label>
                        <input
                            type="date"
                            value={discountData.start_date}
                            onChange={(e) => setDiscountData({ ...discountData, start_date: e.target.value })}
                            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">End Date</label>
                        <input
                            type="date"
                            value={discountData.end_date}
                            onChange={(e) => setDiscountData({ ...discountData, end_date: e.target.value })}
                            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                        />
                    </div>
                    <button
                        onClick={handleCreateDiscount}
                        className="w-full bg-blue-500 text-white p-2 rounded-md"
                    >
                        Create Discount
                    </button>
                </div>

                {/* Discount History (Right) */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">Discount History</h2>
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border">Name</th>
                                <th className="px-4 py-2 border">Discount (%)</th>
                                <th className="px-4 py-2 border">Start Date</th>
                                <th className="px-4 py-2 border">End Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {discountHistory.map((discount) => (
                                <tr key={discount.discount_id}>
                                    <td className="px-4 py-2 border">{discount.name}</td>
                                    <td className="px-4 py-2 border">{discount.discount_percent}</td>
                                    <td className="px-4 py-2 border">{new Date(discount.start_date).toLocaleString()}</td>
                                    <td className="px-4 py-2 border">{new Date(discount.end_date).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
