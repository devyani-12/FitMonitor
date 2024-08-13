const router = require("express").Router();
const apiRoutes = require("./api");

// Use API routes
router.use("/api", apiRoutes);

// Catch-all route for handling unknown routes (optional, adjust as needed)
router.use((req, res) => {
  res.status(404).send("Not Found");
});

module.exports = router;