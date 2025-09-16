import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";
import CreateCard from "./CreateCard";

const Main = ({ userID }) => {
    const [manga, setManga] = useState("");
    const [mangaList, setMangaList] = useState([]);
    const [selectedManga, setSelectedManga] = useState(null);
    const [mangaID, setMangaID] = useState(null);

    const [count, setCount] = useState(1);
    const [price, setPrice] = useState("");

    const increase = () => setCount((prevCount) => prevCount + 1);
    const decrease = () => setCount((prevCount) => Math.max(prevCount - 1, 1));

    useEffect(() => {
        const fetchDefaultManga = async () => {
            try {
                const response = await fetch("http://localhost:5001/api/searchManga/default");
                if (response.ok) {
                    const data = await response.json();
                    setMangaList(data); // Populate the mangaList with default manga
                } else {
                    console.error("Failed to fetch default manga");
                }
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchDefaultManga(); // Fetch default manga on component load
    }, []);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const body = { manga };
            const response = await fetch("http://localhost:5001/api/searchManga", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            setMangaList(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCardClick = (mangaItem) => {
        const authors =
            mangaItem.authors && mangaItem.authors.length > 0
                ? mangaItem.authors.map((author) => `${author.role}: ${author.first_name} ${author.last_name}`).join(", ")
                : "No authors available";
        setSelectedManga({ ...mangaItem, authors });
        setMangaID(mangaItem.manga_id);
    };

    const handleListing = async (e) => {
        e.preventDefault();
        if (!selectedManga) {
            alert("Please select a manga to list!");
            return;
        }
        try {
            const body = { userID, mangaID, count, price };
            const response = await fetch("http://localhost:5001/api/listing", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            alert("Listing successfully created!");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-screen-lg mx-auto p-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h1 className="text-3xl font-bold mb-4 md:mb-0">Create Manga Listing</h1>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
                {/* Manga Search Section */}
                <div className="w-full md:w-2/3">
                    <h2 className="text-2xl font-semibold mb-4">Search for Manga</h2>
                    <div className="mb-6">
                        <div className="flex items-center border rounded-md overflow-hidden">
                            <input
                                className="w-full p-2 border-none focus:ring focus:outline-none"
                                type="text"
                                placeholder="Search for Manga..."
                                value={manga}
                                onChange={(e) => setManga(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleSubmit(e);
                                    }
                                }}
                            />
                            <button
                                className="bg-blue-500 text-white px-4"
                                onClick={handleSubmit}
                            >
                                <FaSearch />
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {mangaList.map((mangaItem, index) => (
                            <CreateCard
                                key={index}
                                manga={mangaItem}
                                onCardClick={() => handleCardClick(mangaItem)}
                            />
                        ))}
                    </div>
                </div>

                {/* Listing Details Section */}
                <div className="w-full md:w-1/3">
                    <h2 className="text-2xl font-semibold mb-4">Selected Manga</h2>
                    {selectedManga ? (
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <div className="flex flex-col items-center mb-4">
                                <img
                                    className="w-32 h-48 object-cover mb-4"
                                    src={selectedManga.main_picture}
                                    alt={selectedManga.title}
                                />
                                <h1 className="text-xl font-semibold mb-2">{selectedManga.title}</h1>
                                <p className="text-sm text-gray-600 mb-2">{selectedManga.authors}</p>
                            </div>
                            <div className="flex items-center justify-between mb-4">
                                <input
                                    type="number"
                                    className="w-16 p-2 border rounded-l-md"
                                    value={count}
                                    min={1}
                                    readOnly
                                />
                                <div className="flex gap-2">
                                    <button
                                        className="w-8 h-8 bg-blue-500 text-white rounded-full"
                                        onClick={increase}
                                    >
                                        +
                                    </button>
                                    <button
                                        className="w-8 h-8 bg-red-500 text-white rounded-full"
                                        onClick={decrease}
                                    >
                                        -
                                    </button>
                                </div>
                            </div>
                            <input
                                type="number"
                                placeholder="Price?"
                                className="w-full p-2 border rounded-md mb-4"
                                value={price}
                                min={0}
                                step="0.01"
                                onChange={(e) => setPrice(e.target.value)}
                            />
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded-md w-full"
                                onClick={handleListing}
                            >
                                List {count} of the Manga for ${price || "0.00"}
                            </button>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">No manga selected.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Main;
