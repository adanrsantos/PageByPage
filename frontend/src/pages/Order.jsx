import React, { useEffect, useState } from "react";

const Order = ({ userID }) => {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const body = { user_id: userID };
            const response = await fetch("http://localhost:5001/api/getOrder", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Orders data:", data);
                setOrders(data); // Store orders in state
            } else {
                console.error("Failed to fetch orders");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchOrders();
    // eslint-disable-next-line
    }, []);

    return (
        <div className="Order container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Your Orders</h1> {/* Increased margin-bottom */}
            <div className="space-y-6">
                {orders.length === 0 ? (
                    <p>No orders found</p>
                ) : (
                    orders.map((order) => (
                        <div key={order.order_id} className="border p-4 rounded-lg shadow-md">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Order ID: {order.order_id}</h2>
                                <p className="text-gray-500">{new Date(order.order_date).toLocaleString()}</p>
                            </div>
                            <p className="text-lg mt-2">Total Price: ${order.total_price.toFixed(2)}</p>

                            <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                                {order.items.map((item) => {
                                    // Handle authors extraction
                                    const authors = item.authors && item.authors.length > 0
                                        ? item.authors.map(author => `${author.last_name} ${author.first_name}`).join(", ")
                                        : "Unknown Author";

                                    return (
                                        <div
                                            key={item.order_item_id}
                                            className="flex justify-around items-center p-2 border-b last:border-b-0"
                                        >
                                            <img
                                                src={item.main_picture}
                                                alt={item.title_english || item.title}
                                                className="w-20 h-20 object-cover"
                                            />
                                            <p className="text-gray-700">Manga: {item.title_english || item.title}</p>
                                            <p className="text-gray-700">Author(s): {authors}</p>
                                            <p className="text-gray-700">Quantity: {item.item_quantity}</p>
                                            <p className="text-gray-700">Price: ${item.price.toFixed(2)}</p>
                                            <p className="text-gray-700">Total: ${item.price.toFixed(2) * item.item_quantity}</p> 
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Order;