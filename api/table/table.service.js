const { getDatalists } = require('../../services/sheet.service')
const logger = require('../../services/logger.service')

async function getTableDatalists(filterBy = { txt: '' }) {
    try {
        return await getDatalists()
    } catch (err) {
        logger.error('cannot find leads', err)
        throw err
    }
}


module.exports = {
    getTableDatalists,
}