class Animal {
    protected name: string;

    constructor(name: string) {
        this.name = name;
    }

    speak() {
        console.log(`${this.name} makes a sound`);
    }
}

class Dog extends Animal {
    constructor(name: string, public breed: string) {
        super(name);
    }

    speak(){
        console.log(`${this.name} barks.`);
    }
}

const myDog = new Dog("Buddy", "Labrador");
myDog.speak();