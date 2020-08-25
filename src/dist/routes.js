"use strict";
exports.__esModule = true;
var express_1 = require("express");
var ClassesCtr_1 = require("./controllers/ClassesCtr");
var routes = express_1["default"].Router();
var classesCtr = new ClassesCtr_1["default"]();
routes.post('/classes', classesCtr.create);
exports["default"] = routes;
