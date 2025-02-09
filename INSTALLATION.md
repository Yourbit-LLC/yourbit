# Installation Instructions
These instructions are provided for the purpose of setting up a host server or development environment for Yourbit

**Breakdown:**
1. [Install Python](#1-install-python-3105)
2. [Clone the Repository](#2-clone-this-repository)
3. [Create Virtual Environment](#3-create-the-virtual-environment)
4. [Install the Dependencies](#4-install-the-dependencies)
5. [Set Up Environment](#5-set-up-environment)
6. [Migrate and Run](#6-migrate-the-database-and-run-the-server)
7. [Create Super User](#7-create-super-user)


## **1. Install Python 3.10.5**


Follow this [link to download Python-3.10.5](https://www.python.org/downloads/release/python-3105/)

To install on windows, download and run the windows installer provided on the page.

> **Note:** If you are attempting to install python on Linux. You must download the source code from the link above and follow [these instructions here](https://github.com/Yourbit-LLC/yourbit/blob/main/docs/installation/install-python-source.md) to compile and install.

---

## **2. Clone this Repository**




> **Note:** You must have git installed to continue with this step. Follow [this guide](https://github.com/Yourbit-LLC/yourbit/blob/main/docs/installation/install-git.md) to get started.

With git installed, run the following commands inside of your terminal of choice.

```sh
# Example for Django
git clone https://github.com/Yourbit-LLC/yourbit.git

# Navigate into the project directory
cd yourbit
```

<div align="right"><a href="https://github.com/Yourbit-LLC/yourbit/main/INSTALLATION.md#installation-instructions">Back to Top</a></div>

---

## **3. Create the virtual environment**


A virtual environment allows you to create isolated Python environments for different projects, preventing dependency conflicts.

### **Creating a Virtual Environment**

If you have been following this guide, you should be in the `/yourbit` directory. Run the following command to create the environment.

```sh
python3 -m venv venv
```

This creates a folder named `venv` containing the isolated environment. The `/venv/` directory should be listed in the `.gitignore` as it should not be committed to the repository.

### Activate the Virtual Environment
- On **Linux/macOS**:

  ```sh
  source venv/bin/activate
  ```

- On **Windows (PowerShell)**:

  ```powershell
  venv\Scripts\Activate
  ```

Once activated, your terminal prompt should show `(venv)`, indicating you are using the virtual environment.

### **Future Reference:**

<details>
<summary><strong>Installing Packages</strong></summary>

With the virtual environment activated, install packages using `pip`:

```sh
pip install package_name
```

</details>

<details>
<summary><strong>Deactivating the Virtual Environment</strong></summary>

To exit the virtual environment, simply run:

```sh
deactivate
```

</details>

<details>
<summary><strong>Removing a Virtual Environment</strong></summary>

If you no longer need the virtual environment, you can delete it:

```sh
rm -rf venv
```

or on Windows:

```powershell
Remove-Item -Recurse -Force venv
```

---
</details>


<div align="right">[Back to Top](#installation-instructions)</div>
---

## **4. Install the dependencies**


```sh
pip install -r requirements.txt
```

<div align="right">[Back to Top](#installation-instructions)</div>

---

## **5. Set Up Environment**  


### Create an environment file

In the root (top) directory of your project. Create a file with the name `.env`. 

1. Copy the contents `.env.example` to `.env` ([Link to Example File](https://github.com/Yourbit-LLC/yourbit/blob/main/.env.example))
2. Fill in the values as needed (use the keys listed below in this document).

> **Note:** Ensure that the `.env` file is added to your `.gitignore` to avoid accidentally sharing sensitive information.

**Required Configuration**

For basic operation there are a few environment variables that require configuration. Expand each section of the guide below for information on setting up the required environment variables. 

> **Tip:** For a reference guide to all environment variables, [click here](https://github.com/Yourbit-LLC/yourbit/blob/main/ENVIRONMENT.md).

<details>
<summary><strong>Setup Django Secret</strong></summary>

  
The most important variable in environment variables is the Django Secret Key. This can be generated using python by following [these instructions](https://github.com/Yourbit-LLC/yourbit/blob/main/docs/keys/generate-django-secret.md). 

Once you have created your secret key add it to your `.env` file as seen below.

```env
# Django Secret Key (Ensure this is secure!)
DJANGO_SECRET_KEY=your-django-secret-key
```
</details>

<details>
<summary><strong>Setup VAPID Keys</strong></summary>

  
VAPID Keys are used for handling web push notifications. Instructions for how to set up your VAPID keys can be found [here](https://github.com/Yourbit-LLC/yourbit/blob/main/docs/keys/generate-vapid-keys.md). Once your VAPID keys have been created, add them to the environment variables.

```env
# VAPID Keys for Push Notifications
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
VAPID_ADMIN_EMAIL=admin@example.com
```
</details>

<details>
<summary><strong>Setup Database</strong></summary>

  
If running on a local environment, the best option for a database setup is using SQLite3 as the engine. This allows you to locally host your database file in the root directory of your project, without credentials or server setup. The database file will be generated when you perform migrations in Step 6.

```env
# Database Configuration
DB_ENGINE=sqlite3

# All other fields can be commented out or left blank.
```
</details>

<details>
<summary><strong>Setup Email Service</strong></summary>


Email services are required in Yourbit for verification of email ownership, resetting passwords, and communicating with support. Yourbit SMTP is currently under development, once released you can use Yourbits internal, centralized email service connected with Yourbit support.

```env
# Email Server Configuration
EMAIL_HOST=smtp.example.com
EMAIL_HOST_USER=your-email@example.com
EMAIL_HOST_PASSWORD=your-email-password
EMAIL_PORT=587
```
</details>

<details>
<summary><strong>Setup Object Storage</strong></summary>

  
Object storage is required for basic media functionality. However, if you are setting up image and video delivery with a third party provider, this step can be ignored. 

```env
# Bucket Storage Configuration
BUCKET_NAME=your-bucket-name
BUCKET_REGION=us-east
BUCKET_ACCESS_KEY=your-bucket-access-key
BUCKET_SECRET_KEY=your-bucket-secret-key
```
</details>

<details>
<summary><strong>Setup Image Host</strong></summary>


```env
```
</details>

<details>
<summary><strong>Setup Video Host</strong></summary>


```env
# Video CDN Configuration
VIDEO_CDN_TOKEN=your-mux-video-token
VIDEO_CDN_SECRET=your-mux-video-secret

# Video Webhook and Signing Keys
VIDEO_WEBHOOK_SECRET=your-mux-webhook-secret
VIDEO_SIGNING_KEY=your-mux-signing-key
VIDEO_PRIVATE_KEY=your-mux-private-key
```
</details>

<div align="right">[Back to Top](#installation-instructions)</div>

---

## **6. Migrate the database and run the server**


```bash
python manage.py migrate
python manage.py runserver
```

You should now be able to access the site at `127.0.0.1:8000` unless you specify a different port than `8000`. 

> **Note:** Bot Challenges (Turnstile/reCAPTCHA) will not run without a secure tunnel and are disabled in local enviroments by default, Yourbits authentication system will bypass them automatically.


<div align="right">[Back to Top](#installation-instructions)</div>

---

## **7. Create Super User**


```bash
python manage.py createsuperuser
```

Follow the prompts to set up your admin account. Once complete, you may login with your new account. With debug mode on, you can access the admin panel at `127.0.0.1:8000/admin`.

> **Note:** When creating an account through the terminal, the date of birth must be formatted as YYYY-MM-DD.

<div align="right">[Back to Top](#installation-instructions)</div>





