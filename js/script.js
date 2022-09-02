/* Validations */
function validateForm(e) {
    e.preventDefault(); // Cancel submitting and refreshing the page

    if(form.checkValidity() && select.value !== 'null') {
        // Form is valid, add a new book
        const title = form.querySelector('#title');
        const author = form.querySelector('#author');
        const pages = form.querySelector('#pages');
        const status = form.querySelector('#status'); 

        const book = new Book(
            title.value, 
            author.value, 
            pages.value, 
            ((status.value === 'true') ? true : false) // Converts from string to Boolean
        );

        if(existsIdenticalTitle(title.value)) {
            title.classList.add('copy-error');
        } else {
            addBook(book)
            resetInputs();
            hideForm();
        }
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
    } else if(input.value === '' || !input.checkValidity()) {
        input.classList.add('error');
        input.classList.add('hasError');    // Activates aggressive validation
    }

    if(input.id === 'title') {
        if(existsIdenticalTitle(input.value)) {
            input.classList.add('copy-error');
            input.classList.add('hasError');
        } else if(input.checkValidity()){ // Only removes hasError if both checks are correct
            input.classList.remove('hasError');
        }                                 
    }

    if(input.id === 'pages') {
        if(checkPagesValidity(input.value) && input.checkValidity()) { // Only removes hasError if both checks are correct
            input.classList.remove('hasError');
        } else if(!checkPagesValidity(input.value)) {
            input.classList.add('error');
            input.classList.add('hasError');
        }
    }
}

function validateInputChange(input) { // Aggressive validation on every button press
    if(input.className.includes('hasError')) {
        if(input.checkValidity()) {
            input.classList.remove('error');
        } else {
            input.classList.add('error');
        }
        
        if(input.id === 'title') {
            if(existsIdenticalTitle(input.value)) {
                input.classList.add('copy-error');
            } else {
                input.classList.remove('copy-error');
            }
        }

        if(input.id === 'pages') {
            if(checkPagesValidity(input.value)) {
                input.classList.remove('error');
            } else {
                input.classList.add('error');
            }
        }
    }
}

function existsIdenticalTitle(title) {
    if (library.some(e => e.title.toLowerCase() === title.toLowerCase())) {
        /* library already contains book with the same title (case insensitive) */
        return true;
    }
    return false;
}

function checkPagesValidity(pages) {
    return /^[1-9]\d*$/.test(pages); // RegExp testing
}



/* Library functions */
function addBook(book) {
    if(!(book instanceof Book)) {
        throw Error("Not a book!");
    }
    library.push(book);
    displayBook(book);
}

function displayBook(book) {
    bookList.insertAdjacentHTML('beforeEnd', book.htmlMarkup);

    const statusButton = bookList.querySelector(':last-child > .status > button'); // Find the recently added status button
    statusButton.addEventListener('click', () => {                                 // Toggle status and update textContent on click
        book.toggleStatus();
        statusButton.textContent = (book.status) ? 'Read' : 'Not read';
    });

    const removeButton = bookList.querySelector(':last-child > .remove > button'); // Find the recently added remove button
    removeButton.addEventListener('click', () => {                                 // Ask the user to confirm, and remove the book if accepted
        if(confirm(`Are you sure you want to remove ${book.title}?`)) {
            removeBook(book);
        }
    });
}

function displayBookList() {
    /* Clears the list */
    bookList.querySelectorAll('.book').forEach(book => book.remove());
    
    /* Readds the elements */
    library.forEach(book => displayBook(book));
}

function removeBook(book) {
    if(!(book instanceof Book)) {
        throw Error("Not a book!");
    }
    
    // Remove from library
    for(let i = 0; i < library.length; i++) {
        if(library[i].title === book.title) {
            library.splice(i, 1);
            break; // Unique titles means only one has to be removed
        }
    }

    // Remove from DOM
    bookList.querySelector(`.book[title="${book.title}"]`).remove();
}

function sortList(header) {
    switch(header.dataset.header) {
        case 'author':
            library.sort((b1, b2) => {
                a1 = b1.author.toLowerCase();
                a2 = b2.author.toLowerCase();
                if(a1 !== a2) {
                    return (a1 > a2) ? 1 : -1;
                }
                return sortByTitle(); 
            });
            break;
        case 'status':
            library.sort((b1, b2) => {
                s1 = b1.status;
                s2 = b2.status;
                if(s1 !== s2) {
                    return (s1 > s2) ? 1 : -1;
                }
                return sortByTitle(b1, b2);
            });
            break;
        case 'pages':
            library.sort((b1, b2) => {
                p1 = +b1.pages;
                p2 = +b2.pages;
                if(p1 !== p2) {
                    return (p1 > p2) ? 1 : -1;
                }
                return sortByTitle(b1, b2);
            });
            break;
        case 'title':
            library.sort((b1, b2) => sortByTitle(b1, b2));
            break;
        default:
            console.log('Something went wrong!')
    }

    displayBookList();
}

function sortByTitle(b1, b2) {
    return (b1.title.toLowerCase() > b2.title.toLowerCase()) ? 1 : -1; 
}



/* Book class */
class Book {
    constructor(title, author, pages, status) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.status = status;
        this.htmlMarkup = `
                      <div class="book" title="${this.title}">
                          <p class="title">${this.title}</p>
                          <p class="author">${this.author}</p>
                        <p class="pages">${this.pages}</p>
                        <div class="status">
                              <button>${this.status ? 'Read' : 'Not read'}</button>
                          </div>
                          <div class="remove">
                              <button>x</button>
                          </div>
                      </div>
                      `;
    }

    toggleStatus() {
        this.status = !this.status;
    }
}



/* Form functions */
function showForm() {
    formContainer.classList.remove('hidden');
}

function hideForm() {
    formContainer.classList.add('hidden');
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



/* DOM variables */
const bookList = document.querySelector('.book-list');

const listHeaders = document.querySelectorAll('.list-headers div[data-header]');
const openFormButton = document.querySelector('.open-form');

const formContainer = document.querySelector('.form-container');
const form = document.querySelector('form');
const inputLabels = form.querySelectorAll('label.input-label');
const select = form.querySelector('label select');
const submitButton = form.querySelector('button[type="submit"]');
const closeButton = form.querySelector('button.close');
form.noValidate = true; // Prevents submitting before validation



/* Variables */
let library = [];
addBook(new Book('The Intelligent Investor', 'Benjamin Graham', '587', false));
addBook(new Book('The Art of War', 'Sun Tzu', '160', true));
addBook(new Book('Sapiens', 'Yuval Noah Harari', '431', true));



/* Event listeners */
listHeaders.forEach(header => {
    header.addEventListener('click', () => sortList(header));
});

openFormButton.addEventListener('click', showForm);

inputLabels.forEach(inputLabel => {
    const input = inputLabel.querySelector('input');
    
    inputLabel.addEventListener('focusout', () => validateLabelFocusOut(input));
    input.addEventListener('input', () => validateInputChange(input));
});

select.addEventListener('change', () => {
    if(select.value === 'null') select.classList.add('error');
    else                        select.classList.remove('error');
});

submitButton.addEventListener('click', validateForm);

closeButton.addEventListener('click', () => {
    resetInputs();
    hideForm();
});