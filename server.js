const express = require('express');
const app = express()
const dotenv = require('dotenv')
const bodyParser = require('body-parser')

dotenv.config()

app.use(bodyParser)

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`server is running at ${PORT}`))
