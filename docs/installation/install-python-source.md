# Installing Python 3.10.5 from Source on Linux

This guide will walk you through compiling and installing Python 3.10.5 from source on a Linux system.

## Prerequisites

Before proceeding, ensure your system has the necessary dependencies installed.

### Install Required Packages

On Debian/Ubuntu-based distributions:

```sh
sudo apt update
sudo apt install -y build-essential libssl-dev zlib1g-dev \
    libncurses5-dev libncursesw5-dev libreadline-dev libsqlite3-dev \
    libgdbm-dev libdb5.3-dev libbz2-dev libexpat1-dev \
    liblzma-dev tk-dev libffi-dev
```

On Fedora-based distributions:

```sh
sudo dnf groupinstall -y "Development Tools"
sudo dnf install -y gcc gcc-c++ make bzip2 bzip2-devel \
    zlib-devel xz-devel libffi-devel sqlite-devel \
    readline-devel ncurses-devel gdbm-devel tk-devel
```

On Arch-based distributions:

```sh
sudo pacman -S --needed base-devel gcc zlib xz tk \
    sqlite libffi ncurses gdbm
```

## Download and Extract Python Source Code

```sh
cd /usr/src
sudo curl -O https://www.python.org/ftp/python/3.10.5/Python-3.10.5.tgz
sudo tar xvf Python-3.10.5.tgz
cd Python-3.10.5
```

## Compile and Install

```sh
sudo ./configure --enable-optimizations
sudo make -j$(nproc)
sudo make altinstall
```

> **Note:** We use `altinstall` instead of `install` to prevent overwriting the default `python` binary.

## Verify Installation

Check the installed version:

```sh
python3.10 --version
```

You should see:

```
Python 3.10.5
```

## Cleanup (Optional)

After installation, you can remove the source files:

```sh
cd ..
sudo rm -rf Python-3.10.5 Python-3.10.5.tgz
```

## Troubleshooting

- If `python3.10` is not found, try running `hash -r` or restarting your terminal.
- Ensure `/usr/local/bin` is in your `PATH` by running:

  ```sh
  echo $PATH
  ```

If you encounter issues, check the Python documentation or file a GitHub issue for assistance.
