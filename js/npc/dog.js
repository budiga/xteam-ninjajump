import Animation from '../base/animation'
import DataBus from '../databus'
import {
  ROAD_WIDTH,
  ROAD_SPEED,
  FROM_BOTTOM,
  DOG_WIDTH,
  DOG_HEIGHT,
  PLAYER_HEIGHT,
  PLAYER_WIDTH
} from '../constant'

const DOG_IMG_SRC = 'images/dog.jpeg'

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight
const x_postions = [ROAD_WIDTH, window.innerWidth - ROAD_WIDTH - DOG_WIDTH]

let time = (screenHeight - FROM_BOTTOM - PLAYER_HEIGHT) / ROAD_SPEED
let s = screenWidth - 2 * ROAD_WIDTH - DOG_WIDTH
// console.log(time, s, s/time);
const DOG_SPEED_X = parseFloat((s / time).toFixed(2));

const __ = {
  speed: Symbol('speed')
}

let databus = new DataBus()

function rnd(start, end) {
  return Math.floor(Math.random() * (end - start) + start)
}

export default class DOG extends Animation {
  constructor() {
    super(DOG_IMG_SRC, DOG_WIDTH, DOG_HEIGHT)

    this.initExplosionAnimation()
  }

  init(speed) {
    this.index = rnd(0, 2)
    this.x = x_postions[this.index];
    this.y = -this.height

    this[__.speed] = speed

    this.visible = true
  }

  // 预定义爆炸的帧动画
  initExplosionAnimation() {
    let frames = []

    const EXPLO_IMG_PREFIX = 'images/explosion'
    const EXPLO_FRAME_COUNT = 19

    for (let i = 0; i < EXPLO_FRAME_COUNT; i++) {
      frames.push(EXPLO_IMG_PREFIX + (i + 1) + '.png')
    }

    this.initFrames(frames)
  }

  // 每一帧更新小狗的位置
  update() {
    this.y += this[__.speed]

    if (this.y >= 0) {
      if (this.index == 0) {
        this.x += DOG_SPEED_X
        if (this.x >= x_postions[1]) {
          this.index = 1
        }
      } else {
        this.x -= DOG_SPEED_X
        if (this.x <= x_postions[0]) {
          this.index = 0
        }
      }
    }

    // 对象回收
    if (this.y > screenHeight)
      databus.removeDog(this)
  }
}
