let APIphotos = "http://localhost:8000/photos";
let APIhighlights = "http://localhost:8000/highlights";

// search inp
let searchInp = document.querySelector("#search-input");
let searchValue = "";

// pagination

let paginationList = document.querySelector(".pagination-list");
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");
let pageTotal = 1;
let currentPage = 1;

//! highlights
let highlightDialog = document.querySelector("#highlight-add");
let highlightBtn = document.querySelector(".highlight-button");
let highlightsList = document.querySelector(".highlights");
let highlightUrl = document.querySelector("#highlight-url");

let cancelButton = document.getElementById("cancel");
let cancelButton3 = document.getElementById("cancel3");
let addHighlight = document.getElementById("highlightAdd");

highlightBtn.addEventListener("click", function () {
  highlightDialog.showModal();
});

cancelButton.addEventListener("click", function () {
  highlightDialog.close();
});

//TODO highlights
addHighlight.addEventListener("click", async function () {
  let newHighlight = {
    url: highlightUrl.value,
  };
  await fetch(APIhighlights, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(newHighlight),
  });
  addHighlightRender();
});

async function addHighlightRender() {
  let highlights = await fetch(APIhighlights).then((res) => res.json());
  console.log(highlights);
  highlights.forEach((element) => {
    let highlight = document.createElement("div");
    highlight.innerHTML = `<div class="highlight-item"><img src=${element.url}></div>`;
    highlightsList.prepend(highlight);
    console.log(element);
  });
}

// edit hightlight
// Функция для отображения кнопок "Edit" и "Delete" при клике на элемент "highlight-item"
// Функция для отображения кнопок "Edit" и "Delete"
function showButtons(highlightElement, highlightId) {
  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => {
    const newImageUrl = prompt("Enter the new image URL:");
    if (newImageUrl !== null) {
      editHighlight(highlightId, newImageUrl);
    }
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => {
    const confirmation = confirm(
      "Are you sure you want to delete this highlight?"
    );
    if (confirmation) {
      deleteHighlight(highlightId);
      highlightElement.remove();
    }
  });

  highlightElement.appendChild(editButton);
  highlightElement.appendChild(deleteButton);
}

