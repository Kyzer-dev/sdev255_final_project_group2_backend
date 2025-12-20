const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://<dbuser>:<dbpw>@songdb.mlmiecm.mongodb.net/?appName=songdb")

module.exports = mongoose
