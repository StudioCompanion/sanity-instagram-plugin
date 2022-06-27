/* eslint-disable @typescript-eslint/no-explicit-any */
interface PThrottleArgs {
  limit: number
  interval: number
}

type PromiseResolve<ValueType> = ValueType extends PromiseLike<infer ValueType>
  ? Promise<ValueType>
  : Promise<ValueType>

export type ThrottledFunction<
  Argument extends readonly unknown[],
  ReturnValue
> = (...args: Argument) => PromiseResolve<ReturnValue>

export default function pThrottle(
  options: PThrottleArgs
): <Argument extends readonly unknown[], ReturnValue>(
  function_: (...args: Argument) => ReturnValue
) => ThrottledFunction<Argument, ReturnValue>

export default function pThrottle({ limit, interval }: any) {
  if (!Number.isFinite(limit)) {
    throw new TypeError('Expected `limit` to be a finite number')
  }

  if (!Number.isFinite(interval)) {
    throw new TypeError('Expected `interval` to be a finite number')
  }

  const queue = new Map()

  let currentTick = 0
  let activeCount = 0

  function windowedDelay() {
    const now = Date.now()

    if (now - currentTick > interval) {
      activeCount = 1
      currentTick = now
      return 0
    }

    if (activeCount < limit) {
      activeCount++
    } else {
      currentTick += interval
      activeCount = 1
    }

    return currentTick - now
  }

  return (callback: any) => {
    const throttled = function (...args: any[]) {
      let timeout: NodeJS.Timeout

      return new Promise((resolve, reject) => {
        const execute = () => {
          // @ts-ignore
          resolve(callback.apply(this, args))
          queue.delete(timeout)
        }

        timeout = setTimeout(execute, windowedDelay())

        queue.set(timeout, reject)
      })
    }

    return throttled
  }
}
