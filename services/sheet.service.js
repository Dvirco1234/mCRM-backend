const { google } = require('googleapis')

module.exports = {
    getSheet,
    updateSheet,
}

async function getSheet(rowStart = 3, rowEnd = 0) {
    try {
        const { auth, sheets, spreadsheetId } = await _authenticate()
        const sheetRows = await sheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: `Leads V3!A${rowStart}:Q${rowEnd || '10'}`,
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
            resource: { values: [newVal] }
    
        };
        const updatedCell = await sheets.spreadsheets.values.update(updateOptions);
        // console.log(updatedCell);

        return updatedCell
    } catch (err) {
        logger.error('Failed to connect to google sheets', err)
        throw err
    }
}

async function _authenticate() {
    const auth = new google.auth.GoogleAuth({
        keyFile: 'credentials.json',
        scopes: 'https://www.googleapis.com/auth/spreadsheets'
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