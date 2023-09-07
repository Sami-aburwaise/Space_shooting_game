//game panel dimentions
let panelWidth = 720
let panelHight = 480
const gamePanel = document.querySelector('#gamePanel')

class Entity {
  constructor(type) {
    this.type = type
    this.speed = 5
    this.health = 100
    render: null
  }
  spawn(x, y) {
    this.render = document.createElement('div')
    this.render.classList.add(this.type)
    gamePanel.appendChild(this.render)
    this.render.style.left = x + 'px'
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
    if (this.yPosition() > panelHight - this.render.offsetWidth) {
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

const player = new Entity('player')

player.spawn(100, 100)

const makeFrame = () => {
  //what things run every frame
  player.moveDown()
  player.moveRight()
}

const runFrames = setInterval(() => {
  makeFrame()
}, 50)
