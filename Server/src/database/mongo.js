const MongoClient = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;
const dbName = "RetroBoard";
const collectionName = "Teams";
// this is a single collection which contains all the details
const collectionHappiness = "Happiness";
const collectionVelocity = "Velocity";
const votesAllowedPerMember = 3;

class DBConnection {
  static async connectToMongo() {
    if (this.db) return this.db;
    this.connection = await MongoClient.connect(
      this.url,
      { useUnifiedTopology: true },
      this.options
    );
    this.db = this.connection.db(dbName);
    this.db.createCollection(collectionName, function (err, result) {
      if (err) throw err;
      console.log("Collection :" + collectionName + " is created!!!");
    });
    this.db.createCollection(collectionHappiness, function (err, result) {
      if (err) throw err;
      console.log("Collection :" + collectionHappiness + " is created!!!");
    });
    this.db.createCollection(collectionVelocity, function (err, result) {
      if (err) throw err;
      console.log("Collection :" + collectionVelocity + " is created!!!");
    });
    console.log("database connection complete!!!");
    return this.db;
  }
  static async closeDB() {
    this.connection.close();
    console.log("DB closed");
  }
}

DBConnection.db = null;
DBConnection.connection = null;
DBConnection.url = "mongodb://127.0.0.1:27017/";
DBConnection.options = {
  bufferMaxEntries: 0,
  reconnectTries: 5000,
  useNewUrlParser: true,
};

class DBClient {
  static async addItemToCollection(item) {
    // console.log("addItemToCollection :" + item);
    return await DBConnection.db.collection(collectionName).insertOne(item);
  }

  static async viewCompleteBoard(teamName, sprintName) {
    console.log("view board start :name = " + teamName + "::" + sprintName);
    let query = {
      team: teamName,
      sprint: sprintName,
    };
    return DBConnection.db.collection(collectionName).find(query).toArray();
  }

  static async viewByUserName(userName) {
    let myQuery = { name: userName };
    return await DBConnection.db
      .collection(collectionName)
      .find(myQuery)
      .toArray();
  }

  static async addToDataBase(userInfo) {
    return await DBConnection.db
      .collection(collectionName)
      .insertOne(userInfo)
      .toArray();
  }

  static async findTeam(teamName) {
    let myQuery = { team: teamName };
    return await DBConnection.db
      .collection(collectionName)
      .find(myQuery)
      .toArray();
  }

  static async getColumnSettings(team) {
    let dbQuery = { teamName: team, setting: "columns" };
    return await DBConnection.db.collection(collectionName).findOne(dbQuery);
  }

  static async findSprint(teamName, sprintName) {
    let myQuery = {
      teamName: teamName,
      sprintName: sprintName,
    };
    return await DBConnection.db
      .collection(collectionName)
      .find(myQuery)
      .toArray();
  }

  /**
   *
   * @param {name of the team where setting are applied} teamName
   * @param {original column value "Good", "Bad", or "Ugly"} col
   * @param {new column value} value
   */
  static async renameColumn(teamName, col, value) {
    let settingsQuery = {
      teamName: teamName,
      setting: "columns",
    };
    return await DBConnection.db
      .collection(collectionName)
      .findOne(settingsQuery, function (err, result) {
        if (err) throw err;
        else if (result) {
          // if setting exists: update
          console.log(result);
          let update = {};
          update[col] = value;
          DBConnection.db
            .collection(collectionName)
            .updateOne(
              { _id: new ObjectID(result._id) },
              { $set: update },
              { upsert: false }
            );
        } // if setting does not exist: create one
        else {
          let defaultColumns = {
            teamName: teamName,
            setting: "columns",
            Good: "Good",
            Bad: "Bad",
            Ugly: "Ugly",
          };
          defaultColumns[col] = value;
          DBConnection.db
            .collection(collectionName)
            .insertOne(defaultColumns, function (err, result) {
              if (err) throw err;
            });
        }
      });
  }

  static async getTeams() {
    let teams = await DBConnection.db
      .collection(collectionName)
      .distinct("team");
    return teams.sort();
  }

  static async getSprintsForATeam(teamName) {
    let myQuery = {
      team: teamName,
    };
    let sprints = await DBConnection.db
      .collection(collectionName)
      .distinct("sprint", myQuery);

    return sprints.sort();
  }

  static async viewByUserName(userName) {
    let myQuery = { name: userName };
    return await Connection.db
      .collection(collectionName)
      .find(myQuery)
      .toArray();
  }

  static async getListOfCollections() {
    return await DBConnection.db.listCollections().toArray();
  }

  static async createNewSprint(sprintName) {
    return await createCollection(sprintName);
  }

  static async addVote(id) {
    // console.log("addVote id = " + id);
    return await DBConnection.db
      .collection(collectionName)
      .updateOne({ _id: id }, { $inc: { votes: 1 } });
  }

  static async removeVote(id) {
    // console.log("removeVote id = " + id);
    let info = await DBConnection.db
      .collection(collectionName).findOne({ _id: id });

    console.log("vote count = " + info.votes);
    if (info.votes > 0) {
      return await DBConnection.db
        .collection(collectionName)
        .updateOne({ _id: id }, { $inc: { votes: -1 } });
    }

    return JSON.stringify(-1);
  }

  static async addActionPointToItem(actionData) {
    await DBConnection.db
      .collection(collectionName)
      .updateOne(
        { _id: actionData._id },
        { $push: { actionPoints: actionData.actionPoint } },
        { upsert: true }
      );
    return await DBConnection.db
      .collection(collectionHappiness)
      .find({ _id: actionData._id })
      .toArray();
  }

  static async removeHappiness(id) {
    let myQuery = {
      _id: id,
    };
    return await DBConnection.db
      .collection(collectionHappiness)
      .deleteOne(myQuery);
  }

