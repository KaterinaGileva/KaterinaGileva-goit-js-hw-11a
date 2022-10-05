import axios from "axios";
 
 export default class ImagesApiService { 
constructor () {
this.searchQ = "";
this.page = 1;
this.PER_PAGE = 40;
}
async fetchImages() {
  
  const axiosOptions = {
    method: 'get',
    url: 'https://pixabay.com/api/',
    params: {
      key: '30239587-3f20dad8b68c1db6bb7cff5e0',
      q: `${this.searchQ}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: `${this.page}`,
      per_page: `${this.PER_PAGE}`,     
  }
  };
   try{
    const response = await axios(axiosOptions);
    const data = response.data;
    console.log(data)
    return data;
  } catch (error) {
    console.error(error);
  }
}   

incrementPage() {
  this.page += 1;
}
  
resetPage() {
  this.page = 1;
}

resetEndOfHits() {
  this.endOfHits = false;
}  

get searchQuery() {
return this.searchQ;
}

set searchQuery(newQuery){
  this.searchQ = newQuery;
  }
}