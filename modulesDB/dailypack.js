const mongoose = require("mongoose");



const modulee = new mongoose.Schema({






    ItemID: { type: String },
    numberofCT: { type: String },
    CartonsWieght: { type: String },
    orderID: { type: String },


    repack: {
        type: Boolean,
        default: false
    },

    timestamp: { type: Date, default: () => new Date(Date.now() - 24 * 60 * 60 * 1000) }



});


const DBmodule = new mongoose.model('DailyPack', modulee)
module.exports = DBmodule;