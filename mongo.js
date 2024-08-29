const mongoose = require('mongoose')


const password = process.argv[2]
const nameParam = process.argv[3]
const numberParam = process.argv[4]


const url =
  `mongodb+srv://anniauroraa:${password}@cluster0.7ddunga.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const entrySchema = new mongoose.Schema({
  name: String,
  number: String
})

const Entry = mongoose.model('Entry', entrySchema)

if (process.argv.length == 3) {
  console.log('phonebook:')
  Entry
    .find({})
    .then(persons => {
      persons.forEach(entry => {
        console.log(entry.name + ' ' + entry.number)
      mongoose.connection.close()
  })
  process.exit(1)
})
}
else if (process.argv.length < 5) {
  console.log('Please provide the password, name and number as arguments: node mongo.js <password> <name> <number>')
  process.exit(1)
}
else {

  const entry = new Entry({
    name: nameParam,
    number: numberParam
  })

  entry.save().then(result => {
    console.log('added ' + result.name + ' number ' + result.number + ' to phonebook')
    mongoose.connection.close()
  })

}

