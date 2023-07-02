
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'

const STORAGE_KEY = 'lead'

export const leadService = {
    query,
    getById,
    save,
    remove,
    getEmptyLead,
    addLeadMsg
}
window.cs = leadService


async function query(filterBy = { txt: '', price: 0 }) {
    var leads = await storageService.query(STORAGE_KEY)
    if (filterBy.txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        leads = leads.filter(lead => regex.test(lead.vendor) || regex.test(lead.description))
    }
    if (filterBy.price) {
        leads = leads.filter(lead => lead.price <= filterBy.price)
    }
    return leads
}

function getById(leadId) {
    return storageService.get(STORAGE_KEY, leadId)
}

async function remove(leadId) {
    await storageService.remove(STORAGE_KEY, leadId)
}

async function save(lead) {
    var savedLead
    if (lead._id) {
        savedLead = await storageService.put(STORAGE_KEY, lead)
    } else {
        // Later, owner is set by the backend
        lead.owner = userService.getLoggedinUser()
        savedLead = await storageService.post(STORAGE_KEY, lead)
    }
    return savedLead
}

async function addLeadMsg(leadId, txt) {
    // Later, this is all done by the backend
    const lead = await getById(leadId)
    if (!lead.msgs) lead.msgs = []

    const msg = {
        id: utilService.makeId(),
        by: userService.getLoggedinUser(),
        txt
    }
    lead.msgs.push(msg)
    await storageService.put(STORAGE_KEY, lead)

    return msg
}

function getEmptyLead() {
    return {
        vendor: 'Susita-' + (Date.now() % 1000),
        price: utilService.getRandomIntInclusive(1000, 9000),
    }
}


// TEST DATA
// storageService.post(STORAGE_KEY, {vendor: 'Subali Rahok 2', price: 980}).then(x => console.log(x))




