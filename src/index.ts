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
type Log = ( message: string, userId?: string ) => void;
let log: Log = (
	message,
	userId = 'empty'
) => {
	console.log(message, userId)
}

// 重载
type Reserve = {
	(form: Date, to: Date, destination: string): Reservation
	(form: Date, destination: string): Reservation
}

let reserve: Reserve = (
	from: Date,
	toOrDestination: Date | string,
	destination?: string
	) => {
		if(toOrDestination instanceof Date && destination !== undefined) {
			// 预定单程
		}

		if(typeof toOrDestination === 'string') {
			// 预定往返
		}
}

