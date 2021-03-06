// app config
const express = require('express')
const { urlencoded } = require('body-parser')
const app = express()
require('dotenv').config()
const cors = require('cors')

// db config
const mongoose = require('mongoose')
mongoose.connect(process.env.DB_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
const db = mongoose.connection
db.once('open', () => infoLog('SUCCESS: CONNECTED TO DB'))
db.on('error', () => errorLog("ERROR: Can't connect to DB"))
app.use(cors())
app.use(urlencoded({ extended: false }))
app.use(express.json())

// routes
const usersRoutes = require('./routes/user')
const shopsRoutes = require('./routes/shops')
const { infoLog, errorLog } = require('./util/logs')

app.use('/users', usersRoutes)
app.use('/shops', shopsRoutes)

// SERVER
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(process.env.PORT, () =>
  infoLog(`App listening on port ${process.env.PORT}!`)
)
