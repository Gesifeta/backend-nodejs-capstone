/* jshint esversion: 8 */
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const pinoLogger = require('./logger')
//const { loadData } = require("./util/import-mongo/index")

const connectToDatabase = require('./models/db')

const app = express()
app.use('*', cors())
const port = 3060

//  Connect to MongoDB we just do this one time
connectToDatabase().then(() => {
  pinoLogger.info('Connected to DB')
})
  .catch((e) => console.error('Failed to connect to DB', e))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
//server images
app.use('/images', (req,res)=> {
  res.sendFile(__dirname ,'images')
})
app.use(cors())
app.options('*', cors())
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Authorization, Accept'
  )
  next()
})

const userRoutes = require('./routes/userRoutes')

const secondChanceItemsRoutes = require('./routes/secondChanceItemsRoutes')
const searchRoutes = require('./routes/searchRoutes')

const pinoHttp = require('pino-http')
const logger = require('./logger')

app.use(pinoHttp({ logger }))
app.use('/api/auth', userRoutes)
app.use('/api/secondchance/items', secondChanceItemsRoutes)
app.use('/api/secondchance', searchRoutes)
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).send('Internal Server Error')
})

app.get('/', (req, res) => {
  res.send('Inside the server')
})
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
//loadData()
