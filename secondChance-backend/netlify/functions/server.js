/* jshint esversion: 8 */
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const pinoLogger = require('./logger')
const serverless = require('serverless-http')
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
app.use('/images', (req, res) => {
  res.sendFile(__dirname, 'images')
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
app.use('/api/', userRoutes)
app.use('/api/', secondChanceItemsRoutes)
app.use('/api/', searchRoutes)
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).send('Internal Server Error')
})

app.get('/', (req, res) => {
  res.send(`
  
    <h1>Second Chance API</h1>
    <h2>API Documentation</h2>
    <h3>Base URL: https://secondchanceapi.netlify.app</h3>
    <h3>API Endpoints</h3>
    <ul>
      <li>/api/auth - User routes</li>
      <li>/api/secondchance/items - Second Chance Items routes</li>
      <li>/api/secondchance/search - Search routes</li>
    </ul>
    <h3>API Documentation</h3>
    <a href="/api-docs">Documentation</a>
    <p>API is Running</p>    
    <p>Version 1.0.0</p>
    <p>Developed by <a href="https://gemechuadam.com">Gemechu Adam</a></p>
    <p>Powered by <a href="https://mongodb.com">MongoDB</a></p>
     <p>Hosted on <a href="https://wwww.netlify.com">Netlify</a></p>
      `)
})
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
//loadData()
