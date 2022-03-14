let c : {
	firstName: string,
	lastName: string,
} = {
	firstName: 'john',
	lastName: 'barrowman'
}

class Person {
	constructor(
		public firstName: string,
		public lastName: string,
	){}
}

let a : {
	b: number,
	c?: string, // 属性c类型检查 string or undefined 
	readonly d: string,
	[key: number]: boolean, // 任意数字类型key检查 boolean
} = {
	b: 1,
	c: undefined,
	d: 'fuck',
	1: true,
}

c = new Person('matt', 'smith')

let d : Object = {}

type Cat = { name: string, purrs: boolean }
type Dog = { name: string, barks: boolean, wags: boolean }

type CatOrDogOrBoth = Cat | Dog
type CatAndDog = Cat & Dog


let fuck: CatAndDog = {
	name: 'lucas',
	purrs: true,
	barks: true,
	wags: true,
}

// unknown 必须显式注解方可执行操作
let _test_uk: unknown = 3
// let _fuck_uk = _test_uk + 1; // error: Object is of type 'unknown'
if(typeof _test_uk == 'number') {
	let _fuck_uk = _test_uk + 1
}


// 数组
let h: string[] = []
let v: number[] = []
h.push()
// 只读属性push等改变数组方法 & 修改元素值不可执行
let as: readonly number[] = [1, 2, 3]


// 元组: 长度固定，各索引位值具有固定已知类型(子集)。 差异: 跟数组不同必须显示注解类型
let friends: [string, ...string[]] = ['salad'] // 可遍历
let info: [string, string, number] = ['galens', 'zhang', 1993]


// 类型别名
type Age = number
type _person = {
	name: string,
	age: Age,
}

let age = 55
let driver: _person = {
	name: 'James May',
	age: age
}


/*
	null: 缺少值
	undefined: 尚未赋值的变量
	void: 没有return语句的函数
	never: 永不返回的函数_testNev1(抛出异常) & _testNev2(一直运行)
*/

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
let _square = Square = { numberOfSides: 4, sideLength: 3 }
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


/* 类和接口 */

// ------ 类:
type Color = 'Black' | 'White'
type File = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
type Rank = 1 | 2 | 3 | 4 | 5 | 6

// 表游戏回合
class Game {
	private piece = Game.makePieces()
	private static makePieces() {
		return [
			new King('White', 'E', 1),
			new Queen('Black', 'D', 8),
			//...
		]
	}
}

// 表棋子坐标
class Position {
	constructor (
		private file: File,
		private rank: Rank
	) {}

	distanceFrom(position: Position) {
		return {
			rank: Math.abs(position.rank - this.rank),
			file: Math.abs(position.file.charCodeAt(0) - this.charCodeAt(0))
		}
	}
}

// 表棋子 abstract: 抽象类不允许实例化，抽象类中的抽象方法必须在子类中实现
abstract class Piece {
	protected position: Position
	abstract canMoveTo(position: Position): boolean
	constructor(
		private readonly color: Color
		file: File
		rank: Rank
	) {
		this.position = new Position(file, rank)
	}

	moveTo(position: Position) {
		this.position = position
	}
}

// 棋子分类...
class King extends Piece {
	canMoveTo(position: Position) {
		let distance = this.position.distanceFrom(position)
		return distance.rank < 2 && distance.file < 2
	}
}
class Queen extends Piece {}


// ------ 接口:

type Food = {
	calories: number
	tasty: boolean
}
type Sushi = Food & {
	salty: boolean
}
type Cake = Food & {
	sweet: boolean
}

// 等价于

interface Food {
	calories: number
	tasty: boolean
}
interface Sushi extends Food {
	salty: boolean
}
interface Cake extends Food {
	sweet: boolean
}

/*

类和接口区别(例子不赘述)

1. 类型别名更通用，接口声明右侧必须为结构
2. 扩展接口赋值的检查
3. 声明合并
3. 声明合并
*/ 







































