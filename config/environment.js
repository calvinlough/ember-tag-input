'use strict';

module.exports = function (env) {
  let ENV = {
    APP: {}
  };

  if (env === 'test') {
    ENV.APP.autoboot = false;
  }

  return ENV;
};
