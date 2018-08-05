import Animation from '../base/animation'
import DataBus   from '../databus'
import {
  ROAD_WIDTH,
  FROM_BOTTOM,
  BIRD_WIDTH,
  BIRD_HEIGHT,
  BIRD_WALL_SPACE,
  PLAYER_HEIGHT,
  PLAYER_WIDTH
} from '../constant'

const ENEMY_IMG_SRC = 'images/enemy.png'
const ENEMY_WIDTH = BIRD_WIDTH
const ENEMY_HEIGHT = BIRD_HEIGHT

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight
const x_postions = [ROAD_WIDTH + BIRD_WALL_SPACE, window.innerWidth - ROAD_WIDTH - ENEMY_WIDTH - BIRD_WALL_SPACE]
const change_point_y = screenHeight - (
  FROM_BOTTOM + PLAYER_HEIGHT / 2 
  + (screenWidth - 2*ROAD_WIDTH - BIRD_WALL_SPACE - ENEMY_WIDTH/2 - PLAYER_WIDTH/2)
  + ENEMY_HEIGHT / 2
)

const __ = {
  speed: Symbol('speed')
}

let databus = new DataBus()

function rnd(start, end){
  return Math.floor(Math.random() * (end - start) + start)
}

export default class Enemy extends Animation {
  constructor() {
    super(ENEMY_IMG_SRC, ENEMY_WIDTH, ENEMY_HEIGHT)

    this.initExplosionAnimation()
  }

  init(speed) {
    this.index = rnd(0, 2)
    this.x = x_postions[this.index];
    this.y = -this.height
    this.hasLift = false

    this[__.speed] = speed

    this.visible = true
  }

  // 预定义爆炸的帧动画
  initExplosionAnimation() {
    let frames = []

    const EXPLO_IMG_PREFIX  = 'images/explosion'
    const EXPLO_FRAME_COUNT = 19

    for ( let i = 0;i < EXPLO_FRAME_COUNT;i++ ) {
      frames.push(EXPLO_IMG_PREFIX + (i + 1) + '.png')
    }

    this.initFrames(frames)
  }

  // 每一帧更新敌人的位置
  update() {
    this.y += this[__.speed]

    // 升降的逻辑 start
    if(!this.hasLift){
      if (this.y >= change_point_y + 10) {
        this.shouldLift = true;
      }
      if (this.shouldLift) {
        this.y -= 2 * this[__.speed]
      }
      if (this.shouldLift && this.y <= change_point_y - 50) {
        this.shouldLift = false;
        this.hasLift = true
      }
    }
    // end

    if (this.hasLift && this.y >= change_point_y) {
      if (this.index == 0) {
        this.x += this[__.speed]
      } else {
        this.x -= this[__.speed]
      }
    }

    // 对象回收
    if (this.y > screenHeight || this.x < 0 || this.x > screenWidth )
      databus.removeEnemey(this)
  }
}
