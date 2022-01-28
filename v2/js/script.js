const postsLists = document.querySelector('.posts-list');
const postTitle = document.getElementById('post-title');
const postBody = document.getElementById('post-body');
const getPostsBtn = document.querySelector('.button__load-posts');
const loadPostsBtn = document.querySelector('.button__load-more-posts');
const addNewPost = document.querySelector('.button-create');
const idPost = document.getElementById('idPost');
const buttonSearch = document.querySelector('.button-search');
const buttonEdit = document.getElementById('editButton');

const url = 'https://jsonplaceholder.typicode.com';
const state = {
  posts: [],
}

const limit = 10;
let data = [];
let from = limit;

idPost.addEventListener('input', lockButtonSearch);

function lockButtonSearch() {
  if (idPost.value == "") {
    buttonSearch.disabled = true;
    buttonSearch.classList.remove('button-search');
    buttonSearch.classList.add('button-search_disabled')
  } else {
    buttonSearch.disabled = false;
    buttonSearch.classList.remove('button-search_disabled');
    buttonSearch.classList.add('button-search')
  }
}
lockButtonSearch();

postTitle.addEventListener('input', lockButtonCreate);
postBody.addEventListener('input', lockButtonCreate);

function lockButtonCreate() {
  if (postTitle.value == "" && postBody.value == "") {
    addNewPost.disabled = true;
    addNewPost.classList.remove('button-create');
    addNewPost.classList.add('button-create_disabled');
  } else {
    addNewPost.disabled = false;
    addNewPost.classList.remove('button-create_disabled');
    addNewPost.classList.add('button-create');
  }
}
lockButtonCreate();

const fillPostsList = (posts) => {
  if (posts.length) {
    posts.forEach((post, index) => {
      const postsList = document.querySelector(".posts-list");

      let postCard = document.createElement('div');
      postCard.className = ("card");
      postCard.setAttribute('data-id', `${post.id}`);
      postsList.append(postCard);

      postCard.insertAdjacentHTML("afterbegin", `<h5 class='card-title'>${post.title}`);
      postCard.insertAdjacentHTML("beforeend", `<p class='card-body'>${post.body}`);
      postCard.insertAdjacentHTML("beforeend", `<button class='card-button' id='editButton'>Редактировать`);
      postCard.insertAdjacentHTML("beforeend", `<button class='card-button' id='deleteButton'>Удалить`);
    });
  }
}

getPostsBtn.addEventListener('click', async() => {
  getPostsBtn.classList.add('button__load-posts_hidden');
  loadPostsBtn.classList.add('button__load-more-posts_active');
  await getPostsRequest();
  fillPostsList(state.posts);
})

loadPostsBtn.addEventListener('click', () => {
  const postCard = document.getElementById('postsList').childNodes.length;
  let countPostCard = postCard + 10;
  if (countPostCard == data.length) {
    loadPostsBtn.classList.remove('button__load-more-posts_active');
  } else {
    const to = from + limit;
    fillPostsList(data.slice(from, to));
    from = to;
  }
})

function getPostsRequest() {
  return fetch(`${url}/posts`, {
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    .then(res => {
      if (!res.ok) {
        throw `${res.status}`
      }
      return res.json().then((posts) => {
        data = posts;
        fillPostsList(data.slice(0, limit));
      })
    })
}