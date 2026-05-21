const mongoose = require("mongoose");



const modulee = new mongoose.Schema({






    

    orderId: {
        type: String,

    },
    ItemName: {
        type: String,

    },
    ExportItemName: {
        type: String,

    },
    Process: {
        type: String,

    },
    FishGrading: {
        type: Array,

    },
    Frezeas: {
        type: String,

    },
    PACKas: {
        type: String,

    },
    PACKGrading: {
        type: Array,

    },
    TotalCartons: {
        type: String,

    },
    WeightperCartons: {
        type: String,

    },
    pcperCartons: {
        type: String,

    },
    loaclgradings: {
        type: String,

    },

    timestamp: { type: Date, default: Date.now }



});


const DBmodule = new mongoose.model('Order_Item', modulee)
module.exports = DBmodule;