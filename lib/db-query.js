const { Client } = require("pg");
//logs the query for nodemon
const logQuery = (statement, parameters) => {
  let timeStamp = new Date();
}

module.exports = {
  async dbQuery(statement, ...parameters) {
    let client = new Client({ database: "expense_tracker" });

    await client.connect();
    logQuery(statement, parameters);
    let result = await client.query(statement, parameters);
    await client.end();

    return result;
  }
}