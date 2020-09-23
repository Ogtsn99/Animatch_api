const Sequelize = require('sequelize');
let express = require('express')
const app = express()
require('dotenv').config()
let database;

let DB_url = process.env.DATABASE_URL;
if(app.get("env") === "test") DB_url = process.env.DATABASE_URL_FOR_TESTING

database = new Sequelize(DB_url, {operatorsAliases: false})

module.exports = {
  database: database,
  Sequelize: Sequelize
};