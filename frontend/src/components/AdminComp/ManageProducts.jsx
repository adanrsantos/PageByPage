import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const ManageUsers = ({ dashboardData, fetchDashboard }) => {
    const [userSearch, setUserSearch] = useState("");
    const [userData, setUserData] = useState([]); // Initialize as an array for mapping
    const [userID, setUserID] = useState(null);
    const [allListings, setAllListings] = useState([]);
    const location = useLocation();
    const userIDFromURL = new URLSearchParams(location.search).get("userID");

    useEffect(() => {
        if (userIDFromURL) {
            setUserID(userIDFromURL);
        }
    }, [userIDFromURL]);

    useEffect(() => {
        if (userID) {
            handleFetchListing(userID); // Fetch data when userID changes
        }
    }, [userID]); // Re-run when userID changes

    // Handle search functionality
    const handleFetchListing = async (searchQuery) => {
        try {
            const body = { userSearch: searchQuery };
            const response = await fetch("http://localhost:5001/api/getUserListing", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (response.ok) {
                const data = await response.json();
                setUserData(data);
            } else {
                console.error("User not found");
                setUserData([]); // Reset to empty array if no user is found
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAllListings = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/getAllListings", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (response.ok) {
                const temp = await response.json();
                setAllListings(temp);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleTerminateListing = async (listing_id) => {
        if (!window.confirm("Are you sure you want to terminate this user? This action cannot be undone.")) {
            return;
        }

        try {
            const body = { listing_id: listing_id };
            const response = await fetch("http://localhost:5001/api/terminateListing", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (response.ok) {
                fetchDashboard();
                fetchAllListings();
                handleFetchListing(userSearch);
                alert("User terminated successfully");
            } else {
                console.error("Failed to terminate user");
                alert("Failed to terminate user");
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchAllListings(); // Fetch all listings on page load
    }, []);

    return (
        <div className="p-4 flex flex-row">
            <div className="w-1/2">
                <h1 className="text-2xl font-bold mb-4">Manage Listings</h1>
                {/* User Search */}
                <div className="mb-6">
                    <input
                        type="text"
                        className="p-2 border border-gray-300 rounded mr-2"
                        placeholder="Search for a user"
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => handleFetchListing(userSearch)} // Pass userSearch to function
                    >
                        Search
                    </button>
                </div>
                {/* Display User Listings */}
                {userData.length === 0 ? (
                    <p>No listings found for this user.</p>
                ) : (
                    <div>
                        {userData.map((listing) => (
                            <div key={listing.listing_id} className="flex rounded-lg shadow-md mb-4">
                                <div className="w-1/2 p-4">
                                    <p><strong>Listing ID:</strong> {listing.listing_id}</p>
                                    <p><strong>Manga ID:</strong> {listing.manga_id}</p>
                                    <p><strong>Price:</strong> ${listing.price}</p>
                                    <p><strong>Current Quantity:</strong> {listing.current_quantity}</p>
                                    <p><strong>Active:</strong> {listing.active ? "Yes" : "No"}</p>
                                </div>
                                {/* Right section show manga */}
                                <div className="w-1/2 p-4 ml-auto text-right">
                                    <img src={listing.main_picture} alt="" className="h-20 ml-auto mb-2"/>
                                    <p><strong>Title: </strong>{listing.title}</p>
                                    <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => handleTerminateListing(listing.listing_id)}>Terminate Listing</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/* All Listings Section */}
            <div className="w-1/2 pl-4">
                <h2 className="text-xl font-bold mb-4">All Listings</h2>
                <p className="text-gray-600 mt-8 mb-7">
                    Total Listings: {dashboardData.total_listings}
                </p>
                <div className="bg-white shadow-md rounded p-4 overflow-y-auto max-h-96">
                    {allListings.length > 0 ? (
                        <ul>
                            {allListings.map((listing) => (
                                <li key={listing.user_id} className="mb-2 flex justify-between">
                                    <span className="font-bold">{listing.username}</span>
                                    <span>Active: {listing.active ? "Yes" : "No"}</span>
                                    <span>{new Date(listing.creation_date).toLocaleString()}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No listings found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;