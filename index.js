require("dotenv").config()
const express = require('express')
const morgan = require("morgan");
const cors = require("cors");
const app = express()
const Person = require("./models/person")

app.use(express.json())
app.use(cors())
app.use(express.static("build"))

morgan.token("body", (request) => {
    return JSON.stringify(request.body)
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))


// app.get("/info", (request, response) => {
//     const numPeople = `<p>Phonebook has information about ${persons.length} people</p>`
//     const date = `<p>${Date()}</p>`
//     const body = numPeople.concat(date)
//     response.send(body)
// })

app.get('/api/persons', (request, response) => {
    Person.find({}).then(result => {
        response.json(result)
    }).catch(error => {
        response.json(error)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    }).catch(error => {
        response.json(error)
    })
})

// app.delete("/api/persons/:id", (request, response) => {
//     const id = Number(request.params.id)
//     persons = persons.filter(person => person.id !== id)
//
//     response.status(204).end()
// })

app.post("/api/persons", (request, response) => {
    const body = request.body

    if (!(body.name && body.number)) {
        return response.status(400).json({
            error: "missing name or number"
        })
    }
    // else if (persons.find(person => person.name === body.name)) {
    //     return response.status(400).json({
    //         error: "name must be unique"
    //     })
    // }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})