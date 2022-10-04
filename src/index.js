import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImagesApiService from './fetchImages';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import LoadMoreBtn from './load-more-btn';

const refs = {
    seachForm: document.querySelector('.search-form'),
    loadMoreBtn: document.querySelector('.load-more'),
    galleryContainer: document.querySelector('.gallery'),
    loadingBtn: document.querySelector('.label'),
};
let hitSumm = 0;
const imagesApiService = new ImagesApiService();

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

loadMoreBtn.disable();

refs.seachForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

// Бесконечного скролла 
//const options = {
//  rootMargin: '50px',
//  root: null,
//  threshold: 0.3
//};
//const observer = new IntersectionObserver(onLoadMore, options);
//observer.observe(refs.loadMoreBtn);  

function onSearch(e) {
   e.preventDefault();

   refs.galleryContainer.innerHTML = '';
   imagesApiService.searchQuery = e.currentTarget.elements.searchQuery.value.trim();
   imagesApiService.resetPage();

   if (imagesApiService.searchQuery === '') {
    loadMoreBtn.disable();
    return Notify.failure
    ('Sorry, there are no images matching your search query.Please try again.');
     
  }

   loadMoreBtn.show();
   clearImagesContainer();

   hitSumm = 0;
    fetchImages(); 
    //appendImagesMarkup(hits);
   }

function clearImagesContainer () {
    refs.galleryContainer.innerHTML = '';
}
 //observer.observe(refs.loadMoreBtn);     
function onLoadMore() {      
  imagesApiService.incrementPage();
  fetchImages();
}   
  
async function fetchImages(){
       loadMoreBtn.disable(); 
       const r = await imagesApiService.fetchImages();
       const { hits, total } = r;   
      hitSumm += hits.length;

      if (!hits.length) {
        Notify.warning(`Sorry, there are no images matching your search query. Please try again.`);
        //loadMoreBtn.disable();
        refs.loadMoreBtn.classList.add('is-hidden');
        return;
      };  

       appendImagesMarkup(hits);
       hitSumm += hits.length;

    if (hitSumm < total) {
    
        Notify.success(`Hooray! We found ${total} images !!!`);   
        //refs.loadMoreBtn.classList.remove('is-hidden');
        loadMoreBtn.enable();
    }
    
    if (hitSumm >= total) {
      refs.loadMoreBtn.classList.add('is-hidden');
        Notify.info(
            'We re sorry, but you have reached the end of search results.'
            
            );
    }
  }
  
function appendImagesMarkup(hits) {
    const markup = hits.map(({
         webformatURL, 
          largeImageURL, 
          tags, 
          likes, 
          views,
          comments,
          downloads
         }) => {
         return `
         <div class="photo-card">
         <a class="gallery__item" href="${largeImageURL}">
         <img class="photo-img" src="${webformatURL}" alt="${tags}"  width = "320" height = "270" loading="lazy"/>
         </a>
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
       `
      }).join("");
   
         refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
         lightbox.refresh();
        }   

let lightbox = new SimpleLightbox('.gallery a', {
          captions: true,
          captionsData: 'alt',
          captionDelay: 250,
        });

