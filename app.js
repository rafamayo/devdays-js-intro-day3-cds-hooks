import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

import servicesController from './controllers/services.js'
import stepsController from './controllers/steps.js'

const app = express()
app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/cds-services/steps', stepsController)
app.use('/cds-services', servicesController)

export default app
