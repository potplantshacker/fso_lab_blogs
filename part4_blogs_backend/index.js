const config = require('./utils/config')
const app = require('./App') // the actual Express application
const logger = require('./utils/logger')
const supertest = require('supertest')

const api = supertest(app)


app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})