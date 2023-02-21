import Notiflix, { Notify } from 'notiflix';
import axios from 'axios';
export default class NewsApiService {
  constructor() {
    this.query = '';
    this.page = 1;
  }
  async fetchImages() {
    console.log(this);
    const KEY = '33614397-1a0ce7cdeb863390e1bd0b922';
    const URL_BASE = 'https://pixabay.com/api/';

    //   return fetch(
    //     `${URL_BASE}?key=${KEY}&q=${this.query}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=8`
    //   )
    //     .then(resp => resp.json())
    //     .then(({ hits, totalHits }) => {
    //       // console.log(data);
    //       Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
    //       this.nextPage();
    //       if (this.page === totalHits) {
    //         Notiflix.Notify.warning(
    //           "We're sorry, but you've reached the end of search results."
    //         );
    //       }
    //       return hits;
    // });

    const resp = await axios.get(
      `${URL_BASE}?key=${KEY}&q=${this.query}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`
    );

    this.nextPage();

    return resp.data;

    // return axios
    //   .get(
    //     `${URL_BASE}?key=${KEY}&q=${this.query}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=8`
    //   )
    //   .then(({ data }) => {
    //     console.log(data);
    //     Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
    //     this.nextPage();
    //     if (this.page === data.totalHits) {
    //       Notiflix.Notify.warning(
    //         "We're sorry, but you've reached the end of search results."
    //       );
    //     }
    //     return data.hits;
    //   });
  }

  nextPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }

  //   get searchQuery() {
  //     return this.query;
  //   }

  //   set searchQuery(newQuery) {
  //     this.query = newQuery;
  //   }
}
