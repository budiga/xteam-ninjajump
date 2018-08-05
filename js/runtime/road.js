import Sprite from '../base/sprite'
import DataBus from '../databus'
import { ROAD_SPEED, ROAD_WIDTH, SCORE_FRAMES } from '../constant'

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

const BG_IMG_ROAD = 'images/road.jpg'
const BG_WIDTH = ROAD_WIDTH
const BG_HEIGHT = 512

let databus = new DataBus()

/**
 * 游戏背景类
 * 提供update和render函数实现无限滚动的背景功能
 */
export default class BackGround extends Sprite {
  constructor(ctx) {
    super(BG_IMG_ROAD, BG_WIDTH, BG_HEIGHT)

    this.render(ctx)

    this.top = 0
  }

  update() {
    if (databus.isHeroDead) {
      this.top -= ROAD_SPEED
    } else {
      this.top += ROAD_SPEED
      if (databus.frame % SCORE_FRAMES == 0) {
        databus.score++
      }
    }

    if (this.top >= screenHeight) this.top = 0
  }

  /**
   * 背景图重绘函数
   * 绘制两张图片，两张图片大小和屏幕一致
   * 第一张漏出高度为top部分，其余的隐藏在屏幕上面
   * 第二张补全除了top高度之外的部分，其余的隐藏在屏幕下面
   */
  render(ctx) {
    // 左边的道路
    ctx.drawImage(
      this.img,
      0,
      0,
      this.width,
      this.height,
      0,
      -screenHeight + this.top,
      this.width,
      screenHeight
    )
    ctx.drawImage(
      this.img,
      0,
      0,
      this.width,
      this.height,
      0,
      this.top,
      this.width,
      screenHeight
    )

    // 右边的道路
    ctx.drawImage(
      this.img,
      0,
      0,
      this.width,
      this.height,
      screenWidth - this.width,
      -screenHeight + this.top,
      this.width,
      screenHeight
    )
    ctx.drawImage(
      this.img,
      0,
      0,
      this.width,
      this.height,
      screenWidth - this.width,
      this.top,
      this.width,
      screenHeight
    )
  }
}
