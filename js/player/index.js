import Sprite   from '../base/sprite'
import DataBus  from '../databus'
import { 
  PLAYER_JUMP_SPEED,
  ROAD_WIDTH,
  FROM_BOTTOM,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  screenWidth,
  screenHeight,
  PLAYER_DROP_SPEED
} from '../constant'

// 忍者相关常量设置
const PLAYER_IMG_SRC = 'images/hero.png'

let databus = new DataBus()

export default class Player extends Sprite {
  constructor() {
    super(PLAYER_IMG_SRC, PLAYER_WIDTH, PLAYER_HEIGHT)

    // 忍者的位置（y是固定的）
    this.minX = ROAD_WIDTH
    this.maxX = screenWidth - ROAD_WIDTH - this.width
    this.x = this.minX
    this.y = screenHeight - this.height - FROM_BOTTOM

    // 0 左边，1 右边
    this.leftRightFlag = 0

    // 初始化事件监听
    this.initEvent()
  }

  update(){
    if (databus.isHeroJumping) {
      if (this.leftRightFlag == 0) {
        this.x += PLAYER_JUMP_SPEED
        if (this.x >= this.maxX) {
          this.x = this.maxX
          this.leftRightFlag = 1
          databus.isHeroJumping = false
        }
      } else {
        this.x -= PLAYER_JUMP_SPEED
        if (this.x <= this.minX) {
          this.x = this.minX
          this.leftRightFlag = 0
          databus.isHeroJumping = false
        }
      }
    }

    if (databus.isHeroDead) {
      this.y += PLAYER_DROP_SPEED
      if (this.leftRightFlag == 0) {
        this.x += (PLAYER_DROP_SPEED / 2)
      } else {
        this.x -= (PLAYER_DROP_SPEED / 2)
      }

      if (this.y >= screenHeight) {
        databus.gameOver = true
      }
    }
  }


  /**
   * 玩家响应手指的触摸事件
   * 改变战机的位置
   */
  initEvent() {
    canvas.addEventListener('touchend', ((e) => {
      e.preventDefault()
      if (!databus.gameOver) {
        if (databus.isHeroJumping) return
        databus.isHeroJumping = true
      }
    }).bind(this))
  }

}
