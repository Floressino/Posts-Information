const postsList = document.querySelector('.posts__list');
const getPostsBtn = document.querySelector('.posts__get-posts');
const postTitle = document.querySelector('.new-post__title');
const postBody = document.querySelector('.new-post__body');
const addNewPost = document.querySelector('.new-post__add');
const updatePost = document.querySelector('.post__update');
const searchPostBtn = document.querySelector('.button-search');
const idPost = document.getElementById('idPost');

const url = 'https://jsonplaceholder.typicode.com';

const state = {
  posts: [],
  post: [],
  newPost: {
    title: '',
    body: ''
  },
  editPost: {}
}

const cleanData = () => {
  state.newPost.title = '';
  state.newPost.body = '';

  postTitle.value = '';
  postBody.value = '';
}

const editPost = (id) => {
  const editeblePost = state.posts.find(item => item.id == id);
  console.log(editeblePost);
  state.editPost = editeblePost;

  addNewPost.classList.add('posts__get-posts_hidden');
  updatePost.classList.add('post__update_active');

  postTitle.value = state.editPost.title;
  postBody.value = state.editPost.body;
}

const deletePost = (index) => {
  const editedblePost = state.posts[index];

  removePostRequest(editedblePost.id);

  state.posts.splice(index, 1);

  deletePostsList();
  getPostsRequest();
  fillPostsList(state.posts);
}

const changeHandler = e => {
  const value = e.value;
  e.value = value.replace(/\D/g, '');
}

const fillPostsList = (posts) => {
  if (posts.length) {
    posts.forEach((post) => {
      let postCard = document.createElement('div');
      postCard.className = ('post');
      postsList.append(postCard);

      let postWrapper = document.createElement('div');
      postWrapper.className = ('post__wrapper');
      postCard.append(postWrapper);

      postWrapper.insertAdjacentHTML("afterbegin", `<h5 class='wrapper__title'>${post.title}`);
      postWrapper.insertAdjacentHTML("beforeend", `<p class='wrapper__body'>${post.body}`);

      let postButtons = document.createElement('div');
      postButtons.className = ('post__buttons');
      postCard.append(postButtons);

      let id = post.id;
      postButtons.insertAdjacentHTML("afterbegin", `<button class='button__edit' onclick='editPost(${id})'>Редактировать`);
      postButtons.insertAdjacentHTML('beforeend', `<button class='button__delete' onclick='deletePost(${id})'>Удалить`);
    });
  }
}

searchPostBtn.addEventListener('click', async() => {
  state.post = [];
  deletePostsList();
  await searchPostRequest();
  fillPostsList(state.post);
})

postTitle.addEventListener('change', (e) => {
  if (!!state.editPost.title) {
    return state.editPost.title = e.target.value;
  }
  return state.newPost.title = e.target.value;
});
postBody.addEventListener('change', (e) => {
  if (!!state.editPost.body) {
    return state.editPost.body = e.target.value;
  }
  return state.newPost.body = e.target.value;
});

addNewPost.addEventListener('click', async(e) => {
  e.preventDefault();
  await createPostRequest();
  cleanData();
})

updatePost.addEventListener('click', async(e) => {
  e.preventDefault();
  await updatePostRequest();
  cleanData();
  deletePostsList();
  await getPostsRequest();
  fillPostsList(state.posts);
  addNewPost.classList.remove('posts__get-posts_hidden');
  updatePost.classList.remove('post__update_active');
})

getPostsBtn.addEventListener('click', async() => {
  getPostsBtn.classList.add('posts__get-posts_hidden');
  await getPostsRequest();
  fillPostsList(state.posts);
})

function getPostsRequest() {
  return fetch(`${url}/posts?_limit=10`, {
      method: 'GET',
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        return Promise.reject(res);
      }
    })
    .then((posts) => state.posts = state.posts.concat(posts))
    .catch(function(err) {
      console.warn('Ошибка получения!');
      console.log(err);
    })
}

function createPostRequest() {
  return fetch(`${url}/posts`, {
      method: 'POST',
      body: JSON.stringify(state.newPost),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        return Promise.reject(res);
      }
    })
    .then(post => {
      const dataArr = [];
      dataArr.push(post);
      state.posts = dataArr;
      fillPostsList(state.posts);
    })
    .catch(function(err) {
      console.warn('Ошибка получения!');
      console.log(err);
    })
}

function updatePostRequest() {
  return fetch(`${url}/posts/${state.editPost.id}`, {
      method: 'PUT',
      body: JSON.stringify(state.editPost),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    .then((res) => res.json())
    .then((data) => state.posts = state.posts.concat(data))
}

function removePostRequest(id) {
  return fetch(`${url}/posts/${id}`, {
    method: 'DELETE',
  })
}

function deletePostsList() {
  while (postsList.firstChild) {
    postsList.removeChild(postsList.firstChild);
  }
}

function searchPostRequest() {
  let id = idPost.value;
  return fetch(`${url}/posts/${id}`, {
      method: 'GET',
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        return Promise.reject(res);
      }
    })
    .then((post) => state.post = state.post.concat(post))
    .catch(function(err) {
      console.warn('Ошибка получения!');
      console.log(err);
    })
}

postTitle.addEventListener('input', lockButtonCreate);
postBody.addEventListener('input', lockButtonCreate);

function lockButtonCreate() {
  if (postTitle.value == "" && postBody.value == "") {
    addNewPost.disabled = true;
    addNewPost.classList.remove('new-post__add');
    addNewPost.classList.add('new-post__add_disabled');
  } else {
    addNewPost.disabled = false;
    addNewPost.classList.remove('new-post__add_disabled');
    addNewPost.classList.add('new-post__add');
  }
}
lockButtonCreate();

idPost.addEventListener('input', lockButtonSearch);

function lockButtonSearch() {
  if (idPost.value == "") {
    searchPostBtn.disabled = true;
    searchPostBtn.classList.remove('button-search');
    searchPostBtn.classList.add('button-search_disabled')
  } else {
    searchPostBtn.disabled = false;
    searchPostBtn.classList.remove('button-search_disabled');
    searchPostBtn.classList.add('button-search')
  }
}
lockButtonSearch();