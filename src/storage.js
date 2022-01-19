import { dateToText, getDatesFromText, generateId } from "./helpers"
import { initialState } from "./initialState"


class Storage {
    constructor(initialState = []) {
        this.notes = initialState
    }

    saveNote(name, category, content) {
        const dates = getDatesFromText(content)
        const id = generateId()
        const created = dateToText(new Date())
        const newNote = {
            id,
            name,
            created,
            category,
            content,
            dates,
            isActive: true
        }
        this.notes.push(newNote)
        return newNote
    }
    deleteNote(id) {
        this.notes = this.notes.filter(note => note.id !== id)
    }

    archiveNote(id) {
        const note = this.getNoteById(id)
        note.isActive = !note.isActive
        return note.isActive
    }
    editNote(id, name, category, content) {
        this.notes = this.notes.map(note => {
            if (note.id === id) return {
                ...note,
                dates: getDatesFromText(content),
                name,
                category,
                content
            }
            else return note
        })
        return this.getNoteById(id)
    }
    getNotes() {
        return this.notes
    }

    getNoteById(id) {
        return this.notes.find(note => note.id === id)
    }

    getNotesCount(category, isActive) {
        return this.notes.filter(note => note.category === category)
            .filter(note => note.isActive === isActive).length
    }
}
export const storage = new Storage(initialState)