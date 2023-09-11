const playerImg = document.createElement('img')
playerImg.setAttribute('src', 'images/spaceShip.png')

const scoresDisplay = document.querySelector('#scoresDisplay')
const killsDisplay = document.querySelector('#killsDisplay')
const accuracyDisplay = document.querySelector('#accuracyDisplay')
projectiles = []
//game panel dimentions
let panelWidth = 720
let panelHight = 480
let inputRight = false
let inputLeft = false

const gamePanel = document.querySelector('#gamePanel')
let panelXpositon = gamePanel.getBoundingClientRect('position').left
let panelYpositon = gamePanel.getBoundingClientRect('position').top

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
  xPosition() {
    return this.render.getBoundingClientRect('position').left
  }
  yPosition() {
    return this.render.getBoundingClientRect('position').top
  }
  moveRight = () => {
    if (this.xPosition() > panelWidth + panelXpositon - this.render.width) {
      return
    }
    this.render.style.left = this.xPosition() + this.speed + 'px'
  }
  moveLeft = () => {
    if (this.xPosition() < panelXpositon) {
      return
    }
    this.render.style.left = this.xPosition() - this.speed + 'px'
  }
  moveUp = () => {
    if (this.yPosition() < panelYpositon) {
      return
    }
    this.render.style.top = this.yPosition() - this.speed + 'px'
  }
  moveDown = () => {
    if (this.yPosition() > panelYpositon + panelHight) {
      return
    }
    this.render.style.top = this.yPosition() + this.speed + 'px'
  }
}

class Player extends Entity {
  constructor(type) {
    super(type)
    this.speed = 5
    this.coolDown = 15
    this.coolDownCounter = 0
    this.shoots = 0
    this.kills = 0
    this.scores = 0
  }

  shoot = () => {
    if (this.coolDownCounter == 0) {
      const projectile = new Projectile('projectile')
      const projectileImg = document.createElement('img')
      projectileImg.setAttribute('src', 'images/projectile.png')
      projectile.spawn(this.xPosition(), this.yPosition(), projectileImg)
      projectiles.push(projectile)
      this.coolDownCounter = 0 //this.coolDown
      this.shoots += 1
      updateStats()
    }
  }
}

class Projectile extends Entity {
  constructor(type) {
    super(type)
    this.speed = 30
  }
  moveUp = () => {
    this.render.style.top = this.yPosition() - this.speed + 'px'
  }
  checkCollision = () => {
    if (this.yPosition() <= 0) {
      this.alive = false
    }
  }
}

class Enemy extends Entity {
  constructor(type) {
    super(type)
    this.speed = 10
    this.coolDown = 50
    this.coolDownCounter = 0
  }

  shoot = () => {
    if (this.coolDownCounter == 0) {
      const projectile = new Projectile('projectile')
      const projectileImg = document.createElement('img')
      projectileImg.setAttribute('src', 'images/projectile.png')
      projectile.spawn(this.xPosition(), this.yPosition(), projectileImg)
      projectiles.push(projectile)
      this.coolDownCounter = 0 //this.coolDown
      this.shoots++
      updateStats()
    }
  }
  moveRandom() {
    let r = Math.floor(Math.random() * 4)
    switch (r) {
      case 0:
        this.moveDown()
        break
      case 1:
        this.moveUp()
        break
      case 2:
        this.moveLeft()
        break
      case 3:
        this.moveRight()
        break

      default:
        break
    }
  }
  checkCollsion() {
    projectiles.forEach((projectile) => {
      if (
        Math.abs(
          projectile.xPosition() - this.xPosition() - this.render.width / 2
        ) <= 15 &&
        Math.abs(
          projectile.yPosition() - this.yPosition() - this.render.height
        ) <= 15
      ) {
        projectile.alive = false
        this.alive = false
        player.kills += 1
      }
    })
  }
}

const player = new Player('player')
player.spawn(panelWidth / 2, panelYpositon + panelHight - 75, playerImg)

let enemyList = []
for (let i = 0; i < 20; i++) {
  const enemyImg = document.createElement('img')
  enemyImg.setAttribute('src', 'images/enemy.png')
  const enemy = new Enemy('enemy')
  enemyList.push(enemy)
  enemyList[i].spawn(panelXpositon + 20 + i, panelYpositon, enemyImg)
}

const manageInput = () => {
  if (inputLeft) {
    player.moveLeft()
  } else if (inputRight) {
    player.moveRight()
  }

  player.coolDownCounter =
    player.coolDownCounter > 0 ? (player.coolDownCounter -= 1) : 0
}

updateStats = () => {
  scoresDisplay.innerText = 'scores: ' + player.scores
  killsDisplay.innerText = 'kills: ' + player.kills
  accuracyDisplay.innerText =
    'accuracy: ' + parseInt((100 * player.kills) / player.shoots) + '%'
}

manageProjectiles = () => {
  if (projectiles.length != 0) {
    projectiles.forEach((projectile, index) => {
      projectile.moveUp()
      projectile.checkCollision()
      if (!projectile.alive) {
        projectile.render.remove()
        projectiles.splice(index, 1)
      }
    })
  }
}

manageEnemies = () => {
  enemyList.forEach((enemy, index) => {
    enemy.moveRandom()
    enemy.checkCollsion()
    if (!enemy.alive) {
      enemy.render.remove()
      enemyList.splice(index, 1)
    }
  })
}

const makeFrame = () => {
  //what things run every frame
  manageInput()

  manageProjectiles()

  manageEnemies()
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
})
document.body.addEventListener('keyup', (e) => {
  if (e.code == 'KeyD') {
    inputRight = false
  } else if (e.code == 'KeyA') {
    inputLeft = false
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
