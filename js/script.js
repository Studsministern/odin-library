/* Validations */
function validateForm(e) {
    e.preventDefault(); // Cancel submitting and refreshing the page

    if(form.checkValidity() && select.value !== 'null') {
        // Form is valid, add a new book
        const title = form.querySelector('#title').value;
        const author = form.querySelector('#author').value;
        const pages = form.querySelector('#pages').value;
        const status = (form.querySelector('#status').value === 'true') ? true : false; // Converts from string to Boolean

        const book = new Book(title, author, pages, status);
        addBookToLibrary(book);
        resetInputs();
        hideForm();
    } else {
        inputLabels.forEach(inputLabel => {
            const input = inputLabel.querySelector('input');
            
            if(!input.checkValidity()) {
                input.classList.add('error');
                input.classList.add('hasError');
            }
        });

        if(select.value === 'null') {
            select.classList.add('error');
        }
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
    inputLabels.forEach(inputLabel => {
        const input = inputLabel.querySelector('input');
        input.value = '';
        input.removeAttribute('class');
    });

    select.value = 'null';
    select.removeAttribute('class');
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

/* Show and hide form functions */
function showForm() {
    formContainer.classList.remove('hidden');
}

function hideForm() {
    formContainer.classList.add('hidden');
}

/* DOM variables */
const openFormButton = document.querySelector('.open-form');
const formContainer = document.querySelector('.form-container');
const form = document.querySelector('form');
const inputLabels = form.querySelectorAll('label.input-label');
const select = form.querySelector('label select');
const submitButton = form.querySelector('button[type="submit"]');
const cancelButton = form.querySelector('button.cancel');
form.noValidate = true; // Prevents submitting before validation

const bookList = document.querySelector('.book-list');

/* Variables */
let myLibrary = [];

/* Event listeners */
openFormButton.addEventListener('click', showForm);

inputLabels.forEach(inputLabel => {
    const input = inputLabel.querySelector('input');

    if(input.id === 'pages') {
        inputLabel.addEventListener('focusout', () => validatePagesLabelFocusOut(input));
        input.addEventListener('input', () => validatePagesInputChange(input));
    } else {
        inputLabel.addEventListener('focusout', () => validateLabelFocusOut(input));
        input.addEventListener('input', () => validateInputChange(input));
    }
});

select.addEventListener('change', () => {
    if(select.value === 'null') select.classList.add('error');
    else                        select.classList.remove('error');
});

submitButton.addEventListener('click', validateForm);

cancelButton.addEventListener('click', () => {
    resetInputs();
    hideForm();
});