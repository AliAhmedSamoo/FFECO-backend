const mongoose = require("mongoose");

const uri = "mongodb://localhost:27017/";
mongoose.connect(uri).then(() => {
    console.log("Connection is successful with DataBase");
}).catch((err) => {
    console.log("Connection error: ", err);
    if (err.name === 'MongoNetworkError') {
        console.log('Please check your internet connection and MongoDB Atlas status.');
    } else if (err.name === 'MongoParseError') {
        console.log('Please check your connection string.');
    } else {
        console.log(err);
    }
});