const { format } = require('timeago.js');
//const timeagoInstance = timeago();

const helpers = {};

helpers.timeago = (savedTimestamp) => {
    return format(savedTimestamp, 'es');
};


module.exports = helpers;