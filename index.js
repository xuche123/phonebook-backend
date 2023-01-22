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

morgan.token('person', (req, res) => {
    return JSON.stringify(req.body)
})

let phonebooks = []

app.get('/api/persons', (req, res) => {
    Person.find({}).then(people => {
        res.json(people)
    })
})

app.get('/api/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${phonebooks.length} people</p><p>${new Date()}</p>`)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)

    let copy = [...phonebooks]
    phonebooks = phonebooks.filter(phonebook => phonebook.id != id)

    if (copy.length === phonebooks.length) {
        res.status(404).end()
    } else {
        res.status(204).end()
    }
})

const generateId = () => {
    return Math.floor(Math.random() * 999999999)
}

app.post('/api/persons', (req, res) => {
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

    const names = phonebooks.map(person => person.name)

    if (names.includes(body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    phonebooks = phonebooks.concat(person)

    res.json(person)
})

app.put('/api/persons/:id', (req, res) => {
    const body = req.body
    console.log("body: ", body)
    if (!body.number) {
        return res.status(400).json({
            error: 'number missing'
        })
    }

    // console.log(phonebooks)

    const phonebooks1 = phonebooks.map(phonebook => {
        console.log("debug: ", phonebook)
        return phonebook.name === body.name ? req.body : phonebook
    })

    phonebooks = phonebooks1

    res.json(req.body)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})