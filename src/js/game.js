const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const currentScoreEl = document.querySelectorAll(".currentScore")
const playButton = document.querySelector(".playButton")
const playEl = document.querySelector(".play")
const displayEl = document.querySelector(".pause")

let currentScore = 0
let isPause = false

canvas.width = innerWidth
canvas.height = innerHeight

class Circle {
  constructor(_x, _y, _radius, _color) {
    this.x = _x
    this.y = _y
    this.radius = _radius
    this.color = _color
  }

  draw() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    ctx.fillStyle = this.color
    ctx.fill()
  }

  update() {
    this.draw()
  }
}

class Player extends Circle {}

class Projectile extends Circle {
  constructor(_x, _y, _radius, _color, _velocity) {
    super(_x, _y, _radius, _color)
    this.velocity = _velocity
  }

  update() {
    super.update()
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
  }
}

class Particle extends Projectile {
  constructor(_x, _y, _radius, _color, _velocity) {
    super(_x, _y, _radius, _color, _velocity)
    this.friction = 0.99
    this.alpha = 1
  }

  draw() {
    ctx.save()
    ctx.globalAlpha = this.alpha
    super.draw()
    ctx.restore()
  }

  update() {
    this.velocity.x *= this.friction
    this.velocity.y *= this.friction
    super.update()
    this.alpha -= 0.01
  }
}

class Enemy extends Circle {
  constructor(_x, _y, _radius, _color, _velocity) {
    super(_x, _y, _radius, _color)
    this.velocity = _velocity
  }

  update() {
    this.draw()
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
  }
}

const halfWidth = canvas.width / 2
const halfHeight = canvas.height / 2

let player = new Player(halfWidth, halfHeight, 30, "white")
let projectiles = []
let enemies = []
let particles = []

const init = () => {
  player = new Player(halfWidth, halfHeight, 30, "white")
  projectiles = []
  enemies = []
  particles = []
  currentScore = 0
}

const spawnEnemies = () => {
  setInterval(() => {
    const radius = Math.random() * (30 - 7) + 7

    let x
    let y
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
      y = Math.random() * canvas.height
    } else {
      x = Math.random() * canvas.width
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
    }

    const color = `hsl(${Math.random() * 360}, 50%, 50%)`
    const angle = Math.atan2(halfHeight - y, halfWidth - x)
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    }
    enemies.push(new Enemy(x, y, radius, color, velocity))
  }, 1000)
}

let animationId
const animate = () => {
  animationId = requestAnimationFrame(animate)
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  player.draw()

  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1)
    } else {
      particle.update()
    }
  })

  projectiles.forEach((projectile, projectileIndex) => {
    projectile.update()

    if (
      projectile.x - projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      projectiles.splice(projectileIndex, 1)
    }
  })

  enemies.forEach((enemy, index) => {
    enemy.update()

    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)

    if (dist - player.radius - enemy.radius < 1) {
      playEl.style.display = "flex"
      playButton.innerHTML = "Play Again"

      currentScoreEl.forEach((score) => {
        score.innerHTML = currentScore
      })

      cancelAnimationFrame(animationId)
    }

    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)

      if (dist - enemy.radius - projectile.radius < 1) {
        for (let i = 0; i < 8; i++) {
          particles.push(
            new Particle(projectile.x, projectile.y, 3, enemy.color, {
              x: Math.random() - 0.5,
              y: Math.random() - 0.5,
            })
          )
        }

        if (enemy.radius - 10 > 10) {
          currentScore += 50
          currentScoreEl.forEach((score) => {
            score.innerHTML = currentScore
          })

          gsap.to(enemy, {
            radius: enemy.radius - 10,
          })
          setTimeout(() => {
            projectiles.splice(projectileIndex, 1)
          }, 0)
        } else {
          currentScore += 150
          currentScoreEl.forEach((score) => {
            score.innerHTML = currentScore
          })

          setTimeout(() => {
            enemies.splice(index, 1)
            projectiles.splice(projectileIndex, 1)
          }, 0)
        }
      }
    })
  })
}

canvas.addEventListener("click", (e) => {
  const angle = Math.atan2(
    e.clientY - halfHeight,
    e.clientX - halfWidth
  )
  const velocity = {
    x: Math.cos(angle) * 6,
    y: Math.sin(angle) * 6,
  }
  projectiles.push(
    new Projectile(halfWidth, halfHeight, 5, "white", velocity)
  )
})

playButton.addEventListener("click", () => {
  init()
  animate()
  spawnEnemies()
  currentScoreEl.forEach((score) => {
    score.innerHTML = currentScore
  })
  playEl.style.display = "none"
})

window.addEventListener("keypress", (e) => {
  e.preventDefault()
  if (e.shiftKey) {
    if (e.key.toLocaleLowerCase() == "p") {
      if (animationId && !isPause) {
        isPause = true
        cancelAnimationFrame(animationId)
        displayEl.style.display = "flex"
      } else {
        isPause = false
        requestAnimationFrame(animate)
        displayEl.style.display = "none"
      }
    }
  }
})
