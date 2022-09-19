let agenda = null

function set_agenda_instance(instance){
    agenda = instance
}

function get_agenda_instance(){
    return agenda
}

module.exports = {
    set_agenda_instance, get_agenda_instance
}