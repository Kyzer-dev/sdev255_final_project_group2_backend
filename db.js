const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://<username>:<password>@songdb.mlmiecm.mongodb.net/?appName=songdb")

module.exports = mongoose
