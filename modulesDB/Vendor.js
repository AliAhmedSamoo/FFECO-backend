const mongoose = require("mongoose");



const modulee = new mongoose.Schema({






    vendorName: {
        type: String,

    },
    vendorPhone: {
        type: String,
    },
    


    timestamp: { type: Date, default: Date.now }



});


const DBmodule = new mongoose.model('Vendor', modulee)
module.exports = DBmodule;