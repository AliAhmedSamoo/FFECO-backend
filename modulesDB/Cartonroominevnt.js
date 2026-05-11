const mongoose = require("mongoose");



const modulee = new mongoose.Schema({




    itemID: { type: String },
    Stock: { type: String },
    Required: { type: String },


    timestamp: { type: Date, default: Date.now }



});


const DBmodule = new mongoose.model('Cartonroominevnt', modulee)
module.exports = DBmodule;