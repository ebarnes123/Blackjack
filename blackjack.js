var dealerTotal = 0;
var playerTotal = 0;
var dealerAces = 0;
var playerAceCount = 0; 
var hidden;
var deck;

// player can draw as long as the player total is less than or equal to 21 
var canHit = true; 

window.onload = function() {
    buildDeck();
    shuffleDeck();
    startGame();
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]);
        }
    }
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); 
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck);
}

function startGame() {
    hidden = deck.pop();
    dealerTotal += getValue(hidden);
    dealerAces += checkAce(hidden);

    while (dealerTotal < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerTotal += getValue(card);
        dealerAces += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }
    console.log(dealerTotal);

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        playerTotal += getValue(card);
        playerAceCount += checkAce(card);
        document.getElementById("player-cards").append(cardImg);
    }

    console.log(playerTotal);
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);

}

function hit() {
    if (!canHit) {
        return;
    }

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    playerTotal += getValue(card);
    playerAceCount += checkAce(card);
    document.getElementById("player-cards").append(cardImg);

    if (reduceAce(playerTotal, playerAceCount) > 21) { // A, J, 8 -> 1 + 10 + 8
        canHit = false;
    }

}

function stay() {
    dealerTotal = reduceAce(dealerTotal, dealerAces);
    playerTotal = reduceAce(playerTotal, playerAceCount);

    canHit = false;
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";

    let message = "";
    if (playerTotal > 21) {
        message = "Sorry, you lose!";
    }
    else if (dealerTotal > 21) {
        message = "Yay, you win!";
    }
    // both player and dealer totals <= 21
    else if (playerTotal == dealerTotal) {
        message = "Oh no! It's a tie!";
    }
    else if (playerTotal > dealerTotal) {
        message = "Yay, you win!";
    }
    else if (playerTotal < dealerTotal) {
        message = "Sorry, you lose!";
    }

    document.getElementById("dealer-total").innerText = dealerTotal;
    document.getElementById("player-total").innerText = playerTotal;
    document.getElementById("results").innerText = message;
}

function getValue(card) {
    let data = card.split("-"); // "4-C" -> ["4", "C"]
    let value = data[0];

    if (isNaN(value)) { //A J Q K
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(playerTotal, playerAceCount) {
    while (playerTotal > 21 && playerAceCount > 0) {
        playerTotal -= 10;
        playerAceCount -= 1;
    }
    return playerTotal;
}