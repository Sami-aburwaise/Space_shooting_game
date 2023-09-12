const playButton = document.querySelector('#button')

playButton.addEventListener('mouseover', () => {
  playButton.style.backgroundColor = 'rgb(45, 45, 45)'
})

playButton.addEventListener('mouseout', () => {
  playButton.style.backgroundColor = 'black'
})

playButton.addEventListener('click', () => {
  window.location.href = 'game.html'
})

const linkedinLogo = document.querySelector('#in-logo')

linkedinLogo.addEventListener('mouseover', () => {
  linkedinLogo.classList.add('hovered')
})
linkedinLogo.addEventListener('mouseout', () => {
  linkedinLogo.classList.remove('hovered')
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
