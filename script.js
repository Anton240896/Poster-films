const elem = {
    container: document.querySelector('.js-movie-list'),
    guard: document.querySelector('.js-guard')
};

const defaults = {
  poster: "https://www.reelviews.net/resources/img/default_poster.jpg",
  date: "XXXX-XX-XX",
  title: "Title not found",
  vote: "XX.XX",
};


const options = {
    // root: null,
    rootMargin: "300px",
    // threshold: 0,
  };

  let page = 1;

  const observer = new IntersectionObserver(infinityScroll, options);

  function infinityScroll(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        page += 1;
        serviceFilms(page)
          .then((data) => {
            elem.container.insertAdjacentHTML(
              "beforeend",
              createMarkup(data.results));
  
            if (data.page >= data.total_pages) {
              observer.observe(elem.guard);
            }
          })
          .catch((err) => {});
      }
    });
  }

function createMarkup(arr) {
  return arr
    .map(
      ({ poster_path, release_date, original_title, vote_average }) => `
    <li class="movie-card">
    <img src="${
      poster_path
        ? "https://image.tmdb.org/t/p/w300" + poster_path
        : defaults.poster
    }" alt="${original_title || defaults.title}">
    <div class="movie-info">
        <h2>${original_title || defaults.title}</h2>
        <p>Release Date: ${release_date || defaults.date}</p>
        <p>Vote Average: ${vote_average || defaults.vote}</p>
    </div>
</li>`
    )
    .join("");
}


serviceFilms()
.then((data) => {
elem.container.insertAdjacentHTML('beforeend', createMarkup(data.results));

if (data.page < data.total_pages) {
    observer.observe(elem.guard);
}
})
.catch(err => console.log(err))


function serviceFilms(currentPage = '1') {

    const URL =  'https://api.themoviedb.org/3/trending/movie/week';

    const params = new URLSearchParams({
        api_key: '64832fedcffbe340ec8c3c22e595e81f',
        page: currentPage,
    })
    return fetch(`${URL}?${params}`)
    .then((resp) => {
    if(!resp.ok) {
        throw new Error('Error');
}
    return resp.json()
});

}
