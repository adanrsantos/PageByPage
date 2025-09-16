import { useState } from "react";
import { useLocation } from "react-router-dom";
import '../components/ProductComp/product.css'

const Product = ({ userID }) => {
    const [count, setCount] = useState(1);
    const location = useLocation();
    const { post } = location.state || {};  // Retrieve the passed post object
    if (!post) {
        return <div>No product data found</div>;
    }

    const increase = () => {
        if (count < post.current_quantity){
            setCount(prevCount => prevCount + 1);
        }
      };
    
    const decrease = () => {
        if (count > 1){
            setCount(prevCount => prevCount - 1);
        }
    };

    const handleAddToCart = async (e) => {
        const listing_id = post.listing_id;
        const buyer_id = userID;
        const item_quantity = count;
    
        e.preventDefault();
        try {
            const body = { listing_id, buyer_id, item_quantity };
            const response = await fetch("http://localhost:5001/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            const data = await response.json();
            post.current_quantity -= count;
            setCount(1);
            console.log("Successfully added to cart:", data);
        } catch (error) {
            console.log(error);
        }
    }

    const author = post.authors && post.authors[0];
    const fullName = author ? `${author.last_name} ${author.first_name}` : "Unknown Author";

    return (
        <>
            <div className="productWrapper">
                <div className="product">
                    <div className="product-image">
                        <img src={post.main_picture || "placeholder.jpg"} alt={post.title || "No Image"} />
                    </div>
                    <div className="product-details">
                        <h1>{post.title || "Product Title"}</h1>
                        <h2>by {fullName || "Author Name"}</h2>
                        <div className="product-price-rating">
                            <span className="price">$ {post.price || "Price"}</span>
                            <span className="rating">{post.score || "Rating"}  ★</span>
                        </div>
                        <div className="buy-section">
                            <input type="number" min="1" value={count} readOnly className="quantity-input"/>
                            <button onClick={increase}>+</button>
                            <button onClick={decrease}>-</button>
                            <button 
                                className="buy-button" 
                                onClick={handleAddToCart}
                                disabled={post.current_quantity === 0}
                                style={{
                                    backgroundColor: post.current_quantity === 0 ? "red" : "#45a049",
                                    color: "white",
                                    cursor: post.current_quantity === 0 ? "not-allowed" : "pointer"
                                }}
                            >{post.current_quantity === 0 ? "SOLD OUT" : "BUY"}</button>
                        </div>
                        <div className="product-description">
                            <h3>Overview</h3>
                            <p>{post.synopsis || "Product description"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Product;