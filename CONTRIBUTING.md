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


**Install application and dependencies**

Follow the [installation instructions](https://github.com/Yourbit-LLC/yourbit/blob/main/INSTALLATION.md) given in `INSTALLATION.md` to clone the repository and configure the development environment.

**Configure the environment**

Follow the instructions in the [environment file](https://github.com/Yourbit-LLC/yourbit/blob/main/ENVIRONMENT.md) in `ENVIRONMENT.md` to configure the settings and credentials for your environment.


**Migrate the database and runserver**
```sh
python manage.py migrate
python manage.py runserver
```
