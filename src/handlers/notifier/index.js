const Notifier = require('./notifier');

module.exports.handler = (event, context, callback) => {
  new Notifier(event, context, callback).notify();
};
