const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy={txt:''}) {
    try {
        const criteria = {
            vendor: { $regex: filterBy.txt, $options: 'i' }
        }
        const collection = await dbService.getCollection('note')
        var leads = await collection.find(criteria).toArray()
        return leads
    } catch (err) {
        logger.error('cannot find leads', err)
        throw err
    }
}

async function getById(leadId) {
    try {
        const collection = await dbService.getCollection('lead')
        const lead = collection.findOne({ _id: ObjectId(leadId) })
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
        const leadToSave = {
            vendor: lead.vendor,
            price: lead.price
        }
        const collection = await dbService.getCollection('lead')
        await collection.updateOne({ _id: ObjectId(lead._id) }, { $set: leadToSave })
        return lead
    } catch (err) {
        logger.error(`cannot update lead ${leadId}`, err)
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
        await collection.updateOne({ _id: ObjectId(leadId) }, { $pull: { msgs: {id: msgId} } })
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
    addLeadMsg,
    removeLeadMsg
}
