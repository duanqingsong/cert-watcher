const path = require('path');

// 获取 npm 可执行文件的路径
const getNpmPath = () => {
  if (process.platform === 'win32') {
    // Windows 系统
    const path_NODEJS = process.env.Path.split(';').find(f => f.includes('nodejs'));
    return path.join(path_NODEJS, 'node_modules', 'npm', 'bin', 'npm-cli.js');
  } else {
    // macOS 和 Linux 系统
    return 'npm'; // 直接使用 npm 命令
  }
};

module.exports = {
  apps : [{
    name: "cert-watcher-3009",
    script: getNpmPath(),
    args: 'start',
    autorestart: false,
    env_production: {
      NODE_ENV: 'production',
    },
  }],
};

// 使用方法
//  pm2 reload ecosystem.config.js --env production
