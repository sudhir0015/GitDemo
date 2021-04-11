const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const nodeCleanup = require("node-cleanup");
const databasebroker = require("./routes/databasebroker.js");
const pdfGenerator = require("./routes/pdfmake");
const { DBConnection } = require("./database/mongo");

// defining the Express app
const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan("combined"));

DBConnection.connectToMongo();

nodeCleanup(function(exitCode, signal) {
    // release resources here before node exits
    console.log("Received signal to exit");
    DBConnection.closeDB();
});

app.use(databasebroker, pdfGenerator);

// starting the server
app.listen(3000, () => {
    console.log("listening on port 3000");
});
