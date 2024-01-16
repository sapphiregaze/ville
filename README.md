# Ville

**Full-stack music streaming application with custom uploading options created with Nuxt.js and Express.js 🎶**

## Video Demo

https://github.com/SapphireGaze/ville/assets/48490756/cf02497b-c82e-4d9c-adc2-7abc02332cd1

- Implemented a robust REST API server with a MySQL database for efficient storage of user and track information.
- Made use of JSON web tokens and customized Nuxt.js middleware for secure user session and resources management.
- Implemented data streaming when audio file is playing for continuous data transfer with low-latency processing, reduced processing speed by up to 70%.

## Installation

### MySQL Installation

**Skip this section if MySQL database is already setup.**

Navigate to the [official MySQL documentations](https://dev.mysql.com/doc/mysql-getting-started/en/) and follow the steps regarding installation, and start the service once MySQL is installed.

Once MySQL is running, open the MySQL console and run the below commands

```
CREATE DATABASE ville;
CREATE USER 'YOUR_USER'@'YOUR_HOST' IDENTIFIED BY 'YOUR_PASSWORD';
GRANT ALL PRIVILEGES ON ville.* TO 'YOUR_USER'@'YOUR_HOST';
FLUSH PRIVILEGES;
```

Now the MySQL database is ready!

### General Installation

Set up the `.env` file in both frontend and backend directory by looking at the `.env.example` file in the respective directories.

Note: If a local instance of the MySQL database is running, make sure to specify the `DB_HOST` as `127.0.0.1` instead of localhost, as localhost sometimes resolves to IPv6 and fails to connect to the database.

Then, install the dependencies in both directories,

```
npm i
```

In the backend, run the below commands to start the server,

```
npm start
```

Afterwards, type the below commands in the frontend,

```
npm run build
node .output/server/index.mjs
```

Now you're all set!
