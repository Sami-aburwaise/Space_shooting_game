const playButton = document.querySelector('#button')
const hireMe = document.querySelector('#hireMeButton')

playButton.addEventListener('mouseover', () => {
  playButton.style.backgroundColor = 'rgb(45, 45, 45)'
})

playButton.addEventListener('mouseout', () => {
  playButton.style.backgroundColor = 'black'
})

playButton.addEventListener('click', () => {
  window.location.href = 'game.html'
})

hireMe.addEventListener('mouseover', () => {
  hireMe.style.backgroundColor = 'rgb(45, 45, 45)'
})

hireMe.addEventListener('mouseout', () => {
  hireMe.style.backgroundColor = 'black'
})

hireMe.addEventListener('click', () => {
  window.location.href = 'game.html'
})

for (let i = 0; i < 100; i++) {
  const star = document.createElement('img')
  star.setAttribute('src', 'images/star.png')
  star.setAttribute('class', 'star')
  star.style.width = Math.random() * 10 + 'px'
  document.body.prepend(star)
  star.style.left = Math.floor(Math.random() * innerWidth) + 'px'
  star.style.top = Math.floor(Math.random() * window.innerHeight) + 'px'
}
