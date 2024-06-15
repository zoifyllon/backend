# backend

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


# API Documentation

## AUTHENTICATION ENDPOINT
### REGISTER
Endpoint : POST /auth/register

Body Request :
```
name: "John Doe"
email: "johndoe@gmail.com"
password: "johndoe"
profileImage (optional): file
```

Response :
```
HTTP Response 201
{
  "message": "Created"
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "johndoe@gmail.com",
    "image_url": "profile image url" 
  }
}
```

Response Body Error :
- salah satu field kosong (kecuali "profileImage")
  ```
  HTTP Response 400
  {
    "message": "field tidak boleh kosong"
  }
  ```
- salah satu field berbentuk selain string (kecuali "profileImage")
  ```
  HTTP Response 400
  {
    "message": "field harus berupa string"
  }
  ```
- jika field name dan email melebihi maksimal 50 karakter
  ```
  HTTP Response 400
  {
    "message": "jumlah karakter melebihi batas maksimal 50"
  }
  ```

### LOGIN
Endpoint : POST /auth/login

Body Request :
```
email: "johndoe@gmail.com"
password: "johndoe"
```

Response :
```
HTTP Response 200
{
  "message": "Success"
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "johndoe@test.com",
    "image_url": "profile image url",
    "token": "string token"
  }
}
```

Response Body Error :
- jika login salah
  ```
  HTTP Response 401
  {
    "status": "fail",
    "message": "Invalid username or password"
  }
  ```

## USER ENDPOINT
### DETAIL USER
Endpoint : GET /users

Headers:
- Authorization: token

Response :
```
HTTP Response 200
{
  "message": "Success"
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "johndoe@gmail.com",
    "image_url": "profile image url" 
  }
}
```

Response Body Error :
- jika user tidak ditemukan
  ```
  HTTP Response 404
  {
    "status": "fail",
    "message": "user not found"
  }
  ```
  
### UPDATE USER
Endpoint : PUT /users

Headers:
- Authorization: token

Body Request :
```
name: "test"
password: "test"
profileImage: file
```

Response :
```
HTTP Response 200
{
  "message": "Success"
  "data": {
    "user_id": 1,
    "name": "John Doe",
    "email": "johndoe@gmail.com",
    "password": "encrypted password",
    "image_url": "profile image url"
  }
}
```

Response Body Error :
- salah satu field kosong
  ```
  HTTP Response 400
  {
    "message": "field tidak boleh kosong"
  }
  ```
- salah satu field berbentuk selain string (kecuali "profileImage")
  ```
  HTTP Response 400
  {
    "message": "field harus berupa string"
  }
  ```
- jika field name melebihi maksimal 50 karakter
  ```
  HTTP Response 400
  {
    "message": "jumlah karakter melebihi batas maksimal 50"
  }
  ```
- jika user tidak ditemukan
  ```
  HTTP Response 404
  {
    "status": "fail",
    "message": "user not found"
  }
  ```
    
### DELETE USER
Endpoint : DELETE /users

Headers:
- Authorization: token

Response :
```
HTTP Response 200
{
  "message": "Success"
  "data": "null"
}
```

Response Body Error :
- jika user tidak ditemukan
  ```
  HTTP Response 404
  {
    "status": "fail",
    "message": "user not found"
  }
  ```
  
## MACHINE LEARNING API
### DETECT
Endpoint : POST /detect

Headers:
- Authorization: token

Body Request :
```
detectImage: file
```

Response :
```
HTTP Response 201
{
  "message": "Created"
  "data": {
    "id": 1,
    "image_url": "detect image url",
    "user_id": 1,
    "diseases": [
      {
        "disease_id": 1,
        "history_id": 2,
        "disease": "nama penyakit",
        "percentage": 100
      },
      {
        "disease_id": 2,
        "history_id": 2,
        "disease": "nama penyakit",
        "percentage": 100
      },
      {
        "disease_id": 3,
        "history_id": 2,
        "disease": "nama penyakit",
        "percentage": 100
      }
    ]
  }
}
```

### GET ALL HISTORY
Endpoint : GET /history

Headers:
- Authorization: token

Body Request :
```
detectImage: file
```

Response :
```
HTTP Response 200
{
  "message": "Success"
  "data": [
    {
      "id": 1,
      "image_url": "detect image url",
      "user_id": 1,
      "diseases": [
        {
          "disease_id": 1,
          "history_id": 1,
          "disease": "nama penyakit",
          "percentage": 100
        },
        {
          "disease_id": 2,
          "history_id": 1,
          "disease": "nama penyakit",
          "percentage": 100
        },
        {
          "disease_id": 3,
          "history_id": 1,
          "disease": "nama penyakit",
          "percentage": 100
        }
      ]
    },
    {
      "id": 2,
      "user_id": 1,
      "image_url": "detect image url",
      "diseases": [
        {
          "disease_id": 1,
          "history_id": 2,
          "disease": "nama penyakit",
          "percentage": 100
        },
        {
          "disease_id": 2,
          "history_id": 2,
          "disease": "nama penyakit",
          "percentage": 100
        },
        {
          "disease_id": 3,
          "history_id": 2,
          "disease": "nama penyakit",
          "percentage": 100
        }
      ]
    }
  ]
}
```

### GET DETAIL HISTORY
Endpoint : GET /history/{historyId}

Headers:
- Authorization: token

Body Request :
```
detectImage: file
```

Response :
```
HTTP Response 200
{
  "message": "Success"
  "data": {
    "id": 1,
    "user_id": 1,
    "image_url": "detect image url",
    "diseases": [
      {
        "disease_id": 1,
        "history_id": 1,
        "disease": "nama penyakit",
        "percentage": 100,
        "symptoms": [], <-- string of array: isinya gejala dari penyakit
        "prevents": [] <-- string of array: isinya pencegahan dari penyakit
      },
      {
        "disease_id": 2,
        "history_id": 1,
        "disease": "nama penyakit",
        "percentage": 100,
        "symptoms": [], <-- string of array: isinya gejala dari penyakit
        "prevents": [] <-- string of array: isinya pencegahan dari penyakit
      },
      {
        "disease_id": 3,
        "history_id": 1,
        "disease": "nama penyakit",
        "percentage": 100,
        "symptoms": [], <-- string of array: isinya gejala dari penyakit
        "prevents": [] <-- string of array: isinya pencegahan dari penyakit
      },
    ]
  }
}
```

Response Body Error :
- jika history tidak ditemukan
  ```
  HTTP Response 404
  {
    "status": "fail",
    "message": "history not found"
  }
  ```

### GET DETAIL HISTORY
Endpoint : GET /history/{historyId}

Headers:
- Authorization: token

Body Request :
```
detectImage: file
```

Response :
```
HTTP Response 200
{
  "message": "Success"
  "data": null
}
```

Response Body Error :
- jika history tidak ditemukan
  ```
  HTTP Response 404
  {
    "status": "fail",
    "message": "history not found"
  }
  ```
