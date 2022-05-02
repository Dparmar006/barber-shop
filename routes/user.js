const express = require('express')
const usersRoutes = express.Router()
const auth = require('../middlewares/auth')
const {
  login,
  getUsers,
  addUser,
  getUser,
  deleteUser,
  updateUser
} = require('../controllers/users')
// const mongoose = require('mongoose')

// POST /login
usersRoutes.post('/login', login)

// GET /users
usersRoutes.get('/', auth, getUsers)

// POST /user
usersRoutes.post('/', addUser)

// GET user/:id
usersRoutes.get('/:id', auth, getUser)

// DELETE user/:id
usersRoutes.delete('/:id', auth, deleteUser)

// PUT user/:id
usersRoutes.put('/:id', updateUser)

module.exports = usersRoutes
