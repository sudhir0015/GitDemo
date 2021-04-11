var express = require("express");
var routes = express.Router();

routes.post("/pdf", (req, res) => {
    res.send("pdf generated");
});

module.exports = routes;