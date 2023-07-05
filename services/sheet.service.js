const { google } = require('googleapis')

module.exports = {
    getSheet,
    updateSheet,
    getDatalists,
}

async function getSheet(rowStart = 3, rowEnd = 0) {
    try {
        const { auth, sheets, spreadsheetId } = await _authenticate()
        const sheetRows = await sheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: `Leads V3!A${rowStart}:Q${rowEnd || '50'}`,
        })
        return sheetRows.data
    } catch (err) {
        logger.error('Failed to connect to google sheets', err)
        throw err
    }
}

async function updateSheet(row = 3, cell = 'M', newVal = '') {
    // for dates - new Date().toLocaleDateString('en-GB')
    newVal = newVal instanceof Array ? newVal : [newVal]
    try {
        const { auth, sheets, spreadsheetId } = await _authenticate()

        const updateOptions = {
            auth,
            spreadsheetId,
            range: `Leads V3!${cell || 'A'}${row}:${cell || 'Q'}${row}`,
            valueInputOption: 'USER_ENTERED',
            resource: { values: [newVal] },
        }
        const updatedCell = await sheets.spreadsheets.values.update(updateOptions)
        // console.log(updatedCell);

        return updatedCell
    } catch (err) {
        logger.error('Failed to connect to google sheets', err)
        throw err
    }
}

async function getDatalists() {
    const listNames = [
        ['beforeIntroStatus', 'AW'],
        ['blocker', 'BJ'],
        ['afterIntroStatus', 'AY'],
        ['registrationStatus', 'BA'],
        ['lastContactMethod', 'BE'],
    ]
    const datalists = {}
    try {
        // console.time('QueryTime')
        // const beforeIntroStatus = await _getDatalist('AW')
        // const blocker = await _getDatalist('BJ')
        // const afterIntroStatus = await _getDatalist('AY')
        // const registrationStatus = await _getDatalist('BA')
        // const lastContactMethod = await _getDatalist('BE')
        // console.timeEnd('QueryTime')
        // const res = await Promise.all([beforeIntroStatus, afterIntroStatus, registrationStatus, blocker, lastContactMethod])
        // return { beforeIntroStatus, blocker, afterIntroStatus, registrationStatus, lastContactMethod }
        // console.time('QueryTime')
        const prms = listNames.map(name => _getDatalist(name[1]))
        const res = await Promise.all(prms)
        res.forEach((list, idx) => (datalists[listNames[idx][0]] = list))
        // console.timeEnd('QueryTime')
        return datalists
    } catch (err) {
        logger.error('Failed to connect to google sheets', err)
        throw err
    }
}

async function _getDatalist(col) {
    try {
        const { auth, sheets, spreadsheetId } = await _authenticate()
        const options = await sheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: `Leads V3!${col}3:${col}`,
        })
        return options.data.values.filter(arr => arr.length).map(arr => arr[0])
    } catch (err) {
        logger.error('Failed to connect to google sheets', err)
        throw err
    }
}

async function _authenticate() {
    const auth = new google.auth.GoogleAuth({
        keyFile: 'credentials.json',
        scopes: 'https://www.googleapis.com/auth/spreadsheets',
    })

    try {
        const client = await auth.getClient()
        const sheets = google.sheets({ version: 'v4', auth: client })
        const spreadsheetId = process.env.SHEET_ID

        return { auth, sheets, spreadsheetId }
    } catch (err) {
        logger.error('Failed to connect to google sheets', err)
        throw err
    }
}
// async function getSheet(rowStart = 3, rowEnd = 0) {
//     const auth = new google.auth.GoogleAuth({
//         keyFile: 'credentials.json',
//         scopes: 'https://www.googleapis.com/auth/spreadsheets'
//     })

//     try {
//         const client = await auth.getClient()
//         const sheets = google.sheets({ version: 'v4', auth: client })

//         const spreadsheetId = process.env.SHEET_ID
//         const sheetRows = await sheets.spreadsheets.values.get({
//             auth,
//             spreadsheetId,
//             // range: 'Leads V3!A3:Q5',
//             range: `Leads V3!A${rowStart}:Q${rowEnd || '10'}`,

//         })
//         return sheetRows.data
//     } catch (err) {
//         logger.error('Failed to connect to google sheets', err)
//         throw err
//     }
// }
