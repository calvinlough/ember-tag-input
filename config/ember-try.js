/*jshint node:true*/
module.exports = {
  scenarios: [
    {
      name: 'ember-2.11',
      npm: {
        devDependencies: {
          'ember-source': '2.11'
        }
      }
    },
    {
      name: 'ember-release',
      npm: {
        devDependencies: {
          'ember-source': 'release'
        }
      }
    },
    {
      name: 'ember-beta',
      npm: {
        devDependencies: {
          'ember-source': 'beta'
        }
      }
    },
    {
      name: 'ember-canary',
      npm: {
        devDependencies: {
          'ember-source': 'canary'
        }
      }
    }
  ]
};
