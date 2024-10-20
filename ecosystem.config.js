const path = require('path');
const path_NODEJS = process.env.Path.split(';').filter( f => f.includes('nodejs') )[0];
const path_NPM = path.join( path_NODEJS, 'node_modules', 'npm', 'bin', 'npm-cli.js');

module.exports = {
  apps : [{
    name: "cert-watcher-3009",
    script: "server.js",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    env_production: {
      NODE_ENV: "production",
      PORT: 3009
    }
  }]
};

// 使用方法
//  pm2 start ecosystem.config.js --env production
