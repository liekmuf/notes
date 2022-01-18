import "./index.css"
import { storage } from "./storage"

const minNameLength = 3
const minContentLength = 5

const newNodeButton = document.querySelector("#new-note-btn")
newNodeButton.addEventListener("click", () => {
    storage.addNote()
})
const saveButton = document.querySelector("#new-node-save")
const contentForm = document.querySelector("#note__content")

const nameForm = document.querySelector("#note__name")
console.log(nameForm)

contentForm.addEventListener("change", () => {
    saveButton.disabled = nameForm.value < minNameLength
})
nameForm.addEventListener("change", () => {
    saveButton.disabled = nameForm.value < minNameLength
})

const onPageLoaded = () => {
    storage.loadNotes()
    storage.updateSummary()
}
document.addEventListener("DOMContentLoaded", onPageLoaded)