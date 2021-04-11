const bodyParser = require("body-parser");
const express = require("express");
// defining the Express app
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

const uuidv1 = require("uuidv4");

// var express = require("express");
var routes = express.Router();

const { DBClient } = require("../database/mongo");

// defining an endpoint to return all ads
routes.get("/", (req, res) => {
    // res.send("Hello From Server");
});

routes.get("/sprint/:name", (req, res) => {
    // console.log("/sprint/:name");
    // console.log("req = " + req.body.name);

    DBClient.createNewSprint(req.body.name);
    DBClient.viewCompleteBoard(req.body.name)
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            console.error(error);
        });
});

routes.get("/team/:name", (req, res) => {
    // provide the list of sprints corresponding to a team.
    // console.log("/team/:name===========");
    // console.log("req = " + req.params.name);

    DBClient.getSprintsForATeam(req.params.name)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.error(err);
        });
});

routes.get("/team/:teamName/sprint/:sprintName", (req, res) => {
    // provide the board details for the corresponding result
    // console.log("/team/:teamName/sprint/:sprintName=================");
    // console.log("data = " + JSON.stringify(req.params));

    if (!req.params && !req.params.teamName && !req.params.sprintName) {
        return res.status(400).send("Please update all the required fields!");
    }
    DBClient.viewCompleteBoard(req.params.teamName, req.params.sprintName)
        .then((result) => {
            DBClient.getColumnSettings(req.params.teamName)
                .then((set) => {
                    let retunObj = {
                        items: result,
                        settings: set,
                    };
                    res.send(retunObj);
                })
                .catch((error) => {
                    console.error(error);
                });
        })
        .catch((error) => {
            console.error(error);
        });
});

routes.get("/getTeams", (req, res) => {
    // console.log("getTeams ===== called");

    DBClient.getTeams()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.error(err);
        });
});

routes.get("/getSprints", (req, res) => {
    // console.log("getSprints ======" + JSON.stringify(req.query));
    // console.log("team name = " + req.query.team);
    if (!req.query.team) {
        return res.status(400).send("Team name is not defined!");
    }
    DBClient.getSprintsForATeam(req.query.team)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.error(err);
        });
});

routes.post("/createSprint", (req, res) => {
    // console.log("createSprint");
    // console.log("team = " + req.body.team);

    if (!req.body.team) {
        return res.status(400).send("Team name is not defined!");
    }
    if (!req.body.sprint) {
        return res.status(400).send("Sprint name is not defined!");
    }
    var sprintDbName = req.body.sprint
        .trim()
        .toLowerCase()
        .replace(/[^A-Z0-9]+/gi, "_");
    DBClient.findSprint(req.body.team, sprintDbName)
        .then((result) => {
            if (result && result.length) {
                return res.status(400).send("Sprint exists!");
            } else {
                let sprint = {
                    _id: uuidv1(),
                    team: req.body.team,
                    sprint: sprintDbName,
                };
                DBClient.addItemToCollection(sprint)
                    .then((result) => {
                        res.send(result);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        })
        .catch((error) => {
            console.error(error);
        });
});

routes.post("/createTeam", (req, res) => {
    // console.log("createTeam");
    // console.log(req.body.team);

    if (!req.body.team) {
        return res.status(400).send("Team name is not defined!");
    }
    let teamDBName = req.body.team
        .trim()
        .toLowerCase()
        .replace(/[^A-Z0-9]+/gi, "_");
    DBClient.findTeam(teamDBName)
        .then((result) => {
            if (result && result.length) {
                return res.status(400).send("Team exists!");
            } else {
                let team = {
                    _id: uuidv1(),
                    team: teamDBName,
                };
                DBClient.addItemToCollection(team)
                    .then((result) => {
                        res.send(result);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        })
        .catch((error) => {
            console.error(error);
        });
});

routes.get("/Board", (req, res) => {
    // console.log("/Board=================");
    // console.log("req = " + req.query.sprint);

    DBClient.viewCompleteBoard(req.query.team, req.query.sprint)
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            console.error(error);
        });
});

routes.post("/update/:name", (req, res) => {
    // console.log("update/:name");
    // console.log("req = " + JSON.stringify(req.body));

    if (!req.body.team ||
        !req.body.sprint ||
        !req.body.name ||
        !req.body.message ||
        !req.body.type ||
        !req.body.date
    ) {
        return res.status(400).send("Please update all the required fields!");
    }

    let item = {
        _id: uuidv1(),
        team: req.body.team,
        sprint: req.body.sprint,
        name: req.body.name,
        type: req.body.type,
        message: req.body.message,
        date: req.body.date,
        votes: req.body.vote,
        index: req.body.index,
    };

    DBClient.addItemToCollection(item)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            res.send(err);
        });
});

routes.get("/search", (req, res) => {
    // console.log("search");
    // console.log("req = " + req.body.name);

    DBClient.viewByUserName(req.body.sprint, req.body.name)
        .then((result) => {
            console.log(result);
            res.send(result);
        })
        .catch((error) => {
            console.error(error);
        });
});

routes.post("/renameColumn", (req, res) => {
    if (!req.body.team || !req.body.column || !req.body.value) {
        return res.status(400).send("Please update all the required fields!");
    }

    if (
        req.body.column !== "Good" &&
        req.body.column !== "Bad" &&
        req.body.column !== "Ugly"
    ) {
        return res.status(400).send("Undefined column name!");
    }

    DBClient.renameColumn(req.body.team, req.body.column, req.body.value)
        .then(function () {
            res.sendStatus(200);
        })
        .catch((err) => {
            res.send(err);
        });
});

routes.post("/deletepost", (req, res) => {
    // console.log("deletepost");
    // console.log("req = " + req.body._id);

    DBClient.deletePost(req.body._id)
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            console.error(error);
        });
});

