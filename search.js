// Use TMDB API

const API_KEY = 'api_key=a262fb1998a2c64c05a5d5e7a7635772'; 
const BASE_URL = 'https://api.themoviedb.org/3';
const DISCOVER = '/discover/movie?sort_by=';
const DEFAULT_SORT = 'popularity.desc&'; 
const NEW_RELEASE = 'release_date.desc&';
const HIGH_SCORE = 'vote_average.desc&';
const LOW_SCORE = 'vote_average.asc&';
const API_URL = BASE_URL + DISCOVER + DEFAULT_SORT + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const SEARCH_URL = BASE_URL + '/search/movie?' + API_KEY;

const genres = [
    {
        "id":28,
        "name":"Action"
    },
    {
        "id":12,
        "name":"Adventure"
    },
    {
        "id":16,
        "name":"Animation"
    },
    {
        "id":35,
        "name":"Comedy"
    },
    {
        "id":80,
        "name":"Crime"
    },
    {
        "id":99,
        "name":"Documentary"
    },
    {
        "id":18,
        "name":"Drama"
    },
    {
        "id":10751,
        "name":"Family"
    },
    {
        "id":14,
        "name":"Fantasy"
    },
    {
        "id":36,
        "name":"History"
    },
    {
        "id":27,
        "name":"Horror"
    },
    {
        "id":10402,
        "name":"Music"
    },
    {
        "id":9648,
        "name":"Mystery"
    },
    {
        "id":10749,
        "name":"Romance"
    },
    {
        "id":878,
        "name":"Science Fiction"
    },
    {
        "id":10770,
        "name":"TV Movie"
    },
    {
        "id":53,
        "name":"Thriller"
    },
    {
        "id":10752,
        "name":"War"
    },
    {
        "id":37,
        "name":"Western"
    }
]

const main = document.getElementById('main'); 
const form = document.getElementById('form'); 
const tags = document.getElementById('tags');

const pop = document.getElementById("pop");
const new_release = document.getElementById('new'); 
const high_score = document.getElementById('highscore');
const low_score = document.getElementById('lowscore');

const prev = document.getElementById('prev'); 
const next = document.getElementById('next');
const curr = document.getElementById('current'); 

var selectedGenre = []

var currPage = 1; 
var nextPage = 2; 
var prevPage = 3; 
var lastUrl = ''; 
var totalPages = 100; 

setGenre(); 

// Dynamically initialize each genre tag and choose genre(s). 
function setGenre() {
    tags.innerHTML='';
    genres.forEach(genre => {
        const t = document.createElement('div'); 
        t.classList.add('tag'); 
        t.id = genre.id; 
        t.innerText = genre.name; 
        t.addEventListener('click', () => {
            if (selectedGenre.length == 0) {
                selectedGenre.push(genre.id); 
            } else {
                if (selectedGenre.includes(genre.id)) {
                    selectedGenre.forEach((id, index) => {
                        if (id == genre.id) {
                            selectedGenre.splice(index, 1); 
                        }
                    })
                } else {
                    selectedGenre.push(genre.id); 
                }
            }
            getMovies(API_URL + '&with_genres=' + encodeURI(selectedGenre.join(',')))
            highlightTag()
        })
        tags.append(t); 
    })
}

// Highlight the selected tag. 
function highlightTag() {
    const tags = document.querySelectorAll('.tag'); 
    tags.forEach(tag => {
        tag.classList.remove('highlight')
    })
    if (selectedGenre.length != 0) {
        selectedGenre.forEach(id => {
            const highlightedTag = document.getElementById(id); 
            highlightedTag.classList.add('highlight'); 
        })
    }
}

// Clear any previosuly selected genre tags. 
function clear() {
    let clearBtn = document.getElementById('clear'); 
    if (clearBtn) {
        clearBtn.classList.add('clear')
    } else {
        let clear = document.createElement('div'); 
        clear.classList.add('tag', 'clear'); 
        clear.id = 'clear'; 
        clear.innerText = 'Clear All'; 
        clear.addEventListener('click', () => {
            selectedGenre = [];
            setGenre();
            getMovies(API_URL);
        })
        tags.append(clear); 
    }
}

