import Animation from '../base/animation'
import DataBus from '../databus'
import {
  ROAD_WIDTH,
  BRIDGE_WIDTH,
  BRIDGE_HEIGHT
} from '../constant'

const BRIDGE_IMG_SRC = 'images/bridge.png'

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

const __ = {
  speed: Symbol('speed')
}

let databus = new DataBus()

export default class Bridge extends Animation {
  constructor() {
    super(BRIDGE_IMG_SRC, BRIDGE_WIDTH, BRIDGE_HEIGHT)
  }

  init(speed) {
    this.x = ROAD_WIDTH;
    this.y = 0

    this[__.speed] = speed

    this.visible = true
  }

  // 每一帧更新小狗的位置
  update() {
    this.y += this[__.speed]

    // 对象回收
    if (this.y > screenHeight)
      databus.removeBridge(this)
  }
}
