'use strict';

const defaultBook1 = new Book("The Fellowship of the Ring", "J. R. R. Tolkien", 479, "Read");
const defaultBook2 = new Book("The Two Towers", "J. R. R. Tolkien", 352, "Read");
let library = [defaultBook1, defaultBook2];

function Book(title, author, pages, isRead) {
    this.title = title
    this.author = author
    this.pages = pages
    this.isRead = isRead
}

function addBookToLibrary(book) {
    library.push(book);
}

function updateTable() {

}

function toggleBookForm() {
    let bookForm = document.getElementById("new-book-form");
    let newBookBtn = document.getElementById("new-book-btn");
    console.log(bookForm.style.display);
    console.log(bookForm);
    if (bookForm.style.display === "none") {
        bookForm.style.display = "grid";
        newBookBtn.textContent = "Hide Form"
    } else {
        bookForm.style.display = "none";
        newBookBtn.textContent = "New Book";
    }
}

// use SetHTML() to sanitize the text before insertion
// when inserting plain text, use Node.textContent