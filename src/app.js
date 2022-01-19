import "./index.css"
import { storage } from "./storage"
import { reduceText } from "./helpers"

const createNote = (id, name, created, category, content, dates) => {
    const note = document.createElement("div")
    note.className = "row w-100 p-2 border border-secondaty pr-0 mb-2"
    note.id = id
    note.innerHTML = `<li class="row w-100 p-2">
    <div class="col-2 font-weight-bold"> ${name}</div>
    <div class="col-2">${created}</div>
    <div class="col-2">${category}</div>
    <div class="col-3"> ${reduceText(24)(content)} </div>
    <div class="col-2"> ${dates[0] || ""}</div>
    <div class="col-1">
        <img id="${id}-edit-btn" src="https://findicons.com/files/icons/2315/default_icon/128/pencil.png" class="note__button"></img>
        <img id="${id}-delete-btn" src="https://findicons.com/files/icons/2770/ios_7_icons/128/trash2.png" class="note__button"></img>
        <img id="${id}-archive-btn" src="https://findicons.com/files/icons/2711/free_icons_for_windows8_metro/128/archive2.png" class="note__button"></img>
    </div></li>`
    return note
}

const addNote = () => {
    document.querySelector("#new-note-colapse").style.display = "contents"
    const nameForm = document.querySelector("#note__name")
    const contentForm = document.querySelector("#note__content")
    const categoryForm = document.querySelector("#note__category")
    const saveButton = document.querySelector("#new-node-save")

    const onSaveClick = event => {
        event.preventDefault()
        const { id, name, created, category, content, dates, } = storage.saveNote(nameForm.value, categoryForm.value, contentForm.value)
        nameForm.value = ""
        contentForm.value = ""
        document.querySelector("#new-note-colapse").style.display = "none"
        document.querySelector("#notes").appendChild(createNote(id, name, created, category, content, dates))
        addListenersToNote(id)
        updateSummary()
    }
    saveButton.onclick = onSaveClick
}

document.querySelector("#new-note-btn").addEventListener("click", addNote)

const archiveNote = (id) => {
    const isActive = storage.archiveNote(id)
    const note = document.getElementById(id)
    if (isActive) {
        document.querySelector("#notes").appendChild(note)
    } else document.querySelector("#archive").appendChild(note)
    updateSummary()
}
const deleteNote = (id) => {
    storage.deleteNote(id)
    document.getElementById(id).remove()
    updateSummary()
}

const setEditMode = (id) => {
    document.querySelector("#new-note-colapse").style.display = "contents"
    const note = storage.getNoteById(id)
    const nameForm = document.querySelector("#note__name")
    const contentForm = document.querySelector("#note__content")
    const categoryForm = document.querySelector("#note__category")
    nameForm.value = note.name
    contentForm.value = note.content
    categoryForm.value = note.category
    const saveButton = document.querySelector("#new-node-save")
    const onClick = event => {
        event.preventDefault()
        const { name, created, category, content, dates, } = storage.editNote(id, nameForm.value, categoryForm.value, contentForm.value)
        const newNote = createNote(id, name, created, category, content, dates)
        const oldNote = document.getElementById(id)
        oldNote.innerHTML = newNote.innerHTML
        addListenersToNote(id)
        document.querySelector("#new-note-colapse").style.display = "none"
    }
    saveButton.onclick = onClick.bind(this)
}

const addListenersToNote = (id) => {
    document.getElementById(`${id}-delete-btn`).addEventListener("click", () => {
        deleteNote(id)
    })
    document.getElementById(`${id}-archive-btn`).addEventListener("click", () => {
        archiveNote(id)
    })
    document.getElementById(`${id}-edit-btn`).addEventListener("click", () => {
        setEditMode(id)
    })
}

const updateSummary = () => {
    document.querySelector("#task-active").innerHTML = `${storage.getNotesCount("Task", true)}`
    document.querySelector("#task-archived").innerHTML = `${storage.getNotesCount("Task", false)}`
    document.querySelector("#idea-active").innerHTML = `${storage.getNotesCount("Idea", true)}`
    document.querySelector("#idea-archived").innerHTML = `${storage.getNotesCount("Idea", false)}`
    document.querySelector("#thought-active").innerHTML = `${storage.getNotesCount("Random Thought", true)}`
    document.querySelector("#thought-archived").innerHTML = `${storage.getNotesCount("Random Thought", false)}`
}

const onPageLoaded = () => {
    storage.getNotes().forEach(
        element => {
            const note = createNote(element.id, element.name, element.created, element.category, element.content, element.dates)
            if (element.isActive) {
                document.querySelector("#notes").appendChild(note)
            } else document.querySelector("#archive").appendChild(note)
            addListenersToNote(element.id)
        })
    updateSummary()
}
document.addEventListener("DOMContentLoaded", onPageLoaded)