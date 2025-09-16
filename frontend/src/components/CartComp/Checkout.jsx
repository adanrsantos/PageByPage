import { useNavigate } from 'react-router-dom';

const Checkout = ({ userID, totalPrice, totalItems }) => {
    const navigate = useNavigate();
    const handleCheckout = async (e) => {
        navigate('/checkout', {
            state: { userID: userID, totalPrice: totalPrice, totalItems: totalItems},
        });
    };

    return (
        <div className="max-w-lg mx-auto mt-16 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
            <h1 className="text-4xl font-semibold text-center text-gray-800 mb-6">Checkout Overview</h1>
            <div className="text-lg space-y-4">
                <p className="flex justify-between">
                    <span className="font-medium">Total Items:</span> 
                    <span>{totalItems}</span>
                </p>
                <p className="flex justify-between">
                    <span className="font-medium">Subtotal:</span> 
                    <span>${totalPrice.toFixed(2)}</span>
                </p>
                <p className="flex justify-between">
                    <span className="font-medium">Estimated Shipping:</span> 
                    <span>$6.99</span>
                </p>
                <p className="flex justify-between">
                    <span className="font-medium">Taxes:</span> 
                    <span>$0.00</span>
                </p>
                <p className="flex justify-between border-t pt-4 font-semibold text-lg">
                    <span>Total:</span> 
                    <span>${(parseFloat(totalPrice) + 6.99).toFixed(2)}</span>
                </p>
            </div>
            <button
                onClick={handleCheckout}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg transition">
                Complete Checkout
            </button>
        </div>
    );
};

export default Checkout;