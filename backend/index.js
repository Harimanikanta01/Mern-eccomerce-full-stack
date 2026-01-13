const express = require('express');
require('dotenv').config();
const cors = require('cors');



const connectDB = require('./config/db');
const router = require('./routes');

const app = express();

// --- Allow all origins without credentials ---
app.use(cors()); // simple, allows all origins
app.options('*', cors()); // handle preflight requests

// Serve frontend product assets
const path = require('path');
app.use('/images', express.static(path.join(__dirname, '..', 'frontend', 'src', 'assest', 'products')));

app.use(express.json());


app.use("/api", router);

// Error handling middleware
app.use(function(err, req, res, next){
    console.error('Unhandled error:', err);
    const status = err && err.status ? err.status : 500;
    res.status(status).json({ message: err.message || 'Internal Server Error', error: true, success: false });
});

const PORT = process.env.PORT || 8080;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Connected to DB");
        console.log("Server is running on port " + PORT);
    });
});
