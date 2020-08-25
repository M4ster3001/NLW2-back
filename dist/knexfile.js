"use strict";
exports.__esModule = true;
var path_1 = require("path");
module.exports = {
    client: 'sqlite3',
    connection: {
        filename: path_1["default"].resolve(__dirname, 'src', 'database', 'database.sqlite')
    },
    migrations: {
        directory: path_1["default"].resolve(__dirname, 'src', 'database', 'migrations')
    },
    useNullAsDefault: true
};
