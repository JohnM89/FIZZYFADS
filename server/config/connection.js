const mongoose = require('mongoose');
// comment out to run locally
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fitzysfades');

module.exports = mongoose.connection;
