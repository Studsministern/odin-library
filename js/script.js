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
            addBookToLibrary(book)
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
function addBookToLibrary(book) {
    if(!(book instanceof Book)) {
        throw Error("Not a book!");
    }
    library.push(book);
    displayBook(book);
}

function displayBook(book) {
    bookList.insertAdjacentHTML('beforeEnd', book.htmlMarkup);
    const statusButton = bookList.querySelector(':last-child > .status > button'); // Find the most recently added button
    
    statusButton.addEventListener('mousedown', () => { // Toggle status and update textContent on click
        book.toggleStatus();
        statusButton.textContent = (book.status) ? 'Read' : 'Not read';
    });
}

function displayBookList() {
    /* Clears the list */
    bookList.forEach(e => {
        bookList.remove(e);
    });
    
    /* Readds the elements */
    library.forEach(book => {
       displayBook(book); 
    });
}



/* Book function */
function Book(title, author, pages, status) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
    
    this.htmlMarkup = `
        <div class="book">
            <p class="title">${this.title}</p>
            <p class="author">${this.author}</p>
            <p class="pages">${this.pages}</p>
            <div class="status">
                <button>${this.status ? 'Read' : 'Not read'}</button>
            </div>
        </div>
        `;

    this.toggleStatus = function() {
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
addBookToLibrary(new Book('The Intelligent Investor', 'Benjamin Graham', '587', false));


/* Event listeners */
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