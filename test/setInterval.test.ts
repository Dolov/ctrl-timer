

import { expect, jest, test, describe } from '@jest/globals';
import { Interval } from '../src'

jest.useFakeTimers();

afterEach(() => Interval.clearInterval());

describe('setInterval', () => {

	test('setInterval cant invoke multi', () => {
		const callback = jest.fn();
		const timer = new Interval()
		timer.setInterval(callback, 1000)
		timer.setInterval(callback, 1000)
		jest.advanceTimersByTime(1000)
		expect(callback).toHaveBeenCalledTimes(1)
	});

	test('handler required', () => {
		const timer = new Interval()
		// @ts-ignore
		expect(() => timer.setInterval()).toThrowError()
	});

	test('handler type check', () => {
		const timer = new Interval()
		// @ts-ignore
		expect(() => timer.setInterval({})).toThrowError()
	});

	test('handler type string', () => {
		const callback = jest.fn();
		const timer = new Interval()
		const str = `${callback()}`
		expect(() => timer.setInterval(str, 1000)).toThrowError()
	});

	test('setInterval work', () => {
		const callback = jest.fn();
		const timer = new Interval()

		timer.setInterval(callback, 1000)

		expect(callback).not.toHaveBeenCalled();
		jest.advanceTimersByTime(3000);
		expect(callback).toHaveBeenCalledTimes(3);
	});

	test('setInterval rest params', () => {
		const callback = jest.fn();
		const timer = new Interval()

		timer.setInterval(callback, 1000, 1, 2, 3)
		jest.advanceTimersByTime(1000);
		expect(callback).toHaveBeenCalledTimes(1);
		expect(callback).toHaveBeenCalledWith(1, 2, 3)
	});
})

describe('pause', () => {
	
	test('pause must after setInterval work', () => {
		const callback = jest.fn();
		const timer = new Interval()
		timer.pause()
		expect(timer.paused).toBe(false)
		timer.setInterval(callback, 1000)
		timer.pause()
		timer.pause()
		expect(timer.paused).toBe(true)
	});

	test('setInterval pause work', () => {
		const callback = jest.fn();
		const timer = new Interval()
		expect(callback).not.toHaveBeenCalled();
		timer.setInterval(callback, 1000)
		timer.pause()
		jest.advanceTimersByTime(5000);
		expect(callback).not.toHaveBeenCalled();
	});
})

describe("restart", () => {

	test('restart must after setInterval work', () => {
		const callback = jest.fn();
		const timer = new Interval()
		timer.handler = callback
		timer.timeout = 1000
		timer.restart()
		jest.advanceTimersByTime(1000);
		expect(callback).not.toHaveBeenCalled();

		timer.setInterval(callback, 1000)
		jest.advanceTimersByTime(1000);
		expect(callback).toHaveBeenCalled();
	});

	test('restart cant invoke after clearInterval', () => {
		const callback = jest.fn();
		const timer = new Interval()
		timer.setInterval(callback, 1000)
		jest.advanceTimersByTime(1000);
		expect(callback).toHaveBeenCalledTimes(1);

		timer.clearInterval()
		timer.restart()
		jest.advanceTimersByTime(1000);
		expect(callback).toHaveBeenCalledTimes(1);
	});


	test('restart work', () => {
		const callback = jest.fn();
		const timer = new Interval()
		timer.setInterval(callback, 1000)
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
		expect(callback).toHaveBeenCalledTimes(2);
	});

	test('restart with rest params []', () => {
		const callback = jest.fn();
		const timer = new Interval()
		timer.setInterval(callback, 1000, 1, 2, 3)
		jest.advanceTimersByTime(1000);
		expect(callback).toHaveBeenCalledWith(1, 2, 3)
		
		timer.pause()
		timer.restart()
		jest.advanceTimersByTime(1000);
		expect(callback).toHaveBeenCalledWith(1, 2, 3)
	});

	test('restart with rest params', () => {
		const callback = jest.fn();
		const timer = new Interval()
		timer.setInterval(callback, 1000, 1, 2, 3)
		jest.advanceTimersByTime(1000);
		expect(callback).toHaveBeenCalledWith(1, 2, 3)

		timer.pause()
		timer.restart(3, 2, 1)
		jest.advanceTimersByTime(1000);
		expect(callback).toHaveBeenCalledWith(3, 2, 1)
	});
})

describe("return", () => {
	test('returns work', () => {
		const callback = jest.fn();
		const timer = new Interval()
		const timerRef = timer.setInterval(callback)
		expect(timerRef).not.toBeNull()
		expect(timerRef).not.toBeUndefined()
	});
})

