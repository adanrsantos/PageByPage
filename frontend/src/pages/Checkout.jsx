import { useLocation, useNavigate, Link } from "react-router-dom";
import React, { useState } from "react";

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userID, totalPrice, totalItems } = location.state || {};

    const [shippingAddress, setShippingAddress] = useState({
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
    });

    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardHolder: "",
    });

    const handleShippingChange = (e) => {
        setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
    };

    const handlePaymentChange = (e) => {
        setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        try {
            const body = {userID, shippingAddress, paymentInfo, totalPrice, totalItems};
            const response = await fetch("http://localhost:5001/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            if (response.ok){
                const data = await response.json();
                console.log("Order:", data);
                alert("Order Complete!");
                navigate('/orders');
            } else {
                const errorData = await response.json();
                console.error(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.log(error);
        }

        console.log("Shipping Address:", shippingAddress);
        console.log("Payment Info:", paymentInfo);
    };

    return (
        <div className="max-w-4xl mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg border border-gray-200 space-y-2">
            <div className="flex justify-between mb-4">
                <h1 className="text-3xl font-semibold text-center text-gray-800">Checkout</h1>
                <Link to="/cart">
                <button className="w-7 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold">
                    X
                </button>
                </Link>
            </div>
            <form onSubmit={handleCheckout} className="space-y-6">
                {/* Shipping Address Section */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-700">Shipping Address</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Address Line 1</label>
                            <input
                                type="text"
                                name="addressLine1"
                                value={shippingAddress.addressLine1}
                                onChange={handleShippingChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="123 Main St"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Address Line 2</label>
                            <input
                                type="text"
                                name="addressLine2"
                                value={shippingAddress.addressLine2}
                                onChange={handleShippingChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Apt, Suite, etc. (optional)"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">City</label>
                            <input
                                type="text"
                                name="city"
                                value={shippingAddress.city}
                                onChange={handleShippingChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="City"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">State</label>
                            <input
                                type="text"
                                name="state"
                                value={shippingAddress.state}
                                onChange={handleShippingChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="State"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">ZIP Code</label>
                            <input
                                type="text"
                                name="zipCode"
                                value={shippingAddress.zipCode}
                                onChange={handleShippingChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="ZIP Code"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Country</label>
                            <input
                                type="text"
                                name="country"
                                value={shippingAddress.country}
                                onChange={handleShippingChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Country"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Payment Information Section */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-700">Payment Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Card Number</label>
                            <input
                                type="text"
                                name="cardNumber"
                                value={paymentInfo.cardNumber}
                                onChange={handlePaymentChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="1234 5678 9012 3456"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Card Holder Name</label>
                            <input
                                type="text"
                                name="cardHolder"
                                value={paymentInfo.cardHolder}
                                onChange={handlePaymentChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Name on card"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Expiry Date</label>
                            <input
                                type="text"
                                name="expiryDate"
                                value={paymentInfo.expiryDate}
                                onChange={handlePaymentChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="MM/YY"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">CVV</label>
                            <input
                                type="password"
                                name="cvv"
                                value={paymentInfo.cvv}
                                onChange={handlePaymentChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="CVV"
                                required
                            />
                        </div>
                    </div>
                </div>
                <button type="submit" className="w-[100%] rounded-lg bg-blue-600 hover:cursor-pointer hover:bg-blue-700 text-white font-bold py-2">
                        Checkout
                </button>
            </form>
        </div>
    );
};

export default Checkout;