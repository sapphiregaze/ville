# Ville

**Full-stack music streaming application with custom uploading options created with Nuxt.js and Express.js 🎶**

### Video Demo

https://github.com/SapphireGaze/ville/assets/48490756/cf02497b-c82e-4d9c-adc2-7abc02332cd1

- Implemented a robust REST API server with a SQLite database for efficient storage of user and track information.
- Made use of JSON web tokens and customized Nuxt.js middleware for secure user session and resources management.
- Implemented data streaming when audio file is playing for continuous data transfer with low-latency processing, reduced processing speed by up to 70%.

### Installation

First, set up the `.env` file in both frontend and backend directory by looking at the `.env.example` file in the respective directories.

Then, install the dependencies in both directories as well,

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

Now You're all set!
