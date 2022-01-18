import { dateToText, getDatesFromText, generateId } from "./helpers"
import { initialState } from "./initialState"


class Storage {
    constructor(initialState = []) {
        this.notes = initialState
    }

    addNote() {
        document.querySelector("#new-note-colapse").style.display = "contents"
        const nameForm = document.querySelector("#note__name")
        const contentForm = document.querySelector("#note__content")
        const categoryForm = document.querySelector("#note__category")
        const saveButton = document.querySelector("#new-node-save")

        const id = generateId()
        const created = dateToText(new Date())
        const dates = getDatesFromText(contentForm.value)

        const onSaveClick = event => {
            event.preventDefault()
            this.saveNote(nameForm.value, created, categoryForm.value, contentForm.value, dates, id)
            const newNote = this.createNote(nameForm.value, created, categoryForm.value, contentForm.value, dates, id)
            nameForm.value = ""
            contentForm.value = ""
            document.querySelector("#new-note-colapse").style.display = "none"

            document.querySelector("#notes").appendChild(newNote)
            this.addListenersToNote(id)
        }
        saveButton.onclick = onSaveClick.bind(this)
    }

    saveNote(name, created, category, content, dates, id) {

        this.notes.push({
            id,
            name,
            created,
            category,
            content,
            dates,
            isActive: true
        })
        this.updateSummary()
    }
    createNote(name, created, category, content, dates, id) {
        const note = document.createElement("div")
        note.className = "row w-100 p-2 border border-secondaty pr-0 mb-2"
        note.id = id
        note.innerHTML = `<li class="row w-100 p-2">
        <div class="col-2 font-weight-bold"> ${name}</div>
        <div class="col-2">${created}</div>
        <div class="col-2">${category}</div>
        <div class="col-3"> ${content.slice(0, 24)} </div>
        <div class="col-2"> ${dates[0] || ""}</div>
        <div class="col-1">
            <img id="${id}-edit-btn" src="https://findicons.com/files/icons/2315/default_icon/128/pencil.png" class="note__button"></img>
            <img id="${id}-delete-btn" src="https://findicons.com/files/icons/2770/ios_7_icons/128/trash2.png" class="note__button"></img>
            <img id="${id}-archive-btn" src="https://findicons.com/files/icons/2711/free_icons_for_windows8_metro/128/archive2.png" class="note__button"></img>
        </div></li>`
        return note
    }


    addListenersToNote(id) {
        const deleteButton = document.getElementById(`${id}-delete-btn`)
        const deleteNote = (id) => {
            this.deleteNote(id)
            this.updateSummary()
        }
        deleteButton.addEventListener("click", () => {
            deleteNote.bind(this)(id)
        })

        const archiveButton = document.getElementById(`${id}-archive-btn`)
        const archiveNote = (id) => {
            this.archiveNote(id)
            this.updateSummary()
        }
        archiveButton.addEventListener("click", () => {
            archiveNote.bind(this)(id)
        })
        const editButton = document.getElementById(`${id}-edit-btn`)
        const editNote = this.setEditMode.bind(this)
        editButton.addEventListener("click", () => {
            editNote(id)
        })

    }
    deleteNote(id) {
        this.notes = this.notes.filter(note => note.id !== id)
        document.getElementById(id).remove()
    }
    archiveNote(id) {
        const note = this.getNoteById(id)
        const noteElement = document.getElementById(id)
        note.isActive = !note.isActive
        if (note.isActive) {
            document.querySelector("#notes").appendChild(noteElement)
        } else document.querySelector("#archive").appendChild(noteElement)

    }
    setEditMode(id) {
        document.querySelector("#new-note-colapse").style.display = "contents"
        const note = this.getNoteById(id)
        const nameForm = document.querySelector("#note__name")
        const contentForm = document.querySelector("#note__content")
        const categoryForm = document.querySelector("#note__category")
        nameForm.value = note.name
        contentForm.value = note.content
        categoryForm.value = note.category
        const saveButton = document.querySelector("#new-node-save")
        const onClick = () => {
            const oldNote = document.getElementById(id)
            const newNote = this.createNote(nameForm.value, note.created, categoryForm.value, contentForm.value, note.dates, id)
            oldNote.innerHTML = newNote.innerHTML
            this.addListenersToNote(id)
            nameForm.value = ""
            contentForm.value = ""
            document.querySelector("#new-note-colapse").style.display = "none"
        }
        saveButton.onclick = onClick.bind(this)
    }

    loadNotes() {
        this.notes.forEach(element => {
            const note = this.createNote(element.name, element.created, element.category, element.content, element.dates, element.id)
            if (element.isActive) {
                document.querySelector("#notes").appendChild(note)
            } else document.querySelector("#archive").appendChild(note)
            this.addListenersToNote(element.id)
        })
    }

    getNoteById(id) {
        for (let i = 0; i < this.notes.length; i++) {
            if (this.notes[i].id === id) return this.notes[i]
        }
        return null
    }

    getNotesCount(category, isActive) {
        return this.notes.filter(note => note.category === category)
            .filter(note => note.isActive === isActive).length
    }

    updateSummary() {
        document.querySelector("#task-active").innerHTML = `${storage.getNotesCount("Task", true)}`
        document.querySelector("#task-archived").innerHTML = `${storage.getNotesCount("Task", false)}`
        document.querySelector("#idea-active").innerHTML = `${storage.getNotesCount("Idea", true)}`
        document.querySelector("#idea-archived").innerHTML = `${storage.getNotesCount("Idea", false)}`
        document.querySelector("#thought-active").innerHTML = `${storage.getNotesCount("Random Thought", true)}`
        document.querySelector("#thought-archived").innerHTML = `${storage.getNotesCount("Random Thought", false)}`
    }

}
export const storage = new Storage(initialState)