// details: https://www.theodinproject.com/lessons/node-path-javascript-library

const myLibrary = [];
const readBooks = document.querySelector(".readBooks");
const unreadBooks = document.querySelector(".unreadBooks");

const inputForm = document.querySelector("#inputForm");
const prompter = document.querySelector("#prompter");
const h1 = document.querySelector("h1");

// ____ARCHIVE____
addBookToLibrary("Film als subversive Kunst", "Amos", "Vogel", 1997, true);
addBookToLibrary("Kapitalismus aufheben", "Stefan", "Meretz", 2018, false);
addBookToLibrary("Governing the Commons", "Elinor", "Ostrom", 1996, true);
addBookToLibrary("Lohn, Preis und Profit", "Karl", "Marx", 1846, false);
addBookToLibrary("Die Linke im Baskenland", "Raul", "Zelik", 2019, true);
addBookToLibrary("Engels neu entdecken", "Elmar", "Altvater", 2010, false);

// ___CONSTRUCTOR____

const current = {
  book: document.querySelector("#currentBook"),
  author: document.querySelector("#currentAuthor"),
  title: document.querySelector("#currentTitle"),
  date: document.querySelector("#currentDate"),
  setting: document.querySelector("#currentSettings"),
  readCheckbox: document.querySelector("#readCheckbox"),
  id: null,
};

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
    current["author"].textContent =
      this.authorFirstName + " " + this.authorLastName;
    current["title"].textContent = this.title;
    current["date"].textContent = this.date;
    current["readCheckbox"].checked = this.readStatus;
    current["id"] = this.id; //need to change read status + delete
  };
}

// ___SWITCH PROMPTER MODE___

const modes = {
  formOverlay: document.querySelector("#formOverlay"),
  currentBook: document.querySelector("#currentBook"),
  empty: document.querySelector("#empty"),
  backgroundLoop: document.querySelector("#backgroundLoop"),
};

function modeSelector(mode) {
  Object.keys(modes).forEach((item) => modes[item].classList.remove("visible")); // hide every prompt-mode
  if (mode === "formInput") {
    modes["formOverlay"].classList.add("visible");
    modes["backgroundLoop"].classList.add("visible");
  } else if (mode === "showBook") {
    modes["currentBook"].classList.add("visible");
  } else if (mode === "empty") {
    modes["empty"].classList.add("visible");
  } else {
    throw new Error("unvalid prompter mode: " + mode);
  }
}

// ____FORM INPUT_______

const formInput = {
  inputFirstName: document.querySelector("#inputFirstName"),
  inputLastName: document.querySelector("#inputLastName"),
  inputTitle: document.querySelector("#inputTitle"),
  inputDate: document.querySelector("#inputDate"),
  addBook: function () {
    let uuid = addBookToLibrary(
      //returns new UUID
      this.inputTitle.value,
      this.inputFirstName.value,
      this.inputLastName.value,
      this.inputDate.value
    );
    promptBookByUuid(uuid);
  },
};

// ___BUTTONS___

const buttons = {
  newBook: document.querySelector("#newBookButton"),
  submit: document.querySelector("#formSubmitButton"),
};

buttons["newBook"].addEventListener(
  "click",
  function () {
    modeSelector("formInput");
  },
  false
);

buttons["submit"].addEventListener(
  "click",
  function (event) {
    event.preventDefault(); // prevent sending data to server
    formValidation();
    formInput.addBook();
    inputForm.reset();
    fillShelf();

    myLibrary.forEach((item) => {
      if (item.id === current["id"]) {
        item.readStatus = readCheckbox.checked;
      }
    });

    modeSelector("showBook");
  },
  false
);

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
    console.log("inside clicked");
    event.stopPropagation();
  } else if (area === "outside") {
    console.log("outside clicked");
    modeSelector("empty");
  }
}

// ___CASUAL FUNCTIONS____

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
  return uuid;
}

function fillShelf() {
  clearShelf();
  let mySortedLibrary = sortLibrary();
  // add authors last name and book title as list items to DOM
  mySortedLibrary.forEach((item) => {
    let entry = createClickableListEntry(item);
    sortAccordingReadStatus(item, entry);
    apendEntrysInDOM(item, entry);
  });
}

function createClickableListEntry(item) {
  let entry = document.createElement("li");
  entry.setAttribute("id", item.id);
  entry.classList.add("entry");

  entry.addEventListener("click", function () {
    console.log("works + " + item.id);
    item.prompt();
  });

  return entry;
}

function sortAccordingReadStatus(item, entry) {
  if (item.readStatus) {
    readBooks.appendChild(entry);
  } else {
    unreadBooks.appendChild(entry);
  }
}

function apendEntrysInDOM(item, entry) {
  // create text-span; seperate author and title
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

//Shelf gets cleared before refilling
function clearShelf() {
  while (readBooks.hasChildNodes()) {
    readBooks.removeChild(readBooks.firstChild);
  }
  while (unreadBooks.hasChildNodes()) {
    unreadBooks.removeChild(unreadBooks.firstChild);
  }
}

// "Read?" -Checkbox works
readCheckbox.addEventListener("click", function () {
  myLibrary.forEach((item) => {
    if (item.id === current["id"]) {
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

// iterates for uuid and brings the content to _current book_
function promptBookByUuid(uuid) {
  myLibrary.forEach((item) => {
    if (item.id === uuid) {
      item.prompt();
    }
  });
}

function deleteBookfromLibrary(id) {
  //
}

fillShelf();

console.log(myLibrary);
