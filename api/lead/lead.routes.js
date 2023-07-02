const express = require('express')
// const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
// const { log } = require('../../middlewares/logger.middleware')
const { getLeads, getLeadById, addLead, updateLead, removeLead, addLeadMsg, removeLeadMsg } = require('./lead.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getLeads)
router.get('/:id', getLeadById)
router.post('/', addLead)
router.put('/:id', updateLead)
router.delete('/:id', removeLead)
// router.post('/', requireAuth, addLead)
// router.put('/:id', requireAuth, updateLead)
// router.delete('/:id', requireAuth, removeLead)
// router.delete('/:id', requireAuth, requireAdmin, removeLead)

// router.post('/:id/msg', requireAuth, addLeadMsg)
// router.delete('/:id/msg/:msgId', requireAuth, removeLeadMsg)

module.exports = router