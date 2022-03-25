`use strict`
const shapes = ["♠", "♣", "♥", "♦"]
const values = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K"
]
//give value for each sign
const CardsValue = {
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    J: 11,
    Q: 12,
    K: 13,
    A: 14
}
//html elements
const result = document.querySelector(".result")
const restBtn = document.querySelector(".btn")
const cpuCardSlot = document.querySelector(".cpu-card-slot")
const userCardSlot = document.querySelector(".user-card-slot")
const cpuDeckElement = document.querySelector(".cpu-deck")
const userDeckElement = document.querySelector(".user-deck")



//elements to use later
let userDeck, cpuDeck, round, stop

//audio elements
const flipVoice = new Audio("./sound/flip.mp3")
const loseVoice = new Audio("./sound/lose.mp3")
const winVoice = new Audio("./sound/win.mp3")


class Decks {
    constructor(cards = buildDeck()) {
        this.cards = cards
    }
    //flip the first card
    takeFirstCard() {
        return this.cards.shift()
    }
    //add the loser card to winner card
    addToWinner(card) {
        this.cards.push(card)
    }
    //full deck length
    get fullDeck() {
        return this.cards.length
    }
    //shuffle the deck
    deckShuffle() {
        for (let i = 0; i < this.fullDeck - 1; i++) {
            const rndIndex = Math.trunc(Math.random() * (i - 1))
            const firstIndex = this.cards[rndIndex]
            this.cards[rndIndex] = this.cards[i]
            this.cards[i] = firstIndex
        }
    }
}

class Card {
    constructor(shape, value) {
        this.shape = shape
        this.value = value
    }
    //show the card that flip in html
    render() {
        const divCardSlot = document.createElement("div")
        divCardSlot.textContent = this.shape
        divCardSlot.classList.add("card", this.shape === "♣" || this.shape === "♠" ? "black" : "red")
        divCardSlot.dataset.value = `${this.value} ${this.shape}`
        return divCardSlot
    }
}
//build an array of 52 cards included
const buildDeck = () => {
    return shapes.flatMap(shape => {
        return values.map(value => {
            return new Card(shape, value)
        })
    })
}

//show in html how many cards remaining for each
const numberOfCards = () => {
    cpuDeckElement.textContent = cpuDeck.fullDeck
    userDeckElement.textContent = userDeck.fullDeck
}
//clear the table before next round
const removeBeforeNextRound = () => {
    cpuCardSlot.textContent = ""
    userCardSlot.textContent = ""
    result.textContent = ""
    round = false
    numberOfCards()
}

// give to each player half deck
const letsPlay = () => {
    const deck = new Decks()
    deck.deckShuffle()
    const halfDeck = Math.trunc(deck.fullDeck / 2)
    userDeck = new Decks(deck.cards.slice(0, halfDeck))
    cpuDeck = new Decks(deck.cards.slice(halfDeck, deck.fullDeck))
    round = false
    stop = false

    removeBeforeNextRound()
}
letsPlay()


//flip the first card for each
function cardFlip() {
    round = true

    const userCard = userDeck.takeFirstCard()
    const cpuCard = cpuDeck.takeFirstCard()

    userCardSlot.appendChild(userCard.render())
    cpuCardSlot.appendChild(cpuCard.render())


    numberOfCards()


    //check who win the round
    if (CardsValue[userCard.value] > CardsValue[cpuCard.value]) {
        result.textContent = "Win"
        result.style.color = "green"
        userDeck.addToWinner(userCard)
        userDeck.addToWinner(cpuCard)
    } else if (CardsValue[userCard.value] < CardsValue[cpuCard.value]) {
        result.textContent = "Lose"
        result.style.color = "red"
        cpuDeck.addToWinner(userCard)
        cpuDeck.addToWinner(cpuCard)
    } else {
        result.textContent = "Draw"
        result.style.color = "blue"
        userDeck.addToWinner(userCard)
        cpuDeck.addToWinner(cpuCard)
    }
    gameOver()

    flipVoice.play()
}

//check if game over
const gameOver = () => {
    if (userDeck.fullDeck === 0) {
        result.textContent = "LOSER 😛🤣 !!!"
        loseVoice.play()
        stop = true
    } else if (cpuDeck.fullDeck === 0) {
        result.textContent = "WINNER 💪🤩 !!!"
        winVoice.play()
        stop = true
    }

}

//defined the order of the game
function flipUser() {
    if (stop) {
        letsPlay()
        return
    }

    if (round) {
        removeBeforeNextRound()
    } else {
        cardFlip()

    }

}
//play-flip cards
userDeckElement.addEventListener("click", () => {
    flipUser()
})

document.addEventListener(`keydown`, (e) => {
    if (e.key === "Enter") {
        flipUser()

    }
})

//new game
restBtn.addEventListener(`click`, () => {
    new Card()
    new Decks()
    letsPlay()
    numberOfCards()
    buildDeck()
})
