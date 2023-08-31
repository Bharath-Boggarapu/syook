const mongoose = require("mongoose");

const MongoDbConnection = async () => {
  mongoose
    .connect(
      "mongodb+srv://bbk:mAZUxyRVzObUeSZo@cluster1.kkjl4.mongodb.net/forSyook?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then((res) => {
      console.log(res.connection.name, res.connection.host, "db connected");
    })
    .catch((err) => {
      console.log(err);
    });
};
module.exports = MongoDbConnection