
module.exports = {
  apps : [
    {
      name: "cert-watcher-3009",
      script: 'npm start',
      // args: 'start',
      env_production: {
        NODE_ENV: 'production',
      },
    },
    {
      name: "cert-watcher-job",
      script: "cron-server.js",
      // 关键配置
      autorestart: true,          // 保持应用常驻
      watch: false,               // 关闭文件监听
      exec_mode: "fork",          // 使用 fork 模式
      instances: 1,               // 单实例运行
      env_production: {
        NODE_ENV: "production",  // 统一通过环境变量传递
        CRON_SCHEDULE: "* */6 * * *" // 实际 cron 表达式由代码读取
      },
      // 日志配置（可选）
      error_file: "/root/logs/cron-error.log",
      out_file: "./root/logs/cron-output.log",
    }
  ],

  deploy : {
    production : {
      key:'~/.ssh/id_rsa',
      user : 'root',
      host : 'gd',
      ref  : 'origin/master',
      repo : 'git@github.com:duanqingsong/cert-watcher.git',
      path : '/root/cert-watcher',
      'pre-deploy-local': '',
      'post-deploy' : `source ~/.nvm/nvm.sh && 
        yarn && 
        yarn build && 
        pm2 startOrReload ecosystem.config.js --env production`,
      'pre-setup': ''
    }
  }
};

// 使用方法
// pm2 deploy production setup   安装:只需要执行一次
// pm2 deploy production  部署