routes.post("/addvote", (req, res) => {
    // console.log("addvote");
    // console.log("req = " + req.body._id);

    DBClient.addVote(req.body._id)
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            console.error(error);
        });
});

routes.post("/removevote", (req, res) => {
    // console.log("removevote");
    // console.log("req = " + req.body._id);

    DBClient.removeVote(req.body._id)
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            console.error(error);
        });
});

routes.post("/removehappiness", (req, res) => {
    if (!req.body || !req.body.id) {
        return res.status(400).send("id is missing!");
    }
    DBClient.removeHappiness(req.body.id)
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            console.error(error);
        });
});

routes.post("/addactionpoint", (req, res) => {
    // console.log("addactionpoint");
    // console.log("req = " + JSON.stringify(req.body));

    DBClient.addActionPointToItem(req.body)
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            console.error(error);
        });
});

routes.post("/updateHappiness", (req, res) => {
    // console.log("updateHappiness =================");
    // console.log(JSON.stringify(req.body));

    if (!req.body ||
        !req.body.team ||
        !req.body.sprint ||
        !req.body.name ||
        !req.body.happiness
    ) {
        return res.status(400).send("Please update all the required fields!");
    }
    let myQuery = {
        _id: uuidv1(),
        team: req.body.team,
        sprint: req.body.sprint,
        name: req.body.name,
        happiness: req.body.happiness,
    };
    DBClient.updateHappiness(myQuery)
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            console.error(error);
        });
});

routes.post("/setVelocity", (req, res) => {
    if (!req.body ||
        !req.body.team ||
        !req.body.sprint ||
        !req.body.spPlanned ||
        !req.body.spBurnt ||
        !req.body.pi ||
        !req.body.bbAccuracy
    ) {
        return res.status(400).send("Please update all the required fields!");
    }
    DBClient.setVelocity(req.body)
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            console.error(error);
        });
});

routes.post("/setSortingCriteria", (req, res) => {
    if (!req.body || !req.body.team ||
        !req.body.sprint || !req.body.criteria) {
        return res.status(400).send("Please update all the required fields!");
    }

    DBClient.setSortingCriteria(req.body.team, req.body.sprint, req.body.criteria)
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            console.error(error);
        });
});


routes.get("/getSortingCriteria", (req, res) => {
    if (!req.query || !req.query.team ||
        !req.query.sprint) {
        return res.status(400).send("Please update all the required fields!");
    }

    DBClient.getSortingCriteria(req.query.team, req.query.sprint)
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            console.error(error);
        });
});

