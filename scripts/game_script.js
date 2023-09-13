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
let explosionList = []

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

  move(x, y, bordered = true) {
    //right left
    if (
      (x > 0 &&
        this.xPosition() < panelWidth + panelXpositon - this.render.width) ||
      !bordered
    ) {
      this.render.style.left = this.xPosition() + x + 'px'
    } else if ((x < 0 && this.xPosition() > panelXpositon) || !bordered) {
      this.render.style.left = this.xPosition() + x + 'px'
    }
    //up down
    if ((y < 0 && this.yPosition() > panelYpositon) || !bordered) {
      this.render.style.top = this.yPosition() + y + 'px'
    } else if (
      (y > 0 &&
        this.yPosition() < panelYpositon + panelHight - this.render.height) ||
      !bordered
    ) {
      this.render.style.top = this.yPosition() + y + 'px'
    }
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

class Explosion extends Entity {
  constructor(type) {
    super(type)
    this.lifeTime = 10
  }
  run() {
    if (this.lifeTime == 0) {
      this.render.remove()
    } else {
      this.lifeTime -= 1
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
    this.xVelocity = this.speed * (Math.random() - Math.random())
    this.yVelocity = this.speed * (Math.random() - Math.random())
    this.movingInterval = 5
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
      this.coolDown = 20 + Math.floor(Math.random() * 50)
      this.coolDownCounter = this.coolDown
    }
  }

  moveAround() {
    this.move(this.xVelocity, this.yVelocity)
    if (this.movingIntervalCounter != 0) {
      return
    }
    this.movingIntervalCounter = this.movingInterval
    this.xVelocity = this.speed * (Math.random() - Math.random())
    this.yVelocity = this.speed * (Math.random() - Math.random())
  }

  checkCollsion() {
    projectileList.forEach((projectile) => {
      if (!projectile.friendly) {
        return
      }
      if (
        Math.abs(
          projectile.xPosition() - this.xPosition() - this.render.width / 2
        ) <=
          this.render.width / 2 &&
        Math.abs(
          projectile.yPosition() - this.yPosition() - this.render.height / 2
        ) <= 15
      ) {
        if (this.health <= 0) {
          projectile.alive = false
          this.alive = false
          player.kills += 1
          //spawn explostion
          const explodeImg = document.createElement('img')
          explodeImg.setAttribute('src', 'images/explode.gif')
          const explosion = new Explosion('explostion')
          explosionList.push(explosion)
          explosion.spawn(this.xPosition(), this.yPosition(), explodeImg)
          explosion.render.width = this.render.width
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
    player.move(-player.speed, 0)
  } else if (inputRight) {
    player.move(player.speed)
  }
  if (inputUp) {
    player.move(0, -player.speed)
  } else if (inputDown) {
    player.move(0, player.speed)
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
        projectile.move(0, -projectile.speed, false)
      } else {
        projectile.move(0, projectile.speed, false)
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
    enemy.shoot()
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
      panelXpositon + panelWidth / 2 - Math.random() * 200 * i,
      panelYpositon + Math.random() * 100,
      enemyImg
    )
  }
}
spawnEnemies(1)

const manageGame = () => {
  if (explosionList.length != 0) {
    explosionList.forEach((e) => {
      e.run()
    })
  }
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
