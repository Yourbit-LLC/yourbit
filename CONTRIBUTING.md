# Contributing to Yourbit

Thank you for considering contributing to Yourbit! We appreciate your help in improving the project. Please follow these guidelines to ensure a smooth contribution process.

---

## 🛠 Project Setup

### Prerequisites
Before contributing, ensure you have the following installed:

- Python 3.10.5+

The database is built for PostgreSQL, instructions for setting up your own PostgreSQL server can be found here:
[Installing PostgreSQL](https://www.postgresql.org/docs/current/tutorial-install.html) 


### Setting Up the Development Environment
```sh
# Example for Django
git clone https://github.com/Yourbit-LLC/yourbit.git
cd yourbit
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
