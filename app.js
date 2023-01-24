const express = require('express')
const config = require('./utils/config')
const cors = require('cors')
const peopleRouter = require('./controller/people')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

console.log('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
	.then(() => {
		logger.info('connected to MongoDB')
	})
	.catch((error) => {
		logger.error('error connecting to MongoDB:', error.message)
	})

const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

app.use(middleware.requestLogger)

app.use('/api/people', peopleRouter)

app.use(middleware.unknownEndpoint)

app.use(middleware.errorHandler)

module.exports = app