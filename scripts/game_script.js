//game panel dimentions
let panelWidth = 720
let panelHight = 480
const gamePanel = document.querySelector('#gamePanel')

class Entity {
  constructor(type, x, y) {
    this.type = type
    this.speed = 5
    this.health = 100
    this.x = 0
    this.y = 0
    render: null
  }
  spawn() {
    this.render = document.createElement('div')
    this.render.classList.add(this.type)
    gamePanel.appendChild(this.render)
    this.render.style.left = this.x + 'px'
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

const player = new Entity('player', 100)

player.spawn('player')

const makeFrame = () => {
  //what things run every frame
  player.moveDown()
}

const runFrames = setInterval(() => {
  makeFrame()
}, 50)
