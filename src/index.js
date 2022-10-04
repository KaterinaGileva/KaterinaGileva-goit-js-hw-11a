import './css/styles.css';
import InfiniteScroll from 'infinite-scroll';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImagesApiService from './fetchImages';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";


const refs = {
    seachForm: document.querySelector('.search-form'),
    galleryContainer: document.querySelector('.gallery'),
    sentinel: document.querySelector('#sentinel')
};
let hitSumm = 0;
const imagesApiService = new ImagesApiService();

refs.seachForm.addEventListener('submit', onSearch);



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

   clearImagesContainer();

   hitSumm = 0;
    fetchImages(); 
    
   }

function clearImagesContainer () {
    refs.galleryContainer.innerHTML = '';
}
      

async function fetchImages(){
      
       const r = await imagesApiService.fetchImages();
       const { hits, total } = r;   
      hitSumm += hits.length;

      if (!hits.length) {
        Notify.warning(`Sorry, there are no images matching your search query. Please try again.`);
        return;
      };  

       appendImagesMarkup(hits);
       hitSumm += hits.length;

    if (hitSumm < total) {
    
        Notify.success(`Hooray! We found ${total} images !!!`);   
      }
    
    if (hitSumm >= total) {
     
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

        const onEntry = entries => {
          entries.forEach(entry => {
           
            if (entry.isIntersecting && imagesApiService.searchQuery !== '') {
             console.log ("Пора грузить статьи" + Date.now());
             imagesApiService.fetchImages().then(hits => {
                
               appendImagesMarkup(hits);
                
               imagesApiService.incrementPage();
              });   
           }
            });
          };
         
const observer = new IntersectionObserver(onEntry, {
  rootMargin: '150px',
});
observer.observe (refs.sentinel);

