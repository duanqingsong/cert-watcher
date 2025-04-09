# 域名证书监控
用于获取监控域名证书的有效期

## 功能特点

- 监控多个域名的 HTTPS 证书有效期
- 自动检查证书状态并更新信息
- 支持添加、编辑和删除域名
- 定时任务自动检查所有域名证书

# 管理系统 启动方式

## 开发模式
```bash
npm run dev
# or
yarn dev

```
## 生产模式
```bash
npm run build
npm run start

#or 
yarn build
yarn start
```

# cron server启动方式

```js
node cron-server.js --env=production
```

+ ## 环境变量配置
+ 
+ 创建 `.env.local` 文件并配置以下环境变量：
+ 
+ ```plaintext
+ # MongoDB 配置
+ MONGODB_URI=mongodb://localhost:27017/your_database
+ 
+ # JWT 配置
+ JWT_SECRET=your_jwt_secret_key
+ 
+ # 邮件服务配置
+ SMTP_HOST=smtp.example.com
+ SMTP_PORT=587
+ SMTP_USER=your_email@example.com
+ SMTP_PASSWORD=your_email_password
+ SMTP_FROM=your_email@example.com
+ 
+ # 应用配置
+ NEXT_PUBLIC_APP_URL=http://localhost:3000
+ ```
+ 
+ ### 环境变量说明
+ 
+ - `MONGODB_URI`: MongoDB 数据库连接地址
+ - `JWT_SECRET`: JWT 令牌加密密钥
+ - `SMTP_*`: 邮件服务器配置
+ - `NEXT_PUBLIC_APP_URL`: 应用访问地址


api.zuimei.utour.xin|醉美-APP
proxy.utour.xin|导游助手-代理
wx.gdtour.hk|广东-小程序
img.gdtour.hk|广东-图片
api.gdtour.hk|广东-APP
8d.api.utour.xin|八达小程序
img.bada.hk|八达-图片
bada.hk|八达-网站
gdtour.hk|广东旅游网站
res.gdtour.hk|广东旅游-PDF
bracexpo.com|一带一路
travelx.pro|travelx网站