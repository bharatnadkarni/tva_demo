const mongoose = require("mongoose");

const asteroid_schema = mongoose.Schema({   
    date:{type: Date},
    asteroids: {type: [
        {
            name: {type: String},
            magnitude: {type: Number},
            diameter: {type: Number},
            distance: {type: Number},
            velocity: {type: Number}
        }
    ]}
})
module.exports = mongoose.model("Asteroid",asteroid_schema)