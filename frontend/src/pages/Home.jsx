import { useEffect } from "react";
import CardHome from "../components/HomeComp/CardHome";
import Filter from "../components/HomeComp/Filter";

const Home = ({ userID, posts, setPosts, filter, setFilter, navSearch }) => {

    const refreshCartData = async (filter = "") => {
        try {
            const response = await fetch(`http://localhost:5001/api/home?filter=${filter}`, { // Use backticks here
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                setPosts(data);
            } else {
                console.log("Failed to fetch listings");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };    

    useEffect(() => {
        if (!navSearch) {
            refreshCartData(filter);
        }
        // eslint-disable-next-line
    }, [filter]); // Dependency array includes filter    

    return(
        <div className="homeWrapper">
            <div className="Home">
                <div className="filter">
                    <Filter onFilterChange={setFilter}/>
                </div>
                <div className="itemHome">
                    {posts.length === 0 ? (
                        <div className="noResultMessage">
                            No results. Refresh or check spelling.
                        </div>
                    ) : (
                        posts.map(post=>(
                            <CardHome key={post.listing_id} post={post} userID={userID} refreshCartData={refreshCartData}/>
                        ))
                    )}
                </div>
            </div>   
        </div>
    );
}

export default Home;