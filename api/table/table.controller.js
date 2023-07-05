const tableService = require('./table.service.js')

const logger = require('../../services/logger.service.js')

async function getDatalists(req, res) {
  try {
    const datalists = await tableService.getTableDatalists()
    res.json(datalists)
  } catch (err) {
    logger.error('Failed to get datalists', err)
    res.status(500).send({ err: 'Failed to get datalists' })
  }
}

module.exports = {
  getDatalists,
}
