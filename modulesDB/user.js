const mongoose = require("mongoose");



const modulee = new mongoose.Schema({






    category: {
        type: String,

    },



    timestamp: { type: Date, default: Date.now }



});


const DBmodule = new mongoose.model('user', modulee)
module.exports = DBmodule;