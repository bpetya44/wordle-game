
alert('You have 6 tries to guess the word \n Grey letter does not exist in the word \n Yellow letter is not on the correct place \n Green letter is on it"s right place')
import { WORDS } from "./words.js";

const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)]
//console.log(rightGuessString);

function initBoard(){
    let board = document.getElementById('game-board')

    //create 6 rows
    for(let i = 0; i < NUMBER_OF_GUESSES; i++){
        let row = document.createElement('div')
        row.className = 'letter-row'

        //create 5 boxes in the row
        for (let j = 0; j < 5; j++) {
            let box = document.createElement("div")
            box.className = "letter-box"
            row.appendChild(box)
        }

        board.appendChild(row)
    }
}

initBoard()

//check that the key we pressed was an alphabetical key representing a single letter. 
document.addEventListener('keyup', (e)=> {

    if (guessesRemaining === 0){
        return
    }

    let pressedKey = String(e.key)
    if (pressedKey === "Backspace" && nextLetter !==0) {
        deleteLetter()
        return
    }

    if(pressedKey === "Enter"){
        checkGuess()
        return
    }

    let found = pressedKey.match(/[a-z]/gi)
    if( !found || found.length >1){
        return
    } else {
        insertLetter(pressedKey)
    }
})

//checks that there's still space in the guess for this letter, finds the appropriate row, and puts the letter in the box.
function insertLetter(pressedKey){
    if(nextLetter === 5){
        return
    }
    pressedKey = pressedKey.toLowerCase()

    let row = document.getElementsByClassName('letter-row')[6 - guessesRemaining]
    let box = row.children[nextLetter]
    animateCSS(box, "pulse") //animation
    box.textContent = pressedKey
    box.classList.add('filled-box')
    currentGuess.push(pressedKey)
    nextLetter += 1
}

//gets the correct row, finds the last box and empties it, resets the nextLetter counter.
function deleteLetter(){
    let row = document.getElementsByClassName('letter-row')[6 - guessesRemaining]
    let box = row.children[nextLetter -1]
    box.textContent = ''
    box.classList.remove('filled-box')
    currentGuess.pop()
    nextLetter -= 1
}

function checkGuess(){
    //the guess is 5 letters
    let row = document.getElementsByClassName('letter-row')[6 - guessesRemaining]
    let guessString = ''
    
    //the guess is a valid list
    let rightGuess = Array.from(rightGuessString)

    for (const val of currentGuess) {
        guessString += val
    }

    if (guessString.length != 5){
        toastr.error('Not enough letters!')
        return
    }

    if (!WORDS.includes(guessString)) {
        toastr.error("Word not in the list!")
        return
    }
    //Checks each letter of the word and shades them
    for (let i =0; i < 5; i++){
        let letterColor = ''
        let box = row.children[i]
        let letter = currentGuess[i]

        let letterPosition = rightGuess.indexOf(currentGuess[i])
        //is letter in the correct guess
        if(letterPosition === -1){
            letterColor ='#444'
        } else {
            //now letter is deffinately in the word
            // if letter index and right guess index are the same
            // letter is in the right position - color green
            if(currentGuess[i] === rightGuess[i]){
                letterColor = '#595'
            } else{
                //letter is not in the right position - box color yellow
                letterColor = '#ba4'
            }

            rightGuess[letterPosition] = '#'
        }

        let delay = 250 * i
        setTimeout(() => {
            //flip box
            animateCSS(box, 'flipInX')//animation
            //shade box
            box.style.backgroundColor = letterColor
            shadeKeyBoard(letter, letterColor)
        }, delay)
    }

    //Tells the user about the end of the game
    if (guessString === rightGuess){
        toastr.success('You guessed right! Game over!')
        guessesRemaining = 0
        return
    } else {
        guessesRemaining -= 1
        currentGuess = []
        nextLetter = 0

        if (guessesRemaining === 0){
            toastr.error('You run out of guesses! Game over! Sorry...')
            toastr.info(`The right word was: ${rightGuess}`)
        }
    }
}

    //change color of the letters on the keyboard
    function shadeKeyBoard(letter, color) {
        for (const elem of document.getElementsByClassName("keyboard-button")) {
            //Find the key that matches the given letter
            if (elem.textContent === letter) {
                let oldColor = elem.style.backgroundColor
                //If the key is already green, do nothing
                if (oldColor === 'green') {
                    return
                } 
                //If the key is currently yellow, only allow it to become green
                if (oldColor === 'yellow' && color !== 'green') {
                    return
                }
                //Else, shade the key passed to the function
                elem.style.backgroundColor = color
                break
            }
        }
    }

    //on-screen keyboard
    document.getElementById('keyboard-cont').addEventListener('click', (e)=>{
        const target = e.target
        
        //If the clicked element was not a button, exit the function
        if(!target.classList.contains('keyboard-button')){
            return
        }
        let key = target.textContent
        if(key ==='Del'){
            key= 'Backspace'
        }
        document.dispatchEvent(new KeyboardEvent('keyup', {'key': key}))

    })

    //animation
    //https://animate.style/#javascript
    const animateCSS = (element, animation, prefix = 'animate__')=>
    //create a Promise and return it
    new Promise((resolve, reject)=>{
        const animationName = `${prefix}${animation}`
        // const node = document.querySelector(element)
        const node = element
        node.style.setProperty('--animate-duration', '0.9s')

        node.classList.add(`${prefix}animated`, animationName)

        // When the animation ends, clean the classes and resolve the Promise
        function handleAnimationEnd(event){
            event.stopPropagation()
            node.classList.remove(`${prefix}animated`, animationName)
            resolve('Animation ended')
        }

        node.addEventListener('animationend', handleAnimationEnd, {once: true})
    })

