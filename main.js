const NUM_POKEMON = 151;

const cardGrid = document.querySelector("#cards");

async function getPokemonData(id) {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) {
        alert(`While retrieving Pokémon #${id} data, encountered HTTP error: ${response.status}`);
        return;
    }
    let data = await response.json();

    return {
        id: data.id,
        name: data.name,
        image: data.sprites.front_default,
        types: parseTypes(data),
    }
}

function parseTypes(data) {
    let typeString = "";
    data.types.forEach((element) => {
        typeString += `, ${element.type.name}`;
    });
    return typeString.slice(2);
}

function createCardDiv(pokemon) {
    let card = document.createElement("div");
    card.setAttribute("class", "card");

    let cardId = document.createElement("span");
    cardId.setAttribute("class", "card-id");
    cardId.textContent = `#${pokemon.id}`;
    card.appendChild(cardId);
    
    let cardImage = document.createElement("img");
    cardImage.setAttribute("class", "card-image");
    cardImage.setAttribute("src", pokemon.image);
    cardImage.setAttribute("alt", `${pokemon.name} art`);
    card.appendChild(cardImage);

    let cardName = document.createElement("h1");
    cardName.setAttribute("class", "card-name");
    cardName.textContent = pokemon.name;
    card.appendChild(cardName);

    let cardType = document.createElement("span");
    cardType.setAttribute("class", "card-type");
    cardType.textContent = pokemon.types;
    card.appendChild(cardType);

    return card;
}

async function displayCards() {
    for (let i = 1; i <= NUM_POKEMON; i++) {
        cardGrid.appendChild(createCardDiv(await getPokemonData(i)));
    }
}

displayCards();