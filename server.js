const express = require('express');
const app = express()
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')

dotenv.config()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/src/templates'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use("/", require('./src/routes'))

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('mongoDB connected'))
.catch((err) => console.log(err.message))

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`server is running at ${PORT}`))
