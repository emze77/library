// details: https://www.theodinproject.com/lessons/node-path-javascript-library

const myLibrary = [];

// ___QUERY-SELECTORS___

const readBooks = document.querySelector(".readBooks");
const unreadBooks = document.querySelector(".unreadBooks");

const inputForm = document.querySelector("#inputForm");
const prompter = document.querySelector("#prompter");
const h1 = document.querySelector("h1");

const buttons = {
  newBook: document.querySelector("#newBookButton"),
  submit: document.querySelector("#formSubmitButton"),
  delete: document.querySelector("#delete"),
  read: document.querySelector("#read"),
};

const activeBook = {
  book: document.querySelector("#currentBook"),
  author: document.querySelector("#currentAuthor"),
  title: document.querySelector("#currentTitle"),
  date: document.querySelector("#currentDate"),
  setting: document.querySelector("#currentSettings"),
  readCheckbox: document.querySelector("#readCheckbox"),
  id: null,
};

const modes = {
  formOverlay: document.querySelector("#formOverlay"),
  currentBook: document.querySelector("#currentBook"),
  empty: document.querySelector("#empty"),
  backgroundLoop: document.querySelector("#backgroundLoop"),
  gifAttribution: document.querySelector("#attribution"),
};

// ____ARCHIVE____

addBookToLibrary("Film als subversive Kunst", "Amos", "Vogel", 1997, true);
addBookToLibrary("Kapitalismus aufheben", "Stefan", "Meretz", 2018, false);
addBookToLibrary("Governing the Commons", "Elinor", "Ostrom", 1996, true);
addBookToLibrary("Lohn, Preis und Profit", "Karl", "Marx", 1846, false);
addBookToLibrary("Die Linke im Baskenland", "Raul", "Zelik", 2019, true);
addBookToLibrary("Engels neu entdecken", "Elmar", "Altvater", 2010, false);
addBookToLibrary("Ilias", "", "Homer", -800, false);

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
    modeSelector("showBook");
    activeBook["author"].textContent =
      this.authorFirstName + " " + this.authorLastName;
    activeBook["title"].textContent = this.title;
    activeBook["date"].textContent = yearAppendix(this.date);
    activeBook["readCheckbox"].checked = this.readStatus;
    activeBook["id"] = this.id; //need to change read status + delete
  };
}

function yearAppendix(date) {
  if (date < 0) {
    return Math.abs(Number(date)) + " v. u. Z.";
  } else {
    return date + " u. Z.";
  }
}

// ___SWITCH PROMPTER MODE___

function modeSelector(mode) {
  Object.keys(modes).forEach((item) => modes[item].classList.remove("visible")); // hide every prompt-mode
  if (mode === "formInput") {
    modes["formOverlay"].classList.add("visible");
    modes["backgroundLoop"].classList.add("visible");
    modes["gifAttribution"].classList.add("visible");
  } else if (mode === "showBook") {
    modes["currentBook"].classList.add("visible");
  } else if (mode === "empty") {
    modes["empty"].classList.add("visible");
    modes["gifAttribution"].classList.add("visible");
  } else {
    throw new Error("unvalid prompter mode: " + mode);
  }
}

// ____FORM INPUT_______

buttons["newBook"].addEventListener("click", function () {
  modeSelector("formInput");
});

const formInput = {
  firstName: document.querySelector("#inputFirstName"),
  lastName: document.querySelector("#inputLastName"),
  title: document.querySelector("#inputTitle"),
  date: document.querySelector("#inputDate"),
  addBook: function () {
    addBookToLibrary(
      this.title.value,
      this.firstName.value,
      this.lastName.value,
      this.date.value
    );
  },
};

buttons["submit"].addEventListener("click", function (event) {
  event.preventDefault(); // prevent sending data to server
  if (formValidation()) {
    formInput.addBook();
    showBookById(activeBook["id"]);
    inputForm.reset();
    fillShelf();
    modeSelector("showBook");
  }
});


