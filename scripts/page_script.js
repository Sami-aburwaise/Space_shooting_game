const playButton = document.querySelector('#button')

playButton.addEventListener('mouseover', () => {
  playButton.style.backgroundColor = 'rgb(45, 45, 45)'
})

playButton.addEventListener('mouseout', () => {
  playButton.style.backgroundColor = 'black'
})
