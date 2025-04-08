
module.exports = {
  apps : [{
    name: "cert-watcher-3009",
    script: 'npm start',
    // args: 'start',
    env_production: {
      NODE_ENV: 'production',
    },
  }],

  deploy : {
    production : {
      key:'~/.ssh/id_rsa',
      user : 'root',
      host : 'gd',
      ref  : 'origin/master',
      repo : 'git@github.com:duanqingsong/cert-watcher.git',
      path : '/root/cert-watcher',
      'pre-deploy-local': '',
      'post-deploy' : `source ~/.nvm/nvm.sh && yarn && yarn build && pm2 reload ecosystem.config.js --env production`,
      'pre-setup': ''
    }
  }
};

// 使用方法
// pm2 deploy production setup   安装:只需要执行一次
// pm2 deploy production  部署