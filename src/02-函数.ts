
// 返回void函数
function _testvoid() {
	let _a = 2 + 2
}

function _testNev1() {
	throw TypeError('I always error')
}

function _testNev2() {
	while(true) {
		// doSomething();
	}
}

// this关键字处理
function fancyDate(this: Date) {
	return `${ this.getDate() } / ${ this.getMonth() } / ${ this.getFullYear() }`;
}
fancyDate.call(new Date)


/* 函数调用签名(类型签名) */

// function greet(name: string)
type _greet = (name: string) => string

// function log(message: string, userId?: string)
type _log = (message: string, userId?: string) => void

// function sumVariadicSafe(...numbers: number[]): number
type _sumVariadicSafe = (...numbers: number[]) => number

// for example
type Log = ( message: string, userId?: string ) => void
let log: Log = (
	message,
	userId = 'empty'
) => {
	// console.log(message, userId)
}

// 重载函数: 有多个调用签名的函数
type Reserve = {
	(form: Date, to: Date, destination: string): Reservation
	(form: Date, destination: string): Reservation
	(destination: string): Reservation
}

let reserve: Reserve = (
	from?: Date,
	toOrDestination?: Date | string,
	destination?: string
	) => {
		if(toOrDestination instanceof Date && destination !== undefined) {
			// 预定单程
		}

		if(typeof toOrDestination === 'string') {
			// 预定往返
		}
}

// 多态
function filter(ary: any, f: Function) {
	let result = []
	for(let i = 0; i < ary.length; i++) {
		let item = ary[i]
		if( f(item) ) {
			result.push(item)
		}
	}
	return result
}

/* 泛型参数: 在类型层面施加约束的占位类型，也称多态类型参数 */

// <T>在调用签名中声明, ts将在调用Filter类型的函数时为T绑定具体类型
type Filter = {
	// (array: number[], f: (item: number) => boolean): number[]
	// (array: string[], f: (item: string) => boolean): string[]
	<T>(array: T[], f: (item: T) => boolean): T[]
}

// 如需把T的作用域限定在类型别名Filter中，ts则需调用Filter时显式绑定类型
type _Filter<T> = {
	(array: T[], f: (item: T) => boolean): T[]
}
// let filterInstance: _Filter<number> = (array, f) => {}

// 具名函数调用签名
function filter<T>(array: T[], f: (item: T) => boolean ): T[] { }


function mapNode<T extends TreeNode>(
	node: T,
	f: (value: string) => string
): T {
	return {
		...node,
		value: f(node.value)
	}
}

// ts推导result类型为{}报错, T默认{}, 需显式注解Promise泛型参数
// let promise = new Promise(resolve => resolve(45))
let promise = new Promise<number>(resolve => resolve(45))
promise.then( result => result * 4)


// 多个约束的受限多态
type HasSides = { numberOfSides: number }
type SideHaveLengh = { sideLength: number }

function logPerimeter<
	Shape extends HasSides & SideHaveLengh
>(s: Shape): Shape {
	console.log(s.numberOfSides * s.sideLength)
	return s
}

type Square = HasSides & SideHaveLengh
let _square: Square = { numberOfSides: 4, sideLength: 3 }
logPerimeter(_square)


// 受限的多态模拟变长参数
// function call(
// 	f: (...args: unknown[]) => unknown,
// 	...args: unknown[]
// ): unknown {
// 	return f(...args)
// }
function call<T extends unknown[], R>(
	f: (...args: T) => R,
	...args: T
): R {
	return f(...args)
}

function fill(length: number, value: string): string[] {
	return Array.from({length}, () => value)
}
