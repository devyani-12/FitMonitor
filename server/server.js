const express = require("express");
const path = require("path");
const routes = require("./routes");
const cors = require("cors")
const db = require("./config/connection");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
