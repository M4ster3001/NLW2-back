"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var connection_1 = require("../database/connection");
var convertHourToMinutes_1 = require("../utils/convertHourToMinutes");
var ClassesCtr = /** @class */ (function () {
    function ClassesCtr() {
    }
    ClassesCtr.prototype.index = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var filters, timeinMinutes, classes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filters = req.query;
                        if (!filters.subject || !filters.week_day || !filters.time) {
                            return [2 /*return*/, res.status(400).json({ error: 'Missing filter classes' })];
                        }
                        timeinMinutes = convertHourToMinutes_1["default"](filters.time);
                        return [4 /*yield*/, connection_1["default"]('classes')
                                .whereExists(function () {
                                this.select('class_schedule.*')
                                    .from('class_schedule')
                                    .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
                                    .whereRaw('`class_schedule`.`week_day` = ??`', [Number(filters.week_day)])
                                    .whereRaw('`class_schedule`.`from` <= ??`', [timeinMinutes])
                                    .whereRaw('`class_schedule`.`to` > ??`', [timeinMinutes]);
                            })
                                .where('classes.subject', '=', filters.subject)
                                .join('users', 'classes_id', '=', 'users.id')
                                .select(['classes.*', 'users.*'])];
                    case 1:
                        classes = _a.sent();
                        return [2 /*return*/, res.json(classes)];
                }
            });
        });
    };
    ClassesCtr.prototype.create = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, name, avatar, whatsapp, bio, subject, cost, schedule, trx, insertedUsersIds, user_id, insertedClassesIds, class_id_1, classSchedule, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, name = _a.name, avatar = _a.avatar, whatsapp = _a.whatsapp, bio = _a.bio, subject = _a.subject, cost = _a.cost, schedule = _a.schedule;
                        return [4 /*yield*/, connection_1["default"].transaction()];
                    case 1:
                        trx = _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 7, , 9]);
                        return [4 /*yield*/, trx('users').insert({
                                name: name, avatar: avatar, whatsapp: whatsapp, bio: bio
                            })];
                    case 3:
                        insertedUsersIds = _b.sent();
                        user_id = insertedUsersIds[0];
                        return [4 /*yield*/, trx('classes').insert({
                                subject: subject, cost: cost, user_id: user_id
                            })];
                    case 4:
                        insertedClassesIds = _b.sent();
                        class_id_1 = insertedClassesIds[0];
                        classSchedule = schedule.map(function (scheduleItem) {
                            return {
                                week_day: scheduleItem.week_day,
                                from: convertHourToMinutes_1["default"](scheduleItem.from),
                                to: convertHourToMinutes_1["default"](scheduleItem.to),
                                class_id: class_id_1
                            };
                        });
                        return [4 /*yield*/, trx('class_schedule').insert(classSchedule)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, trx.commit()];
                    case 6:
                        _b.sent();
                        return [2 /*return*/, res.status(201).send()];
                    case 7:
                        err_1 = _b.sent();
                        return [4 /*yield*/, trx.rollback()];
                    case 8:
                        _b.sent();
                        return [2 /*return*/, res.status(400).json({ error: 'Unexpected error while creating new class' })];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    return ClassesCtr;
}());
exports["default"] = ClassesCtr;
