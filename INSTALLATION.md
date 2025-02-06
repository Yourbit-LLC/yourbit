# Installation Instructions
These instructions are provided for the purpose of setting up a host server or development environment for Yourbit


## 1. Install Python 3.10.5

Follow this [link to download Python-3.10.5](https://www.python.org/downloads/release/python-3105/)

To install on windows, download and run the windows installer provided on the page.

> **Note:** If you are attempting to install python on Linux. You must download the source code from the link above and follow [these instructions here](https://github.com/Yourbit-LLC/yourbit/blob/main/docs/installation/install-python-source.md) to compile and install.

## 2. Create the virtual environment

A virtual environment allows you to create isolated Python environments for different projects, preventing dependency conflicts.

**Creating a Virtual Environment**

Run the following command in your project directory:

```sh
python3.10 -m venv venv
```

This creates a folder named `venv` containing the isolated environment.

Using virtual environments keeps your system’s Python environment clean and avoids package conflicts between projects.


**Additional Information:**

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






