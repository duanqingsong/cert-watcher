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

app.prepare()
  .then(() => {
    console.log('Next.js应用准备完成');
    return new Promise((resolve, reject) => {
      const server = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        const { pathname } = parsedUrl;

        // 只对非 /api/auth 路径的请求进行日志记录
        if (!pathname.startsWith('/api/auth')) {
          console.log('收到请求:', pathname);
        }

        handle(req, res, parsedUrl);
      });

      server.listen(port, (err) => {
        if (err) reject(err);
        console.log('服务器初始化完成');
        console.log(`Ready on http://localhost:${port}`);
        resolve(server);
      });
    });
  })
  .then(() => {
    // 设置 cron 作业
    cron.schedule(cronSchedule, async () => {
      console.log('开始执行定时证书检查任务:', new Date().toISOString());
      try {
        await performCertificateCheck();
        console.log('定时证书检查任务完成:', new Date().toISOString());
      } catch (error) {
        console.error('定时证书检查任务失败:', error);
      }
    });
    console.log(`证书检查cron任务已设置，调度: ${cronSchedule}`);
  })
  .catch((error) => {
    console.error('服务器启动失败:', error);
    process.exit(1);
  });