getMovies(API_URL);

// Use TMDB API to send request for movie data. 
function getMovies(url) {
    lastUrl = url;
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results); 
        if (data.results.length !== 0) {
            showMovies(data.results);
            currPage = data.page; 
            nextPage = currPage + 1; 
            prevPage = currPage - 1;
            totalPages = data.total_pages; 
            
                      
            current.innerText = currPage; 
            // Toggle page navigation options. 
            if (currPage <= 1) {
                prev.classList.add('disabled');
                next.classList.remove('disabled')
            } else if (currPage >= totalPages) {
                prev.classList.remove('disabled'); 
                next.classList.add('disabled')
            } else {
                prev.classList.remove('disabled');
                next.classList.remove('disabled') 
            }
            nav.scrollIntoView({behavior : 'smooth'})
            
        } else {
            main.innerHTML = `<h1 class="no-results"> No Results Found </h1>`
        }
    })
}

// Display movie information as an HTML element for the website. 
function showMovies(data) {
    main.innerHTML = ''; 
    
    data.forEach(movie => {
        const {title, poster_path, vote_average, overview} = movie; 
        const movieObj = document.createElement('div'); 
        movieObj.classList.add('movie'); 
        movieObj.innerHTML = `
            <img src="${poster_path? IMG_URL+poster_path: "http://via.placeholder.com/1080x1580" }" alt="${title}">

            <div class="movie-info">
                <h3> ${title} </h3>
                <span class ="${getColor(vote_average)}"> ${vote_average} </span>
            </div>

            <div class = "overview">
                <h3> Plot </h3>
                ${overview}
            </div>      
        `
        main.appendChild(movieObj); 
    })
}

// Determine the color that the vote average should be displayed in. 
function getColor(vote) {
    if (vote >= 8.0) {
        return 'green'
    } else if (vote >= 5) {
        return 'orange'
    } else {
        return 'red'
    }
}

// Sort by popularity descending (default)
pop.addEventListener('click', () => {
    getMovies(API_URL); 
})

// Sort by upcoming releases
new_release.addEventListener('click', () => {
    const NEW_URL = BASE_URL + DISCOVER + NEW_RELEASE + API_KEY; 
    getMovies(NEW_URL); 
})

// Sort by vote average descending
high_score.addEventListener('click', () => {
    const HS_URL = BASE_URL + DISCOVER + HIGH_SCORE + API_KEY; 
    getMovies(HS_URL); 
})

// Sort by vote average ascending
low_score.addEventListener('click', () => {
    const LS_URL = BASE_URL + DISCOVER + LOW_SCORE + API_KEY; 
    getMovies(LS_URL); 
})

// Link search form to movie API.
form.addEventListener('submit', (e) => {
    e.preventDefault(); 

    const searchTerm = search.value; 
    selectedGenre=[]; 
    highlightTag();
    if(searchTerm) {
        getMovies(SEARCH_URL + '&query=' + searchTerm)
    } else {
        getMovies(API_URL); 
    }
})

// Go to previous page when clicked.
prev.addEventListener('click', () => {
    if (prevPage > 0) {
        pageCall(prevPage);
    }
})

// Go to next page when clicked.
next.addEventListener('click', () => {
    if (nextPage <= totalPages) {
        pageCall(nextPage);
    }
})

// Go to specified page by querying and modifying url. 
function pageCall(page) {
    let urlSplit = lastUrl.split('?'); 
    let queryParams = urlSplit[1].split('&');
    let key = queryParams[queryParams.length-1].split('='); 
    if (key[0] != 'page') {
        let url = lastUrl + "&page=" + page
        getMovies(url); 
    } else {
        key[1] = page.toString(); 
        let a = key.join('='); 
        queryParams[queryParams.length-1] = a; 
        let b = queryParams.join('&'); 
        let url = urlSplit[0] + '?' + b
        getMovies(url); 
    }
}
