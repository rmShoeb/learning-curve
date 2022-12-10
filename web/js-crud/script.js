let books = [
    {
        'book': 'Javascript',
        'author': 'Whatever',
    },
    {
        'book': 'C++',
        'author': 'Love',
    },
];

function BindBooks(books) {
    let row = ``;
    books.forEach(function (book, i) {
        row += `
        <tr>
            <td>${i}</td>
            <td>${book['book']}</td>
            <td>${book['author']}</td>
            <td>
                <button onclick="EditBook(${i})">Edit</button>
                <button onclick="DeleteBook(${i})">Delete</button>
            </td>
        </tr>`;
    });
    document.getElementById('table-body').innerHTML = row;
}

function EditBook(index) {
    event.preventDefault();;
    document.getElementById('book').value = books[index]['book'];
    document.getElementById('author').value = books[index]['author'];
    document.getElementById('book-index').value = index;
    document.getElementById('submit-new-book').hidden = true;
    document.getElementById('update-book').hidden = false;
}

function DeleteBook(index) {
    event.preventDefault();
    document.forms['add-book'].reset(); // in case there was any data for edit
    books.splice(index, 1);
    BindBooks(books);
}

document.getElementById('submit-new-book').addEventListener('click', function (event) {
    event.preventDefault();
    const form = document.forms['add-book'];
    books.push({
        'book': form['book'].value,
        'author': form['author'].value,
    });
    BindBooks(books);
    form.reset();
});

document.getElementById('update-book').addEventListener('click', function (event) {
    event.preventDefault();
    const index = document.forms['add-book']['index'].value;

    books.splice(index, 1, {
        'book': form['book'].value,
        'author': form['author'].value,
    });
    document.getElementById('submit-new-book').hidden = false;
    this.hidden = true;
    BindBooks(books);
    form.reset();
});

document.getElementById('book-header').addEventListener('click', function(event){
    event.preventDefault();
    const book = document.forms['sorted-data']['book'].value;
    let sorted;

    switch (book) {
        case "": // this means the array was not sorted before, sort the array into ascending order
        case "2": // sorted in descending order, sort into ascending order
            document.forms['sorted-data']['book'].value = 1;
            sorted = books.sort(function(b1, b2){
                if(b1['book']>b2['book']) return 1;
                if(b1['book']<b2['book']) return -1;
                return 0;
            });
            break;
        default: // sorted in ascending order, sort into descending order
            document.forms['sorted-data']['book'].value = 2;
            sorted = books.sort(function(b1, b2){
                if(b1['book']>b2['book']) return -1;
                if(b1['book']<b2['book']) return 1;
                return 0;
            });
            break;
    }
    BindBooks(sorted);
});

document.getElementById('author-header').addEventListener('click', function(event){
    event.preventDefault();
    const author = document.forms['sorted-data']['author'].value;

    switch (author) {
        case "": // this means the array was not sorted before, sort the array into ascending order
        case "2": // sorted in descending order, sort into ascending order
            document.forms['sorted-data']['author'].value = 1;
            sorted = books.sort(function(b1, b2){
                if(b1['author']>b2['author']) return 1;
                if(b1['author']<b2['author']) return -1;
                return 0;
            });
            break;
        default: // sorted in ascending order, sort into descending order
            document.forms['sorted-data']['author'].value = 2;
            sorted = books.sort(function(b1, b2){
                if(b1['author']>b2['author']) return -1;
                if(b1['author']<b2['author']) return 1;
                return 0;
            });
            break;
    }
    BindBooks(sorted);
});



BindBooks(books);