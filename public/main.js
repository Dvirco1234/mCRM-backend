import { leadService } from './services/lead.service.local.js'
import { userService } from './services/user.service.js'
import { utilService } from './services/util.service.js'

console.log('Simple driver to test some API calls')

window.onLoadLeads = onLoadLeads
window.onLoadUsers = onLoadUsers
window.onAddLead = onAddLead
window.onGetLeadById = onGetLeadById
window.onRemoveLead = onRemoveLead
window.onAddLeadMsg = onAddLeadMsg

async function onLoadLeads() {
    const leads = await leadService.query()
    render('Leads', leads)
}
async function onLoadUsers() {
    const users = await userService.query()
    render('Users', users)
}

async function onGetLeadById() {
    const id = prompt('Lead id?')
    if (!id) return
    const lead = await leadService.getById(id)
    render('Lead', lead)
}

async function onRemoveLead() {
    const id = prompt('Lead id?')
    if (!id) return
    await leadService.remove(id)
    render('Removed Lead')
}

async function onAddLead() {
    await userService.login({ username: 'muki', password: '123' })
    const savedLead = await leadService.save(leadService.getEmptyLead())
    render('Saved Lead', savedLead)
}

async function onAddLeadMsg() {
    await userService.login({ username: 'muki', password: '123' })
    const id = prompt('Lead id?')
    if (!id) return

    const savedMsg = await leadService.addLeadMsg(id, 'some msg')
    render('Saved Msg', savedMsg)
}

function render(title, mix = '') {
    console.log(title, mix)
    const output = utilService.prettyJSON(mix)
    document.querySelector('h2').innerText = title
    document.querySelector('pre').innerHTML = output
}

