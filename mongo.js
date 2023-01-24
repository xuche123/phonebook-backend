/* eslint-disable no-undef */
const mongoose = require('mongoose')

if (process.argv.length < 3) {
	console.log('give password as argument')
	process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

if (process.argv.length > 3) {
	if (!name || !number) {
		console.log('name/number cannnot be left empty')
		process.exit(1)
	}
}

const url =
	`mongodb+srv://fullstack:${password}@cluster0.salqvm2.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
	name: name,
	number: number
})

if (process.argv.length === 3) {
	console.log('phonebook:')
	Person
		.find({})
		.then(result => {
			result.forEach(person => {
				console.log(person.name, person.number)
			})
			mongoose.connection.close()
		})
} else {
	person
		.save()
		.then(result => {
			console.log('added', result.name, result.number, 'to phonebook')
			console.log('note saved!')
			mongoose.connection.close()
		})
}

