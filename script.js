// Books main div holding all the books
const books = document.querySelector(".books");
const addBook = document.querySelector(".add-book");
const modal = document.querySelector("#modal");
const span = document.querySelector(".close");

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
span.addEventListener("click", () => {
  modal.style.display = "none";
});
addBook.addEventListener("click", () => {
  modal.style.display = "block";
  document.querySelector(".form-title").textContent = "Add Book";
  document.querySelector(".form-add-button").textContent = "Add";
});

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.id = Math.floor(Math.random() * 10000000);
}

function addBookToLibrary(title, author, pages, read) {
  myLibrary.push(new Book(title, author, pages, read));
  saveAndRenderBooks();
}

const addBookForm = document.querySelector(".add-book-form");
addBookForm.addEventListener("submit", (e) => {
  //prevents the page from refreshing
  e.preventDefault();

  const data = new FormData(e.target);
  let newBook = {};
  for (let [name, value] of data) {
    if (name === "book-read") {
      newBook["book-read"] = true;
    } else {
      newBook[name] = value || "";
    }
  }

  if (!newBook["book-read"]) {
    newBook["book-read"] = false;
  }
  //hacky way to get the id of the book to edit
  if (document.querySelector(".form-title").textContent === "Edit Book") {
    let id = e.target.id;
    //filter the id so we have the id of the book to edit
    let editBook = myLibrary.filter((book) => book.id == id)[0];
    editBook.title = newBook["book-title"];
    editBook.author = newBook["book-author"];
    editBook.pages = newBook["book-pages"];
    editBook.read = newBook["book-read"];
    saveAndRenderBooks();
  } else {
    addBookToLibrary(
      newBook["book-title"],
      newBook["book-author"],
      newBook["book-pages"],
      newBook["book-read"],
    );
  }

  //resets form.
  addBookForm.reset();
  //closes modal
  modal.style.display = "none";
});

//array of books
let myLibrary = [];

//renders all books in myLibrary array.
function renderBooks() {
  books.textContent = "";
  myLibrary.map((book, index) => {
    createBookItem(book, index);
  });
}

function saveAndRenderBooks() {
  localStorage.setItem("library", JSON.stringify(myLibrary));
  renderBooks();
}

//Higher order function for createBookElement and createReadElement
function createBookItem(book, index) {
  const bookItem = document.createElement("div");
  bookItem.setAttribute("id", index);
  bookItem.setAttribute("key", index);
  bookItem.setAttribute("class", "card book");

  bookItem.appendChild(
    createBookElement("h1", `Title: ${book.title}`, "book-title"),
  );
  bookItem.appendChild(
    createBookElement("h1", `Author: ${book.author}`, "book-author"),
  );
  bookItem.appendChild(
    createBookElement("h1", `Pages: ${book.pages}`, "book-pages"),
  );
  bookItem.appendChild(createReadElement(bookItem, book));
  bookItem.appendChild(createBookElement("button", "X", "delete"));
  bookItem.appendChild(createIcons());
  bookItem.appendChild(createEditIcon(book));
  //insertAdjacentElement(position, element) 'afterbegin': Just inside the targetElement, before its first child.
  bookItem.querySelector(".delete").addEventListener("click", () => {
    deleteBook(index);
  });
  books.insertAdjacentElement("afterbegin", bookItem);
}

//create dummy icons, they don't do anything yet.
function createIcons() {
  const div = createBookElement("div", null, "icons");

  const icon1 = document.createElement("img");
  icon1.src = "public/heart-outline.svg";
  const icon2 = document.createElement("img");
  icon2.src = "public/eye-check-outline.svg";
  const icon3 = document.createElement("img");
  icon3.src = "public/source-branch.svg";

  div.appendChild(icon1);
  div.appendChild(icon2);
  div.appendChild(icon3);
  return div;
}

function fillOutEditForm(book) {
  modal.style.display = "block";
  document.querySelector(".form-title").textContent = "Edit Book";
  document.querySelector(".form-add-button").textContent = "Edit";
  document.querySelector(".add-book-form").setAttribute("id", book.id);
  document.querySelector("#book-title").value = book.title || "";
  document.querySelector("#book-author").value = book.author || "";
  document.querySelector("#book-pages").value = book.pages || "";
  document.querySelector("#book-read").checked = book.read;
}

//create the edit icon w/ event listener
function createEditIcon(book) {
  const editIcon = document.createElement("img");
  editIcon.src = "../public/pencil-outline.svg";
  editIcon.setAttribute("class", "edit-icon");
  editIcon.addEventListener("click", () => {
    fillOutEditForm(book);
  });
  return editIcon;
}

function deleteBook(index) {
  myLibrary.splice(index, 1);
  saveAndRenderBooks();
}

//used by createBookItem
function createBookElement(el, content, className) {
  const element = document.createElement(el);
  element.textContent = content;
  element.setAttribute("class", className);
  return element;
}

function addLocalStorage() {
  //localStorage => save things in key value pairs - key = library : myLibrary
  myLibrary = JSON.parse(localStorage.getItem("library")) || [];

  saveAndRenderBooks();
}

//used by createBookItem to append to bookItem div
function createReadElement(bookItem, book) {
  //First, assign read variable to a div element.
  const read = document.createElement("div");
  //With the element we just created, add a class of "book-read" using setAttribute method.
  read.setAttribute("class", "book-read");
  //Now, with the div element, we append a h1 element with the text "Read?" and a class of "book-read-title".
  read.appendChild(createBookElement("h1", `Read?`, "book-read-title"));

  //Second, do the same thing for the input which will be a checkbox.
  const input = document.createElement("input");
  input.type = "checkbox";

  input.addEventListener("click", (e) => {
    //If the checkbox is checked, we add a class of "read-checked" to the bookItem div and set the book's read property to true.
    if (e.target.checked) {
      bookItem.setAttribute("class", "card book read-checked");
      book.read = true;
      saveAndRenderBooks();
      //If the checkbox is unchecked, we add a class of "read-unchecked" to the bookItem div and set the book's read property to false.
    } else {
      bookItem.setAttribute("class", "card book read-unchecked");
      book.read = false;
      saveAndRenderBooks();
    }
  });
  //If the book's read property is true, we set the input's checked property to true and add a class of "read-checked" to the bookItem div.
  if (book.read) {
    input.checked = true;
    bookItem.setAttribute("class", "card book read-checked");
  }
  //We append the input to the read div.
  read.appendChild(input);
  return read;
}

//render on page load
addLocalStorage();
