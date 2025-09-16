----------------User Information--------------
CREATE TABLE IF NOT EXISTS manga (
    manga_id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    score DOUBLE PRECISION,
    "status" TEXT NOT NULL,
    volumes INTEGER NOT NULL,
    chapters INTEGER NOT NULL,
    "start_date" DATE,
    end_date DATE,
    sfw BOOLEAN NOT NULL,
    genres TEXT[],
    themes TEXT[],
    demographics TEXT[],
    authors JSONB,
    synopsis TEXT,
    main_picture TEXT,
    title_english TEXT,
    title_japanese TEXT,
    title_synonyms TEXT[]
);

CREATE TABLE IF NOT EXISTS user_info (
    user_id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS user_listings (
    listing_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES user_info(user_id) ON DELETE CASCADE,
    manga_id INTEGER NOT NULL REFERENCES manga(manga_id) ON DELETE CASCADE,
    initial_quantity INTEGER NOT NULL,
    current_quantity INTEGER NOT NULL,
    price DOUBLE PRECISION,
    creation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS shipping_address (
    address_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES user_info(user_id) ON DELETE CASCADE,
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    "state" TEXT,
    zip_code TEXT,
    country TEXT
);

-------------Product Details-------------
CREATE TABLE IF NOT EXISTS discount (
    discount_id SERIAL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    discount_percent DOUBLE PRECISION NOT NULL CHECK (discount_percent BETWEEN 0 AND 100),
    start_date DATE NOT NULL,
    end_date DATE,
    CHECK (end_date >= start_date)
);

------------Order Details------------
CREATE TABLE IF NOT EXISTS cart (
    cart_id SERIAL PRIMARY KEY,
    buyer_id INTEGER NOT NULL REFERENCES user_info(user_id) ON DELETE CASCADE,
    listing_id INTEGER NOT NULL REFERENCES user_listings(listing_id) ON DELETE CASCADE,
    item_quantity INTEGER
);

CREATE TABLE IF NOT EXISTS order_history (
    order_id SERIAL PRIMARY KEY,
    buyer_id INTEGER NOT NULL REFERENCES user_info(user_id) ON DELETE CASCADE,
    address_id INTEGER NOT NULL REFERENCES shipping_address(address_id) ON DELETE CASCADE,
    discount_id INTEGER REFERENCES discount(discount_id) ON DELETE SET NULL,
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_price DOUBLE PRECISION,
    completed BOOLEAN DEFAULT FALSE;
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES order_history(order_id) ON DELETE CASCADE,
    listing_id INTEGER NOT NULL REFERENCES user_listings(listing_id) ON DELETE CASCADE,
    item_quantity INTEGER,
    listing_price DOUBLE PRECISION
);

--\COPY is an SQL meta-command so this line must be run directly through DB command line. Change the file location to where you have manga.csv located.
\COPY manga FROM 'C:\Users\adanr\OneDrive\Documents\Classes\SE\project\LoadDB\manga.csv' WITH(FORMAT csv, HEADER);