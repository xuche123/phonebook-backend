const express = require('express')
const config = require('./utils/config')
const morgan = require('morgan')
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
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))


morgan.token('person', (req) => {
	return JSON.stringify(req.body)
})

app.use(middleware.requestLogger)

app.use('/api/people', peopleRouter)
// app.get('/api/info', (req, res) => {
// 	Person
// 		.countDocuments()
// 		.then(count =>
// 			res.send(`<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`)
// 		)
// })


// app.get('/api/persons', (req, res) => {
// 	Person.find({}).then(people => {
// 		res.json(people)
// 	})
// })

// app.get('/api/persons/:id', (req, res, next) => {
// 	Person
// 		.findById(req.params.id)
// 		.then(note => {
// 			if (note) {
// 				res.json(note)
// 			} else {
// 				res.status(404).end()
// 			}
// 		})
// 		.catch(error => next(error))

// })

// app.delete('/api/persons/:id', (req, res, next) => {
// 	Person.findByIdAndRemove(req.params.id)
// 		.then(res => {
// 			res.status(204).end()
// 		})
// 		.catch(error => next(error))
// })

// app.post('/api/persons', (req, res, next) => {
// 	const body = req.body

// 	if (!body.name) {
// 		return res.status(400).json({
// 			error: 'name missing'
// 		})
// 	}

// 	if (!body.number) {
// 		return res.status(400).json({
// 			error: 'number missing'
// 		})
// 	}

// 	const person = new Person({
// 		name: body.name,
// 		number: body.number
// 	})

// 	person
// 		.save()
// 		.then(savedPerson => {
// 			// console.log(savedPerson)
// 			res.json(savedPerson)
// 		}).catch(err =>
// 			next(err)
// 		)
// })

// app.put('/api/persons/:id', (req, res, next) => {
// 	const body = req.body
// 	console.log('body: ', body)
// 	if (!body.number) {
// 		return res.status(400).json({
// 			error: 'number missing'
// 		})
// 	}

// 	const person = {
// 		name: body.name,
// 		number: body.number
// 	}

// 	Person.findByIdAndUpdate(
// 		req.params.id,
// 		person,
// 		{ new: true, runValidators: true, context: 'query' })
// 		.then(updatedPerson => {
// 			res.json(updatedPerson)
// 		})
// 		.catch(error => next(error))
// })
app.use(middleware.unknownEndpoint)

app.use(middleware.errorHandler)

module.exports = app