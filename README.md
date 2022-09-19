# TVA DEMO APPLICATION

You can access the demo at https://tva.mystaginghub.com

The TVA Demo application consists of 2 parts - the client built in Vue (Nuxt.js) and the backend server built in Node.js (Express.js). Database used is MongoDb. The database is hosted in a cloud instance so you will not require to install a database for running this code. Each of the folders are deployed separately. Please find below the deploy instructions for each -


## CLIENT APPLICATION

### If you need NUXT cli

```
sudo npm install -g nuxt
```

### cd into client folder
```
cd client
```

### Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```

### Run unit tests
```
npm run dev
```

### Compiles and minifies for production
```
nuxt generate
```

## BACKEND SERVER

### cd into backend folder
```
cd backend
```

### Project setup
```
npm install
```

### Starts the server
```
node server.js
```

### Compiles and hot-reloads for development (Requires nodemon globally installed)
```
nodemon
```