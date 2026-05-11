const mongoose = require("mongoose");



const modulee = new mongoose.Schema({




    item: {type: String},
    name: {type: String},
    type: {type: String},
    party: {type: String},
    dimensions: {type: String},
    ply: {type: String},
    color: {type: String},
    micron:{type: String},

    timestamp: { type: Date, default: Date.now }



});


const DBmodule = new mongoose.model('Cartonroomitems', modulee)
module.exports = DBmodule;