routes.get("/checkIfVotingAllowed", (req, res) => {
    if (!req.query || !req.query.team ||
        !req.query.sprint) {
        return res.status(400).send("Please update all the required fields!");
    }

    DBClient.checkIfVotingAllowed(req.query.team, req.query.sprint)
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            console.error(error);
        });
});

routes.get("/getVelocityForSprint", (req, res) => {
    console.log(req.query);
    if (!req.query || !req.query.team || !req.query.sprint) {
        return res.status(400).send("Missing field!");
    }

    let query = {
        team: req.query.team,
        sprint: req.query.sprint,
    };

    DBClient.getVelocity(query)
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            console.error(error);
        });
});

routes.get("/getHappinessForASprint", (req, res) => {
    // console.log("getHappinessForASprint=========" + JSON.stringify(req.query));

    if (!req.query || !req.query.team || !req.query.sprint) {
        return res.status(400).send("Please update all the required fields!");
    }

    let query = {
        team: req.query.team,
        sprint: req.query.sprint,
    };
    DBClient.getHappinessForASprint(query)
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            console.error(error);
        });
});

routes.get("/getAvgHappinessForASprint", (req, res) => {
    // console.log("getAvgHappinessForASprint=========" +
    // JSON.stringify(req.query));

    if (!req.query || !req.query.team || !req.query.sprint) {
        return res.status(400).send("Please update all the required fields!");
    }
    let query = {
        team: req.query.team,
        sprint: req.query.sprint,
    };
    DBClient.getAvgHappinessForASprint(query)
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            console.error(error);
        });
});

routes.get("/getTopVotedItemsForASprint", (req, res) => {
    // console.log(
    //     "getTopVotedItemsForASprint=========" + JSON.stringify(req.query)
    // );

    if (!req.query || !req.query.team || !req.query.sprint) {
        return res.status(400).send("Please update all the required fields!");
    }
    let query = {
        team: req.query.team,
        sprint: req.query.sprint,
    };
    DBClient.getTopVotedItemsForASprint(query)
        .then((result) => {
            DBClient.getColumnSettings(req.query.team)
                .then((setting) => {
                    let retData = {
                        items: result,
                        settings: setting,
                    };
                    res.send(retData);
                })
                .catch((error) => {
                    console.error(error);
                });
        })
        .catch((error) => {
            console.error(error);
        });
});

routes.post("/moveacrosscolumn", (req, res) => {
    console.log("moveAcrossColumn == " + JSON.stringify(req.body));

    DBClient.moveAcrossColumn(req.body)
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            console.error(error);
        });
});

routes.post("/editSprintNameOfATeam", (req, res) => {
    if (!req.body || !req.body.team || !req.body.sprint || !req.body.newSprint) {
        return res.status(400).send("Please update all the required fields!");
    }

    // console.log("editSprintNameOfATeam == " + JSON.stringify(req.body));

    DBClient.editSprintNameOfATeam(req.body)
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            console.error(error);
        });
});

routes.post("/editNameOfATeam", (req, res) => {
    if (!req.body || !req.body.team || !req.body.newTeam) {
        return res.status(400).send("Please update all the required fields!");
    }

    DBClient.editNameOfATeam(req.body)
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            console.error(error);
        });
});

routes.post("/move", (req, res) => {
    console.log("move == " + JSON.stringify(req.body));

    DBClient.moveAnItem(req.body)
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            console.error(error);
        });
});

routes.get("/getActionItemsForASprint", (req, res) => {
    if (!req.query || !req.query.team || !req.query.sprint) {
        return res.status(400).send("Please update all the required fields!");
    }

    let query = {
        team: req.query.team,
        sprint: req.query.sprint,
    };
    DBClient.getActionItemsForASprint(query)
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            console.error(error);
        });
});

routes.get("/getPIListForATeam", (req, res) => {
    if (!req.query || !req.query.team) {
        return res.status(400).send("Please update all the required fields!");
    }

    let query = {
        team: req.query.team,
    };
    DBClient.getPIListForATeam(query)
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            console.log(error);
        });
});

routes.get("/getSprintsForAPI", (req, res) => {
    if (!req.query || !req.query.team) {
        return res.status(400).send("Please update all the required fields!");
    }

    let query = {
        team: req.query.team,
        pi: req.query.pi,
    };
    DBClient.getSprintsForAPI(query)
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            console.log(error);
        });
});

module.exports = routes;