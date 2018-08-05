import Pool from './base/pool'

let instance

/**
 * 全局状态管理器
 */
export default class DataBus {
  constructor() {
    if ( instance )
      return instance

    instance = this

    this.pool = new Pool()

    this.reset()
  }

  reset() {
    this.frame      = 0
    this.score      = 0
    this.enemys     = []
    this.bridges    = []
    this.dogs       = []
    this.animations = []
    this.isHeroJumping = false // 忍者是否处于跳跃状态
    this.isHeroDead = false // 忍者挂了 准备掉落
    this.gameOver   = false
  }

  /**
   * 回收敌人，进入对象池
   * 此后不进入帧循环
   */
  removeEnemey(enemy) {
    let temp = this.enemys.shift()
    temp.visible = false

    this.pool.recover('enemy', enemy)
  }

  removeDog(dog) {
    let temp = this.dogs.shift()
    temp.visible = false

    this.pool.recover('dog', dog)
  }

  removeBridge(bridge) {
    let temp = this.bridges.shift()
    temp.visible = false

    this.pool.recover('bridge', bridge)
  }
}
