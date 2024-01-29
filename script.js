const letters = document.querySelectorAll('.letter-input')
const loadingDiv = document.querySelector('.info-bar')
const ANSWER_LENGTH = 5
const ROUNDS = 6

async function init() {
  let currentGuess = ''
  let currentRow = 0
  let done = false
  let isLoading = true

  const wordAPI = await fetch('https://words.dev-apis.com/word-of-the-day')
  const responseObj = await wordAPI.json()
  const word = responseObj.word.toUpperCase()
  const wordParts = word.split('')
  isLoading = false
  setLoading(isLoading)

  function addLetter(letter) {
    if (currentGuess.length < ANSWER_LENGTH) {
      // add letter to the end
      currentGuess += letter
    } else {
      // replace last letter
      current = currentGuess.substring(0, currentGuess.length - 1) + letter
    }
    letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText =
      letter
  }

  async function commit() {
    if (currentGuess.length !== ANSWER_LENGTH) {
      //   do nothing
      return
    }

    // check the API to see if it's a valid word
    // skip this step if you're not checking for valid words
    isLoading = true
    setLoading(isLoading)
    const res = await fetch('https://words.dev-apis.com/validate-word', {
      method: 'POST',
      body: JSON.stringify({ word: currentGuess }),
    })
    const { validWord } = await res.json()
    isLoading = false
    setLoading(isLoading)

    // not valid, mark the word as invalid and return
    if (!validWord) {
      markInvalidWord()
      return
    }

    // Mark as "correct", "close" or "wrong"
    const guessParts = currentGuess.split('')
    const map = makeMap(wordParts)

    for (let i = 0; i < ANSWER_LENGTH; i++) {
      // mark as correct
      if (guessParts[i] === wordParts[i]) {
        letters[currentRow * ANSWER_LENGTH + i].classList.add('correct')
        map[guessParts[i]]--
      }
    }

    for (let i = 0; i < ANSWER_LENGTH; i++) {
      if (guessParts[i] === wordParts[i]) {
        // do nothing
      } else if (wordParts.includes(guessParts[i]) && map[guessParts[i] > 0]) {
        // mark as close
        letters[currentRow * ANSWER_LENGTH + i].classList.add('close')
        map[guessParts[i]]--
      } else {
        letters[currentRow * ANSWER_LENGTH + i].classList.add('wrong')
      }
    }
    currentRow++
    // win or lose?
    if (currentGuess === word) {
      // win
      alert('you win!')
      document.querySelector('.brand').classList.add('winner')
      done = true
      return
    } else if (currentRow === ROUNDS) {
      alert(`You lose, the word was, ${word}`)
      done = true
    }
    currentGuess = ''
  }

  function backspace() {
    currentGuess = currentGuess.substring(0, currentGuess.length - 1)
    letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = ''
  }

  function markInvalidWord() {
    // alert('Not a valid Word')

    for (let i = 0; i < ANSWER_LENGTH; i++) {
      letters[currentRow * ANSWER_LENGTH + i].classList.add('invalid')
    }
    setTimeout(function () {
      letters[currentRow * ANSWER_LENGTH + i].classList.remove('invalid')
    }, 10)
  }

  document.addEventListener('keydown', function handleKeyPress(event) {
    if (done || isLoading) {
      // do nothing
      return
    }
    const action = event.key
    console.log(action)
    if (action === 'Enter' && !done) {
      commit()
    } else if (action === 'Backspace' && !done) {
      backspace()
    } else if (isLetter(action) && !done) {
      addLetter(action.toUpperCase())
    } else {
      // do nothing
    }
  })
}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter)
}

// show the loading spinner when needed
function setLoading(isLoading) {
  loadingDiv.classList.toggle('hidden', !isLoading)
}

function makeMap(array) {
  const obj = {}
  for (let i = 0; i < array.length; i++) {
    const letter = array[i]
    if (obj[letter]) {
      obj[letter]++
    } else {
      obj[letter] = 1
    }
  }
  return obj
}

init()
