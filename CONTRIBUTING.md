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
```sh
# Example for Django
git clone https://github.com/Yourbit-LLC/yourbit.git
cd yourbit
pip install -r requirements.txt
```

**Add database credentials to .env file**
```env
# Database Configuration
DB_NAME=your-database-name
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_HOST=localhost
DB_PORT=5432
```

**Add Object Storage Bucket to .env file**
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
