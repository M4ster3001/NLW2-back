"use strict";
exports.__esModule = true;
function convertHoutToMinutes(time) {
    var _a = time.split(':').map(Number), hour = _a[0], minutes = _a[1];
    var timeInMinutes = (hour * 60) + minutes;
    return time;
}
exports["default"] = convertHoutToMinutes;
