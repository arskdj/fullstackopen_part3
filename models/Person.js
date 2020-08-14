require('dotenv').config()
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

mongoose.set('useFindAndModify', false)

const uri = process.env.DB_URI
console.log('connecting to', uri)

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then( result => {
        console.log('connected to DB')
    })
    .catch( error => {
        console.log('error connecting to DB')
    })

const personSchema = new mongoose.Schema({
    name :    { type: String, required: true, unique: true, minlength : 3 },
    number :  { type: String, required: true, minlength : 8 } 
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})



const Person = mongoose.model('Person', personSchema)
module.exports = Person
