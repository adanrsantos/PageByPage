import { Link } from "react-router-dom";
import { useState } from "react";
import CardHomeCSS from "./CardHome.module.css";

const CardHome = ({ post, userID, refreshCartData }) => {
  const [count, setCount] = useState(1);

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

        console.log("Successfully added to cart:", data)
        refreshCartData();
    } catch (error) {
        console.log(error);
    }
  }

  const author = post.authors && post.authors[0];
  const fullName = author ? `${author.last_name} ${author.first_name}` : "Unknown Author";

  return (
    <div className={CardHomeCSS.card}>
        <div className={CardHomeCSS.imgCont}>
            <Link className={CardHomeCSS.link} to={`/product/${post.listing_id}`}
            state={{ post: post}}>
                <img src={post.main_picture} alt="" className={CardHomeCSS.img} />
            </Link>
        </div>
        <div className={CardHomeCSS.titleCont}>
            <Link className={CardHomeCSS.link} to={`/product/${post.listing_id}`}
            state={{ post: post}}>
                <h2 className={CardHomeCSS.title}>{post.title}</h2>
            </Link>
            <div className={CardHomeCSS.usernameCont}>
                <p className={CardHomeCSS.seller}>Seller:</p>
                <p className={CardHomeCSS.username}>{post.username}</p>
            </div>
        </div>
        <div className={CardHomeCSS.infoCont}>
            <Link className={CardHomeCSS.link} to={`/product/${post.listing_id}`}
            state={{ post: post}}>
                <p className={CardHomeCSS.author}>{fullName}</p>
                <p className={CardHomeCSS.rating}>{post.score} ★</p>
            </Link>
        </div>
        <div className={CardHomeCSS.priceCont}>
            <Link className={CardHomeCSS.link} to={`/product/${post.listing_id}`}
            state={{ post: post}}>
                <p className={CardHomeCSS.type}>Manga</p>
                <p className={CardHomeCSS.price}>${post.price}</p>
            </Link>
        </div>
        <div className={CardHomeCSS.quantityCont}>
            <div className={CardHomeCSS.quantityBorder}>
                <input type="number" className={CardHomeCSS.input} value={count} min={1} readOnly/>
                <div className={CardHomeCSS.quantity}>
                    <button className={CardHomeCSS.increase} onClick={increase}>+</button>
                    <button className={CardHomeCSS.decrease} onClick={decrease}>-</button>
                </div>
            </div>
            <p className={CardHomeCSS.currentValue}>Available quantity: {post.current_quantity}</p>
        </div>
        <div className={CardHomeCSS.btnCont}>
            <button className={CardHomeCSS.btn} onClick={handleAddToCart}>
                Add to Cart
            </button>
        </div>
    </div>
  );
}

export default CardHome;