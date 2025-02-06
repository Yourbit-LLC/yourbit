## 1. Install Python 3.10.5

Follow this [link to install python](https://www.python.org/downloads/release/python-3105/)

To install on windows, download and run the windows installer provided on the page.


## 2. Create the virtual environment
# Creating and Using a Python Virtual Environment

A virtual environment allows you to create isolated Python environments for different projects, preventing dependency conflicts.

## Creating a Virtual Environment

Run the following command in your project directory:

```sh
python3.10 -m venv venv
```

This creates a folder named `venv` containing the isolated environment.

## Activating the Virtual Environment

- On **Linux/macOS**:

  ```sh
  source venv/bin/activate
  ```

- On **Windows (PowerShell)**:

  ```powershell
  venv\Scripts\Activate
  ```

Once activated, your terminal prompt should show `(venv)`, indicating you are using the virtual environment.

## Installing Packages

With the virtual environment activated, install packages using `pip`:

```sh
pip install package_name
```

## Deactivating the Virtual Environment

To exit the virtual environment, simply run:

```sh
deactivate
```

## Removing a Virtual Environment

If you no longer need the virtual environment, you can delete it:

```sh
rm -rf venv
```

or on Windows:

```powershell
Remove-Item -Recurse -Force venv
```

---

Using virtual environments keeps your system’s Python environment clean and avoids package conflicts between projects.



## 3. Clone this Repository

```sh
# Example for Django
git clone https://github.com/Yourbit-LLC/yourbit.git
cd yourbit
```

## 4. Install the dependencies
```sh
pip install -r requirements.txt
```






