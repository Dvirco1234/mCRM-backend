const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const { getSheet, updateSheet } = require('../../services/sheet.service')
const utilService = require('../../services/util.service')
const ObjectId = require('mongodb').ObjectId

const fieldsMap = {
    status: 'A',
    fullname: 'B',
    phone: 'C',
    email: 'D',
    createdAt: 'E',
    channel: 'F',
    source: 'G',
    beforeIntroStatus: 'H',
    blocker: 'I',
    afterIntroStatus: 'J',
    registrationStatus: 'K',
    lastContactBy: 'L',
    lastContactAt: 'M',
    lastContactMethod: 'N',
    contactLog: 'O',
    nextContactDate: 'P',
    nextContactTime: 'Q',
}

async function query(filterBy = { txt: '' }) {
    try {
        const sheet = await getSheet()
        // console.log('sheet: ', sheet)
        const leads = _prepData(sheet)
        return leads
    } catch (err) {
        logger.error('cannot find leads', err)
        throw err
    }
}

async function getById(leadId) {
    console.log('leadId: ', leadId)
    try {
        const sheet = await getSheet(leadId, leadId)
        const lead = _prepLeadFromRow(sheet.values[0], leadId)
        return lead
    } catch (err) {
        logger.error(`while finding lead ${leadId}`, err)
        throw err
    }
}

async function remove(leadId) {
    try {
        const collection = await dbService.getCollection('lead')
        await collection.deleteOne({ _id: ObjectId(leadId) })
        return leadId
    } catch (err) {
        logger.error(`cannot remove lead ${leadId}`, err)
        throw err
    }
}

async function add(lead) {
    try {
        const collection = await dbService.getCollection('lead')
        await collection.insertOne(lead)
        return lead
    } catch (err) {
        logger.error('cannot insert lead', err)
        throw err
    }
}

async function update(lead) {
    try {
        // const leadToSave = {
        //     vendor: lead.vendor,
        //     price: lead.price,
        // }
        // const collection = await dbService.getCollection('lead')
        // await collection.updateOne({ _id: ObjectId(lead._id) }, { $set: leadToSave })
        // return lead
    } catch (err) {
        // logger.error(`cannot update lead ${leadId}`, err)
        throw err
    }
}

async function updateByKey(id, key, value) {
    try {
        const res = await updateSheet(id, fieldsMap[key], value)
        // console.log('res: ', res);
        return await getById(id)
    } catch (err) {
        logger.error('Error updating note:', err)
        throw err
    }
}

async function addLeadMsg(leadId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('lead')
        await collection.updateOne({ _id: ObjectId(leadId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        logger.error(`cannot add lead msg ${leadId}`, err)
        throw err
    }
}

async function removeLeadMsg(leadId, msgId) {
    try {
        const collection = await dbService.getCollection('lead')
        await collection.updateOne({ _id: ObjectId(leadId) }, { $pull: { msgs: { id: msgId } } })
        return msgId
    } catch (err) {
        logger.error(`cannot add lead msg ${leadId}`, err)
        throw err
    }
}

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
    updateByKey,
    addLeadMsg,
    removeLeadMsg,
}

function _prepData({ values, range }) {
    // const fields = {
    //     'status': 'סטטוס' ,
    //     'fullname': 'שם מלא' ,
    //     'firstName': 'שם פרטי' ,
    //     'lastName': 'שם משפחה' ,
    //     'phone': 'טלפון' ,
    //     'email': 'אימייל' ,
    //     'leadManager': 'מנהל לקוח' ,
    //     'channel': "צ'אנל",
    //     'createdAt': 'תאריך כניסה',
    //     'message': 'הודעה' ,
    //     'contactLog': 'לוג שיחה' ,
    //     'source': 'מקור' ,
    //     'blocker': 'חסם פוטנציאלי' ,
    //     'lastContactMethod': 'אמצעי קשר אחרון' ,
    //     'lastContactBy': 'מי תקשר אחרון' ,
    //     'lastContactAt': 'תאריך תקשורת אחרון',
    //     'nextContactTime': 'זמן התקשרות הבא' ,
    //     'nextContactDate': 'תאריך התקשרות הבא',
    // }

    const rangeString = range.split('!')[1]
    const regex = /(\d+)/g
    const numbers = rangeString.match(regex)
    let rangeStart = parseInt(numbers[0])

    return values.map(row => {
        const lead = _prepLeadFromRow(row, rangeStart++)
        return lead
    })
}

function _prepLeadFromRow(row, rangeStart) {
    const fields = [
        'status',
        'fullname',
        // 'firstName' ,
        // 'lastName' ,
        'phone',
        'email',
        'createdAt',
        'channel',
        'source',
        'beforeIntroStatus',
        'blocker',
        'afterIntroStatus',
        'registrationStatus',
        // 'leadManager',
        'lastContactBy',
        'lastContactAt',
        'lastContactMethod',
        'contactLog',
        'nextContactDate',
        'nextContactTime',
        // 'message',
    ]
    const lead = {}
    fields.forEach((field, idx) => (lead[field] = row[idx]))
    lead._id = parseInt(rangeStart)
    
    lead.logs = row[14] ? row[14].split('\n') : []
    lead.logs = lead.logs.map(log => {
        const logDetails = log.split(' - ')
        if (logDetails.length === 1) {
            // if (logDetails[0].startWith('הודעה')) return { description: logDetails[0], type: 'message' }
            return { description: logDetails[0] }
        }
        return {
            createdAt: logDetails[0],
            manager: logDetails[1],
            description: logDetails[2],
            type: logDetails[3],
            status: logDetails[4],
            result: logDetails[5],
        }
    })


    lead.fullname = lead.fullname.trim()
    const names = lead.fullname.split(' ')
    lead.firstName = names[0]
    lead.lastName = names.length > 1 ? names.slice(1).join(' ').trim() : ''
    return lead
}
