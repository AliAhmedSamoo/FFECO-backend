const mongoose = require("mongoose");



const modulee = new mongoose.Schema({






    itemName: {
        type: String,

    },
    marketPrice: {
        type: Array,
    },
    sizesCategories: {
        type: Array,

    },
    sizesCategories_FFECO: {
        type: Array,

    },



    timestamp: { type: Date, default: Date.now }



});


const DBmodule = new mongoose.model('Item', modulee)
module.exports = DBmodule;