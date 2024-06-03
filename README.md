# backend

## isian .env

```
PORT
DATABASE_URL="mysql://user:password@host:port/zoifyllon?schema=public"
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