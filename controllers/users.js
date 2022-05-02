const express = require('express')
const Users = require('../models/users')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { infoLog, errorLog } = require('../util/logs')
const {
  WRONG_CREDENTIALS,
  SERVER_ERROR,
  DATA_RETRIVED_SUCCESSFULLY: DATA_RETRIVED,
  BAD_REQUEST,
  EMAIL_ALREADY_USED,
  RECORD_CREATED,
  RESOURCE_NOT_FOUND,
  RECORD_UPDATED
} = require('../constants/messages')

// POST /login

const login = async (req, res) => {
  try {
    if (!(req.body.email && req.body.password)) {
      return res
        .status(400)
        .json({ success: false, msg: 'Password and Email are required.' })
    }

    const user = await Users.findOne({ email: req.body.email })

    if (user && (await bcrypt.compare(req.body.password, user.password))) {
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: '7d'
        }
      )

      user.token = token
      infoLog(`${user.email} just logged in.`)
      return res.status(200).json({ success: true, user: user })
    } else {
      res.status(400).json(WRONG_CREDENTIALS)
    }
  } catch (error) {
    errorLog('Error occured while logging in.')
    res.status(500).json({ error, ...SERVER_ERROR })
  }
}
// GET /user
const getUsers = async (req, res) => {
  try {
    const users = await Users.find()
    infoLog('Users retrived.')
    res.status(200).json({
      numberOfUserss: users.length,
      users,
      ...DATA_RETRIVED
    })
  } catch (error) {
    errorLog('Error occured while retriving users.')
    res.status(500).json({ error, ...SERVER_ERROR })
  }
}
// POST /user
const addUser = async (req, res) => {
  try {
    if (
      !(req.body.email && req.body.password && req.body.lname && req.body.fname)
    ) {
      res.status(400).json(BAD_REQUEST)
    }

    const oldPharmacist = await Users.findOne({ email: req.body.email })

    if (oldPharmacist) {
      return res.status(409).json(EMAIL_ALREADY_USED)
    }

    const encryptedPassword = await bcrypt.hash(req.body.password, 10)

    const user = new Users({
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email.toLowerCase(),
      password: encryptedPassword,
      phone: req.body.phone
    })

    const token = jwt.sign(
      {
        userId: user._id,
        email: req.body.email.toLowerCase(),
        userRole: req.body.userRole
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: '7d'
      }
    )

    user.token = token

    const newUser = await user.save()
    infoLog(`${user.email} registered.`)
    return res.status(201).json({
      user: newUser,
      ...RECORD_CREATED
    })
  } catch (error) {
    errorLog('Error occured while adding / registering user.')
    return res.status(400).json({ error, ...SERVER_ERROR })
  }
}
// GET user/:id
const getUser = async (req, res) => {
  try {
    const user = await Users.findById(req.params.id)
    if (user === null) {
      return res.status(404).json(RESOURCE_NOT_FOUND)
    }
    infoLog('User retrived.')
    return res.status(200).json({ user, ...DATA_RETRIVED })
  } catch (error) {
    errorLog('Error occured while retriving user.')
    return res.status(500).json({ error, ...SERVER_ERROR })
  }
}
// PUT user/:id
const updateUser = async (req, res) => {
  try {
    await Users.findByIdAndUpdate(req.params.id, req.body)
    infoLog('User updated.')
    return res.status(200).json(RECORD_UPDATED)
  } catch (error) {
    errorLog('Error occured while updating user.')
    return res.status(500).json({ error, ...SERVER_ERROR })
  }
}
// DELETE user/:id
const deleteUser = async (req, res) => {
  try {
    await Users.findByIdAndDelete(req.params.id)
    infoLog('User deleted.')
    res.json(RECORD_DELETED)
  } catch (error) {
    console.log(error)
    errorLog('Error occured while deleting user.')
    res.status(500).json({ error, ...SERVER_ERROR })
  }
}

module.exports = {
  login,
  addUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser
}
