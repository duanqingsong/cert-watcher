require('dotenv').config({ path: '.env.production' });

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const cron = require('node-cron');
const { performCertificateCheck } = require('./lib/certCheck');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3009;
 
//默认每6个小时检查一次
const cronSchedule = process.env.CRON_SCHEDULE || '0 */6 * * *';

console.log('当前环境:', process.env.NODE_ENV);
console.log('开始初始化服务器...,端口:',port);

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, () => {
    console.log('服务器初始化完成');
    console.log(`Ready on http://localhost:${port}`);

    // 设置 cron 作业
    cron.schedule(cronSchedule, () => {
      console.log('开始执行定时证书检查任务:', new Date().toISOString());
      performCertificateCheck().then(() => {
        console.log('定时证书检查任务完成:', new Date().toISOString());
      }).catch(error => {
        console.error('定时证书检查任务失败:', error);
      });
    });
    console.log(`证书检查cron任务已设置，调度: ${cronSchedule}`);
  });
});
