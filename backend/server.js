const express = require("express");
const cors = require("cors");

const dotenv = require('dotenv');
// const apiRouter = require('./api');
dotenv.config();

// ----- MIDDLEWARE ----- //
const app = express();
app.use(cors());
app.use(express.json());

// ----- ROUTES ----- //
const registerRoute = require("./routes/register");
const loginRoute = require("./routes/login");
const searchMangaRoute = require("./routes/searchManga");
const listing = require("./routes/listing");
const cart = require("./routes/cart");
const home = require("./routes/home");
const checkout = require("./routes/checkout");
const getCart = require("./routes/getCart");
const removeCart = require("./routes/removeCart");
const getOrder = require("./routes/getOrder");
const navSearch = require("./routes/navSearch");
const dashboard = require("./routes/dashboard");
const getDiscounts = require("./routes/getDiscounts");
const createDiscounts = require("./routes/createDiscounts");
const getUser = require("./routes/getUser");
const updateUser = require("./routes/updateUser");
const terminate = require("./routes/terminate");
const getAllUsers = require("./routes/getAllUsers");
const updateOrderStatus = require("./routes/updateOrderStatus");
const getAllOrders = require("./routes/getAllOrders");
const getAllListings = require("./routes/getAllListings");
const getUserListing = require("./routes/getUserListing");
const terminateListing = require("./routes/terminateListing");

app.use('/api/register', registerRoute);
app.use('/api/login', loginRoute);
app.use('/api/searchManga', searchMangaRoute);
app.use('/api/listing', listing);
app.use('/api/cart', cart);
app.use('/api/home', home);
app.use('/api/checkout', checkout);
app.use('/api/getCart', getCart);
app.use('/api/removeCart', removeCart);
app.use('/api/getOrder', getOrder);
app.use('/api/navSearch', navSearch);
app.use('/api/dashboard', dashboard);
app.use('/api/getDiscounts', getDiscounts);
app.use('/api/createDiscounts', createDiscounts);
app.use('/api/getUser', getUser);
app.use('/api/updateUser', updateUser);
app.use('/api/terminate', terminate);
app.use('/api/getAllUsers', getAllUsers);
app.use('/api/updateOrderStatus', updateOrderStatus);
app.use('/api/getAllOrders', getAllOrders);
app.use('/api/getAllListings', getAllListings);
app.use('/api/getUserListing', getUserListing);
app.use('/api/terminateListing', terminateListing);

// ----- START PORT ----- //
const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});