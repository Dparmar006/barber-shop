const express = require('express')
const shopsRoutes = express.Router()
const auth = require('../middlewares/auth')
const {
  getStores,
  getStore,
  addStore,
  updateStore,
  deleteStore
} = require('../controllers/shops')

// GET stores OR get pharmacist's store
shopsRoutes.get('/', auth, getStores)

// GET store/:id
shopsRoutes.get('/:id', auth, getStore)

// POST store
shopsRoutes.post('/', auth, addStore)

// PUT store
shopsRoutes.put('/:id', auth, updateStore)

// DEL store
shopsRoutes.delete('/:id', auth, deleteStore)

module.exports = shopsRoutes
