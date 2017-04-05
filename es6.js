/**
 * Created by Andy on 2017/4/5.
 */
//类的定义
class Animal {
    //ES6中新型构造器
    constructor(name) {
        this.name = name;
    }
    //实例方法
    sayName() {
        console.log('My name is '+this.name);
    }
}
//类的继承
class Programmer extends Animal {
    constructor(name) {
        //直接调用父类构造器进行初始化
        super(name);
    }
    program() {
        console.log("I'm coding...");
    }
}
//测试我们的类
var animal=new Animal('dummy'),
    wayou=new Programmer('wayou');
animal.sayName();//输出 ‘My name is dummy’
wayou.sayName();//输出 ‘My name is wayou’
wayou.program();//输出 ‘I'm coding...’


const ary = [];
ary.push("a");
console.log(ary);


//通过对象字面量创建对象
var human = {
    breathe() {
        console.log('breathing...');
    }
};
var worker = {
    __proto__ : human, //设置此对象的原型为human,相当于继承human
    company : 'freelancer',
    work : () => {console.log('working...')}
};
human.breathe();//输出 ‘breathing...’
//调用继承来的breathe方法
worker.breathe();//输出 ‘breathing...’

var Foo = {
    breathe() {
        console.log('breathing...');
    }
};
var foo = {};
foo.prototype = Foo;
foo.prototype.name = "bar";
console.log(Foo.name);

//console.log(worker.__proto__.name = "worker",human.name,human.company);