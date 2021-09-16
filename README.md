# Task manager

A node.js API from Udemy course to manage your personal tasks.

### Install dependencies
```sh
npm install
```

### Usage
```sh
# node
npm run start
```

```sh
# nodemon
npm run dev
```
Go on http://localhost:3000

### Routes

#### Session

**POST** /login

> Login an existing user

Request:
```json
{
    "email": "jverd@protonmail.com",
    "password": "0123456789"
}
```

**POST** /signup

> Create a new user

Request:
```json
{
    "email": "jverd@protonmail.com",
    "password": "0123456789",
    "name": "Joffrey"
}
```

**POST** /logout

> Logout from the current session

**POST** /logoutAll

> Logout from all the existing sessions

#### User

**GET** /users/me

> Get my profile data


**PATCH** /users/me

> Update my password, name or email

Request:
```json
{
    "password": "9876543210"
}
```

**DELETE** /users/me

> Delete my profile and all my tasks

#### Task

**POST** /tasks

> Create a new task

Request:
```json
{
	"description": "Watch Batmman",
	"completed": false
}
```

**GET** /tasks/:id

> Get a specific task


**GET** /tasks?completed=true&limit=10&skip=0&sortBy=createdAt:asc

> Get my tasks

**PATCH** /tasks/:id

> Update one of my tasks

Request:
```json
{
	"completed": true
}
```

**DELETE** /tasks/:id

> Delete one of my tasks
