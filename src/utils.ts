
export const handlerVerification = (handler: TimerHandler) => {
  if (!handler) {
    throw Error("Timer missing necessary parameters - handler")
  }

  if (typeof handler === "string") {
    throw Error("Unsafe string handler")
  }
  
  if (typeof handler !== "function") {
    throw Error(`Timer handler must function not ${typeof handler}`)
  }
}



