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
export async function checkIfServerOn(){
  try{
    const response = await fetch(process.env.REACT_APP_WE_SERVIN);
    const data = await response.json();
    console.log(data);

  if(data){
    return data;
  }
  }
  catch(err){
    console.log(`Something went wrong! ${err}`);
  }
}

export async function getReviews(){
  try{
    const response = await fetch(`${process.env.REACT_APP_WE_SERVIN}/api/reviews`);
    return await response.json();
  }
  catch(err){
    console.log(`Was unable to obtain the reviews! ${err}`);
  }
}

export async function checkAuth(){
  try{
    const response = await fetch(`${process.env.REACT_APP_WE_SERVIN}/admins/auth`,{
      method: 'post',
      headers: {"Content-type": "application/json"},
      body: JSON.stringify(window.location.href)
    });
    if(!response.redirected){
        return await response.json();
    }
    setTimeout(()=>{
      window.location.href = response.url;
    }, 2000);
  }
  catch(err){
    console.log(`Something went wrong with the auth. ${err}`);
  }
}

export async function getGames(){
  try{
    const response = await fetch(`${process.env.REACT_APP_WE_SERVIN}/api/games`);
    return await response.json();
  }
  catch(err){
    console.log(`Was unable to obtain the titles! ${err}`);
  }
}