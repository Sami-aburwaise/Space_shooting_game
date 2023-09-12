const h1Dsiplay = document.querySelector('#displayPanelH1')
const h2Dsiplay = document.querySelector('#displayPanelH2')
let gameOver = true
let levelFinneshed = false
let gameFinished = false

const playerImg = document.createElement('img')
playerImg.setAttribute('src', 'images/spaceShip.png')

const scoresDisplay = document.querySelector('#scoresDisplay')
const killsDisplay = document.querySelector('#killsDisplay')
const accuracyDisplay = document.querySelector('#accuracyDisplay')
let projectileList = []
let enemyList = []

//game panel dimentions
let panelWidth = 720
let panelHight = 480
let inputRight = false
let inputLeft = false
let inputUp = false
let inputDown = false

const gamePanel = document.querySelector('#gamePanel')
let panelXpositon = gamePanel.getBoundingClientRect('position').left
let panelYpositon = gamePanel.getBoundingClientRect('position').top

//classes

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
    this.coolDown = 5
    this.coolDownCounter = 0
    this.shoots = 0
    this.kills = 0
    this.level = 1
  }

  shoot = () => {
    if (this.coolDownCounter == 0) {
      const projectile = new Projectile('projectile')
      const projectileImg = document.createElement('img')
      projectileImg.setAttribute('src', 'images/projectile.png')
      projectile.spawn(this.xPosition(), this.yPosition(), projectileImg)
      projectileList.push(projectile)
      this.coolDownCounter = this.coolDown
      this.shoots += 1
    }
  }
  checkCollsion() {
    projectileList.forEach((projectile) => {
      if (projectile.friendly) {
        return
      }
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
      }
    })
  }
}

class Projectile extends Entity {
  constructor(type) {
    super(type)
    this.speed = 10
    this.friendly = true
  }
  moveUp = () => {
    this.render.style.top = this.yPosition() - this.speed + 'px'
  }
  moveDown = () => {
    this.render.style.top = this.yPosition() + this.speed + 'px'
  }
  checkCollision = () => {
    if (
      this.yPosition() <= document.querySelector('#title').offsetHeight ||
      this.yPosition() >=
        document.body.offsetHeight -
          document.querySelector('footer').offsetHeight
    ) {
      this.alive = false
    }
  }
}

class Enemy extends Entity {
  constructor(type) {
    super(type)
    this.speed = 10
    this.coolDown = 50
    this.coolDownCounter = Math.floor(Math.random() * 50)
    this.health = 0
    this.direction = Math.floor(Math.random() * 8)
    this.movingInterval = 3
    this.movingIntervalCounter = 0
  }

  shoot = () => {
    if (this.coolDownCounter == 0) {
      const projectile = new Projectile('projectile')
      projectile.friendly = false
      const projectileImg = document.createElement('img')
      projectileImg.setAttribute('src', 'images/enemyProjectile.png')
      projectile.spawn(
        this.xPosition() + this.render.width / 2,
        this.yPosition() + this.render.height,
        projectileImg
      )
      projectileList.push(projectile)
      this.coolDownCounter = this.coolDown
    }
  }
  /*   moveRandom() {
    let r = Math.floor(Math.random() * 4)
    switch (r) {
      case 0:
        this.moveDown()
        this.shoot()
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
  } */

  moveAround() {
    switch (this.direction) {
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
      case 4:
        this.moveDown()
        this.moveLeft()
        break
      case 5:
        this.moveUp()
        this.moveLeft()
        break
      case 6:
        this.moveLeft()
        this.moveDown()
        break
      case 7:
        this.moveRight()
        this.moveUp()
        break

      default:
        break
    }
    if (this.movingIntervalCounter != 0) {
      return
    }
    this.movingIntervalCounter = this.movingInterval
    this.direction = Math.floor(Math.random() * 8)
  }

  checkCollsion() {
    projectileList.forEach((projectile) => {
      if (!projectile.friendly) {
        return
      }
      if (
        !(
          Math.abs(
            projectile.xPosition() - this.xPosition() - this.render.width / 2
          ) <=
          this.render.width / 2
        )
      ) {
        return
      }
      if (
        !(
          Math.abs(
            projectile.yPosition() - this.yPosition() - this.render.height / 2
          ) <= 15
        )
      ) {
        return
      }
      {
        if (this.health <= 0) {
          projectile.alive = false
          this.alive = false
          player.kills += 1
        } else {
          projectile.alive = false
          this.health -= 1
          this.render.width -= this.render.width / 4
        }
      }
    })
  }
}

let player = new Player('player')
//control level and stuff

player.spawn(
  panelXpositon + panelWidth / 2,
  panelYpositon + panelHight - 75,
  playerImg
)

//run frames

const managePlayer = () => {
  if (!player.alive) {
    player.render.remove()
    return
  }
  if (inputLeft) {
    player.moveLeft()
  } else if (inputRight) {
    player.moveRight()
  }
  if (inputUp) {
    player.moveUp()
  } else if (inputDown) {
    player.moveDown()
  }
  player.checkCollsion()

  //cooldown counter
  player.coolDownCounter =
    player.coolDownCounter > 0 ? (player.coolDownCounter -= 1) : 0

  //update stats
  scoresDisplay.innerText = 'level ' + player.level
  killsDisplay.innerText = 'kills: ' + player.kills
  accuracyDisplay.innerText =
    'accuracy: ' + parseInt((100 * player.kills) / player.shoots) + '%'
}

const manageProjectiles = () => {
  if (projectileList.length != 0) {
    projectileList.forEach((projectile, index) => {
      if (projectile.friendly) {
        projectile.moveUp()
      } else {
        projectile.moveDown()
      }
      projectile.checkCollision()
      if (!projectile.alive) {
        projectile.render.remove()
        projectileList.splice(index, 1)
      }
    })
  }
}

