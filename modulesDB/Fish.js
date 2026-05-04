const mongoose = require("mongoose");



const modulee = new mongoose.Schema({






    name: {
        type: String,

    },
    id: {
        type: String,

    },
    vendorWeight: {
        type: String,
    },
    sizesCategories: {
        type: String,

    },
   
    batchID: {
        type: String,

    },





    timestamp: { type: Date, default: Date.now }



});


const DBmodule = new mongoose.model('Fish', modulee)
module.exports = DBmodule;