// const { getDatabase, createCollection } = require("./mongo");

// async function viewCompleteBoard(collectionName) {
//     const database = await getDatabase();
//     console.log(database.collection.find().toArray());
//     return await database.collection(collectionName);
// }

// async function viewByUserName(collectionName, userName) {
//     let myQuery = { name: userName };
//     const database = getDatabase();
//     const userBoard = await database.collection(collectionName).find(myQuery);

//     return userBoard;
// }

// async function addToDataBase(collectionName, userInfo) {
//     const database = getDatabase();
//     return await database.collection(collectionName).insertOne(userInfo);
// }

// async function getListOfCollections() {
//     const database = getDatabase();
//     return await database.listCollections().toArray();
// }

// async function createNewSprint(sprintName) {
//     return await createCollection(sprintName);
// }

// module.exports = {
//     viewCompleteBoard,
//     viewByUserName,
//     addToDataBase,
//     getListOfCollections,
//     createNewSprint
// };