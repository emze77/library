// details: https://www.theodinproject.com/lessons/node-path-javascript-library

const myLibrary = [];
const readBooks = document.querySelector(".readBooks");
const unreadBooks = document.querySelector(".unreadBooks");
const submitButton = document.querySelector("#formSubmitButton");
const inputForm = document.querySelector("#inputForm");

const modes = {
  formOverlay: document.querySelector("#formOverlay"),
  currentBook: document.querySelector("#currentBook"),
  empty: document.querySelector("#empty"),
};

let currentBook = document.querySelector("#currentBook");
let currentAuthor = document.querySelector("#currentAuthor");
let currentTitle = document.querySelector("#currentTitle");
let currentDate = document.querySelector("#currentDate");
let currentSetting = document.querySelector("#currentSettings");
let readCheckbox = document.querySelector("#readCheckbox");
let idOfPromptedBook;

// ____ARCHIVE____
addBookToLibrary("Film als subversive Kunst", "Amos", "Vogel", 1997, true);
addBookToLibrary("Kapitalismus aufheben", "Stefan", "Meretz", 2018, false);
addBookToLibrary("Governing the Commons", "Elinor", "Ostrom", 1996, true);
addBookToLibrary("Lohn, Preis und Profit", "Karl", "Marx", 1846, false);
addBookToLibrary("Die Linke im Baskenland", "Raul", "Zelik", 2019, true);
addBookToLibrary("Engels neu entdecken", "Elmar", "Altvater", 2010, false);

// ___CONSTRUCTOR____

function Book(title, authorFirstName, authorLastName, date, readStatus, id) {
  this.title = title;
  this.authorFirstName = authorFirstName;
  this.authorLastName = authorLastName;
  this.date = date;
  this.readStatus = readStatus;
  this.id = id;
  this.prompt = function () {
    // bring current Book to the prompter
    currentAuthor.textContent =
      this.authorFirstName + " " + this.authorLastName;
    currentTitle.textContent = this.title;
    currentDate.textContent = this.date;
    currentSetting.classList.remove("invisible"); //show "delete + read"
    idOfPromptedBook = this.id; //need to change read status + delete
    readCheckbox.checked = this.readStatus;
    currentBook.classList.remove("placeholderGif"); //disable placeholder-animation
  };
}

// ___SWITCH PROMPTER MODE___

function modeSelector(mode) {
  Object.keys(modes).forEach((item) => modes[item].classList.remove("visible")); // hide every prompt-mode
  if (mode === "formInput") {
    modes.formOverlay.classList.add("visible");
  } else if (mode === "showBook") {
    modes.currentBook.classList.add("visible");
  } else if (mode === "empty") {
    modes.empty.classList.add("visible");
  } else {
    throw new Error("unvalid prompter mode: " + mode);
  }
}

// ____PROMPTER MODE: FORM INPUT_______

const formInput = {
  inputFirstName: document.querySelector("#inputFirstName"),
  inputLastName: document.querySelector("#inputLastName"),
  inputTitle: document.querySelector("#inputTitle"),
  inputDate: document.querySelector("#inputDate"),
  addBook: function () {
    addBookToLibrary(
      this.inputTitle.value,
      this.inputFirstName.value,
      this.inputLastName.value,
      this.inputDate.value,
    );
  },
};

submitButton.addEventListener(
  "click",
  function (event) {
    event.preventDefault(); // prevent sending data to server
    formInput.addBook();
    inputForm.reset();
    fillShelf();
    modeSelector("showBook");
  },
  false
);

// _____PROMPTER MODE: EMPTY_____

// _____PROMTER MODE: SHOW BOOK_____

// ___FUNCTIONS____

function addBookToLibrary(
  title,
  authorFirstName,
  authorLastName,
  date,
  readStatus
) {
  let uuid = crypto.randomUUID();
  let newBook = new Book(
    title,
    authorFirstName,
    authorLastName,
    date,
    readStatus,
    uuid
  );
  myLibrary.push(newBook);
}

function fillShelf() {
  clearShelf();
  let mySortedLibrary = sortLibrary();
  // add authors last name and book title as list items to DOM
  mySortedLibrary.forEach((item) => {
    let entry = document.createElement("li");
    entry.setAttribute("id", item.id);

    entry.addEventListener("click", function (e) {
      console.log("works + " + item.id);
      item.prompt();
    });
    
    entry.classList.add("entry");
    if (item.readStatus) {
      readBooks.appendChild(entry);
    } else {
      unreadBooks.appendChild(entry);
    }

    // create text-span; seperate authore and title
    let entrytext = document.createElement("span");
    entrytext.classList.add("entrytext");
    entry.appendChild(entrytext);

    let entryLastName = document.createElement("span");
    entryLastName.classList.add("bold");
    entryLastName.textContent = item.authorLastName + ": ";
    entrytext.appendChild(entryLastName);

    let entryTitle = document.createElement("span");
    entryTitle.textContent = item.title;
    entrytext.appendChild(entryTitle);
  });
}

//Shelf gets cleared before refilling
function clearShelf() {
  while (readBooks.hasChildNodes()) {
    readBooks.removeChild(readBooks.firstChild);
  }
  while (unreadBooks.hasChildNodes()) {
    unreadBooks.removeChild(unreadBooks.firstChild);
  }
}

// ____CLICK-EVENT-LISTENERS

// Add Book

// "Read?" -Checkbox works
readCheckbox.addEventListener("click", function () {
  myLibrary.forEach((item) => {
    if (item.id === idOfPromptedBook) {
      item.readStatus = readCheckbox.checked;
    }
  });
  fillShelf();
});

// ____HELPERS____

// sort library in alphabetic order by authors last name.
function sortLibrary() {
  return myLibrary.sort((a, b) => {
    if (a.authorLastName < b.authorLastName) {
      return -1;
    } else if (a.authorLastName > b.authorLastName) {
      return 1;
    } else {
      return 0;
    }
  });
}

function deleteBookfromLibrary(id) {
  //
}
fillShelf();

console.log(myLibrary);
