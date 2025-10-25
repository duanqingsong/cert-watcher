const cron = require('node-cron');
const dotenv = require('dotenv');
const path = require('path');
const { performCertificateCheck,notifyCertificateExpiry,send2Wechat } = require('./lib/certCheck');

// 从命令行参数或环境变量获取 .env 文件路径
const envFileArg = process.argv.find(arg => arg.startsWith('--env=')) || '--env=';
const envFilePath = envFileArg.split('=')[1];

// 如果没有通过命令行参数指定，则检查 NODE_ENV 环境变量
let fileName;
if (envFilePath) {
  fileName = `.env.${envFilePath}`;
} else if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
  fileName = `.env.${process.env.NODE_ENV}`;
} else {
  fileName = '.env';
}

const fullPath = path.resolve(process.cwd(), fileName);
console.log('env path:', fileName);
// 加载 .env 文件
dotenv.config({ path: fullPath });
// 默认每6个小时检查一次
const cronSchedule = process.env.CRON_SCHEDULE || '';
console.log('cron:', cronSchedule);
if(!cronSchedule){
  console.error('未配置 CRON_SCHEDULE');
  process.exit(1);
}
// 设置 cron 作业
cron.schedule(cronSchedule, async () => {
  console.log('开始->定时证书检查任务:', new Date().toLocaleString());
  try {
    await performCertificateCheck();
    console.log('定时证书检查任务->完成:', new Date().toLocaleString());
    console.log(''); // 空行
  } catch (error) {
    console.error('定时证书检查任务失败:', error);
  }
});


const notifySchedule = process.env.NOTIFY_SCHEDULE || '';
console.log('cron:', notifySchedule);
if(!notifySchedule){
  console.error('未配置 NOTIFY_SCHEDULE');
}
if(notifySchedule){
  cron.schedule(notifySchedule, async () => {
    // 增加自检通知,防止长久没有通知,确保知道服务是正常运行的
    // 增加每周1,3,5 发送一次通知.
    // 因为此任务每天执行一次,所以这里只需要判断当天是否是1,3,5,发送一次即可
    const dayOfWeek = new Date().getDay();
    if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) {
      await send2Wechat('证书到期检查定时任务正常运行中...','13926576007');
    }
    console.log('开始->定时证书到期通知任务:', new Date().toLocaleString());
    try {
      await notifyCertificateExpiry();
      console.log('定时证书到期通知任务->完成:', new Date().toLocaleString());
      console.log(''); // 空行
    } catch (error) {
      console.error('定时证书到期通知任务失败:', error);
    }
  });
}
//运行方法 node cron-server.js    --env=
//或者 node cron-server.js    --env=production