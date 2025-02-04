**Clone this Repository**

```sh
# Example for Django
git clone https://github.com/Yourbit-LLC/yourbit.git
cd yourbit
pip install -r requirements.txt
```


**Create an environment file**

In the root (top) directory of your project. Create a file with the name `.env`. 

To set up your environment. Fill in the [example file](https://github.com/Yourbit-LLC/yourbit/blob/main/.env.example) named, `.env.example`, given in the root of this repository, or [view a table](https://github.com/Yourbit-LLC/yourbit/blob/main/ENVIRONMENT.md) of all of the environment variables to configure your settings.py file. **Do not configure the settings.py file directly.**


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


_Video service providers must be compatible with the HLS protocol._
