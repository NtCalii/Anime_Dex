const cardElement = document.querySelector('.card');
const slideshowDiv = cardElement.querySelector('.slideshow');
const loadingMessage = slideshowDiv.querySelector('.loading-message');

let currentSlideIndex = 0;
let slideshowInterval;
const slideDuration = 3000;

async function fetchPopularAnimes() {
    try {
        const response = await fetch("https://api.jikan.moe/v4/top/anime?type=tv&filter=bypopularity&limit=20");
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        const animesWithImages = data.data.filter(anime => anime.images && anime.images.webp && anime.images.webp.large_image_url);

        return animesWithImages.slice(0, 20); 

    } catch (error) {
        console.error("Erro ao buscar animes populares:", error);
        if (loadingMessage) {
            loadingMessage.textContent = "Erro ao carregar animes populares.";
        }
        return [];
    }
}

function createSlides(animes) {
    if (animes.length === 0) {
        if (loadingMessage) {
            loadingMessage.textContent = "Nenhum anime popular encontrado para exibir.";
        }
        return;
    }

    if (loadingMessage) {
        loadingMessage.style.display = "none";
    }

    animes.forEach((anime, index) => {
        const img = document.createElement("img");
        img.src = anime.images.webp.large_image_url;
        img.alt = anime.title; 
        
        slideshowDiv.appendChild(img); 

        if (index === 0) {
            img.classList.add('active');
        }
    });

    startSlideshow();
}

function showNextSlide() {
    const slides = slideshowDiv.querySelectorAll("img");
    if (slides.length === 0) return;

    slides[currentSlideIndex].classList.remove("active");

    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    
    slides[currentSlideIndex].classList.add("active");
}

function startSlideshow() {
    clearInterval(slideshowInterval);
    slideshowInterval = setInterval(showNextSlide, slideDuration);
}

document.addEventListener('DOMContentLoaded', async () => {
    const animes = await fetchPopularAnimes();
    createSlides(animes);
});

//////////////////////////////////////////////////////////////////////

const inputBusca = document.getElementById('inputBusca');
const btnBuscar = document.getElementById('btnBuscar');
const resultadosDiv = document.getElementById('resultados');

// Função para buscar animes/mangás na Jikan API
async function buscarAnimesOuMangas(query) {
    if (!query) {
        resultadosDiv.innerHTML = '<p class="no-results">Por favor, digite algo para buscar.</p>';
        return;
    }

    resultadosDiv.innerHTML = '<p class="no-results">Buscando...</p>';

    try {
        // Busca por animes
        const responseAnime = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=10`);
        const dataAnime = await responseAnime.json();
        const animes = dataAnime.data;

        // Busca por mangás
        const responseManga = await fetch(`https://api.jikan.moe/v4/manga?q=${query}&limit=5`);
        const dataManga = await responseManga.json();
        const mangas = dataManga.data;

        displayResultados(animes, mangas);

    } catch (error) {
        console.error('Erro ao buscar na Jikan API:', error);
        resultadosDiv.innerHTML = '<p class="no-results">Ocorreu um erro ao buscar. Tente novamente mais tarde.</p>';
    }
}

// Função para exibir os resultados
function displayResultados(animes, mangas) {
    resultadosDiv.innerHTML = '';

    if ((!animes || animes.length === 0) && (!mangas || mangas.length === 0)) {
        resultadosDiv.innerHTML = '<p class="no-results">Nenhum anime ou mangá encontrado para sua busca.</p>';
        return;
    }

    // Exibir resultados de animes
    if (animes && animes.length > 0) {
        const animeSectionTitle = document.createElement('h2');
        animeSectionTitle.textContent = 'Animes Encontrados';
        animeSectionTitle.style.width = '100%';
        animeSectionTitle.style.textAlign = 'center';
        animeSectionTitle.style.marginBottom = '20px';
        animeSectionTitle.style.color = 'white';
        resultadosDiv.appendChild(animeSectionTitle);

        animes.forEach(anime => {
            const animeCard = document.createElement('div');
            animeCard.classList.add('anime-card');

            const imageUrl = anime.images?.webp?.large_image_url || 'https://via.placeholder.com/300x450?text=Sem+Imagem';
            const title = anime.title || 'Título Desconhecido';
            const synopsis = anime.synopsis ? `${anime.synopsis.substring(0, 150)}...` : 'Nenhuma sinopse disponível.';
            const malLink = anime.url || '#';
            const type = anime.type || 'N/A';
            const episodes = anime.episodes || 'N/A';
            const score = anime.score || 'N/A';
            const status = anime.status || 'N/A';

            animeCard.innerHTML = `
                <img src="${imageUrl}" alt="${title} capa">
                <div class="anime-info">
                    <h3>${title}</h3>
                    <p><strong>Tipo:</strong> ${type}</p>
                    <p><strong>Episódios:</strong> ${episodes}</p>
                    <p><strong>Score:</strong> ${score}</p>
                    <p><strong>Status:</strong> ${status}</p>
                    <p>${synopsis}</p>
                    <a href="${malLink}" target="_blank">Ver no MyAnimeList</a>
                </div>
            `;
            resultadosDiv.appendChild(animeCard);
        });
    }

    // Exibir resultados de mangás
    if (mangas && mangas.length > 0) {
        const mangaSectionTitle = document.createElement('h2');
        mangaSectionTitle.textContent = 'Mangás Encontrados';
        mangaSectionTitle.style.width = '100%';
        mangaSectionTitle.style.textAlign = 'center';
        mangaSectionTitle.style.marginTop = '40px';
        mangaSectionTitle.style.marginBottom = '20px';
        mangaSectionTitle.style.color = 'white';
        resultadosDiv.appendChild(mangaSectionTitle);

        mangas.forEach(manga => {
            const mangaCard = document.createElement('div');
            mangaCard.classList.add('anime-card');

            const imageUrl = manga.images?.webp?.large_image_url || 'https://via.placeholder.com/300x450?text=Sem+Imagem';
            const title = manga.title || 'Título Desconhecido';
            const synopsis = manga.synopsis ? `${manga.synopsis.substring(0, 150)}...` : 'Nenhuma sinopse disponível.';
            const malLink = manga.url || '#';
            const type = manga.type || 'N/A';
            const chapters = manga.chapters || 'N/A';
            const volumes = manga.volumes || 'N/A';
            const score = manga.score || 'N/A';
            const status = manga.status || 'N/A';

            mangaCard.innerHTML = `
                <img src="${imageUrl}" alt="${title} capa">
                <div class="anime-info">
                    <h3>${title}</h3>
                    <p><strong>Tipo:</strong> ${type}</p>
                    <p><strong>Capítulos:</strong> ${chapters}</p>
                    <p><strong>Volumes:</strong> ${volumes}</p>
                    <p><strong>Score:</strong> ${score}</p>
                    <p><strong>Status:</strong> ${status}</p>
                    <p>${synopsis}</p>
                    <a href="${malLink}" target="_blank">Ver no MyAnimeList</a>
                </div>
            `;
            resultadosDiv.appendChild(mangaCard);
        });
    }
}

// Event Listeners
btnBuscar.addEventListener('click', () => {
    const query = inputBusca.value.trim();
    buscarAnimesOuMangas(query);
});

inputBusca.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const query = inputBusca.value.trim();
        buscarAnimesOuMangas(query);
    }
});
