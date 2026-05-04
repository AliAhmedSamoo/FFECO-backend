const mongoose = require("mongoose");

const uri = "mongodb://ali:ali@ac-u5bdorw-shard-00-00.ddpi0ha.mongodb.net:27017,ac-u5bdorw-shard-00-01.ddpi0ha.mongodb.net:27017,ac-u5bdorw-shard-00-02.ddpi0ha.mongodb.net:27017/YOUR_DB_NAME?ssl=true&replicaSet=atlas-j1i9ns-shard-0&authSource=admin&appName=FFECO";
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