
// QuickNotes API Client

const API_URL = "https://jsonplaceholder.typicode.com/posts";

// Get elements from the HTML page
const loadButton = document.getElementById("load-btn");
const noteForm = document.getElementById("note-form");
const titleInput = document.getElementById("title-input");
const bodyInput = document.getElementById("body-input");
const submitButton = document.getElementById("submit-btn");
const notesList = document.getElementById("notes-list");
const statusMessage = document.getElementById("status");

// Reusable function for making API requests
async function request(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    if (response.status === 204) {
        return { data: null, status: response.status };
    }

    const data = await response.json();

    return {
        data: data,
        status: response.status
    };
}

// Display status messages
function setStatus(message, type = "") {
    statusMessage.textContent = message;
    statusMessage.className = type;
}

// Create a note element safely using textContent
function createNoteElement(note) {
    const listItem = document.createElement("li");

    const title = document.createElement("h3");
    title.textContent = note.title;

    const body = document.createElement("p");
    body.textContent = note.body || "No note body provided.";

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-btn";
    deleteButton.type = "button";

    deleteButton.addEventListener("click", function () {
        deleteNote(note.id, listItem, deleteButton);
    });

    listItem.appendChild(title);
    listItem.appendChild(body);
    listItem.appendChild(deleteButton);

    return listItem;
}

// Display an empty-state message
function showEmptyState() {
    notesList.textContent = "";

    const emptyItem = document.createElement("li");
    emptyItem.textContent = "No notes available. Create your first note!";

    notesList.appendChild(emptyItem);
}

// TASK 1: GET - Load 10 notes
async function loadNotes() {
    loadButton.disabled = true;
    setStatus("Loading notes...");

    try {
        const result = await request(`${API_URL}?_limit=10`);

        notesList.textContent = "";

        if (result.data.length === 0) {
            showEmptyState();
            setStatus("No notes found.", "success");
            return;
        }

        result.data.forEach(function (note) {
            const noteElement = createNoteElement(note);
            notesList.appendChild(noteElement);
        });

        setStatus(
            `Loaded ${result.data.length} notes from the server.`,
            "success"
        );

    } catch (error) {
        setStatus(
            "Sorry, we could not load your notes. Please try again.",
            "error"
        );

        console.error("Loading error:", error);

    } finally {
        loadButton.disabled = false;
    }
}

// TASK 2: POST - Create a new note
async function createNote(event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    // Validate the note title
    if (!title) {
        setStatus("Please enter a note title.", "error");
        titleInput.focus();
        return;
    }

    if (title.length > 100) {
        setStatus(
            "The title must not exceed 100 characters.",
            "error"
        );
        titleInput.focus();
        return;
    }

    submitButton.disabled = true;
    setStatus("Creating your note...");

    try {
        const result = await request(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                body: body,
                userId: 1
            })
        });

        const newNote = result.data;

        const noteElement = createNoteElement(newNote);

        // Add the newly created note to the top of the list
        notesList.prepend(noteElement);

        // Remove the empty-state message if it is displayed
        const firstItem = notesList.firstElementChild;

        if (
            notesList.children.length > 1 &&
            firstItem.textContent.includes("No notes available")
        ) {
            firstItem.remove();
        }

        setStatus(
            `Note created (status ${result.status}, id ${newNote.id}).`,
            "success"
        );

        noteForm.reset();

    } catch (error) {
        setStatus(
            "Sorry, we could not create your note. Please try again.",
            "error"
        );

        console.error("Creating error:", error);

    } finally {
        submitButton.disabled = false;
    }
}

// TASK 3: DELETE - Remove a note
async function deleteNote(noteId, listItem, deleteButton) {
    deleteButton.disabled = true;
    setStatus("Deleting note...");

    try {
        await request(`${API_URL}/${noteId}`, {
            method: "DELETE"
        });

        // JSONPlaceholder simulates DELETE requests.
        // It does not permanently store or delete notes on its server.
        // We therefore remove the note from the current page after success.
        listItem.remove();

        if (notesList.children.length === 0) {
            showEmptyState();
        }

        setStatus("Note deleted successfully.", "success");

    } catch (error) {
        setStatus(
            "Sorry, we could not delete this note. Please try again.",
            "error"
        );

        console.error("Deleting error:", error);

    } finally {
        deleteButton.disabled = false;
    }
}

// Connect the buttons and form to their functions
loadButton.addEventListener("click", loadNotes);
noteForm.addEventListener("submit", createNote);
