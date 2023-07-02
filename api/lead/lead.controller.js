const leadService = require('./lead.service.js')

const logger = require('../../services/logger.service.js')

async function getLeads(req, res) {
  try {
    logger.debug('Getting Leads')
    const filterBy = {
      txt: req.query.txt || ''
    }
    const leads = await leadService.query(filterBy)
    res.json(leads)
  } catch (err) {
    logger.error('Failed to get leads', err)
    res.status(500).send({ err: 'Failed to get leads' })
  }
}

async function getLeadById(req, res) {
  try {
    const leadId = req.params.id
    const lead = await leadService.getById(leadId)
    res.json(lead)
  } catch (err) {
    logger.error('Failed to get lead', err)
    res.status(500).send({ err: 'Failed to get lead' })
  }
}

async function addLead(req, res) {
  const {loggedinUser} = req

  try {
    const lead = req.body
    lead.owner = loggedinUser
    const addedLead = await leadService.add(lead)
    res.json(addedLead)
  } catch (err) {
    logger.error('Failed to add lead', err)
    res.status(500).send({ err: 'Failed to add lead' })
  }
}


async function updateLead(req, res) {
  try {
    const lead = req.body
    const updatedLead = await leadService.update(lead)
    res.json(updatedLead)
  } catch (err) {
    logger.error('Failed to update lead', err)
    res.status(500).send({ err: 'Failed to update lead' })

  }
}

async function removeLead(req, res) {
  try {
    const leadId = req.params.id
    const removedId = await leadService.remove(leadId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove lead', err)
    res.status(500).send({ err: 'Failed to remove lead' })
  }
}

async function addLeadMsg(req, res) {
  const {loggedinUser} = req
  try {
    const leadId = req.params.id
    const msg = {
      txt: req.body.txt,
      by: loggedinUser
    }
    const savedMsg = await leadService.addLeadMsg(leadId, msg)
    res.json(savedMsg)
  } catch (err) {
    logger.error('Failed to update lead', err)
    res.status(500).send({ err: 'Failed to update lead' })

  }
}

async function removeLeadMsg(req, res) {
  const {loggedinUser} = req
  try {
    const leadId = req.params.id
    const {msgId} = req.params

    const removedId = await leadService.removeLeadMsg(leadId, msgId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove lead msg', err)
    res.status(500).send({ err: 'Failed to remove lead msg' })

  }
}

module.exports = {
  getLeads,
  getLeadById,
  addLead,
  updateLead,
  removeLead,
  addLeadMsg,
  removeLeadMsg
}
