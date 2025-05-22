// details: https://www.theodinproject.com/lessons/node-path-javascript-library

const myLibrary = [];

const readBooks = document.querySelector(".readBooks");
const unreadBooks = document.querySelector(".unreadBooks");


function Book(title, authorFirstName, authorLastName, date, readStatus, id) {
    this.title = title;
    this.authorFirstName = authorFirstName;
    this.authorLastName = authorLastName;
    this.date = date;
    this.readStatus = readStatus;
    this.id = id;
}

function addBookToLibrary(title, authorFirstName, authorLastName, date, readStatus) {
    let uuid = crypto.randomUUID();
    let newBook = new Book (title, authorFirstName, authorLastName, date, readStatus, uuid);
    myLibrary.push(newBook)
  }


function fillShelf () {
    let mySortedLibrary = sortLibrary();

    // add authors last name and book title as list items to DOM 
    mySortedLibrary.forEach(item => {
        let entry = document.createElement("li");
        entry.classList.add("entry");
        if (item.readStatus) {
            readBooks.appendChild(entry)
        } else {
            unreadBooks.appendChild(entry)
        }

        let entryLastName = document.createElement("span");
        entryLastName.classList.add("bold", "entry-text");
        entryLastName.textContent = item.authorLastName + ": ";
        entry.appendChild(entryLastName);

        let entryTitle = document.createElement("span");
        entryLastName.classList.add("entry-text");
        entryTitle.textContent = item.title;
        entry.appendChild(entryTitle);
    })
}

// sort library in alphabetic order by authors last name.
function sortLibrary () {
    return myLibrary.sort((a, b) => {
        if (a.authorLastName < b.authorLastName) {
            return -1
        } else if (a.authorLastName > b.authorLastName) {
            return 1
        } else {
            return 0
        }
    })
}

function deleteBookfromLibrary(id) {
    // 
}

addBookToLibrary("Der Hobbit", "J.R.R.",  "Tolkien", 1956, true);
addBookToLibrary("Kapitalismus aufheben", "Stefan",  "Meretz", 2018, false);
addBookToLibrary("Understanding Institutional Diversity", "Elinor",  "Ostrom", 2001, true);
addBookToLibrary("Lohn, Preis und Profit", "Karl",  "Marx", 1846, false);
addBookToLibrary("Vier lustige Gesellen", "Ludwig",  "Hirsch", 1975, true);
addBookToLibrary("Zeiten des Umbruchs", "Ferdinand",  "Gans", 1870, false);

fillShelf();







