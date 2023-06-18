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

export function checkIfServerOn(){
  fetch(process.env.REACT_APP_WE_SERVIN)
  .then(response => response.json())
  .then(data =>{
    if(typeof data === "boolean" && data === true){
      return data;
    }
  })
  .catch(err =>{
    console.log("Something went wrong!" + err);
  })
}


