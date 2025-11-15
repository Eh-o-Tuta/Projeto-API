// URL base da API Rick and Morty
const API_BASE = 'https://rickandmortyapi.com/api/character';

// Armazena o link da próxima página para paginação
let nextUrl = API_BASE;

// Referências ao DOM
const cardsEl = document.getElementById('cards');
const loadingEl = document.getElementById('loading');
const loadMoreBtn = document.getElementById('loadMore');
const searchInput = document.getElementById('search');

/**
 * Função que busca personagens da API
 * Recebe uma URL (páginas, filtros...)
 */
async function fetchCharacters(url) {
  loadingEl.style.display = 'block';

  try {
    const res = await fetch(url);

    // Caso ocorra falha no servidor
    if (!res.ok) throw new Error('Erro na requisição');

    // Converte JSON
    const data = await res.json();

    // Guarda a próxima página da API
    nextUrl = data.info && data.info.next ? data.info.next : null;

    // Cria os cards na tela
    renderCharacters(data.results);

  } catch (err) {
    console.error(err);

    const errEl = document.createElement('div');
    errEl.textContent = 'Falha ao carregar dados.';
    cardsEl.appendChild(errEl);

  } finally {
    loadingEl.style.display = 'none';
  }
}

/**
 * Cria e exibe os cards de personagens
 */
function renderCharacters(list) {
  list.forEach(ch => {

    // Cria o card
    const card = document.createElement('article');
    card.className = 'card';

    // === IMAGEM ===
    const imgWrap = document.createElement('div');
    imgWrap.className = 'img';

    const img = document.createElement('img');
    img.src = ch.image;
    img.alt = ch.name;

    imgWrap.appendChild(img);
    card.appendChild(imgWrap);

    // === CONTEÚDO DO CARD ===
    const body = document.createElement('div');
    body.className = 'body';

    // Nome
    const h3 = document.createElement('h3');
    h3.textContent = ch.name;
    body.appendChild(h3);

    // Metadados (status + origem)
    const meta = document.createElement('div');
    meta.className = 'meta';

    const status = document.createElement('span');
    status.className = 'status';
    status.textContent = ch.status + ' — ' + ch.species;

    // Aplica classe vermelha se estiver morto
    if (ch.status === 'Dead') status.classList.add('bad');

    meta.appendChild(status);

    // Origem
    const origin = document.createElement('span');
    origin.textContent = ch.origin?.name || 'Unknown';
    meta.appendChild(origin);

    body.appendChild(meta);
    card.appendChild(body);

    // Adiciona card no container
    cardsEl.appendChild(card);
  });
}

// Evento botão "Carregar mais"
loadMoreBtn.addEventListener('click', () => {
  if (nextUrl) fetchCharacters(nextUrl);
});

// Evento: busca dinâmica por nome
searchInput.addEventListener('input', e => {
  const q = e.target.value.trim().toLowerCase();

  // Limpa resultados
  cardsEl.innerHTML = '';

  // Se campo vazio → retorna ao início
  if (q === '') {
    nextUrl = API_BASE;
    fetchCharacters(nextUrl);
  } else {
    // Pesquisa na API: /character?name=...
    fetchCharacters(`${API_BASE}?name=${encodeURIComponent(q)}`);
  }
});

// Primeira carga
fetchCharacters(nextUrl);
