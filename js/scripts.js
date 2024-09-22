// Pegamos os elementos do DOM para poder manipular depois
const pokemonName = document.querySelector('.nome_pokemon');
const pokemonNumber = document.querySelector('.numero_pokemon');
const pokemonImage = document.querySelector('.pokemon__image');

const pokemonTypes = document.querySelector('.tipo');
const pokemonStats = document.querySelector('.status');
const pokemonAbilities = document.querySelector('.habilidades');
const pokemonWeight = document.querySelector('.peso');
const pokemonHeight = document.querySelector('.Altura');
const pokemonCaptureRate = document.querySelector('.taxa_captura');

const form = document.querySelector('.form');
const input = document.querySelector('.pesquisa');
const buttonPrev = document.querySelector('.anter');
const buttonNext = document.querySelector('.prox');

let searchPokemon = 1; // Iniciamos com o primeiro Pokémon

// Função que busca os dados do Pokémon na API
const fetchPokemon = async (pokemon) => {
  try {
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    if (!APIResponse.ok) {
      throw new Error(`Pokemon ${pokemon} não encontrado`);
    }
    return await APIResponse.json(); // Retorna os dados se tudo der certo
  } catch (error) {
    console.error(error);
    return null; // Se der erro, retorna null
  }
};

// Função para pegar informações adicionais da espécie do Pokémon
const fetchPokemonSpecies = async (speciesUrl) => {
  try {
    const speciesResponse = await fetch(speciesUrl);
    if (!speciesResponse.ok) {
      throw new Error('Dados da espécie não encontrados');
    }
    return await speciesResponse.json(); // Retorna os dados da espécie
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Atualiza os dados do Pokémon na tela
const updatePokemonData = async (data) => {
  pokemonImage.style.display = 'block'; // Mostra a imagem do Pokémon
  pokemonName.innerHTML = data.name; // Nome do Pokémon
  pokemonNumber.innerHTML = data.id; // Número na Pokédex
  pokemonImage.src = data.sprites.versions['generation-v']['black-white'].animated.front_default; // Imagem animada do Pokémon
  input.value = ''; // Limpa o campo de busca
  searchPokemon = data.id; // Atualiza o Pokémon atual

  // Atualiza tipos, estatísticas, habilidades, peso e altura
  const types = data.types.map(typeInfo => typeInfo.type.name).join(', '); // Pega os tipos e junta com vírgula
  pokemonTypes.innerHTML = types; // Exibe os tipos

  const stats = data.stats.map(stat => `${stat.stat.name}: ${stat.base_stat}`).join(', '); // Formata as estatísticas
  pokemonStats.innerHTML = stats; // Exibe as estatísticas

  const abilities = data.abilities.map(abilityInfo => abilityInfo.ability.name).join(', '); // Pega as habilidades
  pokemonAbilities.innerHTML = abilities; // Exibe as habilidades

  const weight = data.weight / 10; // Peso em kg
  const height = data.height / 10; // Altura em metros
  pokemonWeight.innerHTML = weight; // Exibe o peso
  pokemonHeight.innerHTML = height; // Exibe a altura

  // Busca a taxa de captura no endpoint da espécie
  const speciesData = await fetchPokemonSpecies(data.species.url);
  if (speciesData) {
    const captureRate = speciesData.capture_rate;
    pokemonCaptureRate.innerHTML = captureRate; // Exibe a taxa de captura
  } else {
    pokemonCaptureRate.innerHTML = 'Indisponível'; // Caso não consiga, exibe que não está disponível
  }
};

// Função para exibir uma mensagem quando o Pokémon não é encontrado
const showNotFoundMessage = () => {
  pokemonImage.style.display = 'none'; // Esconde a imagem
  pokemonName.innerHTML = 'Não encontrado :c'; // Mensagem de erro
  pokemonNumber.innerHTML = '';
  pokemonTypes.innerHTML = '';
  pokemonStats.innerHTML = '';
  pokemonAbilities.innerHTML = '';
  pokemonWeight.innerHTML = '';
  pokemonHeight.innerHTML = '';
  pokemonCaptureRate.innerHTML = '';
};

// Função principal que renderiza os dados do Pokémon
const renderPokemon = async (pokemon) => {
  pokemonName.innerHTML = 'Carregando...'; // Exibe mensagem enquanto carrega
  pokemonNumber.innerHTML = '';
  
  const data = await fetchPokemon(pokemon); // Busca os dados do Pokémon

  if (data) {
    updatePokemonData(data); // Atualiza os dados na tela
  } else {
    showNotFoundMessage(); // Exibe mensagem de não encontrado se der erro
  }
};

// Eventos de clique e submit
form.addEventListener('submit', (event) => {
  event.preventDefault(); // Previne o comportamento padrão do form
  renderPokemon(input.value.toLowerCase()); // Busca pelo Pokémon digitado
});

buttonPrev.addEventListener('click', () => {
  if (searchPokemon > 1) {
    searchPokemon -= 1; // Vai para o Pokémon anterior
    renderPokemon(searchPokemon);
  }
});

buttonNext.addEventListener('click', () => {
  searchPokemon += 1; // Vai para o próximo Pokémon
  renderPokemon(searchPokemon);
});

// Renderiza o Pokémon inicial
renderPokemon(searchPokemon);

window.onload = function() {
  const gifOverlay = document.getElementById('gif-overlay');

  // Oculta o GIF após 2.9 segundos
  setTimeout(() => {
    gifOverlay.style.visibility = 'hidden'; // Torna invisível
    gifOverlay.style.display = 'none'; // Remove da tela
  }, 3600);
};






