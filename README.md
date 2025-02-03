# **Yourbit**  
_**Note:** This documentation is still a work in progress and some explanations will be missing. The available information will change over time._  

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL%203.0-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Issues](https://img.shields.io/github/issues/Yourbit-LLC/yourbit)](https://github.com/Yourbit-LLC/yourbit/issues)

---

## 🚀 **About Yourbit**  
Yourbit is a **next-gen social media platform** focused on **privacy, decentralization, and user empowerment**.  
It offers **real-time media sharing, interactive feeds, and customizable profiles**. Our goal is to develop a platform
that balances privacy and modularity to create a community built platform that people can trust with their personal data.

🔹 **Privacy-first** – Private posts and direct messages are never used for data collection or monetization.  
🔹 **Decentralized architecture** – Fork your own mini-sites off of Yourbit or host their own version locally.  
🔹 **Built-in media support** – Photo, video, and livestreaming; requires a Video Encoding and Storage API for long-form videos and livestreaming.  
🔹 **Customizable feed** – Primarily see posts from those most important to you — your friends and family.  
🔹 **Open API** – Extend Yourbit with custom integrations.  

---

## 🌐 **Live Demo**  
🔗 [yourbit.me](https://yourbit.me) 

---

## 📥 **Installation**  

### **1. Clone the Repository**  
```bash
git clone https://github.com/yourbit-org/yourbit.git
cd yourbit
```

### **2. Install Dependencies**  
```bash
pip install -r requirements.txt  # Backend (Django)
npm install                      # Frontend (React/Vue)
```

### **3. Set Up Environment**  
Create a `.env` file in the root directory and configure your settings:
```
DJANGO_SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### **4. Apply Migrations & Start the Server**  
```bash
python manage.py migrate
python manage.py runserver
```

For the frontend, start the development server:
```bash
npm run dev
```

---

## 🎯 **Features**  
✅ **Customizable Feeds** – Sort by time, likes, or personalized algorithms  
✅ **End-to-End Encrypted Messaging** – Secure direct messages  
✅ **Live Media Support** – Post photos, GIFs, videos, and livestream  
✅ **Custom Communities** – Join and create public or private groups  
✅ **Developer API** – Integrate Yourbit into apps and bots  

---

## 🔧 **Tech Stack**  
- **Backend**: Python, Django, Django REST Framework  
- **Frontend**: JavaScript
- **Database**: PostgreSQL  
- **Storage**: Linode Object Storage, Cloudflare CDN  
- **Authentication**: JWT, CSRF protection  

---

## 📜 **License**  
This project is licensed under the **AGPL-3.0**. See [LICENSE](LICENSE) for details.  

---

## 🛠 **Contributing**  
We welcome contributions! To get started:  
1. **Fork** the repository  
2. **Create a branch** for your feature (`git checkout -b feature-name`)  
3. **Commit your changes** (`git commit -m "Add new feature"`)  
4. **Push to your branch** (`git push origin feature-name`)  
5. **Submit a Pull Request** 🚀  

---

## 📩 **Contact & Community**  
- **Discord**: [Join the Yourbit Community](https://discord.gg/g2JpbbCzZs)    
- **GitHub Issues**: [Report a bug](https://github.com/yourbit-org/yourbit/issues)  