describe("clearInterval", () => {
	test('clearInterval work', () => {
		const callback = jest.fn();
		const timer = new Interval()
		timer.clearInterval()
		timer.setInterval(callback, 1000)
		expect(callback).not.toHaveBeenCalled();
	
		jest.advanceTimersByTime(1000);
		expect(callback).toHaveBeenCalledTimes(1);
	
		timer.clearInterval()
		jest.advanceTimersByTime(5000);
		expect(callback).toHaveBeenCalledTimes(1);
	});
})

describe("options", () => {
	
	test('maxCount work', () => {
		const callback = jest.fn();
		const timer = new Interval({ maxCount: 5 })
		timer.setInterval(callback, 1000)
		expect(callback).not.toHaveBeenCalled();
	
		jest.advanceTimersByTime(10000);
		expect(callback).toHaveBeenCalledTimes(5);
	});

	test('maxClear true work', () => {
		const callback = jest.fn();
		const timer = new Interval({ maxCount: 5 })
		timer.setInterval(callback, 1000)
		expect(callback).not.toHaveBeenCalled();
		jest.advanceTimersByTime(10000);
		expect(callback).toHaveBeenCalledTimes(5);
		expect(timer.cleared).toBe(true)
	});

	test('maxClear false work', () => {
		const callback = jest.fn();
		const timer = new Interval({ maxCount: 5, maxClear: false })
		timer.setInterval(callback, 1000)
		expect(callback).not.toHaveBeenCalled();
		jest.advanceTimersByTime(10000);
		expect(callback).toHaveBeenCalledTimes(5);
		expect(timer.paused).toBe(true)
		expect(timer.cleared).toBe(false)
	});
})

describe("Interval static methods", () => {
	
	test('Interval.clearInterval work', () => {
		const callback1 = jest.fn();
		const interval1 = new Interval()
		interval1.setInterval(callback1, 1000)
	
		const callback2 = jest.fn();
		const interval2 = new Interval()
		interval2.setInterval(callback2, 1000)

		Interval.instanceMap["xxx"] = {}
	
		jest.advanceTimersByTime(1000);
		expect(callback1).toHaveBeenCalledTimes(1)
		expect(callback2).toHaveBeenCalledTimes(1)
		Interval.clearInterval()
	
		jest.advanceTimersByTime(10000);
		expect(callback1).toHaveBeenCalledTimes(1)
		expect(callback2).toHaveBeenCalledTimes(1)
	});

	test('Interval.pause work', () => {
		const callback1 = jest.fn();
		const interval1 = new Interval()
		interval1.setInterval(callback1, 1000)
	
		const callback2 = jest.fn();
		const interval2 = new Interval()
		interval2.setInterval(callback2, 1000)

		Interval.instanceMap["xxx"] = {}
	
		jest.advanceTimersByTime(1000);
		expect(callback1).toHaveBeenCalledTimes(1)
		expect(callback2).toHaveBeenCalledTimes(1)
		Interval.pause()
	
		jest.advanceTimersByTime(10000);
		expect(callback1).toHaveBeenCalledTimes(1)
		expect(callback2).toHaveBeenCalledTimes(1)
	});

	test('Interval.restart work', () => {
		const callback1 = jest.fn();
		const interval1 = new Interval()
		interval1.setInterval(callback1, 1000)
	
		const callback2 = jest.fn();
		const interval2 = new Interval()
		interval2.setInterval(callback2, 1000)

		Interval.instanceMap["xxx"] = {}
	
		jest.advanceTimersByTime(1000);
		expect(callback1).toHaveBeenCalledTimes(1)
		expect(callback2).toHaveBeenCalledTimes(1)
		Interval.pause()
	
		jest.advanceTimersByTime(1000);
		expect(callback1).toHaveBeenCalledTimes(1)
		expect(callback2).toHaveBeenCalledTimes(1)

		Interval.restart()
		jest.advanceTimersByTime(1000);
		expect(callback1).toHaveBeenCalledTimes(2)
		expect(callback2).toHaveBeenCalledTimes(2)
	});
})

describe("update", () => {
	
	test('update handler', () => {
		const callback1 = jest.fn();
		const callback2 = jest.fn();
		const timer = new Interval()
		timer.setInterval(callback1, 1000)
		
		jest.advanceTimersByTime(1000)
		expect(callback1).toHaveBeenCalledTimes(1)
		expect(callback2).toHaveBeenCalledTimes(0)
		timer.update({ handler: callback2 })
		jest.advanceTimersByTime(1000)
		expect(callback1).toHaveBeenCalledTimes(1)
		expect(callback2).toHaveBeenCalledTimes(1)
	});

	test('update timeout', () => {
		const callback = jest.fn();
		const timer = new Interval()
		timer.setInterval(callback, 1000)
		
		jest.advanceTimersByTime(2000)
		expect(callback).toHaveBeenCalledTimes(2)

		timer.update({ timeout: 2000 })
		jest.advanceTimersByTime(2000)
		expect(callback).toHaveBeenCalledTimes(3)
	});
})