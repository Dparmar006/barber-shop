const mongoose = require('mongoose')
const { USER_ROLES: USER_TYPES } = require('../constants/userTypes')

const userSchema = mongoose.Schema(
  {
    fname: {
      type: String,
      required: true
    },
    lname: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phone: {
      type: String,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    createdAt: { type: Date, default: Date.now },
    token: {
      type: String
    }
  },

  { collection: 'users' }
)

module.exports = mongoose.model('Users', userSchema)
