"use strict";
exports.__esModule = true;
var knex_1 = require("knex");
var path_1 = require("path");
var db = knex_1["default"]({
    client: 'sqlite3',
    connection: {
        filename: path_1["default"].resolve(__dirname, 'database.sqlite')
    },
    useNullAsDefault: true
});
exports["default"] = db;
