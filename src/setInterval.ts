import { handlerVerification } from './utils'

export interface IntervalOptionProps {
  /** 定时器执行的最大次数 */
  maxCount?: number
  /** 达到最大执行次数后是否清除定时器，如果不清除则暂停，默认为清除 */
  maxClear?: boolean
}

export class Interval {

  static instanceMap: Record<number, Interval> = {}

  static clearInterval() {
    Object.keys(Interval.instanceMap).forEach(timer => {
      const instance = Interval.instanceMap[Number(timer)]
      if (!(instance instanceof Interval)) return
      instance.clearInterval()
    })
  }

  static pause() {
    Object.keys(Interval.instanceMap).forEach(timer => {
      const instance = Interval.instanceMap[Number(timer)]
      if (!(instance instanceof Interval)) return
      instance.pause()
    })
  }

  static restart() {
    Object.keys(Interval.instanceMap).forEach(timer => {
      const instance = Interval.instanceMap[Number(timer)]
      if (!(instance instanceof Interval)) return
      instance.restart()
    })
  }

  // 记录定时器暂停时的时间戳
  private pauseTime: number
  // 记录定时器执行时的时间戳
  private lastExecTime: number
  // 执行次数
  public count: number = 0
  // 定时器句柄
  public timer: number
  // 定时器回调函数
  public handler: TimerHandler
  // 定时器是否处于暂停状态
  public paused: boolean = false
  // 定时器是否已经被清除
  public cleared: boolean = false
  // 定时器间隔
  public timeout?: number
  // 配置项
  public options: IntervalOptionProps
  // 定时器参数
  public restParams: any[]

  constructor(options: Interval["options"] = {}) {
    this.options = {
      maxClear: true,
      ...options
    }
  }

  private execHandler(handler: TimerHandler) {
    if (typeof handler === "function") {
      handler(...this.restParams)
    }
    if (typeof handler === "string") {
      // eval(handler)
    }
  }

  private _setInterval: typeof setInterval = (handler, timeout) => {
    handlerVerification(handler)
    this.paused = false
    this.cleared = false
    this.lastExecTime = Date.now()
    delete Interval.instanceMap[this.timer]
    this.timer = setInterval(() => {
      this.count += 1
      this.lastExecTime = Date.now()
      this.execHandler(handler)
      if (this.count === this.options.maxCount) {
        if (this.options.maxClear) {
          this.clearInterval()
        } else {
          this.pause()
        }
      }
    }, timeout)

    Interval.instanceMap[this.timer] = this
    return this.timer
  }

  setInterval: typeof setInterval = (handler, timeout, ...rest) => {
    // 不能多次调用
    if (this.lastExecTime) return this.timer
    this.timeout = timeout
    this.handler = handler
    this.restParams = rest
    this._setInterval(this.handler, this.timeout)
    return this.timer
  }

  clearInterval() {
    if (!this.timer) return
    delete Interval.instanceMap[this.timer]
    this.paused = true
    this.cleared = true
    clearInterval(this.timer)
  }

  pause() {
    if (!this.lastExecTime) return
    if (this.paused || this.cleared) return
    this.paused = true
    this.pauseTime = Date.now()
    clearInterval(this.timer)
  }

  restart(...args: any[]) {
    if (this.cleared) return
    if (!this.paused) return
    if (args.length) {
      this.restParams = args
    }
    const passedTime = this.pauseTime - this.lastExecTime
    const nextTimeout = (this.timeout || 0) - passedTime

    this._setInterval(() => {
      this.execHandler(this.handler)
      this.clearInterval()
      this._setInterval(this.handler, this.timeout)
    }, nextTimeout)
  }

  update(options: {
    handler?: Interval["handler"]
    timeout?: Interval["timeout"]
  }) {
    const { handler, timeout } = options
    if (handler) {
      this.handler = handler
    }
    if (typeof timeout === "number") {
      this.timeout = timeout
    }
    this.pause()
    this.restart()
  }
}
