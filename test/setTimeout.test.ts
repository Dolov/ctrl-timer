

import { expect, jest, test, describe } from '@jest/globals';
import { Timeout } from '../src'

jest.useFakeTimers();

afterEach(() => Timeout.clearTimeout());

describe('setTimeout', () => {
  test('handler required', () => {
		const timer = new Timeout()
		// @ts-ignore
		expect(() => timer.setTimeout()).toThrowError()
	});

	test('handler type check', () => {
		const timer = new Timeout()
		// @ts-ignore
		expect(() => timer.setTimeout({})).toThrowError()
	});

	test('handler type string', () => {
		const callback = jest.fn();
		const timer = new Timeout()
		const str = `${callback()}`
		expect(() => timer.setTimeout(str, 1000)).toThrowError()
	});

	test("setTimeout work", () => {
    const timer = new Timeout()
    const callback = jest.fn()
    timer.setTimeout(callback, 1000)
    jest.advanceTimersByTime(999)
    expect(callback).not.toHaveBeenCalled()
    jest.advanceTimersByTime(1)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test("setTimeout only work once", () => {
    const timer = new Timeout()
    const callback = jest.fn()
    timer.setTimeout(callback, 1000)
    jest.advanceTimersByTime(5000)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test("setTimeout cant invoke multi", () => {
    const timer = new Timeout()
    const callback = jest.fn()
    timer.setTimeout(callback, 1000)
    timer.setTimeout(callback, 1000)
    timer.setTimeout(callback, 1000)
    jest.advanceTimersByTime(5000)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('setTimeout rest params', () => {
		const callback = jest.fn();
		const timer = new Timeout()
		timer.setTimeout(callback, 1000, 1, 2, 3)
		jest.advanceTimersByTime(1000);
		expect(callback).toHaveBeenCalledTimes(1);
		expect(callback).toHaveBeenCalledWith(1, 2, 3)
	});
})


describe('pause', () => {
	test('pause must after setTimeout work', () => {
		const callback = jest.fn();
		const timer = new Timeout()
		timer.pause()
		expect(timer.paused).toBe(false)
		timer.setTimeout(callback, 1000)
		timer.pause()
		timer.pause()
		expect(timer.paused).toBe(true)
	});

	test('setTimeout pause work', () => {
		const callback = jest.fn();
		const timer = new Timeout()
		timer.setTimeout(callback, 1000)
		timer.pause()
		jest.advanceTimersByTime(5000);
		expect(callback).not.toHaveBeenCalled();
	});
})


describe("restart", () => {

	test('restart must after setTimeout work', () => {
		const callback = jest.fn();
		const timer = new Timeout()
		timer.handler = callback
		timer.timeout = 1000
		timer.restart()
		jest.advanceTimersByTime(1000);
		expect(callback).not.toHaveBeenCalled();

		timer.setTimeout(callback, 1000)
		jest.advanceTimersByTime(1000);
		expect(callback).toHaveBeenCalled();
	});

	test('restart cant invoke after clearTimeout', () => {
		const callback = jest.fn();
		const timer = new Timeout()
		timer.setTimeout(callback, 1000)
		timer.clearTimeout()
		timer.restart()
		jest.advanceTimersByTime(5000);
		expect(callback).toHaveBeenCalledTimes(0);
	});


	test('restart work', () => {
		const callback = jest.fn();
		const timer = new Timeout()
		timer.setTimeout(callback, 1000)
		expect(callback).not.toHaveBeenCalled();

		jest.advanceTimersByTime(500);
		timer.pause()
		expect(callback).not.toHaveBeenCalled();

		timer.restart()
		jest.advanceTimersByTime(499);
		expect(callback).not.toHaveBeenCalled();

		jest.advanceTimersByTime(1);
		expect(callback).toHaveBeenCalledTimes(1);

		jest.advanceTimersByTime(500);
		expect(callback).toHaveBeenCalledTimes(1);

		jest.advanceTimersByTime(500);
		expect(callback).toHaveBeenCalledTimes(1);
	});

	test('restart with rest params []', () => {
		const callback = jest.fn();
		const timer = new Timeout()
		timer.setTimeout(callback, 1000, 1, 2, 3)
		jest.advanceTimersByTime(1000);
		expect(callback).toHaveBeenCalledWith(1, 2, 3)
		
		timer.pause()
		timer.restart()
		jest.advanceTimersByTime(1000);
		expect(callback).toHaveBeenCalledWith(1, 2, 3)
	});

	test('restart with rest params', () => {
		const callback = jest.fn();
		const timer = new Timeout()
		timer.setTimeout(callback, 1000, 1, 2, 3)

		timer.pause()
		timer.restart(3, 2, 1)
		jest.advanceTimersByTime(1000);
		expect(callback).toHaveBeenCalledWith(3, 2, 1)
	});
})

describe("update", () => {
	test('update handler', () => {
		const callback1 = jest.fn();
		const callback2 = jest.fn();
		const timer = new Timeout()
		timer.setTimeout(callback1, 1000)
		timer.update({ handler: callback2 })
		jest.advanceTimersByTime(1000)
		expect(callback1).toHaveBeenCalledTimes(0)
		expect(callback2).toHaveBeenCalledTimes(1)
	});

	test('update timeout', () => {
		const callback = jest.fn();
		const timer = new Timeout()
		timer.setTimeout(callback, 1000)
		timer.update({ timeout: 2000 })
    jest.advanceTimersByTime(1999)
		jest.advanceTimersByTime(0)
    jest.advanceTimersByTime(1)
		jest.advanceTimersByTime(1)
	});
})

describe("Timeout static methods", () => {
	test('Timeout.clearTimeout work', () => {
		const callback1 = jest.fn();
		const Timeout1 = new Timeout()
		Timeout1.setTimeout(callback1, 1000)
	
		const callback2 = jest.fn();
		const Timeout2 = new Timeout()
		Timeout2.setTimeout(callback2, 1000)

		Timeout.instanceMap["xxx"] = {}
	
		jest.advanceTimersByTime(1000);
		expect(callback1).toHaveBeenCalledTimes(1)
		expect(callback2).toHaveBeenCalledTimes(1)
		Timeout.clearTimeout()
	
		jest.advanceTimersByTime(10000);
		expect(callback1).toHaveBeenCalledTimes(1)
		expect(callback2).toHaveBeenCalledTimes(1)
	});

	test('Timeout.pause work', () => {
		const callback1 = jest.fn();
		const Timeout1 = new Timeout()
		Timeout1.setTimeout(callback1, 1000)
	
		const callback2 = jest.fn();
		const Timeout2 = new Timeout()
		Timeout2.setTimeout(callback2, 1000)

		Timeout.instanceMap["xxx"] = {}
	
		jest.advanceTimersByTime(1000);
		expect(callback1).toHaveBeenCalledTimes(1)
		expect(callback2).toHaveBeenCalledTimes(1)
		Timeout.pause()
	
		jest.advanceTimersByTime(10000);
		expect(callback1).toHaveBeenCalledTimes(1)
		expect(callback2).toHaveBeenCalledTimes(1)
	});

	test('Timeout.restart work', () => {
		const callback1 = jest.fn();
		const Timeout1 = new Timeout()
		Timeout1.setTimeout(callback1, 1000)
	
		const callback2 = jest.fn();
		const Timeout2 = new Timeout()
		Timeout2.setTimeout(callback2, 1000)

		Timeout.instanceMap["xxx"] = {}
	
		jest.advanceTimersByTime(500);
		expect(callback1).toHaveBeenCalledTimes(0)
		expect(callback2).toHaveBeenCalledTimes(0)
		Timeout.pause()
	
    Timeout.restart()
		jest.advanceTimersByTime(500);
		expect(callback1).toHaveBeenCalledTimes(1)
		expect(callback2).toHaveBeenCalledTimes(1)
	});
})