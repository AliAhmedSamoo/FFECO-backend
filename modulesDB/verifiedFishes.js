const mongoose = require("mongoose");



const modulee = new mongoose.Schema({



   
    itemID: {
        type: String,

    },
    VendorID: {
        type: String,

    },
    batchID: {
        type: String,

    },
    sizeCategories: {
        type: String,

    },
    weight: {
        type: String,

   
    },
    grade: {
        type:String,

    },
    tub: {
        type:Array,

    },





    timestamp: { type: Date, default: Date.now }



});


const DBmodule = new mongoose.model('VerifiedFishes', modulee)
module.exports = DBmodule;