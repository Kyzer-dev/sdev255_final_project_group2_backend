const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://<db_username>:<db_password>@songdb.mlmiecm.mongodb.net/?appName=songdb")

module.exports = mongoose
