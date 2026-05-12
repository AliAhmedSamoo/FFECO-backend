const mongoose = require("mongoose");



const modulee = new mongoose.Schema({






    vendor: {
        type: String,

    },
    items: {
        type: Array,
    },
    POnumber: {
        type: String,
    },
    status: {
        type: Boolean,
        default: false
    },



    timestamp: { type: Date, default: Date.now }



});


const DBmodule = new mongoose.model('Purchaseorder', modulee)
module.exports = DBmodule;