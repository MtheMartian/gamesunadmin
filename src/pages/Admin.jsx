import React, {useRef} from 'react';
import {getSpecificTitle, titleOptions, searchTitles,
        getReviews, checkAuth, getGames} from '../js/admin.js';
import '../css/admin.css';
import '../css/general.css';
import '../css/admin-menu.css';
import {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";

function EditForm({closeEditForm}){
  //Variables
  const [selectedTitleInfo, setSelectedTitle] = useState({
    imgUrl: "",
    videoUrl: "",
    summary: "",
    publisher: "",
    releaseDate: "",
    title: "",
    gamePlayVideo: "",
    genres: [],
    platforms: [],
    pcLinks: {},
    consoleLinks: {},
  });

  const genres = ["2D", "Action", "Adventure", 
    "FPS", "Open World", "Party", 
    "Puzzle", "Racing", "RPG", 
    "Sport", "Story Telling", "VR", "Fighting", "Roguelike"];

  const platforms = ["PC", "PS4", "PS5", "XSX", "XSS", "Switch"];

  const formTitle = useRef();  
  const formImage = useRef();
  const formSummary = useRef();
  const formTrailer = useRef();
  const formGameplay = useRef();
  const formPublisher = useRef();
  const formReleaseDate = useRef();
  const formTags = useRef();
  const formPlatforms = useRef();

  function setInfoEditForm(){
    const game = titleOptions.storeTitle;
    setSelectedTitle(prev=>({...prev, 
      imgUrl: game.imgURL,  videoUrl: game.videoURL, summary: game.summary,
      publisher: game.publisher, releaseDate: game.releaseDate, title: game.gameTitle,
      gamePlayVideo: game.gameplayVid, genres: game.tags, platforms: game.platforms,
      pcLinks: game.pcLinks, consoleLinks: game.consoleLinks}));
    document.querySelector('body').style.overflow = "hidden";
  };

  async function updateGame(){
    let tagsArray = [];
    let platformsArray = [];

    (function(){
      const tags = Array.from(document.getElementsByClassName("tags-options"));
      const platforms = Array.from(document.getElementsByClassName("platforms-options"));

      tags.forEach(element=>{
        if(element.selected){
          tagsArray.push(element.value);
        }
      });

      platforms.forEach(element=>{
        if(element.selected){
          platformsArray.push(element.value);
        }
      });
    })();

    const response = await fetch(`/api/games/update/cat/${titleOptions.storeTitle.id}`,{
      method: "put",
      headers: {"Content-type": "application/json"},
      body: JSON.stringify({
        "GameTitle": formTitle.current.value,
        "ImgURL": formImage.current.value,
        "Summary": formSummary.current.value,
        "VideoURL": formTrailer.current.value,
        "GameplayVid": formGameplay.current.value,
        "Publisher": formPublisher.current.value,
        "ReleaseDate": formReleaseDate.current.value,
        "Tags": tagsArray,
        "Platforms": platformsArray,
        "PcLinks":{
          "steam": document.getElementById("steam").value !== "" ? document.getElementById("steam").value : "",
          "epicStore": document.getElementById("epicStore").value !== "" ? document.getElementById("epicStore").value : "",
          "titleWeb": document.getElementById("titleWeb").value !== "" ? document.getElementById("titleWeb").value : "",
        },
        "ConsoleLinks":{
          "pStore": document.getElementById("pStore").value !== "" ? document.getElementById("pStore").value : "",
          "xbox": document.getElementById("xbox").value !== "" ? document.getElementById("xbox").value : "",
          "nintendo": document.getElementById("nintendo").value !== "" ? document.getElementById("nintendo").value : "",
          "bestBuy": document.getElementById("bestBuy").value !== "" ? document.getElementById("bestBuy").value : "",
          "gameStop": document.getElementById("gameStop").value !== "" ? document.getElementById("gameStop").value : "",
        }
      })
    });
    if(response.redirected){
      window.location.href = response.url;
    }
  }

  useEffect(()=>{
    setInfoEditForm();
  }, []);

  return(
    <div id="edit-form-container">
      <form id="edit-form" >
        <input type="text" name="title" placeholder='Title' 
              className='edit-input' defaultValue={selectedTitleInfo.title} ref={formTitle}/>
        <div className="edit-input-container">
          <img src={selectedTitleInfo.imgUrl} className="edit-form-image" alt="title"></img>
          <input type="url" name="image" placeholder='Image URL' 
                className='edit-input' defaultValue={selectedTitleInfo.imgUrl} ref={formImage}/>
        </div>
        <textarea name="summary" placeholder="Summary" 
              id='edit-summary' form="edit-form" defaultValue={selectedTitleInfo.summary} ref={formSummary}>
        </textarea>
        <div className="edit-input-container">
          <iframe src={selectedTitleInfo.videoUrl} title="title-trailer" className="edit-iframe"></iframe>
          <input type="url" name="trailer" placeholder="Trailer" 
                className='edit-input' defaultValue={selectedTitleInfo.videoUrl} ref={formTrailer}/>
        </div>
        <div className="edit-input-container">
          <iframe src={selectedTitleInfo.gamePlayVideo} title="title-gameplay" className="edit-iframe"></iframe>
          <input type="url" name="gameplay" placeholder='Gameplay Video' 
                className='edit-input' defaultValue={selectedTitleInfo.gamePlayVideo} ref={formGameplay}/>
        </div>
        <input type="text" name="publisher" placeholder='Publisher' 
              className='edit-input' defaultValue={selectedTitleInfo.publisher} ref={formPublisher}/>
        <input type="text" name="releaseDate" placeholder='Release Date (MM-DD-YY format)'
              className='edit-input' defaultValue={selectedTitleInfo.releaseDate} ref={formReleaseDate}/>
        <div id="edit-form-selects">
          <h2>Tags</h2>
            <select id="edit-tags" name="tags" multiple ref={formTags}>
              {genres.map((genre, index)=>
                <option key={`genre${index}`} value={genre}
                    selected={selectedTitleInfo.genres.includes(genre) ? true : false}
                    className="tags-options">
                  {genre}
                </option>)}
            </select>
            <h2>Platforms</h2>
            <select id="edit-platforms" name="platforms" multiple ref={formPlatforms}>
              {platforms.map((platform, index)=>
                <option key={`platform${index}`} value={platform} 
                    selected={selectedTitleInfo.platforms.includes(platform) ? true : false}
                    className="platforms-options">
                  {platform}
                </option>)}
            </select>
        </div>
        <div className="edit-form-links">
          <h2>PC Links</h2>
          {Object.keys(selectedTitleInfo.pcLinks).map((link, index)=>
            <input key={`pcLink${index}`} type="url" placeholder={link.toUpperCase()} className='edit-input'
                  name={link} defaultValue={selectedTitleInfo.pcLinks[link]}
                  id={link}/>)}
        </div>
        <div className="edit-form-links">
          <h2>Console Links</h2>
          {Object.keys(selectedTitleInfo.consoleLinks).map((link, index)=>
              <input key={`consoleLink${index}`}type="url" placeholder={link.toUpperCase()} className='edit-input'
                    name={link} defaultValue={selectedTitleInfo.consoleLinks[link]}
                    id={link}/>)}
        </div>
        <div id="edit-form-options">
          <button className="submit-game-card" onClick={updateGame}>Update</button>
          <button className="submit-game-card" onClick={closeEditForm}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

function ReviewSection() {
    const [reviews, setReviews] = useState([{
        displayName: "",
        gameReview: "",
        whenPosted: "",
        id: "",
    }]);

    async function deleReview(e) {
        try {
            const response = await fetch(`/api/reviews/deletereview/${e.currentTarget.id}`, {
                method: "delete"
            });
            const data = await response.json();
            if (data.message === "Success") {
                setReviews(prev => prev = data.data);
            }
            else {
                alert("Was unable to remove the review!");
            }
        }
        catch (err) {
            console.log("Couldn't do it!");
        }
    }

    useEffect(() => {
      async function retrieveReviews(){
        const fetchedReviews = await getReviews();
        setReviews(prev => prev = fetchedReviews);
      }
      retrieveReviews();

      return()=>{
        setReviews(prev => prev = 
          [{displayName: "",
          gameReview: "",
          whenPosted: "",
          id: ""
         }]);
      }
      
    }, []);

    return(
        <section id="reviews-section" className="admin-page-sections">
            <div className="admin-page-sections-title">
                <h1>Reviews</h1>
            </div>
            <div id="reviews-section-reviews">
                {reviews.map((review, index) => 
                    <div key={index} className="reviews-section-reviews-container">
                        <span className="review-display-name">{review.displayName}</span>
                        <span className="review-when-posted">{review.whenPosted}</span>
                        <div className="reviews-section-actual-review-wrapper">
                            <p className="reviews-section-actual-review">{review.gameReview}</p>
                        </div>
                        <div className="reviews-section-options-container">
                            <button className="reviews-section-remove-button"
                                onClick={deleReview} id={review.id}>
                                Remove
                            </button>
                        </div>
                    </div>)
                }
            </div>
        </section>
    );
}

function UserMenu({currentAdmin}) {

    return (
        <ul id="user-menu">
            <span>{currentAdmin.email}</span>
            <li>
                <a href="/signup">Register</a>
            </li>
            <li>
                <form action="/admins/signout" method="post">
                    <button type="submit">Sign Out</button>
                </form>
            </li>
        </ul>
    );
}

function Menu({adminPage, currentAdmin}) {
    const [userMenu, setUserMenu] = useState(null);
    const [isMenuOpen, adminMenu, adminMenuButton] = [useRef(null), useRef(null),
            useRef(null)];


    function showMenu() {
        if (userMenu === null) {
            setUserMenu(prev => prev = <UserMenu currentAdmin={currentAdmin} />);
            isMenuOpen.current = true;
            adminPage.current.style.overflowY = "hidden";
            adminMenu.current.style.display = "flex";
            adminMenuButton.current.style.background = "rgb(20, 20, 20)";
            adminMenuButton.current.style.width = "20%";
        }
        else {
            setUserMenu(prev => prev = null);
            isMenuOpen.current = false;
            adminPage.current.style.overflowY = "auto";
            adminMenu.current.style.cssText = "";
            adminMenuButton.current.style.cssText = "";
        }

    }

    return (
        <section id="admin-menu-wrapper">
            <button onClick={showMenu} id="admin-menu-button" ref={adminMenuButton}>Menu</button>
            <div id="admin-menu" ref={adminMenu}>
                <nav id="admin-menu-nav">
                    {userMenu}
                </nav>
            </div>
        </section>
        );
}

//------------------ Admin Tools page ---------------------//
export default function Admin(){
  const genres = ["2D", "Action", "Adventure", 
    "FPS", "Open World", "Party", 
    "Puzzle", "Racing", "RPG", 
    "Sport", "Story Telling", "VR", "Fighting", "Roguelike"];

  const platforms = ["PC", "PS4", "PS5", "XSX", "XSS", "Switch"];

//Redirect
const navigate = useNavigate();
//Titles useStates
  const [titles, setTitles] = useState([]);
//Edit Form useStates
  const [editForm, setEditForm] = useState(null);

// Admin Page variables
    const adminPage = useRef(null);
    const [currentAdmin, setCurrentAdmin] = useState(null);

//Game Creation variables
    const [createFormTitle, createFormImg, createFormVid, createFormPublisher,
        createFormSummary, createFormReleaseDate] = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

//Functions for the edit button
  function editFormFunctions(event){
    getSpecificTitle(event);
    setTimeout(renderEditForm, 1000);
  }

  function renderEditForm(){
    if(titleOptions.storeTitle !== null){
      setEditForm(<EditForm closeEditForm={closeEditForm} />);
    }
    else{
      setTimeout(renderEditForm, 1000);
    }
  }

  function closeEditForm(event){
    setEditForm(null);
    document.querySelector('body').style.overflow = "auto";
    event.preventDefault();
  }

//Function for uploading image
  function showUploadForm(event){
    event.currentTarget.style.opacity = '1';
    event.currentTarget.style.background = "rgba(32, 32, 32, 1)";
    event.currentTarget.children.item(0).style.visibility = "visible";
    event.currentTarget.children.item(1).style.visibility = "visible";
  }

  async function searchFunctions(){
    await searchTitles();
    setTitles(prev => prev = titleOptions.searchedTitles);
    }

    async function submitGame() {
        let tagsArray = [];
        let platformsArray = [];

        (function () {
            const tags = Array.from(document.getElementsByClassName("tags-option"));
            const platforms = Array.from(document.getElementsByClassName("platforms-option"));

            tags.forEach(tag => {
                if (tag.selected) {
                    tagsArray.push(tag.value);
                }
            });

            platforms.forEach(platform => {
                if (platform.selected) {
                    platformsArray.push(platform.value);
                }
            });
        })();

        const response = await fetch(`/api/games/create`, {
            method: "post",
            headers: { "Content-type": "application/json" },
            redirect: 'follow',
            body: JSON.stringify({
                "GameTitle": createFormTitle.current.value,
                "Tags": tagsArray,
                "Platforms": platformsArray,
                "ImgURL": createFormImg.current.value,
                "VideoURL": createFormVid.current.value,
                "Summary": createFormSummary.current.value,
                "Publisher": createFormPublisher.current.value,
                "ReleaseDate": createFormReleaseDate.current.value,
            })
        });
        if(response.redirected){
          window.location.href = response.url;
        }
    } 

    useEffect(() => { 
        async function runThis(){
          const response = await checkAuth();
          if(typeof response === "string"){
              navigate(response);
          }
          else{
            setCurrentAdmin(prev => prev = response);
          }  
      }
      runThis();

      return()=>{
        setCurrentAdmin(prev => prev = null);
      }
    }, []);

//Get titles and append them to the page
  useEffect(()=>{
    async function retrieveGames(){
      const fetchedGames = await getGames();
      setTitles(prev => prev = fetchedGames);
    }
    retrieveGames();

    return()=>{
      setTitles(prev => prev = []);
    }
  }, []);
  
  return(
    <div id="admin-page" ref={adminPage}>
        {currentAdmin != null ? <Menu adminPage={adminPage} currentAdmin={currentAdmin} /> : null}
        <h1>Admin Tools</h1>
        <div id="title-creation-container">
          <div className="tool-title">
            <h2>Title Creation</h2>
          </div>
          <div id="title-creation-form">
            <div id="input-section">
              <input type="text" id="game-title" placeholder="Game Title" className="title-creation-input"
                      ref={createFormTitle}>
              </input>
              <input type='url' id="image-link" placeholder="Image URL" className="title-creation-input"
                      ref={createFormImg}>
              </input>
              <input type='url' id="video-link" placeholder="Video URL" className="title-creation-input"
                      ref={createFormVid}>
              </input>
              <input type='text' id="title-publisher" placeholder="Publisher" className="title-creation-input"
                      ref={createFormPublisher}>
              </input>
              <input type='text' id="release-date" placeholder="Release Date (MM-DD-YYYY format)" className="title-creation-input"
                    ref={createFormReleaseDate}>
              </input>
              <button className="submit-game-card" onClick={submitGame}>Submit</button>
            </div>
            <div id="title-descriptions">
              <div id="list-section">
                <div className='list-section-container'>
                  <p>Tags</p>
                  <select id="game-tags" multiple>
                    {genres.map((genre, index)=>
                      <option key={`tags${index}`}value={genre} className="tags-option">{genre}</option>)}
                  </select>
                </div>
                <div className='list-section-container'>
                  <p>Platforms</p>
                  <select id="platforms-available" multiple>
                    {platforms.map((platform, index)=>
                      <option key={`plat${index}`} value={platform} className="platforms-option">{platform}</option>)}
                  </select>
                </div>
              </div>
              <textarea placeholder='Summary of title' ref={createFormSummary}>
              </textarea>
            </div>
          </div>
        </div>
        <section id="titles-section">
          <div id="titles-section-header">
            <h2>Titles</h2>
            <input type="text" placeholder='Search for titles' 
                        id="search-titles" onKeyUp={searchFunctions}/>
          </div>
          <div id="titles">
            {titles.map((title, index)=>
              <div key={index} className="title-container">
                <div className="titles-section-image-wrapper">
                  <form action={`/api/games/upload/${title.id}`} encType="multipart/form-data" 
                      method="POST" className="image-upload-form"
                      onClick={showUploadForm}>
                    <input type="file" name="image" className="image-upload"/>
                    <button type="submit" className="image-upload-submit">Submit</button>
                  </form>
                  <img src={title.imgURL} alt="title" className="title-image"></img>
                </div>
                <p>{title.title}</p>
                <div className="title-options">
                  <button style={{background:"rgb(42, 221, 42)"}} 
                          id={title.id} onClick={editFormFunctions} className="edit-button">
                          Edit
                  </button>
                  <form action={`api/games/delete/${title.id}`} method="POST">
                    <button style={{background: "red"}} type="submit">Delete</button>
                  </form>
                </div>
              </div>)}
          </div>
        </section>
        <ReviewSection />
        {editForm}
    </div>
  );
}