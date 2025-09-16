import { useState, useEffect } from "react";

const ManageUsers = ({ dashboardData, fetchDashboard }) => {
    const [userSearch, setUserSearch] = useState("");
    const [userData, setUserData] = useState(null); 
    const [allUsers, setAllUsers] = useState([]);

    const handleFetchUser = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/getUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userSearch }),
            });
            if (response.ok) {
                const data = await response.json();
                setUserData(data);
            } else {
                setUserData(null);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleTerminateUser = async (userId) => {
        if (!window.confirm("Are you sure you want to remove this user? This action cannot be undone.")) return;

        try {
            const response = await fetch("http://localhost:5001/api/terminate", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: userId }),
            });
            if (response.ok) {
                setAllUsers((prevUsers) => prevUsers.filter((user) => user.user_id !== userId));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleToggleAdmin = async (userId, currentAdminStatus) => {
        const action = currentAdminStatus ? "demote" : "promote";
        if (!window.confirm(`Are you sure you want to ${action} this user to/from admin?`)) return;

        try {
            const response = await fetch("http://localhost:5001/api/updateUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: userId,
                    field: "admin",
                    value: !currentAdminStatus,
                }),
            });
            if (response.ok) {
                setAllUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.user_id === userId ? { ...user, admin: !currentAdminStatus } : user
                    )
                );
            } else {
                console.error("Failed to toggle admin status");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/getAllUsers");
            if (response.ok) {
                const data = await response.json();
                setAllUsers(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

    return (
        <div className="p-4 flex flex-col items-center gap-8">
            {/* Search for Users Section */}
            <div className="w-full max-w-3xl">
                <h1 className="text-3xl font-bold text-center mb-6">Manage Users</h1>
                <div className="flex flex-col items-center mb-6">
                    <input
                        type="text"
                        className="w-full md:w-3/4 p-2 border border-gray-300 rounded mb-2"
                        placeholder="Search for a user"
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded w-3/4 md:w-auto"
                        onClick={handleFetchUser}
                    >
                        Search
                    </button>
                </div>
                {userData && (
                    <div className="bg-white shadow-lg rounded p-6">
                        <h2 className="text-xl font-semibold mb-4 text-center">User Details</h2>
                        <p>
                            <strong>Username:</strong> {userData.username}
                        </p>
                        <p>
                            <strong>Email:</strong> {userData.email}
                        </p>
                        <p>
                            <strong>Admin:</strong> {userData.admin ? "Yes" : "No"}
                        </p>
                    </div>
                )}
            </div>

            {/* All Users Section */}
            <div className="w-full max-w-3xl">
                <h2 className="text-xl font-bold text-center mb-4">All Users</h2>
                <div className="bg-white shadow-lg rounded p-6 overflow-y-auto max-h-96">
                    {allUsers.length > 0 ? (
                        <ul className="space-y-3">
                            {allUsers.map((user) => (
                                <li key={user.user_id} className="flex justify-between items-center">
                                    <div>
                                        <strong>{user.username}</strong> - {user.email} -{" "}
                                        {user.admin ? "Admin" : "User"}
                                    </div>
                                    <div className="flex">
                                        <button
                                            className="bg-blue-500 text-white px-2 py-1 rounded"
                                            onClick={() => handleToggleAdmin(user.user_id, user.admin)}
                                        >
                                            Toggle Admin
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                                            onClick={() => handleTerminateUser(user.user_id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center">No users found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;
