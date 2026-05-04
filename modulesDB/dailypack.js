const mongoose = require("mongoose");



const modulee = new mongoose.Schema({






    ItemID:{type:String},
    numberofCT:{type:String},
    CartonsWieght:{type:String},
    orderID:{type:String},



    timestamp: { type: Date, default: Date.now }



});


const DBmodule = new mongoose.model('DailyPack', modulee)
module.exports = DBmodule;