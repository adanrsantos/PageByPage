import Checkout from "../components/CartComp/Checkout";
import CartCard from "../components/CartComp/CartCard"
import { useState, useEffect } from "react";

const Cart = ({ userID }) => {
    const [post, setPosts] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0.00);
    const [totalItems, setTotalItems] = useState(0);

    const fetchPosts = async () => {
        try {
            const user_id = userID;
            const body = { user_id }
            const response = await fetch("http://localhost:5001/api/getCart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body)
            });
            if (response.ok) {
                const data = await response.json();
                setPosts(data);
                setTotalPrice(data.reduce((acc, item) => acc + item.price * item.item_quantity, 0));
                setTotalItems(data.reduce((acc, item) => acc + item.item_quantity, 0));
            }
            else{
                console.error("Failed to fetch listing");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    useEffect(() => {
        fetchPosts();
        // eslint-disable-next-line
    }, []);

    return(
        <div className="cartWrapper">
            <h1 className="cartHeader text-4xl font-bold text-center mb-6 bg-blue-100 p-2 border-0">Overview</h1>
            <div className="cartOverview">
                <div className="cartCard">
                    {post.length > 0 ? (
                        post.map((post) => (
                            <CartCard key={post.cart_id} userID={userID} post={post} fetchPosts={fetchPosts}/>
                        ))
                    ) : (
                        <h1 className="emptyCartMessage">Cart is empty.</h1>
                    )}
                </div>
            </div>
            <div className="cartCheckout">
                <Checkout userID={userID} totalPrice={totalPrice} totalItems={totalItems}/> 
            </div>
        </div>
    );
}

export default Cart;