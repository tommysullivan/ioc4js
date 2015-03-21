var tommy = {
    first: 'tommy',
    last: 'sullivan'
}

var sweetie = {
    first: 'esa-matti',
    last: 'tastula',
    lover: tommy
}

tommy.lover = sweetie;

var tero = {
    first: 'tero',
    last: 'the red'
}

tero.lover = tero;

var sweetie2 = sweetie;
sweetie2.first='sweetie';

var numbers = [1,2,3];
var numbers2 = numbers;
numbers2[1]=4;

var people = [tommy, sweetie];
people[0].first='thomas';

var people2 = people;
people2[0].first;


people2.push(tero);

var numbersClone = numbers.slice();
numbersClone[2]=7;

var peopleShallowClone = people.slice();
peopleShallowClone[2].last='paloniemi';

peopleShallowClone.pop();

var peopleDeepClone = people.deepClone();