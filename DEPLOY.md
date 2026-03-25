# 项目部署教程

## 一、环境要求

- **Node.js**: v14.0.0 或更高版本
- **MySQL**: 5.7 或更高版本
- **操作系统**: Linux (推荐 CentOS 7+/Ubuntu 18.04+) 或 Windows Server
- **内存**: 建议 1GB 以上

## 二、安装 Node.js

### Linux (CentOS/RHEL)

```bash
# 安装 Node.js 18.x
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# 验证安装
node -v
npm -v
```

### Linux (Ubuntu/Debian)

```bash
# 安装 Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node -v
npm -v
```

## 三、安装 MySQL

### CentOS/RHEL

```bash
sudo yum install -y mysql-server
sudo systemctl start mysqld
sudo systemctl enable mysqld
sudo mysql_secure_installation
```

### Ubuntu/Debian

```bash
sudo apt install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
sudo mysql_secure_installation
```

## 四、创建数据库

```bash
# 登录 MySQL
mysql -u root -p

# 创建数据库和用户
CREATE DATABASE jnd28 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'jnd28'@'localhost' IDENTIFIED BY '你的密码';
GRANT ALL PRIVILEGES ON jnd28.* TO 'jnd28'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 五、导入数据库表结构

创建必要的数据库表（根据项目需要创建）：

```sql
-- 用户信息表
CREATE TABLE IF NOT EXISTS userinfo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    telegramid BIGINT UNIQUE,
    username VARCHAR(255),
    balance DECIMAL(20,2) DEFAULT 0,
    liushui DECIMAL(20,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 开奖结果表
CREATE TABLE IF NOT EXISTS result (
    id INT PRIMARY KEY,
    num1 INT,
    num2 INT,
    num3 INT,
    total INT,
    result_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 投注记录表
CREATE TABLE IF NOT EXISTS bet (
    id INT AUTO_INCREMENT PRIMARY KEY,
    telegramid BIGINT,
    resultid INT,
    bet_type VARCHAR(50),
    amount DECIMAL(20,2),
    result VARCHAR(20),
    win_amount DECIMAL(20,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 封盘记录表
CREATE TABLE IF NOT EXISTS fengpan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resultid INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 六、配置项目

### 1. 上传项目文件

将项目文件上传到服务器目录，例如 `/www/wwwroot/jnd28/`

### 2. 安装依赖

```bash
cd /www/wwwroot/jnd28
npm install
```

### 3. 配置文件

复制配置模板并修改：

```bash
cp conf.example.js config/conf.js
```

编辑 `config/conf.js` 文件，修改以下配置：

```javascript
module.exports = {
    pool: mysql.createPool({
        port: 3306,
        user: 'jnd28',              // MySQL 用户名
        password: '你的密码',        // MySQL 密码
        database: 'jnd28',          // 数据库名
        multipleStatements: true
    }),
    token: 'YOUR_TELEGRAM_BOT_TOKEN',  // Telegram Bot Token
    chatid: -100XXXXXXXXXX,            // 开奖群 ID
    sxfqunid: -100XXXXXXXXXX,          // 上下分群 ID
    houtaiqunid: -100XXXXXXXXXX,       // 后台群 ID
    // ... 其他配置
    czaddress: "YOUR_TRON_WALLET_ADDRESS",  // TRON 钱包地址
    trxPrivateKey: "YOUR_TRON_PRIVATE_KEY", // TRON 私钥
    port: 5898,                          // 服务端口
    adminid: [YOUR_ADMIN_ID],            // 管理员 Telegram ID
    botusername: "YOUR_BOT_USERNAME",    // Bot 用户名
};
```

### 4. 获取 Telegram Bot Token

1. 在 Telegram 中搜索 `@BotFather`
2. 发送 `/newbot` 创建新机器人
3. 按提示设置机器人名称
4. 获取 Bot Token

### 5. 获取群组 ID

1. 将 Bot 添加到群组
2. 发送消息
3. 访问 `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`
4. 查看返回的 JSON 中的 `chat.id`

## 七、启动服务

### 开发模式

```bash
node app.js
```

### 生产模式（使用 PM2）

```bash
# 安装 PM2
npm install -g pm2

# 启动服务
pm2 start app.js --name jnd28

# 设置开机自启
pm2 startup
pm2 save

# 查看状态
pm2 status

# 查看日志
pm2 logs jnd28
```

## 八、配置 Nginx 反向代理（可选）

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:5898;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /admin {
        alias /www/wwwroot/jnd28/admin;
        index index.html;
    }
}
```

## 九、防火墙配置

```bash
# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=5898/tcp
sudo firewall-cmd --reload

# Ubuntu/Debian
sudo ufw allow 5898/tcp
sudo ufw reload
```

## 十、常见问题

### 1. 数据库连接失败

检查 MySQL 服务是否运行，用户名密码是否正确：

```bash
systemctl status mysql
mysql -u jnd28 -p
```

### 2. Bot 无响应

- 检查 Bot Token 是否正确
- 检查 Bot 是否在群组中
- 查看日志排查错误

### 3. 端口被占用

```bash
# 查看端口占用
netstat -tlnp | grep 5898

# 修改配置文件中的端口
```

## 十一、项目结构

```
jnd28/
├── admin/              # 管理后台前端
│   ├── css/           # 样式文件
│   ├── js/            # JavaScript 文件
│   ├── fonts/         # 字体文件
│   └── index.html     # 后台首页
├── api/               # API 接口
│   ├── login.js       # 登录接口
│   ├── chart.js       # 图表数据接口
│   ├── table.js       # 表格数据接口
│   └── result.js      # 结果接口
├── config/            # 配置文件
│   ├── conf.js        # 主配置（需自行创建）
│   └── common.js      # 公共函数
├── app.js             # 主程序入口
├── package.json       # 项目依赖
├── conf.example.js    # 配置模板
└── .gitignore         # Git 忽略文件
```

## 十二、安全建议

1. **修改默认端口**：不要使用默认端口 5898
2. **使用强密码**：数据库密码应足够复杂
3. **限制访问**：配置防火墙，只允许必要的 IP 访问
4. **定期备份**：定期备份数据库
5. **HTTPS**：生产环境建议配置 SSL 证书
6. **保护私钥**：TRON 私钥不要泄露

## 十三、更新维护

```bash
# 拉取最新代码
git pull

# 重新安装依赖
npm install

# 重启服务
pm2 restart jnd28
```

