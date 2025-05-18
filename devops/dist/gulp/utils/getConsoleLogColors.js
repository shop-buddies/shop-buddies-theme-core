export var getConsoleLogColors = function (status) {
    var colors = {
        "error": "\x1b[31m%s\x1b[0m",
        "warn": "\x1b[33m%s\x1b[0m",
        "info": "\x1b[34m%s\x1b[0m",
        "success": "\x1b[32m%s\x1b[0m",
    };
    if (colors[status]) {
        return colors[status];
    }
    console.warn("Invalid status: ".concat(status));
    return "";
};
