import { handlerVerification } from './utils'

export interface TimeoutOptionProps {
  
}

export class Timeout {
  static instanceMap: Record<number, Timeout> = {}

  static clearTimeout() {
    Object.keys(Timeout.instanceMap).forEach(timer => {
      const instance = Timeout.instanceMap[Number(timer)]
      if (!(instance instanceof Timeout)) return
      instance.clearTimeout()
    })
  }

  static pause() {
    Object.keys(Timeout.instanceMap).forEach(timer => {
      const instance = Timeout.instanceMap[Number(timer)]
      if (!(instance instanceof Timeout)) return
      instance.pause()
    })
  }

  static restart() {
    Object.keys(Timeout.instanceMap).forEach(timer => {
      const instance = Timeout.instanceMap[Number(timer)]
      if (!(instance instanceof Timeout)) return
      instance.restart()
    })
  }

  // 记录延时器暂停时的时间戳
  private pauseTime: number
  // 记录延时器执行时的时间戳
  private lastExecTime: number
  // 执行次数
  public count: number = 0
  // 延时器句柄
  public timer: number
  // 延时器回调函数
  public handler: TimerHandler
  // 延时器是否处于暂停状态
  public paused: boolean = false
  // 延时器是否已经被清除
  public cleared: boolean = false
  // 延时器间隔
  public timeout?: number
  // 配置项
  public options: TimeoutOptionProps
  // 延时器参数
  public restParams: any[]

  constructor(options: Timeout["options"] = {}) {
    this.options = {
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

  private _setTimeout: typeof setTimeout = (handler, timeout) => {
    handlerVerification(handler)
    delete Timeout.instanceMap[this.timer]
    this.lastExecTime = Date.now()
    this.timer = setTimeout(() => {
      this.execHandler(handler)
      this.clearTimeout()
    }, timeout)
    Timeout.instanceMap[this.timer] = this
    return this.timer
  }

  setTimeout: typeof setTimeout = (handler, timeout, ...rest) => {
    // 不能多次调用
    if (this.lastExecTime) return this.timer
    this.handler = handler
    this.timeout = timeout
    this.restParams = rest
    this._setTimeout(this.handler, this.timeout)
    return this.timer
  }

  clearTimeout() {
    if (!this.timer) return
    delete Timeout.instanceMap[this.timer]
    this.paused = true
    this.cleared = true
    clearTimeout(this.timer)
  }

  pause() {
    if (!this.lastExecTime) return
    if (this.paused || this.cleared) return
    this.paused = true
    this.pauseTime = Date.now()
    clearTimeout(this.timer)
  }

  restart(...args: any[]) {
    if (this.cleared) return
    if (!this.paused) return
    if (args.length) {
      this.restParams = args
    }
    const passedTime = this.pauseTime - this.lastExecTime
    const nextTimeout = (this.timeout || 0) - passedTime
    this._setTimeout(this.handler, nextTimeout)
  }

  update(options: {
    handler?: Timeout["handler"]
    timeout?: Timeout["timeout"]
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
