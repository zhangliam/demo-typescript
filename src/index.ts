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


/* 类和接口 */

// ------ 类:
type Color = 'Black' | 'White'
type File = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
type Rank = 1 | 2 | 3 | 4 | 5 | 6

// 属性修饰符
// private: 当前类的实例访问
// public: 无限制
// protected: 当前类及其子类的实例访问

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

类和接口区别
1. 类型别名更通用(类型表达式&,|诸如此类), 接口声明则不行右侧必须为结构
2. 扩展接口赋值的检查(属性类型不同也会报错)
3. 声明合并
*/ 

// 声明合并
interface User {
	name: string
}

interface User {
	age: number
}

// 声明两个User接口, ts将自动合并为一个(ps:继承的时候同样会进行类型检查)
let _interUser: User = {
	name: 'Ashley',
	age: 30
}


// 接口可以声明实例属性, 但不能带可见性修饰符(private, protected, public)

interface Animal {
	readonly name: string
	eat(food: string): void
	sleep(hours: number): void
}

interface Feline() {
	meow(): void
}

class Cat implements Animal, Feline {
	name: 'Whiskers'

	eat(food: string) {
		console.log(`Eat ${ food }`)s
	}

	sleep(hours: number) {
		console.log(`Sleep ${ hours }`)
	}

	meow() {
		console.log('meow~')
	}
}

/* 
	Q: 实现接口or扩展抽象类
	A: 1. 接口是对结构建模的方式. 在值层面可表示对象, 数组, 函数, 类或类的实例. 接口不生成js代码, 只存在于编译时
		 2. 抽象类只对类建模, 而且生成运行时代码(即js类). 抽象类有构造方法, 可以提供默认实现, 属性和方法设置访问修饰符. 接口则不行
*/


// 类是结构化类型
// ts根据结构比较类, 与类的名称无关, 类与其他类型是否兼容看结构, 如常规对象定义同样属性或方法也可兼容
class Zebra {
	trot() {
		//...
	}
}

class Poodle {
	trot() {
		//...
	}
}

function ambleAround(animal: Zebra) {
	animal.trot()
}

let zebra = new Zebra
let poodle = new Poodle

abbleAround(zebra)  // OK 
abbleAround(poodle) // OK


// 类既声明值也声明类型

// 值
let a = 1999
function b() {}

// 类型
type a = number
interface b {
	(): void
}

// StringDatabase类实现简单数据库
type State = {
	[key: string]: string
}

// StringDatabase实例类型
interface StringDatabase {
	state: State
	get(key: string): string | null
	set(key: string, value: string): void
}

// StringDatabase构造方法
interface StringDatabaseConstructor {
	new(state?: State): StringDatabase
	from(state: State): StringDatabase
}

class StringDatabase {
	state: State = {}
	constructor(public state: State = {}) {}

	get(key: string): string | null {
		return key in this.state ? this.state[key] : null
	}

	set(key: string, value: string): void {
		this.state[key] = value
	}

	static from(state: State) {
		let db = new StringDatabase
		for(let key in state) {
			db.set(key, state[key])
		}
		return db
	}
}

// 综上, 类声明不仅在值层面和类型层面生成相关内容, 而且在类型层面生成了两部门内容: 一部分表示类的实例，另一部分表示类的构造方法


// ------ 混入
class User {
	private id: string = '3'
	private name: string = 'Emma Gluzman'

	debug(): void {
		console.log(this.id + this.name)
	}
}

type ClassConstructor<T> = new(...args: any[]) => T

function withEzDebug<C extends ClassConstructor<{
	// 为ClassConstructor绑定结构类型确保传入此构造方法定义了getDebugValue函数
 	getDebugValue(): object 
}>>(Class: C) {
	return class extends Class {
		// 不考虑构造方法汇中逻辑
		// constructor(...args: any[]) {
		// 	super(...args)
		// }
		debug() {
			let Name = Class.constructor.name
			let value = this.getDebugValue()
			return `Name ${ JSON.stringify(value) } `
		}
	}
}

class HardToDebugUser {
	constructor(
		private id: string,
		private firstName: string,
		private lastName: string
	) {} 

	getDebugValue() {
		return {
			id: this.id,
			name: this.firstName + ' ' + this.lastName
		}
	}
}

let mixinUser = withEzDebug(HardToDebugUser)
let insmixinUser = new mixinUser(3, 'Emma', 'Gluzman')
insmixinUser.debug()


// ------ 类实现常见设计模式

// 工厂模式
interface Shoe {
	purpose: string
}

class BalletFlat implements Shoe {
	purpose = 'dancing'
}

class Boot implements Shoe {
	purpose = 'woodcutting'
}

class Sneaker implements Shoe {
	purpose = 'walking'
}

