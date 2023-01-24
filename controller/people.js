const peopleRouter = require('express').Router()
const Person = require('../models/person')

peopleRouter.get('/info', (req, res) => {
	Person
		.countDocuments()
		.then(count =>
			res.send(`<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`)
		)
})


peopleRouter.get('/', (req, res) => {
	Person.find({}).then(people => {
		res.json(people)
	})
})

peopleRouter.get('/:id', (req, res, next) => {
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

peopleRouter.delete('/:id', (req, res, next) => {
	Person.findByIdAndRemove(req.params.id)
		.then(() => {
			res.status(204).end()
		})
		.catch(error => next(error))
})

peopleRouter.post('/', (req, res, next) => {
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

peopleRouter.put('/:id', (req, res, next) => {
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

module.exports = peopleRouter