const mongoose = require("mongoose");



const modulee = new mongoose.Schema({






    vendor: {
        type: String,

    },
    batchID: {
        type: String,

    },



    timestamp: { type: Date, default: Date.now }



});


const DBmodule = new mongoose.model('Batch', modulee)
module.exports = DBmodule;