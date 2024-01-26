const letters = document.querySelectorAll('.letter-input')
const loadingDiv = document.querySelector('.info-bar')
const ANSWER_LENGTH = 5

async function init() {
  let currentGuess = ''
  let currentRow = 0
  const wordAPI = await fetch('https://words.dev-apis.com/word-of-the-day')
  const responseObj = await wordAPI.json()
  const word = responseObj.word.toUpperCase()
  const wordParts = word.split('')

  function addLetter(letter) {
    if (currentGuess.length < ANSWER_LENGTH) {
      // add letter to the end
      currentGuess += letter
    } else {
      // replace last letter
      customGuess = currentGuess.substring(0, currentGuess.length - 1) + letter
    }
    letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText =
      letter
  }

  async function commit() {
    if (currentGuess.length !== ANSWER_LENGTH) {
      //   do nothing
      return
    }
    // TODO validate the word
    // TODO all the markings as "correct", "close" or "wrong"
    const guessParts = currentGuess.split('')
    for (let i = 0; i < guessParts.length; i++) {
      // mark as correct
      if (guessParts[i] === wordParts[i]) {
        letters[currentRow * ANSWER_LENGTH + i].classList.add('correct')
      }
    }
    // TODO win or lose?
    currentRow++
    currentGuess = ''
  }

  function backspace() {
    currentGuess = currentGuess.substring(0, currentGuess.length - 1)
    letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = ''
  }

  document.addEventListener('keydown', function handleKeyPress(event) {
    const action = event.key
    console.log(action)
    if (action === 'Enter') {
      commit()
    } else if (action === 'Backspace') {
      backspace()
    } else if (isLetter(action)) {
      addLetter(action.toUpperCase())
    } else {
      // do nothing
    }
  })
}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter)
}

init()