const manageEnemies = () => {
  enemyList.forEach((enemy, index) => {
    if (!enemy.alive) {
      enemy.render.remove()
      enemyList.splice(index, 1)
    }
    //enemy.moveRandom()
    enemy.moveAround()
    enemy.checkCollsion()
    enemy.coolDownCounter =
      enemy.coolDownCounter > 0 ? (enemy.coolDownCounter -= 1) : 0

    enemy.movingIntervalCounter =
      enemy.movingIntervalCounter > 0 ? (enemy.movingIntervalCounter -= 1) : 0
  })
}

const spawnEnemies = (n) => {
  for (let i = 0; i < n; i++) {
    const enemyImg = document.createElement('img')
    enemyImg.setAttribute('src', 'images/enemy.png')
    const enemy = new Enemy('enemy')
    enemyList.push(enemy)
    enemyList[i].spawn(
      panelXpositon + panelWidth / 2 - Math.random() * 10 * i,
      panelYpositon + Math.random() * 10,
      enemyImg
    )
  }
}
spawnEnemies(1)

const manageGame = () => {
  if (!player.alive && !gameOver) {
    player.render.remove()
    gameOver = true
    player.level = 0
    h1Dsiplay.innerText = 'You lost'
    h2Dsiplay.innerText = 'press enter to play again'
  } else if (enemyList.length == 0 && !levelFinneshed && !gameOver) {
    gameOver = true
    levelFinneshed = true
    player.level += 1
    h1Dsiplay.innerText = 'You won'
    h2Dsiplay.innerText = 'press any button to continue'
    //remove projectiles so no one get hurt
    projectileList.forEach((projectile) => {
      projectile.render.remove()
    })
    projectileList = []
  }

  if (levelFinneshed && gameOver) {
    levelFinneshed = false

    switch (player.level) {
      case 1:
        spawnEnemies(player.level)
        break
      case 2:
        spawnEnemies(player.level)
        break
      case 3:
        spawnEnemies(player.level)
        enemyList.forEach((enemy) => {
          enemy.render.width += 50
          enemy.coolDown = 20
        })
        break
      case 4:
        spawnEnemies(player.level)
        enemyList.forEach((enemy) => {
          enemy.health = 2
        })
        break
      case 5:
        spawnEnemies(1)
        enemyList.forEach((enemy) => {
          enemy.render.width += 150
          enemy.health = 7
          enemy.coolDown = 10
        })
        break
      case 6:
        spawnEnemies(player.level)
        enemyList.forEach((enemy) => {
          enemy.render.width /= 2
          enemy.speed += 10
        })

        break
      case 7:
        spawnEnemies(15)
        break

      default:
        h1Dsiplay.innerText = 'You Won'
        h2Dsiplay.innerText = 'Game finishsed, press enter to play again'
        gameOver = true
        gameFinished = true
        break
    }
  }
}

const makeFrame = () => {
  manageGame()
  //what things run every frame
  if (gameOver) {
    return
  }
  managePlayer()

  manageProjectiles()

  manageEnemies()
}

const runFrames = setInterval(() => {
  makeFrame()
}, 25)

const resetGame = () => {
  gameOver = true
  levelFinneshed = false
  gameFinished = false
  //remove all projectiles
  if (projectileList.length != 0) {
    projectileList.forEach((projectile, index) => {
      projectile.render.remove()
    })
    projectileList = []
  }
  //remove all enemies
  if (enemyList.length != 0) {
    enemyList.forEach((enemy) => {
      enemy.render.remove()
    })
    enemyList = []
  }
  spawnEnemies(1)

  //reset player
  player = new Player('player')
  player.spawn(
    panelXpositon + panelWidth / 2,
    panelYpositon + panelHight - 75,
    playerImg
  )
  h1Dsiplay.innerText = 'LEVEL 1'
  h2Dsiplay.innerText = 'Press any button to start'
}

//event listners and input

document.body.addEventListener('keydown', (e) => {
  if (e.code == 'KeyD' || e.code == 'ArrowRight') {
    inputRight = true
  } else if (e.code == 'KeyA' || e.code == 'ArrowLeft') {
    inputLeft = true
  }
  if (e.code == 'KeyW' || e.code == 'ArrowUp') {
    inputUp = true
  } else if (e.code == 'KeyS' || e.code == 'ArrowDown') {
    inputDown = true
  }
  if (gameOver && player.alive && !gameFinished) {
    gameOver = false
    h1Dsiplay.innerText = ''
    h2Dsiplay.innerText = ''
  }
})

document.body.addEventListener('keyup', (e) => {
  if (e.code == 'KeyD' || e.code == 'ArrowRight') {
    inputRight = false
  } else if (e.code == 'KeyA' || e.code == 'ArrowLeft') {
    inputLeft = false
  }
  if (e.code == 'KeyW' || e.code == 'ArrowUp') {
    inputUp = false
  } else if (e.code == 'KeyS' || e.code == 'ArrowDown') {
    inputDown = false
  }
})

document.body.addEventListener('keypress', (e) => {
  if (e.code == 'Space' && player.alive) {
    player.shoot()
  }
  if (e.code == 'Enter' && gameOver) {
    resetGame()
  }
})

document.querySelector('button').addEventListener('click', () => {
  window.location.href = 'index.html'
})

//make stars
for (let i = 0; i < 100; i++) {
  const star = document.createElement('img')
  star.setAttribute('src', 'images/star.png')
  star.setAttribute('class', 'star')
  star.style.width = Math.random() * 10 + 'px'
  document.body.prepend(star)
  star.style.left = Math.floor(Math.random() * innerWidth) + 'px'
  star.style.top = Math.floor(Math.random() * window.innerHeight) + 'px'
}
