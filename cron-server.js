const cron = require('node-cron');
const dotenv = require('dotenv');
const path = require('path');
const { performCertificateCheck,notifyCertificateExpiry } = require('./lib/certCheck');

// 从命令行参数获取 .env 文件路径
const envFileArg = process.argv.find(arg => arg.startsWith('--env=')) || '--env=';
const envFilePath = envFileArg.split('=')[1];
const fileName=envFilePath?`.env.${envFilePath}`:'.env';
const fullPath = path.resolve(process.cwd(),fileName);
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