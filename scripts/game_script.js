const playerImg = document.createElement('img')
playerImg.setAttribute('src', 'images/spaceShip.png')

projectiles = []

//game panel dimentions
let panelWidth = 720
let panelHight = 480
let inputRight = false
let inputLeft = false
let inputUP = false
let inputDown = false
const gamePanel = document.querySelector('#gamePanel')
let xPos = gamePanel.getBoundingClientRect('position').left
let yPos = gamePanel.getBoundingClientRect('position').top

class Entity {
  constructor(type) {
    this.type = type
    this.alive = true
  }
  spawn(x, y, render) {
    this.render = render
    this.render.classList.add(this.type)
    gamePanel.appendChild(this.render)
    this.render.style.left = x + 'px'
    this.render.style.top = y + 'px'
  }
}

class Player extends Entity {
  constructor(type) {
    super(type)
    this.speed = 5
    this.coolDown = 10
  }
  xPosition() {
    return this.render.getBoundingClientRect('position').left - xPos
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
  shoot = () => {
    if (this.coolDown == 0) {
      const projectile = new Projectile('projectile')
      const projectileImg = document.createElement('img')
      projectileImg.setAttribute('src', 'images/projectile.png')
      projectile.spawn(
        this.xPosition() - this.render.width,
        panelHight - 180,
        projectileImg
      )
      projectiles.push(projectile)
      this.coolDown = 20
    }
  }
}

class Projectile extends Entity {
  constructor(type) {
    super(type)
    this.speed = 30
  }
  yPosition() {
    return this.render.getBoundingClientRect('position').top - yPos
  }
  moveUp = () => {
    if (this.yPosition() < 10) {
      projectiles.shift()
      this.render.remove()
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

const player = new Player('player')
player.spawn(panelWidth / 2, panelHight - 75, playerImg)

const manageInput = () => {
  if (inputLeft) {
    player.moveLeft()
  } else if (inputRight) {
    player.moveRight()
  }
  player.coolDown = player.coolDown > 0 ? (player.coolDown -= 1) : 0
}

manageProjectiles = () => {
  if (projectiles.length != 0) {
    projectiles.forEach((projectile) => {
      projectile.moveUp()
    })
  }
}

const makeFrame = () => {
  //what things run every frame
  manageInput()
  manageProjectiles()
}

const runFrames = setInterval(() => {
  makeFrame()
}, 25)

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

document.body.addEventListener('keypress', (e) => {
  if (e.code == 'Space') {
    player.shoot()
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