let ShoeFactory = {	
	create(type: 'balletFlat' | 'boot' | 'sneaker'): Shoe {
		switch(type) {
			case 'balletFlat': return new BalletFlat
			case 'boot': return new Boot
			case 'sneaker': return new Sneaker
		}
	}
}


// 建造者模式
class RequestBuilder {
	private url: string | null = null 
	private method: 'get' | 'post' | null = null 
	private data: object | null = {} 

	setURL(url: string):this {
		this.url = url
		return this
	}

	setMethod(method: 'get' | 'post'):this {
		this.method = method
		return this
	}

	setData(data: object):this {
		this.data = data
	}

	send() {}
}

new RequestBuilder()
	.setURL('/users')
	.setMethod('get')
	.setData({ firstName: 'Anna' })
	.send()


// final: 标记类不可拓展 & 方法标记不可覆盖
// 实现不可拓展 & 可实例化
class MessageQueue {
	private constructor(private messages: string[]) {}
	static create(messages: string[]) {
		return new MessageQueue(messages)
	}
}


/* 类型进阶 */

// ------ 函数型变
// 不变T & 协变:<T & 逆变:>T & 双变<:T 或 >:T
// ts对预期的结构, 还可以使用属性的类型<:预期类型的结构, 但是不能传入属性的类型是预期类型的超类型结构. 
// 在类型上, ts对结构(对象和类)的属性类型进行了协变. 如想保证A对象可赋值给B对象, A对象每个属性必须<:B对象对应属性
	
class Animal {}

class Brid extends Animal {
	chirp() {}
}

class Crow extends Brid {
	caw() {}
}

//  Crow为Brid子类型, Brid为Animal子类型, 所以 Crow :< Brid :< Animal

function chirp(brid: Brid): Brid {
	brid.chirp()
	return brid
}

// 细化
type Unit = 'cm' | 'px' | '%'

let _units: Unit[] = ['cm', 'px', '%']

function parseUnit(value: string): Unit | null {
	for(let i = 0; i < _units.length; i++) {
		if(value.endsWith(_units[i])) {
			return units[i]	
		}
	}
	return null
}

type Width = {
	unit: Unit,
	value: number
}

function parseWidth(width: number | string | null | undefined): Width | null {

	if(width == null) {
		return null
	}

	if(typeof width === 'number') {
		return { unit: 'px', value: width}
	}

	let unit = parseUnit(width) 
	if(unit) {
		return { unit, value: parseFloat(width) }
	}

}


/* 对象类型进阶 */

// "键入" 运算符
type APIResponse = {
	user: {
		userId: string,
		friendList: {
			count: number,
			friends: {
				firstName: string,
				lastName: string,
			}[]
		}
	}
}

type FriendList = APIResponse['userId']['friendList']

function renderFriendList(friendlist: FriendList) {
	//...
}

// 任何结构(对象, 类构造方法或类的实例)和数组都可以"键入",单个好友类型可声明如此
type Friend = FriendList['friends'][number]


// keyof运算符: 获取对象类型所有键的类型, 合并为一个字符串字面量类型
type ResponseKeys = keyof APIResponse // 'user'
type UserKeys = keyof APIResponse['user'] // 'userId' | 'friendList'


// Record类型: 描述有映射关系的对象

// 比如我需要一个对象，有 ABC 三个属性，属性的值必须是数字，那么就这么写：
type keys = 'A' | 'B' | 'C'
const result: Record<keys, number> = {
  A: 1,
  B: 2,
  C: 3
}

interface PageInfo {
  title: string
}

type Page = "home" | "about" | "contact";

const nav: Record<Page, PageInfo> = {
  about: { title: "about" },
  contact: { title: "contact" },
  home: { title: "home" },
}

// 映射类型: Record类型的超类型

// Record类型实现来自于映射类型
type Record<K extends keyof any, T> = {
	[P in K]: T
}

type Account = {
	id: number
	isEmployee: boolean
	notes: string
}

// 所有字段可选
type OptionalAccount = {
	[K in keyof Account]?: Account[K]
}

// 所有字段都可为null 
type NullableAccount = {
	[K in keyof Account]?: Account[K] | null
}

// 所有字段都是只读
type ReadonlyAccount = {
	readonly [K in keyof Account]?: Account[K]
}

// 所有字段都是可写(等同于Account)
// '-'减号运算符: 撤销readonly修饰符, 还原为必须的和可写的的
type Account2 = {
	-readonly [K in keyof ReadonlyAccount]?: Account[K]
}

// 内置的映射类型

Record<Keys, Values> // 键的类型为Keys, 值的类型为Values对象

Partial<Object> // Object每个字段标记为可选

Required<Object> // Object每个字段标记为必选

Readonly<Object> // Object每个字段标记为只读

Pick<Object, Keys> // 返回Object子类型, 只含指定Keys