// Функция для редактирования данных элемента
async function editHighlight(highlightId, newImageUrl) {
  try {
    const response = await fetch(`${APIhighlights}/${highlightId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: newImageUrl }),
    });

    if (response.ok) {
      console.log(`Highlight with ID ${highlightId} has been updated.`);

      // Найдите элемент с уникальным идентификатором и обновите его
      const highlightElement = document.querySelector(
        `[data-id="${highlightId}"]`
      );
      if (highlightElement) {
        const imageElement = highlightElement.querySelector("img");
        imageElement.src = newImageUrl;
      }
    } else {
      console.error(`Error updating highlight with ID ${highlightId}.`);
    }
  } catch (error) {
    console.error("An error occurred while updating the highlight:", error);
  }
}

// }

// Функция для удаления данных элемента
async function deleteHighlight(highlightId) {
  try {
    const response = await fetch(`${APIhighlights}/${highlightId}`, {
      method: "DELETE", // Используйте DELETE-запрос для удаления данных
    });

    if (response.ok) {
      console.log(`Highlight with ID ${highlightId} has been deleted.`);

      // Удалите элемент из DOM
      const highlightElement = document.querySelector(
        `[data-id="${highlightId}"]`
      );
      if (highlightElement) {
        highlightElement.remove();
      }
    } else {
      console.error(`Error deleting highlight with ID ${highlightId}.`);
    }
  } catch (error) {
    console.error("An error occurred while deleting the highlight:", error);
  }
}

// Функция для добавления и редактирования данных элемента
async function addOrUpdateHighlight(highlightId, imageUrl) {
  try {
    const isNewHighlight = !highlightId;
    const method = isNewHighlight ? "POST" : "PUT";
    const url = isNewHighlight
      ? APIhighlights
      : `${APIhighlights}/${highlightId}`;

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({ url: imageUrl }),
    });

    if (response.ok) {
      if (isNewHighlight) {
        console.log("New highlight has been added.");
      } else {
        console.log(`Highlight with ID ${highlightId} has been updated.`);
      }

      // После добавления/обновления элемента, перерендерите все выделения
      addHighlightRender();
    } else {
      console.error(
        `Error ${isNewHighlight ? "adding" : "updating"} highlight.`
      );
    }
  } catch (error) {
    console.error(
      `An error occurred while ${
        isNewHighlight ? "adding" : "updating"
      } the highlight:`,
      error
    );
  }
}
async function addHighlightRender() {
  let highlights = await fetch(APIhighlights).then((res) => res.json());
  //   console.log( highlights);
  highlightsList.innerHTML = ""; // Очистите содержимое перед добавлением элементов
  highlights.forEach((element) => {
    let highlight = document.createElement("div");
    highlight.className = "highlight-item";
    highlight.innerHTML = `<img src=${element.url}>`;

    // Создаем кнопки "Edit" и "Delete" для текущего элемента
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => {
      const newImageUrl = prompt("Enter the new image URL:");
      if (newImageUrl !== null) {
        editHighlight(element.id, newImageUrl);
      }
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      const confirmation = confirm(
        "Are you sure you want to delete this highlight?"
      );
      if (confirmation) {
        deleteHighlight(element.id);
        highlight.remove(); // Удаляем элемент из DOM
      }
    });

    // Добавляем кнопки к элементу highlight
    highlight.appendChild(editButton);
    highlight.appendChild(deleteButton);

    // Добавляем элемент highlight в список выделений
    highlightsList.appendChild(highlight);

    // console.log(element);
  });
}
addHighlight.addEventListener("click", async function () {
  let newImageUrl = highlightUrl.value;
  addOrUpdateHighlight(null, newImageUrl); // Передаем null в качестве ID для нового выделения
  highlightUrl.value = ""; // Очищаем поле ввода после добавления
});

// Вызов функции addHighlightRender для отображения элементов и кнопок "Edit" и "Delete"
addHighlightRender();

//TODO RENDER PHOTOS

let showModalAdd = document.querySelector(".create");
let photoDialog = document.querySelector("#photo-add");
let addPhoto = document.querySelector("#photoAdd");

// add photo inputs
let likeInp = document.querySelector("#likes");
let commentInp = document.querySelector("#comments");
let viewsInp = document.querySelector("#views");
let photoInp = document.querySelector("#photo");

let cancelButton2 = document.getElementById("cancel2");

let photosList = document.querySelector(".photos");

cancelButton2.addEventListener("click", function () {
  photoDialog.close();
});

cancelButton3.addEventListener("click", function () {
  editDialog.close();
});

showModalAdd.addEventListener("click", function () {
  photoDialog.showModal();
});

addPhoto.addEventListener("click", async function () {
  let newPhoto = {
    photo: photoInp.value,
    likes: likeInp.value,
    comments: commentInp.value,
    views: viewsInp.value,
  };
  await fetch(APIphotos, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(newPhoto),
  });
  photoInp.value = "";
  likeInp.value = "";
  commentInp.value = "";
  viewsInp.value = "";
  render();
});

async function render() {
  let photos = await fetch(
    `${APIphotos}?q=${searchValue}&_page=${currentPage}&_limit=3`
  ).then((res) => res.json());
  pagination();
  photosList.innerHTML = "";
  photos.forEach((element) => {
    photosList.innerHTML += `<div class="photo-item" id='${element.id}'><div><img src=${element.photo}></div>
            <div class='photo-info'><p><img style="width:20px;height:20px;" src=https://cdn-icons-png.flaticon.com/512/1077/1077035.png>${element.likes}</p><p><img 
        style="width:20px;height:20px;" src=https://cdn-icons-png.flaticon.com/512/3114/3114810.png>${element.comments}</p><p><img src=https://cdn-icons-png.flaticon.com/512/709/709612.png style="width:20px;height:20px;">${element.views}</p></div>
            <div class="card-buttons">
                            <button id=${element.id} class="photo-edit">Edit</button>
                            <button id=${element.id} onclick='deleteContact(${element.id})' class="photo-delete">Delete</button>
            </div></div>`;
  });
}
addHighlightRender();
// let photoInfo = document.querySelector(".photo-info").addEventListener('click', ()=>{
//  color
// })

render();

// =======
addPhoto.addEventListener("click", async function () {
  let newPhoto = {
    title: document.querySelector(".post-title").value, // Получение названия поста
    photo: photoInp.value,
    likes: likeInp.value,
    comments: commentInp.value,
    views: viewsInp.value,
  };
  await fetch(APIphotos, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(newPhoto),
  });
  // Очистка полей ввода
  document.querySelector(".post-title").value = "";
  photoInp.value = "";
  likeInp.value = "";
  commentInp.value = "";
  viewsInp.value = "";
  render();
});
// ====
// TODO PAGINATION
function pagination() {
  fetch(`${APIphotos}?q=${searchValue}`)
    .then((res) => res.json())
    .then((data) => {
      pageTotal = Math.ceil(data.length / 3);
      paginationList.innerHTML = "";
      for (let i = 1; i <= pageTotal; i++) {
        let page = document.createElement("li");
        page.innerHTML = ` <li class="page-item"><a class="page-link page-number" href="#">${i}</a></li>`;
        paginationList.append(page);
      }
    });
}
prev.addEventListener("click", () => {
  if (currentPage <= 1) {
    return;
  }
  currentPage--;
  render();
});

next.addEventListener("click", () => {
  if (currentPage >= pageTotal) {
    return;
  }
  currentPage++;
  render();
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("page-number")) {
    currentPage = e.target.innerText;
    render();
  }
});

// TODO DELETE PHOTO

function deleteContact(id) {
  fetch(`${APIphotos}/${id}`, { method: "DELETE" }).then(() => render());
}

// TODO EDIT PHOTOS

// edit photo inputs

let editDialog = document.getElementById("photo-edit");

let likeEditInp = document.querySelector("#editLikes");
let commentEditInp = document.querySelector("#editComments");
let viewsEditInp = document.querySelector("#editViews");
let photoEditInp = document.querySelector("#editPhoto");

let photoEditBtn = document.querySelector("#photo-edit-btn");

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("photo-edit")) {
    editDialog.showModal();
    let id = e.target.id;
    fetch(`${APIphotos}/${id}`).then((res) =>
      res.json().then((data) => {
        likeEditInp.value = data.likes;
        commentEditInp.value = data.comments;
        viewsEditInp.value = data.views;
        photoEditInp.value = data.photo;
        photoEditBtn.setAttribute("id", data.id);
      })
    );
  }
});

photoEditBtn.addEventListener("click", function () {
  let id = this.id;
  let likes = likeEditInp.value;
  let photo = photoEditInp.value;
  let comments = commentEditInp.value;
  let views = viewsEditInp.value;

  let editedPhoto = {
    likes: likes,
    photo: photo,
    comments: comments,
    views: views,
  };
  editPhoto(editedPhoto, id);
});

function editPhoto(editedPhoto, id) {
  fetch(`${APIphotos}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json; carset=utf-8" },
    body: JSON.stringify(editedPhoto),
  }).then(() => render());
  editDialog.close();
}

//TODO SEARCH

searchInp.addEventListener("input", () => {
  searchValue = searchInp.value;
  render();
});
