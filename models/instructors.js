const db = require("../db")

const Instructor = db.model("Instructor", {
    username:{type:String, required:true},
    password:{type:String, required:true},
    status: String
})

module.exports = Instructor