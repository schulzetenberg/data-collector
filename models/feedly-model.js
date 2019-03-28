module.exports = require('mongoose').model('feedly', {
    timestamp: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24 * 30
    }, // Delete documents after 30 days
    feeds: [{}]
});
