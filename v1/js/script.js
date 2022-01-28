const postsList = document.querySelector(".posts-list");
const addPostForm = document.querySelector(".add-post-form");
const title = document.getElementById('title');
const body = document.getElementById('body');
const idPost = document.getElementById('idPost');
const buttonSubmit = document.querySelector('.btn');
const buttonSelect = document.querySelector('.button-select');
const buttonSearch = document.querySelector('.button-search');
let output = '';

// Обновить
const renderPosts = (posts) => {
  posts.forEach(post => {
    output += `
    <div class="card mt-4 col-md-6 bg-ligt">
      <div class="card-body" data-id=${post.id}>
        <h5 class="card-title ">${post.title}</h5>
        <p class="card-text ">${post.body}</p>
        <a href="# " class="card-link" id="edit-post">Обновить пост</a>
        <a href="# " class="card-link" id="delete-post">Удалить пост</a>
      </div>
    </div>
    `;
  });
  postsList.innerHTML = output;
}

// Обновить
const renderPost = (post) => {
  output += `
  <div class="card mt-4 col-md-6 bg-ligt">
    <div class="card-body" data-id=${post.id}>
      <h5 class="card-title ">${post.title}</h5>
      <p class="card-text ">${post.body}</p>
      <a href="# " class="card-link" id="edit-post">Обновить пост</a>
      <a href="# " class="card-link" id="delete-post">Удалить пост</a>
    </div>
  </div>
  `;
  postsList.innerHTML = output;
}

const url = 'https://jsonplaceholder.typicode.com/posts';

// Разбить на функции
buttonSelect.addEventListener('click', () => {
  // Вывод всех постов
  // Метод: GET
  fetch(url)
    .then(res => res.json())
    .then(data => renderPosts(data))

  postsList.addEventListener('click', (e) => {
    e.preventDefault();
    let editButton = e.target.id == 'edit-post';
    let deleteButton = e.target.id == 'delete-post';

    let id = e.target.parentElement.dataset.id;
    // Удаление поста
    // Метод: DELETE  
    if (deleteButton) {
      fetch(`${url}/${id}`, {
          method: 'DELETE',
        })
        .then(res => res.json())
    }

    if (editButton) {
      const parent = e.target.parentElement;
      let titleContent = parent.querySelector('.card-title').textContent;
      let bodyContent = parent.querySelector('.card-text').textContent;

      title.value = titleContent;
      body.value = bodyContent;
    }

    // Обновление поста
    // Метод: PATCH
    buttonSubmit.addEventListener('click', (e) => {
      e.preventDefault();
      fetch(`${url}/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: title.value,
            body: body.value,
          })
        })
        .then(res => res.json())
        .then(() => location.reload())
    })
  });
})

buttonSearch.addEventListener('click', () => {
  // Вывод определенного поста
  // Метод: GET
  let id = idPost.value;
  fetch(`${url}/${id}`, {
      method: 'GET',
    })
    .then(res => res.json())
    .then(data => renderPost(data))
})

// Создание нового поста
// Метод: POST
addPostForm.addEventListener('submit', (e) => {
  e.preventDefault();
  fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: title.value,
        body: body.value,
      })
    })
    .then(res => res.json())
    .then(data => {
      const dataArr = [];
      dataArr.push(data);
      renderPosts(dataArr);
    })

  title.value = '';
  body.value = '';
})