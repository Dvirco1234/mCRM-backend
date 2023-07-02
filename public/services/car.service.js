
// import { storageService } from './async-storage.service.js'
import { httpService } from './http.service.js'
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
    return httpService.get(STORAGE_KEY, filterBy)

    // var leads = await storageService.query(STORAGE_KEY)
    // if (filterBy.txt) {
    //     const regex = new RegExp(filterBy.txt, 'i')
    //     leads = leads.filter(lead => regex.test(lead.vendor) || regex.test(lead.description))
    // }
    // if (filterBy.price) {
    //     leads = leads.filter(lead => lead.price <= filterBy.price)
    // }
    // return leads

}
function getById(leadId) {
    // return storageService.get(STORAGE_KEY, leadId)
    return httpService.get(`lead/${leadId}`)
}

async function remove(leadId) {
    // await storageService.remove(STORAGE_KEY, leadId)
    return httpService.delete(`lead/${leadId}`)
}
async function save(lead) {
    var savedLead
    if (lead._id) {
        // savedLead = await storageService.put(STORAGE_KEY, lead)
        savedLead = await httpService.put(`lead/${lead._id}`, lead)

    } else {
        // Later, owner is set by the backend
        // lead.owner = userService.getLoggedinUser()
        // savedLead = await storageService.post(STORAGE_KEY, lead)
        savedLead = await httpService.post('lead', lead)
    }
    return savedLead
}

async function addLeadMsg(leadId, txt) {
    // const lead = await getById(leadId)
    // if (!lead.msgs) lead.msgs = []

    // const msg = {
    //     id: utilService.makeId(),
    //     by: userService.getLoggedinUser(),
    //     txt
    // }
    // lead.msgs.push(msg)
    // await storageService.put(STORAGE_KEY, lead)    
    const savedMsg = await httpService.post(`lead/${leadId}/msg`, {txt})
    return savedMsg
}


function getEmptyLead() {
    return {
        vendor: 'Susita-' + (Date.now() % 1000),
        price: utilService.getRandomIntInclusive(1000, 9000),
    }
}





