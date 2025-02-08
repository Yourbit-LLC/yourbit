# Installation Instructions
These instructions are provided for the purpose of setting up a host server or development environment for Yourbit


## **1. Install Python 3.10.5**


Follow this [link to download Python-3.10.5](https://www.python.org/downloads/release/python-3105/)

To install on windows, download and run the windows installer provided on the page.

> **Note:** If you are attempting to install python on Linux. You must download the source code from the link above and follow [these instructions here](https://github.com/Yourbit-LLC/yourbit/blob/main/docs/installation/install-python-source.md) to compile and install.

## **2. Clone this Repository**

Run the following commands inside of your terminal of choice.

```sh
# Example for Django
git clone https://github.com/Yourbit-LLC/yourbit.git
cd yourbit
```

## **3. Create the virtual environment**

A virtual environment allows you to create isolated Python environments for different projects, preventing dependency conflicts.

### **Creating a Virtual Environment**

Run the following command in your project directory (you should be here at the end of step 2):

```sh
python3.10 -m venv venv
```

This creates a folder named `venv` containing the isolated environment.

Using virtual environments keeps your system’s Python environment clean and avoids package conflicts between projects.


### **Additional Information:**

<details>
  
<summary><strong>Activating the Virtual Environment</strong></summary>

- On **Linux/macOS**:

  ```sh
  source venv/bin/activate
  ```

- On **Windows (PowerShell)**:

  ```powershell
  venv\Scripts\Activate
  ```

Once activated, your terminal prompt should show `(venv)`, indicating you are using the virtual environment.
</details>

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

## **4. Install the dependencies**
```sh
pip install -r requirements.txt
```

## **5. Set Up Environment**  

Follow the [instructions](https://github.com/Yourbit-LLC/yourbit/blob/main/ENVIRONMENT.md) provided in `ENVIRONMENT.md` for setting up your environment variables as well as referencing a full list of variables.


## **6. Migrate the database and run the server**

```bash
python manage.py migrate
python manage.py runserver
```

You should now be able to access the site at `127.0.0.1:8000` unless you specify a different port than `8000`. 

> **Note:** Bot Challenges (Turnstile/reCAPTCHA) will not run without a secure tunnel and are disabled in local enviroments by default, Yourbits authentication system will bypass them automatically.

## **7. Create Super User**
```bash
python manage.py createsuperuser
```

Follow the prompts to set up your admin account. Once complete, you may login with your new account. With debug mode on, you can access the admin panel at `127.0.0.1:8000/admin`.

> **Note:** When creating an account through the terminal, the date of birth must be formatted as YYYY-MM-DD. 





