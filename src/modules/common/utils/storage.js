
var _ = require('./base');

module.exports = _.extend({
    getItem: function(name) {
        var str = localStorage.getItem(name) || 'null';
        try {
            return JSON.parse(str) || null;
        } catch (ex) {
            _.removeItem(name); // remove bad data
            return null;
        }
    },
    setItem: function(name, value) {
        try {
            localStorage.setItem(name, JSON.stringify(value));
        } catch (ex) {}
    },
    removeItem: function(name) {
        try {
            localStorage.removeItem(name);
        } catch (ex) {}
    }
});

