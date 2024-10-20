const path = require('path');
const path_NODEJS = process.env.Path.split(';').filter( f => f.includes('nodejs') )[0];
const path_NPM = path.join( path_NODEJS, 'node_modules', 'npm', 'bin', 'npm-cli.js');

module.exports = {
  apps : [{
    name: "cert-watcher-3009",
    script: path_NPM,
    args: 'start',
    autorestart: false,
    env_production: {
      NODE_ENV: 'production',
    },
  }],

};

// 使用方法
//  pm2 reload ecosystem.config.js --env production