/*jshint node:true*/
module.exports = {
  framework: 'qunit',
  test_page: 'tests/index.html?hidepassed',
  disable_watching: true,
  tap_quiet_logs: true,
  launch_in_ci: ['Chrome'],
  launch_in_dev: ['Chrome'],
  browser_args: {
    Chrome: [
      '--disable-dev-shm-usage',
      '--disable-software-rasterizer',
      '--disable-web-security',
      '--headless',
      '--incognito',
      '--mute-audio',
      '--no-sandbox',
      '--remote-debugging-address=0.0.0.0',
      '--remote-debugging-port=9222',
      '--window-size=1440,900'
    ]
  }
};
