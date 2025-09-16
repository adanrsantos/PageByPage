const CreateCard = ({ manga, onCardClick }) => {
    return (
        <div
            className="cursor-pointer border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            onClick={onCardClick}
        >
            <div className="w-full h-64 overflow-hidden mb-4 rounded-md">
                <img
                    className="object-cover w-full h-full"
                    src={manga.main_picture || "placeholder.jpg"}
                    alt={manga.title || "No Image"}
                />
            </div>
            <div className="space-y-2">
                <h1 className="text-lg font-semibold">{manga.title || "Unknown Title"}</h1>
                {manga.authors && manga.authors.length > 0 ? (
                    manga.authors.map((author, index) => (
                        <p key={index} className="text-sm text-gray-600">
                            {author.role}: {author.first_name} {author.last_name}
                        </p>
                    ))
                ) : (
                    <p className="text-sm text-gray-600">No authors available</p>
                )}
            </div>
        </div>
    );
};

export default CreateCard;
