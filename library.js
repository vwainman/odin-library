'use strict';

const MIN_PAGES = 1;
const MAX_PAGES = 99999;
const TABLE_ID = "library";
const ROW_DATA_ATTR_NAME = "data-index-number";
const REQUIRED_INPUT_IDS = ["title", "author", "pages"]
const defaultBook1 = new Book("The Fellowship of the Ring", "J. R. R. Tolkien", 479, "Read");
const defaultBook2 = new Book("The Two Towers", "J. R. R. Tolkien", 352, "Read");
const library = [];
addBookToLibrary(defaultBook1);
addBookToLibrary(defaultBook2);
const bookForm = document.querySelector("#new-book-form");
const newBookBtn = document.querySelector("#new-book-btn");
newBookBtn.onclick = toggleBookForm;

function Book(title, author, pages, isRead) {
    this.title = title
    this.author = author
    this.pages = pages
    this.status = isRead ? "Read" : "Not Read";
}

function addBookToLibrary(book) {
    insertHTMLTableRow(book, library.length);
    library.push(book);
}

function insertHTMLTableRow(object, index) {
    const tbody = document.getElementById(TABLE_ID).getElementsByTagName('tbody')[0];
    const row = tbody.insertRow(index);
    row.setAttribute(ROW_DATA_ATTR_NAME, index);
    insertSanitizedRowCells(row, object);
}

function insertSanitizedRowCells(row, object) {
    // normal input value cells to insert
    for (const key of REQUIRED_INPUT_IDS) {
        const td = row.insertCell(-1);
        td.setHTML(object[key]);
    }
    // modified status and remove button cells to insert with tied events
    appendButtonCell(row, object["status"], "book-status", toggleReadStatus);
    appendButtonCell(row, "Remove", "delete-book", removeBook);
}

function appendButtonCell(row, text, classValue, onclickEvent) {
    const td = row.insertCell(-1);
    const btn = document.createElement("button");
    btn.setAttribute("class", classValue);
    btn.textContent = `${text}`;
    btn.onclick = onclickEvent;
    td.append(btn);
}

// remove the selected book from the libary
function removeBook() {
    const bookRow = this.closest('tr');
    const rowIndex = Number(bookRow.dataset.indexNumber);
    // update the html table and library array
    library.splice(rowIndex, 1);
    const tbody = document.getElementById(TABLE_ID).getElementsByTagName('tbody')[0];
    tbody.deleteRow(rowIndex);
    // very inefficient update to the data index number
    // we could cascade updates from the position of the deleted element instead
    // TODO: refactor
    for (let i = 0, row; row = tbody.rows[i]; i++) {
        row.setAttribute(ROW_DATA_ATTR_NAME, i);
    }

}
// toggle the read status on the selected book
function toggleReadStatus() {
    const rowIndex = this.closest('tr').dataset.indexNumber;
    const newStatus = (this.textContent === "Read") ? "Not Read" : "Read";
    library[rowIndex].status = newStatus;
    this.textContent = newStatus;
}

// show/hide new book form
function toggleBookForm() {
    let bookForm = document.getElementById("new-book-form");
    let newBookBtn = document.getElementById("new-book-btn");
    if (bookForm.style.display === "none") {
        bookForm.style.display = "grid";
        newBookBtn.textContent = "Hide Form"
    } else {
        bookForm.style.display = "none";
        newBookBtn.textContent = "New Book";
    }
}


function hasNonEmptyString(input) {
    return (typeof input === "string" && input.trim() !== "")
}

function hasNumberBetween(input, min, max) {
    return (typeof input === "number" && input >= min && input <= max);
}

function hasBool(value) {
    return typeof value === "boolean";
}

// form validation and data handling
bookForm.addEventListener("submit", (e) => {
    // stop form submission
    e.preventDefault();
    // validate form elements
    const title = bookForm["title"].value;
    const titleValid = hasNonEmptyString(title);
    const author = bookForm["author"].value;
    const authorValid = hasNonEmptyString(author);
    const pages = Number(bookForm["pages"].value);
    const pagesValid = hasNumberBetween(pages, MIN_PAGES, MAX_PAGES);
    const read = bookForm["read"].checked;
    const readValid = hasBool(read);
    if (titleValid && authorValid && pagesValid && readValid) {
        // create and add book to library on valid inputs
        const newBook = new Book(title, author, pages, read);
        addBookToLibrary(newBook);
    } else {
        alert("Invalid input");
    }
});
