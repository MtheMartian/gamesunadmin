export const titleOptions = {
  storeTitle: null,
  openEdit: false,
  searchedTitles: null,
 }
 
 export async function getTitles(){
  try{
    const response = await fetch('/admintools.gamesportal/gettitles', {
      method: 'get',
    });
    const data = await response.json();
    console.log(data);
    return data;
  }
  catch(err){
    console.log(err);
  }
};

export async function getSpecificTitle(event){
  console.log(event);
  const title = event.target.id;
  try{
    const response = await fetch(`/api/games/${title}`,{
      method: 'get',
    });
    const data = await response.json();
    console.log(data);
    titleOptions.storeTitle = data;
    titleOptions.openEdit = true;
  }
  catch(err){
    console.log(err);
  }
}

export async function searchTitles(){
  const input = document.getElementById('search-titles').value.toLowerCase();

  try{
    const response = await fetch(`/api/games/search?entry=${input.length === 0 || input[0] === " " ? "{Empty}" : input}`,{
      method: "GET",
    });
    const data = await response.json();
    titleOptions.searchedTitles = data;
  }
  catch(err){
    console.log(err);
  }
}

// Requests
export async function getReviews(){
  try{
    const response = await fetch(`/api/reviews`);
    return await response.json();
  }
  catch(err){
    console.log(`Was unable to obtain the reviews! ${err}`);
  }
}

function sliceUrl(url){
  let startingIndex = 0;
  let slashCount = 0;
  for(let i = 0; i < url.length; i++){
    if(url[i] === '/' && slashCount < 3){
      slashCount++;
      startingIndex = i;
    }
    if(slashCount === 3) break;
  }
  return url.slice(startingIndex);
}

export async function checkAuth(){
  try{
    const response = await fetch(`/admins/auth`,{
      method: 'get',
    });
    if(!response.redirected){
        return await response.json();
    }
    else if(!window.location.href.includes("/signin")){
      return sliceUrl(response.url);
    }
    return;
  }
  catch(err){
    console.log(`Something went wrong with the auth. ${err}`);
  }
}

export async function getGames(){
  try{
    const response = await fetch(`/api/games`);
    return await response.json();
  }
  catch(err){
    console.log(`Was unable to obtain the titles! ${err}`);
  }
}