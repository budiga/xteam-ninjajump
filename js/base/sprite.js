/**
 * 游戏基础的精灵类
 */
export default class Sprite {
  constructor(imgSrc = '', width=  0, height = 0, x = 0, y = 0) {
    this.img     = new Image()
    this.img.src = imgSrc

    this.width  = width
    this.height = height

    this.x = x
    this.y = y

    this.visible = true
  }

  /**
   * 将精灵图绘制在canvas上
   */
  drawToCanvas(ctx) {
    if ( !this.visible )
      return

    ctx.drawImage(
      this.img,
      this.x,
      this.y,
      this.width,
      this.height
    )
  }

  /**
   * 简单的碰撞检测定义：
   * 另一个精灵的中心点处于本精灵所在的矩形内即可
   * @param{Sprite} sp: Sptite的实例
   */
  isCollideWith(sp) {
    let spX = sp.x + sp.width / 2
    let spY = sp.y + sp.height / 2

    if ( !this.visible || !sp.visible )
      return false

    return !!(   spX >= this.x
              && spX <= this.x + this.width
              && spY >= this.y
              && spY <= this.y + this.height  )
  }

  /**
   * 简单的碰撞检测定义：
   * 另一个精灵的四个角，只要有一个角点在本精灵所在的矩形内
   * 或者 两个精灵中心点距离小于（width1+width2）/ 2
   * 就判定为碰撞
   */
  // isCollideWith(sp) { // 1234 - 左上 右上 右下 左下
  //   let spX1 = sp.x
  //   let spY1 = sp.y

  //   let spX2 = sp.x + sp.width
  //   let spY2 = sp.y

  //   let spX3 = sp.x + sp.width
  //   let spY3 = sp.y + sp.height

  //   let spX4 = sp.x
  //   let spY4 = sp.y + sp.height

  //   if (!this.visible || !sp.visible)
  //     return false

  //   const flag1 = !!(spX1 >= this.x
  //     && spX1 <= this.x + this.width
  //     && spY1 >= this.y
  //     && spY1 <= this.y + this.height)
    
  //   const flag2 = !!(spX2 >= this.x
  //     && spX2 <= this.x + this.width
  //     && spY2 >= this.y
  //     && spY2 <= this.y + this.height)
    
  //   const flag3 = !!(spX3 >= this.x
  //     && spX3 <= this.x + this.width
  //     && spY3 >= this.y
  //     && spY3 <= this.y + this.height)
    
  //   const flag4 = !!(spX4 >= this.x
  //     && spX4 <= this.x + this.width
  //     && spY4 >= this.y
  //     && spY4 <= this.y + this.height)
    
  //   const flag5 = Math.sqrt(Math.pow(this.x - sp.x) + Math.pow(this.y - sp.y))
  //     < (this.width + sp.width) / 2

  //   return (flag1 || flag2 || flag3 || flag4 || flag5)
  // }
}
