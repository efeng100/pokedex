const NUM_POKEMON = 151;

const body = document.querySelector("body");
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
        type: parseType(data),
    }
}

function parseType(data) {
    let typeString = "";
    data.types.forEach((element) => {
        typeString += `, ${element.type.name}`;
    });
    return typeString.slice(2);
}

function createCardDiv(pokemon) {
    let card = document.createElement("div");
    card.classList.add("card");

    let cardId = document.createElement("span");
    cardId.classList.add("card-id");
    cardId.textContent = `#${pokemon.id}`;
    card.appendChild(cardId);
    
    let cardImage = document.createElement("img");
    cardImage.classList.add("card-image");
    cardImage.setAttribute("src", pokemon.image);
    cardImage.setAttribute("alt", `${pokemon.name} art`);
    card.appendChild(cardImage);

    let cardName = document.createElement("h1");
    cardName.classList.add("card-name");
    cardName.textContent = pokemon.name;
    card.appendChild(cardName);

    let cardType = document.createElement("span");
    cardType.classList.add("card-type");
    cardType.textContent = pokemon.type;
    card.appendChild(cardType);

    card.addEventListener("click", displayDetailedCard);

    return card;
}

async function displayCards() {
    for (let i = 1; i <= NUM_POKEMON; i++) {
        cardGrid.appendChild(createCardDiv(await getPokemonData(i)));
    }
}

async function getDetailedPokemonData(id) {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) {
        alert(`While retrieving Pokémon #${id} data, encountered HTTP error: ${response.status}`);
        return;
    }
    let basicData = await response.json();

    response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    if (!response.ok) {
        alert(`While retrieving Pokémon #${id} species data, encountered HTTP error: ${response.status}`);
        return;
    }
    let speciesData = await response.json();

    let height = basicData.height*10;
    let weight = basicData.weight/10;

    let genus;
    speciesData.genera.forEach((element) => {
        if (element.language.name === "en") {
            genus = element.genus;
            return;
        }
    });

    let flavorText;
    speciesData.flavor_text_entries.forEach((element) => {
        if (element.language.name === "en" && element.version.name === "omega-ruby") {
            flavorText = element.flavor_text;
            return;
        }
    });

    return {
        id: basicData.id,
        name: basicData.name,
        image: basicData.sprites.front_default,
        type: parseType(basicData),
        height,
        weight,
        genus,
        flavorText,
    }
}

async function displayDetailedCard(event) {
    let selectedCard = event.target;
    if (!selectedCard.classList.contains("card")) {
        selectedCard = selectedCard.parentNode;
    }
    let id = +selectedCard.querySelector(".card-id").textContent.slice(1);
    let pokemon = await getDetailedPokemonData(id);

    let card = document.createElement("div");
    card.classList.add("detailed-card");

    // Detailed Card Close Button
    let cardCloseButton = document.createElement("div");
    cardCloseButton.classList.add("detailed-card-close-button");
    cardCloseButton.textContent = "X";
    cardCloseButton.addEventListener("click", removeDetailedCard);
    card.appendChild(cardCloseButton);

    // Detailed Card Image
    let cardImage = document.createElement("img");
    cardImage.classList.add("detailed-card-image");
    cardImage.setAttribute("src", pokemon.image);
    cardImage.setAttribute("alt", `${pokemon.name} art`);
    card.appendChild(cardImage);

    // Detailed Card Title
    let cardTitle = document.createElement("h1");
    cardTitle.classList.add("detailed-card-title");
    cardTitle.textContent = `#${pokemon.id} ${pokemon.name}`;
    card.appendChild(cardTitle);

    // Detailed Card Genus
    let cardGenus = document.createElement("p");
    cardGenus.classList.add("detailed-card-genus");
    cardGenus.textContent = `The ${pokemon.genus}`;
    card.appendChild(cardGenus);

    // Detailed Card Stats
    let cardStats = document.createElement("table");
    cardStats.classList.add("detailed-card-stats");
    let cardStatsBody = document.createElement("tbody");

    let typeRow = document.createElement("tr");
    let typeLabel = document.createElement("td");
    typeLabel.textContent = "Type";
    let typeValue = document.createElement("td");
    typeValue.classList.add("detailed-card-stats-value");
    typeValue.textContent = pokemon.type;
    typeRow.appendChild(typeLabel);
    typeRow.appendChild(typeValue);
    cardStatsBody.appendChild(typeRow);

    let heightRow = document.createElement("tr");
    let heightLabel = document.createElement("td");
    heightLabel.textContent = "Height";
    let heightValue = document.createElement("td");
    heightValue.classList.add("detailed-card-stats-value");
    heightValue.textContent = `${pokemon.height} cm`;
    heightRow.appendChild(heightLabel);
    heightRow.appendChild(heightValue);
    cardStatsBody.appendChild(heightRow);

    let weightRow = document.createElement("tr");
    let weightLabel = document.createElement("td");
    weightLabel.textContent = "Weight";
    let weightValue = document.createElement("td");
    weightValue.classList.add("detailed-card-stats-value");
    weightValue.textContent = `${pokemon.weight} kg`;
    weightRow.appendChild(weightLabel);
    weightRow.appendChild(weightValue);
    cardStatsBody.appendChild(weightRow);

    cardStats.appendChild(cardStatsBody);
    card.appendChild(cardStats);

    // Detailed Card Description
    let cardDescription = document.createElement("p");
    cardDescription.classList.add("detailed-card-description");
    cardDescription.textContent = pokemon.flavorText;
    card.appendChild(cardDescription);

    // Detailed Card Shadow
    let cardShadow = document.createElement("div");
    cardShadow.classList.add("detailed-card-shadow");
    cardShadow.addEventListener("click", removeDetailedCard);

    body.appendChild(cardShadow);
    body.appendChild(card);
}

function removeDetailedCard(event) {
    body.querySelector(".detailed-card").remove();
    body.querySelector(".detailed-card-shadow").remove();
}

displayCards();