  static async updateHappiness(query) {
    let myQuery = {
      _id: query._id,
      team: query.team,
      name: query.name,
      sprint: query.sprint,
    };
    return await DBConnection.db
      .collection(collectionHappiness)
      .updateOne(
        myQuery,
        { $set: { happiness: query.happiness } },
        { upsert: true }
      );
  }

  static async setVelocity(reqBody) {
    let velocity = {
      team: reqBody.team,
      sprint: reqBody.sprint,
    };
    return await DBConnection.db.collection(collectionVelocity).updateOne(
      velocity,
      {
        $set: {
          spPlanned: reqBody.spPlanned,
          spBurnt: reqBody.spBurnt,
          pi: reqBody.pi,
          bbAccuracy: reqBody.bbAccuracy,
        },
      },
      { upsert: true }
    );
  }

  static async setSortingCriteria(teamName, sprintName, sortingCriteria) {
    let myQuery = {
      team: teamName,
      sprint: sprintName,
    };
    return await DBConnection.db
      .collection(collectionName)
      .updateOne(
        myQuery,
        { $set: { sorting: sortingCriteria } },
        { upsert: true }
      );
  }

  static async getSortingCriteria(teamName, sprintName) {

    let myQuery = {
      team: teamName,
      sprint: sprintName,
    };

    let data = await DBConnection.db
      .collection(collectionName)
      .distinct("sorting", myQuery);

    return data;
  }

  static async checkIfVotingAllowed(teamName, sprintName) {

    let myQuery = {
      team: teamName,
      sprint: sprintName,
    };

    let data = await DBConnection.db
      .collection(collectionHappiness)
      .distinct("name", myQuery);

    let totalVotesAllowed = (data.length) * votesAllowedPerMember;
    let total = 0;

    let sprintData = await DBConnection.db.collection(collectionName).find(myQuery).toArray();

    sprintData.forEach(info => {
      if (typeof info.votes !== 'undefined') {
        total += info.votes;
      }
    })

    return [true, data.length, total];
  }

  static async getVelocity(query) {
    return await DBConnection.db
      .collection(collectionVelocity)
      .find(query)
      .toArray();
  }

  static async getPIListForATeam(query) {
    return await DBConnection.db
      .collection(collectionVelocity)
      .distinct("pi", query);
  }
  static async getSprintsForAPI(query) {
    let sprints = await DBConnection.db
      .collection(collectionVelocity)
      .distinct("sprint", query);

    return sprints.sort();
  }
  static async getHappinessForASprint(query) {
    return await DBConnection.db
      .collection(collectionHappiness)
      .find(query)
      .toArray();
  }

  static async getAvgHappinessForASprint(query) {
    let data = await DBConnection.db
      .collection(collectionHappiness)
      .find(query)
      .toArray();
    let length = data.length;
    let sum = 0;
    for (let index = 0; index < length; index++) {
      sum += Number(data[index].happiness);
    }

    // console.log("sum = " + sum, "length = " + length);
    const average = (sum / length).toFixed(2);
    let myRet = {
      average: average,
    };

    return myRet;
  }

  static async getTopVotedItemsForASprint(query) {
    const data = await DBConnection.db
      .collection(collectionName)
      .find(query)
      .sort({ votes: -1 })
      .limit(3)
      .toArray();

    // console.log(JSON.stringify(data));

    return data;
  }

  static async deletePost(id) {
    // console.log("deletePost id = " + id);
    return await DBConnection.db.collection(collectionName).deleteOne({
      _id: id,
    });
  }

  static async moveAcrossColumn(updateData) {
    return await DBConnection.db
      .collection(collectionName)
      .updateOne({ _id: updateData._id }, { $set: { type: updateData.type } });
  }

  static async editSprintNameOfATeam(updateData) {
    let teamInfo = {
      team: updateData.team,
      sprint: updateData.sprint,
    };
    return await DBConnection.db
      .collection(collectionVelocity)
      .updateMany(
        teamInfo,
        {
          $set: {
            sprint: updateData.newSprint,
          },
        },
        { upsert: true }
      )
      .then(async () => {
        return await DBConnection.db.collection(collectionHappiness).updateMany(
          teamInfo,
          {
            $set: {
              sprint: updateData.newSprint,
            },
          },
          { upsert: true }
        );
      })
      .then(async () => {
        return await DBConnection.db.collection(collectionName).updateMany(
          teamInfo,
          {
            $set: {
              sprint: updateData.newSprint,
            },
          },
          { upsert: true }
        );
      });
  }

  static async editNameOfATeam(updateData) {
    let teamInfo = {
      team: updateData.team,
    };
    return await DBConnection.db
      .collection(collectionVelocity)
      .updateMany(
        teamInfo,
        {
          $set: {
            team: updateData.newTeam,
          },
        },
        { upsert: true }
      )
      .then(async () => {
        return await DBConnection.db.collection(collectionHappiness).updateMany(
          teamInfo,
          {
            $set: {
              team: updateData.newTeam,
            },
          },
          { upsert: true }
        );
      })
      .then(async () => {
        return await DBConnection.db.collection(collectionName).updateMany(
          teamInfo,
          {
            $set: {
              team: updateData.newTeam,
            },
          },
          { upsert: true }
        );
      });
  }

  static async moveAnItem(updateData) {
    return await DBConnection.db
      .collection(collectionName)
      .updateOne(
        { _id: updateData._id },
        { $set: { type: updateData.type, index: updateData.index } }
      );
  }
  static async getActionItemsForASprint(reqData) {
    return await DBConnection.db
      .collection(collectionName)
      .distinct("actionPoints", reqData);
  }
}

module.exports = {
  DBConnection,
  DBClient,
};
