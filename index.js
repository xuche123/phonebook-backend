require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))
app.use(cors())

morgan.token('person', (req) => {
	return JSON.stringify(req.body)
})

app.get('/api/info', (req, res) => {
	Person
		.countDocuments()
		.then(count =>
			res.send(`<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`)
		)
})


app.get('/api/persons', (req, res) => {
	Person.find({}).then(people => {
		res.json(people)
	})
})

app.get('/api/persons/:id', (req, res, next) => {
	Person
		.findById(req.params.id)
		.then(note => {
			if (note) {
				res.json(note)
			} else {
				res.status(404).end()
			}
		})
		.catch(error => next(error))

})

app.delete('/api/persons/:id', (req, res, next) => {
	Person.findByIdAndRemove(req.params.id)
		.then(res => {
			res.status(204).end()
		})
		.catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
	const body = req.body

	if (!body.name) {
		return res.status(400).json({
			error: 'name missing'
		})
	}

	if (!body.number) {
		return res.status(400).json({
			error: 'number missing'
		})
	}

	const person = new Person({
		name: body.name,
		number: body.number
	})

	person
		.save()
		.then(savedPerson => {
			// console.log(savedPerson)
			res.json(savedPerson)
		}).catch(err =>
			next(err)
		)
})

app.put('/api/persons/:id', (req, res, next) => {
	const body = req.body
	console.log('body: ', body)
	if (!body.number) {
		return res.status(400).json({
			error: 'number missing'
		})
	}

	const person = {
		name: body.name,
		number: body.number
	}

	Person.findByIdAndUpdate(
		req.params.id,
		person,
		{ new: true, runValidators: true, context: 'query' })
		.then(updatedPerson => {
			res.json(updatedPerson)
		})
		.catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}

	next(error)
}

app.use(errorHandler)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})