const mongoose = require('mongoose')
const Shops = require('../models/shops')
const {
  BAD_REQUEST,
  DATA_RETRIVED_SUCCESSFULLY,
  SERVER_ERROR,
  RECORD_CREATED,
  RECORD_DELETED
} = require('../constants/messages')
const { infoLog, errorLog } = require('../util/logs')

const getStores = async (req, res) => {
  const { userId } = req.body
  try {
    if (userId) {
      if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json(BAD_REQUEST)
      }
      const shops = await Shops.find({
        ownerId: mongoose.Types.ObjectId(userId)
      })
      infoLog('Shops retrived.')
      return res.status(200).json({
        totalposts: shops.length,
        ...DATA_RETRIVED_SUCCESSFULLY,
        shops
      })
    }
    const shops = await Shops.find()
    infoLog('Shops retrived.')
    res.status(200).json({
      totalposts: shops.length,
      ...DATA_RETRIVED_SUCCESSFULLY,
      shops: shops
    })
  } catch (error) {
    errorLog(error.message)
    res.status(500).json({ error: error.message, ...SERVER_ERROR })
  }
}

const getStore = async (req, res) => {
  try {
    const shop = await Shops.findById(req.params.id)
    if (!shop) {
      errorLog('Post not found.')
      return res.status(404).json(RESOURCE_NOT_FOUND)
    }
    infoLog('Post found.')
    return res.status(200).json({ ...DATA_RETRIVED_SUCCESSFULLY, shop })
  } catch (error) {
    errorLog(error.message)
    return res.status(500).json({ error, ...SERVER_ERROR })
  }
}

const addStore = async (req, res) => {
  let address = {
    city: req.body.city,
    landmark: req.body.landmark,
    district: req.body.district,
    addressLine1: req.body.addressLine1,
    addressLine2: req.body.addressLine2
  }
  const shop = new Shops({
    name: req.body.name,
    address: address,
    email: req.body.email,
    phone: req.body.phone,
    services: req.body.services,
    about: req.body.about,
    ownerId: req.user.userId
  })
  try {
    const newShop = await shop.save()
    infoLog(`'${shop.name}' shop added.`)
    res.status(201).json({ ...RECORD_CREATED, shop: newShop })
  } catch (error) {
    errorLog('Error occured while adding shop.')
    res.status(400).json({ error, ...BAD_REQUEST })
  }
}

const updateStore = async (req, res) => {
  try {
    let address = {
      city: req.body.city,
      landmark: req.body.landmark,
      district: req.body.district,
      addressLine1: req.body.addressLine1,
      addressLine2: req.body.addressLine2
    }

    let updateReq = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      services: req.body.services,
      about: req.body.about,
      ownerId: req.body.ownerId,
      address: { ...address },
      ...req.body
    }

    const updatedStore = await Shops.findByIdAndUpdate(req.params.id, updateReq)
    infoLog(`shop updated.`)
    return res.json(RECORD_CREATED)
  } catch (error) {
    errorLog('Error occured while updating shop.')
    return res.status(400).json({ error, ...BAD_REQUEST })
  }
}

const deleteStore = async (req, res) => {
  try {
    await Shops.findByIdAndDelete(req.params.id)
    res.json(RECORD_DELETED)
  } catch (error) {
    res.status(500).json({ error, ...SERVER_ERROR })
  }
}

module.exports = {
  getStore,
  getStores,
  addStore,
  updateStore,
  deleteStore
}
