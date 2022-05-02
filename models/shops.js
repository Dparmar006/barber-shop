const mongoose = require('mongoose')

const shopsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'users'
  },
  address: {
    city: {
      type: String
    },
    addressLine1: {
      type: String
    },
    addressLine2: {
      type: String
    },
    district: {
      type: String
    },
    landmark: {
      type: String
    }
  },
  email: {
    type: String,
    unique: true
  },
  phone: {
    type: String,
    unique: true
  },
  services: {
    type: [{ title: String, price: Number, description: String }]
  },
  about: {
    type: String
  }
})

module.exports = mongoose.model('Shops', shopsSchema)