// 伴生对象模式: 把同名的对象和类配对在一起, ts中则为类型和对象配对使用
// ts的类型和值分别在不同的命名空间中, 意味在同一个作用域中可以有同名的类型和值
type Currency = {
	unit: 'EUR' | 'GBP' | 'JPY' | 'USD'
	value: number
}

let Currency = {
	DEFAULT: 'USD',
	from(value: number, unit = Currency.DEFAULT): Currency {
		return { value, unit }
	} 
}


/* 函数类型进阶 */

// 用户定义的类型防护措施
function isString(a: unknown): boolean {
	return typeof a === 'string'
}
isString('a') // true
isString([7]) // false

// it's OK

function parseInput(input: string | number) {
	let formattedInput: string
	if(isString(input)) {
		return input.toUpperCase() // Error Property 'toUpperCase' does not exist on type 'number'
	}	
}

// 类型细化只存在当前作用域, isString中typeof可生效, 但在parseInput新作用域类型细化无法转移
// isString默认返回为布尔值, 需告知类型检查器返回为true时, 表明传给isString函数为字符串, so定义类型防护措施如下
function isString(a: unknown): a is string {
	return typeof a === 'string'
}

//定义类型防护措施只限一个参数, 但不限于类型
type LegacyDialog
type Dialog

function isLegacyLog(dialog: LegacyDialog | Dialog): dialog is LegacyDialog {
	//
}

// 类型断言(Type Assertion)可以用来手动指定一个值的类型。值 as 类型
function formatInput(input: string) {
	//...
}
function getUserInput(): string | number {
	//...
}
let input = getUserInput()

formatInput(input as string) // 使用类型断言as告诉ts, input为字符串, 而不是string | number类型 

formatInput(<string>input) // 类型断言旧语法


// 非空断言: 即 T | null 或者 T | null | undefined
	
type Dialog = {
	id?: string
}

function removeFromDOM(dialog: Dialog, element: Element) {
	// element.parentNode.removeChild(element) // Error Object is possibly 'null'
	element.parentNode!.removeChild(element)
	delete dialog.id
}

function closeDialog(dialog: Dialog) {
	if(!dialog.id) {
		return
	}
	setTimeout(() => {
		removeFromDOM(
			dialog,
			// document.getElementById(dialog.id)) // Error 'String | undefined' is not assignable to parameter of type 'string'
			document.getElementById(dialog.id!)!
		)
	})
}
// '!' 运算符
// 告诉ts确定 dialog.id & document.getElementById & element.parentNode已得到定义,在可能为null or undefined类型值后面加上非空断言运算符


// 如果代码中频繁使用'!'运算符就得考虑下代码重构了, 以下利用并集去改写dialog

type VisableDialog = { id: string }
type DestroyedDialog = {}

type Dialog = VisableDialog | DestroyedDialog

function removeFromDOM(dialog: VisableDialog, element: Element) {
	element.parentNode!.removeChild(element)
	delete dialog.id
}

function closeDialog(dialog: Dialog) {
	if(!('id' in dialog)) {
		return
	}
	setTimeout(() => {
		removeFromDOM(
			dialog,
			document.getElementById(dialog.id)!
		)
	})
}


/* 处理回调 */

import * as fs from 'fs'

// 从Apache服务器访问日志中读取数据
fs.readFile(
	'/var/log/apache2/log',
	{ encoding: 'utf8' },
	(error, data) => {
		if(error) {
			console.error('error reading!', error)
			return
		}
		console.log('success reading', data)
	}
)

fs.appendFile(
	'/var/log/apache2/log',
	'New access log entry',
	error => {
		if(error) {
			console.log('error writing!', error)
		}
	}
)

function appendAndReadPromise(path: string, data: string): Promise<string> {
	return appendPromise(path, data)
		.then(() => readPromise(path))
		.catch(error = console.error(error))
}

function appendAndRead(
	path: string,
	data: string,
	cb: ( error: Error | null, resultn: String | null ) => void
) {
	appendFile(path, data, error => {
		if(error) {
			return cb(error, null)
		}
		readFile(path, (error, result) => {
			if(error) {
				return cb(error, null)
			}
			cb(null, result)
		})
	})
}

// Promise

// Node.js读取文件方法 readFile(path, (error, result) => { ... })

type Executor<T, E extends Error> = {
	resolve: (result: T) => void,
	reject: (error: E) => void
} => void

class Promise<T, E extends Error> {
	constructor(f: Executor<T, E>) {}
	then<U, F extends Error>( g:(result: T) => Promise<U, F>): Promise<U, F>
	catch<U, F extends Error>( g:(error: E) => Promise<U, F>): Promise<U, F>
}

function readFilePromise(path: string): Promise<string> {
	return new Promise( (resolve, reject) => {
		readFile(path, (error, result) => {
			if(error) {
				reject(error)
			} else {
				resolve(result)
			}
		})
	})
}




















































