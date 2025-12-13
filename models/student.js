const db = require("../db")

const User = db.model("Student", {
    username:{type:String, required:true},
    password:{type:String, required:true},
    status: String
})

module.exports = Student