// cannot use regular validation as default is prevented. 
function formValidation() {
  console.log("form input: " + typeof formInput["lastName"].value);
  if (
    formInput["lastName"].value == "" ||
    formInput["title"].value == ""
  ) {
    formInput["lastName"].classList.add("redBorder");
    formInput["title"].classList.add("redBorder");
    return false;
  } else {
    formInput["lastName"].classList.remove("redBorder");
    formInput["title"].classList.remove("redBorder");
    return true;
  }
}

// iterates for uuid and brings the content to current-book
function showBookById(uuid) {
  myLibrary.forEach((item) => {
    if (item.id === uuid) {
      item.prompt();
    }
  });
}


// ___ADD & REMOVE BOOKS____

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
  activeBook["id"] = uuid;
}

buttons["delete"].addEventListener("click", deleteBookFromLibrary);

function deleteBookFromLibrary() {
  myLibrary.forEach((item, index) => {
    if (item.id === activeBook["id"]) {
      myLibrary.splice(index, 1);
    }
  });
  fillShelf();
  modeSelector("empty");
}

// ____CLICK ON H1 & OUTSIDE PROMPTER-CONTENT-AREA LEADS TO "EMPTY"-MODE_____

modes["currentBook"].addEventListener("click", (event) =>
  handlePrompterClick(event, "inside")
);
modes["formOverlay"].addEventListener("click", (event) =>
  handlePrompterClick(event, "inside")
);
h1.addEventListener("click", (event) => handlePrompterClick(event, "outside"));
prompter.addEventListener("click", (event) =>
  handlePrompterClick(event, "outside")
);

function handlePrompterClick(event, area) {
  if (area === "inside") {
    event.stopPropagation();
  } else if (area === "outside") {
    modeSelector("empty");
  }
}

// _____FILL SIDEBAR WITH ARRAY-ENTRYS_____

function fillShelf() {
  clearShelf();
  let mySortedLibrary = sortLibrary();
  mySortedLibrary.forEach((item) => {
    let entry = createListItem(item);
    separateEntriesAccordingToReadStatus(item, entry);
    appendEntriesInDOM(item, entry);
  });
}

function clearShelf() {
  while (readBooks.hasChildNodes()) {
    readBooks.removeChild(readBooks.firstChild);
  }
  while (unreadBooks.hasChildNodes()) {
    unreadBooks.removeChild(unreadBooks.firstChild);
  }
}

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

function createListItem(item) {
  let entry = document.createElement("li");
  entry.setAttribute("id", item.id);
  entry.classList.add("entry");

  entry.addEventListener("click", function () {
    item.prompt();
  });
  return entry;
}

function separateEntriesAccordingToReadStatus(item, entry) {
  if (item.readStatus) {
    readBooks.appendChild(entry);
  } else {
    unreadBooks.appendChild(entry);
  }
}

// create text-span; seperate author and title inside.
function appendEntriesInDOM(item, entry) {
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
}

// ___TOGGLE READ-STATUS___

buttons["read"].addEventListener("click", () => {
  myLibrary.forEach((item) => {
    if (item.id === activeBook["id"]) {
      item.toggleRead();
    }
  });
});

// create Prototype-Function (requested by the-odin-project)
Book.prototype.toggleRead = function () {
  this.readStatus = !this.readStatus;
  refreshCheckbox();
};

function refreshCheckbox () {
  myLibrary.forEach((item) => {
    if (item.id === activeBook["id"]) {
      readCheckbox.checked = item.readStatus;
    }
  });
  fillShelf();
}

// Alternative: direct click on the checkbox
readCheckbox.addEventListener("click", setCheckbox);

function setCheckbox () {
  myLibrary.forEach((item) => {
    if (item.id === activeBook["id"]) {
      item.readStatus = readCheckbox.checked;
    }
  });
  fillShelf();
}


fillShelf();
