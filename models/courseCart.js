const db = require("../db")

const courseCart = db.model("Course", {
    courses:{type:Array,required:true}
    
})

module.exports = Course