# Installing Git on Windows

## 1: Check if Git is Already Installed

Before installing Git, check if it is already installed on your system. Open **Command Prompt** or **PowerShell** and run:

```sh
git --version
```

- If Git is installed, you'll see the version number.
- If not, you'll see an error message and can proceed to the next step.

---

## 2: Download Git for Windows

1. Go to the official Git website:  
   👉 [https://git-scm.com/download/win](https://git-scm.com/download/win)

2. The download will begin automatically. Once it's complete, run the `.exe` installer.

---

## 3: Run the Installer

1. Follow the installation prompts. You can use the default options for most settings.
   - Choose **Git Bash** as your terminal (for easier Git usage).
   - Keep the default text editor settings (usually **Vim** or **Notepad++**).

2. Continue through the installer, accepting default settings unless you have specific preferences.

---

## 4: Verify the Installation

Once the installation is complete, verify that Git was installed correctly.

1. Open **Command Prompt** or **Git Bash** and run:

```sh
git --version
```

2. You should see the Git version number, confirming that Git is installed correctly.

---

## Alternative Method: Install via Package Manager

If you have a Windows package manager like **winget** or **Chocolatey**, you can install Git through the command line.

### Using Windows Package Manager (winget)

```sh
winget install --id Git.Git -e --source winget
```

### Using Chocolatey (if installed)

```sh
choco install git
```

---

## 5: Configure Git (Optional)

Once Git is installed, you may want to set up your user details.

1. Open **Git Bash** or **Command Prompt** and run the following commands, replacing the placeholders with your own details:

```sh
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## 6: Check the Configuration

You can verify your Git configuration with the following command:

```sh
git config --list
```

It should display the `user.name` and `user.email` you've just set.

---

## Conclusion

You’ve successfully installed and configured Git on your Windows system! Happy coding! 🚀


Feel free to copy and paste this markdown file! It covers everything from installation to verification and even optional configuration. Let me know if you need more details or help with something else!
