# Contributing to Yourbit

Thank you for considering contributing to Yourbit! We appreciate your help in improving the project. Please follow these guidelines to ensure a smooth contribution process.

---

## 🛠 Project Setup

### Prerequisites
Before contributing, ensure you have the following installed:

- Python 3.10.5+
- Before installing dependencies, setup and activate a Python virtual environment ([How to setup a python virtual environment](https://www.freecodecamp.org/news/how-to-setup-virtual-environments-in-python/))
- All packages contained in [requirements.txt](https://github.com/Yourbit-LLC/yourbit/blob/main/requirements.txt)

The database is built for PostgreSQL, instructions for setting up your own PostgreSQL server can be found here:
[Installing PostgreSQL](https://www.postgresql.org/docs/current/tutorial-install.html) 


### Setting Up the Development Environment
Before you can host Yourbit locally for development, there are a few variables that Yourbit requires to be configured for basic operation. These variables include:
- **Django Secret Key** _(Used for encryption and CSRF generation)_
- **Set Debug to True** _(Debug should be true if using locally)_
- **Video Storage/Encoding API Credentials** _(Such as [Mux](https://www.mux.com), the service used by Yourbit Official)_
- **Image CDN Credentials** _(Such as [Cloudflare Images](https://developers.cloudflare.com/images/), used by Yourbit Official)_
- **Object Storage Credentials** _(Linode Object Storage, Amazon S3, etc.)_
- **Email Service Credentials** _(Use with with smtp services like google workspace)_

**Create an environment file**

In root (top) directory of your project. Create a file with the name `.env`. 

To set up your environment. Fill in the [example file](https://github.com/Yourbit-LLC/yourbit/blob/main/.env.example) named, `.env.example`, given in the root of this repository, or [view a table](https://github.com/Yourbit-LLC/yourbit/blob/main/ENVIRONMENT.md) of all of the environment variables to configure your settings.py file. **Do not configure the settings.py file directly.**


```sh
# Example for Django
git clone https://github.com/Yourbit-LLC/yourbit.git
cd yourbit
pip install -r requirements.txt
```

**Add database credentials to `.env` file**
```env
# Database Configuration
DB_NAME=your-database-name
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_HOST=localhost
DB_PORT=5432
```

**Add Object Storage Bucket to `.env` file**
```env
# Bucket Storage Configuration
BUCKET_NAME=your-bucket-name
BUCKET_REGION=us-east
BUCKET_ACCESS_KEY=your-bucket-access-key
BUCKET_SECRET_KEY=your-bucket-secret-key
```

**Migrate the database and runserver**
```sh
python manage.py migrate
python manage.py runserver
```
