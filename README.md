# backend

## isian .env

```
DATABASE_URL="mysql://user:password@host:port/database?schema=public"
PORT=
PROJECT_ID=
BUCKET_NAME=
```

## instalasi dependensi

```
npm install
```

## migrasi database

```
npx prisma migrate dev
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