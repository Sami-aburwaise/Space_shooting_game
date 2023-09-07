const playButton = document.querySelector('#button')

const colorButtons = document.querySelectorAll('button')

playButton.addEventListener('mouseover', () => {
  playButton.style.backgroundColor = 'rgb(45, 45, 45)'
})

playButton.addEventListener('mouseout', () => {
  playButton.style.backgroundColor = 'black'
})

playButton.addEventListener('click', () => {
  window.location.href = 'game.html'
})

colorButtons.forEach((button) => {
  button.style.backgroundColor = button.innerText
})
