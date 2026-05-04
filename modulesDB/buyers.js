const mongoose = require("mongoose");



const modulee = new mongoose.Schema({






    FullName: {
        type: String,

    },
    information: {
        type: Array,

    },
    Shortname: {
        type: String,

    },
    conutry: {
        type: String,

    },
    Registration: {
        type: String,

    },
    logo: {
        type: String,

    },



    timestamp: { type: Date, default: Date.now }



});


const DBmodule = new mongoose.model('Buyer', modulee)
module.exports = DBmodule;