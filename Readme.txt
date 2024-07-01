# blockchain-mycoin

**Student information:**
- ID: 20120217
- Name: Lê Minh Trí
- Youtube demo: https://youtu.be/FvX8ul94upA

## How to run the app

**1. Run server**
- Setup server .env file (using postgresql for database)
- Create **.env** file in ./server folder
```bash
CLIENT_URL=http://localhost:5173
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
```
- Run server code
```console
./server/npm install
./server/npm run start
```

**2. Run client**
- Setup client .env file
- Create **.env** file in ./client folder
```bash
VITE_API_URL=http://localhost:5000
```
- Run client code
```
./client/npm install
./client/npm run dev
```