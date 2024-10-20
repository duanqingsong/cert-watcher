/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
}

// 添加 cron 作业
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const cron = require('node-cron');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');

    // 设置 cron 作业
    cron.schedule('0 * * * *', async () => {
      try {
        const response = await fetch('http://localhost:3000/api/cron');
        const result = await response.json();
        console.log('定时检查结果:', result);
      } catch (error) {
        console.error('定时检查失败:', error);
      }
    });
  });
});

module.exports = nextConfig;
