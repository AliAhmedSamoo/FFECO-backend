const mongoose = require("mongoose");



const modulee = new mongoose.Schema({



    
    Buyer: {
        type: String,

    },
    oderID: {
        type: String,

    },
    DOP: {
        type: String,

    },
    DOE: {
        type: String,

    },
    RefNo: {
        type: String,

    },
    LOTNo: {
        type: String,

    },
    


    timestamp: { type: Date, default: Date.now }



});


const DBmodule = new mongoose.model('Order', modulee)
module.exports = DBmodule;