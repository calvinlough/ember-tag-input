/*jshint node:true*/
module.exports = {
  scenarios: [
    {
      name: 'ember-2.0',
      bower: {
        dependencies: {
          'ember': 'components/ember#2.0.3'
        }
      }
    },
    {
      name: 'ember-release',
      bower: {
        dependencies: {
          'ember': 'components/ember#release'
        }
      }
    },
    {
      name: 'ember-beta',
      bower: {
        dependencies: {
          'ember': 'components/ember#beta'
        }
      }
    },
    {
      name: 'ember-canary',
      bower: {
        dependencies: {
          'ember': 'components/ember#canary'
        }
      }
    }
  ]
};
