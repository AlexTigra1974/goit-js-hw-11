import Notiflix, { Notify } from 'notiflix';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import NewsApiService from './newsApiService';

const form = document.querySelector('#search-form');

// const inputSearch = document.querySelector('input[name = "searchQuery"]');
// const btnSearch = document.querySelector('[type="submit"]');

const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

const newsApiService = new NewsApiService();

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  enableKeyboard: true,
});

form.addEventListener('submit', onSearch);
btnLoadMore.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();
  clearMarkup();

  btnLoadMore.hidden = true;

  newsApiService.query = e.target.elements.searchQuery.value.trim();
  if (!newsApiService.query) {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  newsApiService.resetPage();

  try {
    const data = await newsApiService.fetchImages();

    const hits = data.hits;
    const totalHits = data.totalHits;

    createMarkup(hits);

    if (hits.length === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    btnLoadMore.hidden = false;

    if (totalHits > 0) {
      Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
    }

    if (hits.length < 40) {
      btnLoadMore.hidden = true;
      setTimeout(() => {
        Notiflix.Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
      }, 2000);
    }

    lightbox.refresh();
  } catch (err) {
    console.error(err);
  }
}

async function onLoadMore() {
  try {
    const data = await newsApiService.fetchImages();
    const hits = data.hits;

    createMarkup(hits);

    if (hits.length < 40) {
      btnLoadMore.hidden = true;
      setTimeout(() => {
        Notiflix.Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
      }, 2000);
    }

    lightbox.refresh();
  } catch (err) {
    console.error(err);
  }
}

function createMarkup(arr) {
  const markup = arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `

  <a class="gallery-item" href="${largeImageURL}">
  <div class="photo-card">

  <img src="${webformatURL}" alt="${tags}" loading="lazy" />

  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
  </div>
  </a>`
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  onScroll();
}

function clearMarkup() {
  gallery.innerHTML = '';
}

function onScroll() {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

//   q: 'seach',
//   image_type: 'photo',
//   orientation: 'horizontal',
//   safesearch: true,

// async function getImages() {
//   try {
//     const response = await axios.get(`${URL_BASE}?${KEY}`, options);
//     console.log(response);
//   } catch (error) {
//     console.error(error);
//   }
// }

//webformatURL - посилання на маленьке зображення для списку карток.
// largeImageURL - посилання на велике зображення.
// tags - рядок з описом зображення. Підійде для атрибуту alt.
// likes - кількість лайків.
// views - кількість переглядів.
// comments - кількість коментарів.
// downloads - кількість завантажень.
