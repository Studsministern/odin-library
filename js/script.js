/* Validations */
function validateForm(e) {
    e.preventDefault(); // Cancel submitting and refreshing the page

    if(form.checkValidity()) {
        // Form is valid, add a new book
        const title = form.querySelector('#title').value;
        const author = form.querySelector('#author').value;
        const pages = form.querySelector('#pages').value;
        const status = form.querySelector('#status').checked;

        const book = new Book(title, author, pages, status);
        addBookToLibrary(book);
        resetInputs();
    } else {
        labels.forEach(label => {
            const input = label.querySelector('input');
            
            if(!input.checkValidity()) {
                input.classList.add('error');
                input.classList.add('hasError');
            }
        });
    }
}

function validateLabelFocusOut(input) {
    if(input.checkValidity()) {
        input.classList.remove('hasError'); // Resets to lazy validation
    } else if(input.value !== '' && !input.checkValidity()) {
        input.classList.add('error');
        input.classList.add('hasError');    // Activates aggressive validation
    }
}

function validateInputChange(input) { // Aggressive validation on every button press
    if(input.className.includes('hasError')) {
        if(input.checkValidity()) {
            input.classList.remove('error');
        } else {
            input.classList.add('error');
        }
    }
}

function validatePagesLabelFocusOut(input) { // Version of validateLabelFocusOut but for #pages
    if(checkPagesValidity(input)) {
        input.classList.remove('hasError');
    } else if(input.value !== '' && !checkPagesValidity(input)) {
        input.classList.add('error');
        input.classList.add('hasError');
    }
}

function validatePagesInputChange(input) { // Version of validateInputChange but for #pages
    if(input.className.includes('hasError')) {
        if(checkPagesValidity(input)) {
            input.classList.remove('error');
        } else {
            input.classList.add('error');
        }
    }
}

function checkPagesValidity(input) {
    return /^[1-9]\d*$/.test(input.value); // RegExp testing
}

function resetInputs() {
    labels.forEach(label => {
        const input = label.querySelector('input');
        input.value = '';
        input.removeAttribute('class');
        input.checked = false;
    });
}

/* Library functions */
function Book(title, author, pages, status) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
    this.info = function() {
        return `${title} by ${author}, ${pages} pages, ${(status ? 'read' : 'not read yet')}.`;
    };
}

function addBookToLibrary(book) {
    if(!(book instanceof Book)) {
        throw Error("Not a book!");
    }
    myLibrary.push(book);

    const bookElement = document.createElement('div');
    bookElement.classList.add('book');

    const bookTitle = document.createElement('p');
    bookTitle.classList.add('title');
    bookTitle.textContent = book.title;
    bookElement.appendChild(bookTitle);

    const bookAuthor = document.createElement('p');
    bookAuthor.classList.add('author');
    bookAuthor.textContent = book.author;
    bookElement.appendChild(bookAuthor);

    const bookPages = document.createElement('p');
    bookPages.classList.add('pages');
    bookPages.textContent = book.pages;
    bookElement.appendChild(bookPages);

    const bookStatus = document.createElement('p');
    bookStatus.classList.add('status');
    bookStatus.textContent = book.status ? 'Read' : 'Not read';
    bookElement.appendChild(bookStatus);

    bookList.appendChild(bookElement);
}

/* DOM variables */
const form = document.querySelector('form');
const labels = form.querySelectorAll('label');
const submit = form.querySelector('[type="submit"]');
form.noValidate = true; // Prevents submitting before validation

const bookList = document.querySelector('.book-list');

/* Variables */
let myLibrary = [];

/* Event listeners */
labels.forEach(label => {
    const input = label.querySelector('input');

    if(input.id !== 'pages') {
        label.addEventListener('focusout', () => validateLabelFocusOut(input));
        input.addEventListener('input', () => validateInputChange(input));
    } else {
        label.addEventListener('focusout', () => validatePagesLabelFocusOut(input));
        input.addEventListener('input', () => validatePagesInputChange(input));
    }
});

submit.addEventListener('click', validateForm);