import Player from './player/index'
import Enemy from './npc/enemy'
import Dog from './npc/dog'
import Bridge from './npc/bridge'
import BackGround from './runtime/background'
import Road from './runtime/road'
import GameInfo from './runtime/gameinfo'
import Music from './runtime/music'
import DataBus from './databus'
import { BIRD_SPEED, SCORE_PER_BIRD, ROAD_SPEED } from './constant'

let ctx = canvas.getContext('2d')
let databus = new DataBus()

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    this.aniId = 0

    this.restart()
  }

  restart() {
    databus.reset()

    canvas.removeEventListener(
      'touchstart',
      this.touchHandler
    )

    this.bg = new BackGround(ctx)
    this.road = new Road(ctx)
    this.player = new Player(ctx)
    this.gameinfo = new GameInfo()
    this.music = new Music()

    this.bindLoop = this.loop.bind(this)
    this.hasEventBind = false

    // 清除上一局的动画
    window.cancelAnimationFrame(this.aniId);

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }

  /**
   * 随着帧数变化的敌机生成逻辑
   * 帧数取模定义成生成的频率
   */
  enemyGenerate() {
    if (databus.frame % 180 === 0) {
      let enemy = databus.pool.getItemByClass('enemy', Enemy)
      enemy.init(BIRD_SPEED)
      databus.enemys.push(enemy)
    }
  }

  bridgeGenerate() {
    if (databus.frame % 600 === 0) {
      let bridge = databus.pool.getItemByClass('bridge', Bridge)
      bridge.init(ROAD_SPEED)
      databus.bridges.push(bridge)
    }
  }
  dogGenerate() {
    if (databus.frame % 600 === 0) {
      let dog = databus.pool.getItemByClass('dog', Dog)
      dog.init(ROAD_SPEED)
      databus.dogs.push(dog)
    }
  }


  // 全局碰撞检测
  collisionDetection() {
    let that = this

    for (let i = 0, il = databus.enemys.length; i < il; i++) {
      let enemy = databus.enemys[i]

      if (this.player.isCollideWith(enemy)) {
        if (databus.isHeroJumping) {
          enemy.playAnimation()
          that.music.playExplosion()
          databus.score += SCORE_PER_BIRD
        } else {
          this.heroWillDrop()
        }

        break
      }
    }

    for (let i = 0, il = databus.dogs.length; i < il; i++) {
      let dog = databus.dogs[i]

      if (this.player.isCollideWith(dog)) {
        if (databus.isHeroJumping) {
          dog.playAnimation()
          that.music.playExplosion()
          databus.score += SCORE_PER_BIRD
        } else {
          this.heroWillDrop()
        }

        break
      }
    }
  }

  heroWillDrop() { // 忍者掉出屏幕才算gameover
    databus.isHeroDead = true
    this.music.playShoot()
  }

  // 游戏结束后的触摸事件处理逻辑
  touchEventHandler(e) {
    e.preventDefault()

    if (databus.gameOver) {
      let x = e.touches[0].clientX
      let y = e.touches[0].clientY

      let area = this.gameinfo.btnArea

      if (x >= area.startX
        && x <= area.endX
        && y >= area.startY
        && y <= area.endY)
        this.restart()
    }
  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    this.bg.render(ctx)
    this.road.render(ctx)

    databus.enemys.concat(databus.dogs, databus.bridges).forEach((item) => {
      item.drawToCanvas(ctx)
    })

    this.player.drawToCanvas(ctx)

    databus.animations.forEach((ani) => {
      if (ani.isPlaying) {
        ani.aniRender(ctx)
      }
    })

    this.gameinfo.renderGameScore(ctx, databus.score)

    // 游戏结束停止帧循环
    if (databus.gameOver) {
      this.gameinfo.renderGameOver(ctx, databus.score)

      if (!this.hasEventBind) {
        this.hasEventBind = true
        this.touchHandler = this.touchEventHandler.bind(this)
        canvas.addEventListener('touchstart', this.touchHandler)
      }
    }
  }

  // 游戏逻辑更新主函数
  update() {
    if (databus.gameOver)
      return;

    this.road.update()
    this.player.update()

    databus.enemys.concat(databus.dogs, databus.bridges).forEach((item) => {
      item.update()
    })

    this.enemyGenerate()
    this.bridgeGenerate()
    this.dogGenerate()

    this.collisionDetection()
  }

  // 实现游戏帧循环
  loop() {
    databus.frame++

    this.update()
    this.render()

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }
}
