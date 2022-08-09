/* Validations */
function validateForm(e) {
    if(form.checkValidity()) {
        console.log('Prevent default');
        e.preventDefault(); // Cancel submit

        console.log('Adds a new book');
        // Form is valid, add a new book
        const title = form.querySelector('#title').value;
        const author = form.querySelector('#author').value;
        const pages = form.querySelector('#pages').value;
        const read = form.querySelector('#read').value;

        const book = new Book(title, author, pages, read);
        console.log(book);
        addBookToLibrary(book);
    } else {
        e.preventDefault(); // Cancel submit

        labels.forEach(label => {
            const input = label.querySelector('input');
            
            if(!input.checkValidity()) {
                input.classList.add('error');
                input.classList.add('hasError');
            }
        });

        if(confirmPassword.value !== password.value) {
            confirmPassword.classList.add('error');
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

/* Library functions */
function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.info = function() {
        return `${title} by ${author}, ${pages} pages, ${(read ? 'read' : 'not read yet')}.`;
    };
}

function addBookToLibrary(book) {
    console.log('Adds a book!');
    if(!(book instanceof Book)) {
        throw Error("Not a book!");
    }
    myLibrary.push(book);

    const bookElement = document.createElement('div');
    bookElement.classList.add('book');

    const bookTitle = document.createElement('p');
    bookTitle.classList.add('title');
    bookTitle.textContent = book.title;
    console.log(book.title);
    bookElement.appendChild(bookTitle);

    const bookAuthor = document.createElement('p');
    bookAuthor.classList.add('author');
    bookAuthor.textContent = book.author;
    console.log(book.author);
    bookElement.appendChild(bookAuthor);

    const bookPages = document.createElement('p');
    bookPages.classList.add('pages');
    bookPages.textContent = book.pages;
    console.log(book.pages);
    bookElement.appendChild(bookPages);

    const bookRead = document.createElement('p');
    bookRead.classList.add('read');
    bookRead.textContent = book.read;
    console.log(book.read);
    bookElement.appendChild(bookRead);

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
    label.addEventListener('focusout', () => validateLabelFocusOut(input));
    input.addEventListener('input', () => validateInputChange(input));
});

submit.addEventListener('click', validateForm);