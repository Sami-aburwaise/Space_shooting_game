//game panel dimentions
let width = 720
let hight = 480

//normlize position

//spawn something

class Entity {
  constructor(type) {
    this.type = type
    this.speed = 1
    this.health = 100
    render: null
  }
  spawn() {
    this.render = document.createElement('div')
    this.render.classList.add(this.type)
    document.querySelector('#gamePanel').appendChild(this.render)
  }
}

const player = new Entity('player')

player.spawn('player')

const makeFrame = () => {
  //what things run every frame
}

const runFrames = setInterval(() => {
  makeFrame()
}, 50)
