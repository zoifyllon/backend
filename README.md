# Zoifyllon API

![Zoifyllon 1](https://github.com/zoifyllon/Android/assets/120267728/e8a2d9b7-f1ba-4a70-8826-549d7642f695)
<h1 align="center">Zoifyllon - Plant Disease Identification with Deep Learning</h1>

## Introduction
Zoifyllon is mobile app platform powered by image processing and AI technologies to swiftly and accurately diagnose diseases plant leaves.

## Installation
To install and run the Zoifyllon API on your local machine, follow these steps:

  > **_NOTE:_** You must run [detectAPI](https://github.com/zoifyllon/detectAPI) to use the Model Prediction

1. **Clone the Repository**

  ```
  git clone https://github.com/zoifyllon/backend.git
  ``` 

3. **Dependencies Installation**

  ```
  npm install
  ```

3. **Database Migrate**

  ```
  npx prisma migrate dev
  ```

4. **Run the Application**

  - Development
    ```
    npm run start-dev
    ```
  - Production
    ```
    npm run start
    ```

# API Documentation

[API Documentation](API%20Documentation.md)
