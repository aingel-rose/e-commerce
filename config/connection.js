const { MongoClient } = require("mongodb");
const state = {
  db: null,
};

module.exports.connect = function (done) {
  const url = "mongodb://localhost:27017";
  const dbName = "shopping";

  MongoClient.connect(url)
    .then((client) => {
      state.db = client.db(dbName);
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });
};
module.exports.get = () => state.db;
