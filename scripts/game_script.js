const playerImg = document.createElement('img')
playerImg.setAttribute('src', 'images/spaceShip.png')

//game panel dimentions
let panelWidth = 720
let panelHight = 480
let inputRight = false
let inputLeft = false
let inputUP = false
let inputDown = false
const gamePanel = document.querySelector('#gamePanel')

class Entity {
  constructor(type) {
    this.type = type
    this.speed = 5
    this.health = 100
    this.render = null
  }
  spawn(x, y, render) {
    this.render = render
    this.render.classList.add(this.type)
    gamePanel.appendChild(render)
    render.style.left = x + 'px'
    this.render.style.top = y + 'px'
  }
  xPosition() {
    return (
      this.render.getBoundingClientRect('position').left -
      gamePanel.getBoundingClientRect('position').left
    )
  }
  yPosition() {
    return (
      this.render.getBoundingClientRect('position').top -
      gamePanel.getBoundingClientRect('position').top
    )
  }
  moveRight = () => {
    if (this.xPosition() > panelWidth - this.render.offsetWidth) {
      return
    }
    this.render.style.left = this.xPosition() + this.speed + 'px'
  }
  moveLeft = () => {
    if (this.xPosition() < 0) {
      return
    }
    this.render.style.left = this.xPosition() - this.speed + 'px'
  }
  moveUp = () => {
    if (this.yPosition() < 0) {
      return
    }
    this.render.style.top = this.yPosition() - this.speed + 'px'
  }
  moveDown = () => {
    if (this.yPosition() > panelHight - this.render.offsetHeight) {
      return
    }
    this.render.style.top = this.yPosition() + this.speed + 'px'
  }
}

class Player extends Entity {
  constructor(type) {
    super(type)
  }
  shoot() {}
}

const player = new Player('player')
player.spawn(panelWidth / 2, panelHight - 100, playerImg)

const manageInput = () => {
  if (inputLeft) {
    player.moveLeft()
  } else if (inputRight) {
    player.moveRight()
  }
  if (inputUP) {
    player.moveUp()
  } else if (inputDown) {
    player.moveDown()
  }
}

const makeFrame = () => {
  //what things run every frame
  manageInput()
}

const runFrames = setInterval(() => {
  makeFrame()
}, 20)

document.body.addEventListener('keydown', (e) => {
  if (e.code == 'KeyD') {
    inputRight = true
  } else if (e.code == 'KeyA') {
    inputLeft = true
  }
  if (e.code == 'KeyW') {
    inputUP = true
  } else if (e.code == 'KeyS') {
    inputDown = true
  }
})
document.body.addEventListener('keyup', (e) => {
  if (e.code == 'KeyD') {
    inputRight = false
  } else if (e.code == 'KeyA') {
    inputLeft = false
  }
  if (e.code == 'KeyW') {
    inputUP = false
  } else if (e.code == 'KeyS') {
    inputDown = false
  }
})

document.querySelector('button').addEventListener('click', () => {
  window.location.href = 'index.html'
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
