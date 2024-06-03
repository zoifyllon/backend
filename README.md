# backend

## isian .env

```
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_DATABASE=zoifyllon

PORT=3000

DATABASE_URL="mysql://root:root@localhost:3306/zoifyllon?schema=public"
```

## migrasi database

```
npx prisma migrate dev
```

## instalasi dependensi

```
npm install
```

## menjalankan aplikasi

- Development
  ```
  npm run start-dev
  ```
- Production
  ```
  npm run start
  ```