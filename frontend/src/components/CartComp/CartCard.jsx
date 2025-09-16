import { Link } from "react-router-dom";
import { useState } from "react";

const CartCard = ({ post, userID, fetchPosts }) => {
    const [count, setCount] = useState(1);

    // Increase quantity
    const increase = () => {
        if (count < post.item_quantity) {
            setCount((prevCount) => prevCount + 1);
        }
    };

    // Decrease quantity
    const decrease = () => {
        if (count > 1) {
            setCount((prevCount) => prevCount - 1);
        }
    };

    // Remove from cart
    const handleRemoveFromCart = async (e) => {
        e.preventDefault();
        const { listing_id, cart_id } = post;
        const buyer_id = userID;

        try {
            const body = { listing_id, buyer_id, cart_id, count };
            const response = await fetch("http://localhost:5001/api/removeCart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            // Update quantity and reset count
            post.item_quantity -= count;
            setCount(1);

            console.log("Successfully removed from cart:", data);
            fetchPosts();
        } catch (error) {
            console.error("Error removing item from cart:", error);
        }
    };

    // Handle author formatting
    const author = post.authors && post.authors[0];
    const fullName = author ? `${author.last_name} ${author.first_name}` : "Unknown Author";

    return (
        <div className="flex justify-around items-center border-2 border-gray-300 rounded-lg p-5 mb-5 relative shadow-sm hover:shadow-lg">
            {/* Image */}
            <div className="flex w-1/10 mr-8">
                <Link to={`/product/${post.listing_id}`} state={{ post }}>
                    <img
                        src={post.main_picture}
                        alt=""
                        className="h-24 rounded-lg transition-transform transform hover:scale-105 hover:shadow-md"
                    />
                </Link>
            </div>

            {/* Title */}
            <div className="flex w-1/5 mr-8">
                <Link to={`/product/${post.listing_id}`} state={{ post }}>
                    <h2 className="text-xl font-bold hover:underline">{post.title}</h2>
                </Link>
            </div>

            {/* Author and Rating */}
            <div className="flex flex-col w-3/20 mr-8">
                <Link to={`/product/${post.listing_id}`} state={{ post }}>
                    <p className="italic text-lg">{fullName}</p>
                    <p className="text-orange-500 text-sm">{post.score}</p>
                </Link>
            </div>

            {/* Price */}
            <div className="flex flex-col w-3/20">
                <Link to={`/product/${post.listing_id}`} state={{ post }}>
                    <p className="text-blue-500 text-sm">Manga</p>
                    <p className="text-lg font-semibold text-black">${post.price}</p>
                </Link>
            </div>

            {/* Quantity Controls */}
            <div className="flex flex-col justify-center items-center w-1/5 mr-8">
                <div className="flex items-center border rounded-lg bg-white p-2">
                    <input
                        type="number"
                        className="text-center w-10 text-lg bg-white outline-none"
                        value={count}
                        min={1}
                        readOnly
                    />
                    <div className="flex flex-col">
                        <button
                            className="bg-blue-200 hover:bg-blue-300 rounded mb-1 px-1"
                            onClick={increase}
                        >
                            +
                        </button>
                        <button
                            className="bg-red-200 hover:bg-red-300 rounded px-1"
                            onClick={decrease}
                        >
                            -
                        </button>
                    </div>
                </div>
                {/* Display Current Quantity */}
                <p className="mt-2 text-sm text-gray-600">
                    Current Quantity: {post.item_quantity}
                </p>
            </div>

            {/* Remove Button */}
            <div className="flex w-1/5 justify-center items-center">
                <button
                    className="bg-blue-200 hover:bg-blue-300 font-bold rounded-lg px-4 py-2 transition-colors"
                    onClick={handleRemoveFromCart}
                >
                    Remove {count} from cart?
                </button>
            </div>
        </div>
    );
};

export default CartCard;