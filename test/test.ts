class A {
  sayHello() {
    console.log("Hello");
  }
}

class B extends A {
  sayHello(a: number): void {}
}
