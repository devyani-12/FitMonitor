const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGODB_URI , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, err => {
  if (err) throw err;
  console.log('Connected to MongoDB!')
}

);

module.exports = mongoose.connection;
