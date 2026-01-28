# Deploying AI Library to Hostinger VPS

## Prerequisites
- Hostinger VPS (Ubuntu 22.04 recommended)
- Domain name (optional but recommended)

---

## Step 1: Purchase & Access VPS

1. Go to [Hostinger VPS](https://www.hostinger.com/vps-hosting)
2. Choose a plan (KVM 1 or higher recommended - $5-10/mo)
3. Select **Ubuntu 22.04** as OS
4. After purchase, go to **hPanel > VPS > Manage**
5. Note your **IP address** and **root password**

---

## Step 2: Connect to Your VPS

### On Windows (PowerShell):
```powershell
ssh root@YOUR_VPS_IP
```

### Or use PuTTY:
- Host: YOUR_VPS_IP
- Port: 22
- User: root

---

## Step 3: Initial Server Setup

Run these commands on your VPS:

```bash
# Update system
apt update && apt upgrade -y

# Install essential tools
apt install -y curl git nginx certbot python3-certbot-nginx ufw

# Setup firewall
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install Bun (faster than npm)
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc

# Install PM2 (keeps app running)
npm install -g pm2

# Install MySQL
apt install -y mysql-server
mysql_secure_installation
```

---

## Step 4: Setup MySQL Database

```bash
# Login to MySQL
mysql -u root -p

# Create database and user
CREATE DATABASE ai_library;
CREATE USER 'ailibrary'@'localhost' IDENTIFIED BY 'YourStrongPassword123!';
GRANT ALL PRIVILEGES ON ai_library.* TO 'ailibrary'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## Step 5: Upload Your Code

### Option A: Git (Recommended)
```bash
# On your VPS
cd /var/www
git clone https://github.com/YOUR_USERNAME/ai-tools-directory.git
cd ai-tools-directory
```

### Option B: SFTP Upload
Use FileZilla or WinSCP:
- Host: YOUR_VPS_IP
- User: root
- Password: your root password
- Upload to: `/var/www/ai-tools-directory`

---

## Step 6: Configure Environment

```bash
cd /var/www/ai-tools-directory

# Create .env file
nano .env
```

Paste this (edit values):
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=mysql://ailibrary:YourStrongPassword123!@localhost:3306/ai_library
JWT_SECRET=generate-a-random-64-char-string-here
```

Save: `Ctrl+X`, then `Y`, then `Enter`

---

## Step 7: Build & Start App

```bash
cd /var/www/ai-tools-directory

# Install dependencies
bun install

# Run database migrations
bun run db:push

# Build for production
bun run build

# Start with PM2
pm2 start "bun run start" --name ai-library

# Save PM2 config (auto-restart on reboot)
pm2 save
pm2 startup
```

---

## Step 8: Setup Nginx Reverse Proxy

```bash
# Create Nginx config
nano /etc/nginx/sites-available/ai-library
```

Paste this (replace YOUR_DOMAIN.com):
```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN.com www.YOUR_DOMAIN.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
ln -s /etc/nginx/sites-available/ai-library /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

---

## Step 9: Point Domain to VPS

In your domain registrar (or Hostinger DNS):
1. Add **A Record**: `@` -> YOUR_VPS_IP
2. Add **A Record**: `www` -> YOUR_VPS_IP

Wait 5-30 minutes for DNS propagation.

---

## Step 10: Setup SSL (HTTPS)

```bash
certbot --nginx -d YOUR_DOMAIN.com -d www.YOUR_DOMAIN.com
```

Follow prompts. Certbot auto-renews certificates.

---

## Done!

Your site is now live at: **https://YOUR_DOMAIN.com**

---

## Useful Commands

```bash
# View app logs
pm2 logs ai-library

# Restart app
pm2 restart ai-library

# Stop app
pm2 stop ai-library

# Check app status
pm2 status

# Update app (after git pull)
cd /var/www/ai-tools-directory
git pull
bun install
bun run build
pm2 restart ai-library
```

---

## Troubleshooting

### App won't start
```bash
# Check logs
pm2 logs ai-library --lines 50

# Check if port is in use
lsof -i :3000
```

### Database connection error
```bash
# Test MySQL connection
mysql -u ailibrary -p ai_library

# Check DATABASE_URL format
cat /var/www/ai-tools-directory/.env
```

### Nginx errors
```bash
# Test config
nginx -t

# Check error log
tail -50 /var/log/nginx/error.log
```

### SSL certificate issues
```bash
# Renew manually
certbot renew --dry-run
```
