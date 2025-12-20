const db = require("../db")

const Course = db.model("Course", {
    courseName : {type: String, required: true},
    instrMethod : String,
    slots : {type: Number, min: 1},
    hourStart : Number,
    hourEnd : Number,
    dayOfWeek : [String],
    calStartDate : {type: Date},
    calEndDate : {type: Date},
    instructor : String,
    description : String
})

module.exports = Course