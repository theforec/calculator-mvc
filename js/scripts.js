class Model {
    constructor() {
        this.buttons = [];
    }
}
class View {
    constructor(index) {
        this.indexView = index;
        this.root = document.getElementById("root");
        this.calculator = document.createElement("div");
        this.calculator.className = "calculator";
        this.input = document.createElement("input");
        this.input.className = "result";
        this.input.readOnly = true;
        this.input.type = "text";
        this.input.value = "0";
        this.buttons = document.createElement("div");
        this.buttons.className = "button-grid";
        this.operators = document.createElement("div");
        this.operators.className = "operators";

        this.root.append(this.calculator);
        
        const calc = document.getElementsByClassName("calculator")[this.indexView];
        calc.appendChild(this.input);
        calc.appendChild(this.buttons);
        calc.appendChild(this.operators);

        this.buttonsList = [];
    }

    render() {
        for (var i = 0; i < this.buttonsList.length; i++) {
            if (this.buttonsList[i].className == "btn operator") {
                document.getElementsByClassName("operators")[this.indexView].appendChild(this.buttonsList[i]);
            }
            else {
                document.getElementsByClassName("button-grid")[this.indexView].appendChild(this.buttonsList[i]);
            }
        }
    }

    renderAnswer(string) {
        document.getElementsByClassName("result")[this.indexView].value = string;
    }
}
class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.indexController = this.view.indexView;

        this.generateButtons();
        this.view.buttonsList = this.model.buttons;
        this.view.render();
    }

    createButton(text, val, type) {
        var button = document.createElement("button");
        button.className = "btn";
        button.textContent = text;
        button.setAttribute("value", val);

        //differentiate operator vs number
        if (type === "operator") button.className += " operator";

        var idResult = document.getElementsByClassName("result")[this.indexController];

        if (type === "others") {
            switch (text) {
                case "CE":
                    break;
                case "C":
                    button.onclick = function () {
                        idResult.value = "0";
                    }
                    break;
                case "DEL":
                    button.onclick = function () {
                        var valResult = idResult.value;
                        if (valResult != "0") {
                            if (valResult.length == 1) idResult.value = 0;
                            else {
                                //last character = number: delete 1 character
                                let character = valResult.substr(valResult.length - 1, 1);
                                if (Number(character) || parseInt(character) == 0 || character == ".")
                                    idResult.value = valResult.substr(0, valResult.length - 1);
                                //last character = operator: delete 3 character
                                else if (!Number(character))
                                    idResult.value = valResult.substr(0, valResult.length - 3);
                            }
                        }
                    }
                    break;
                case "+/-":
                    button.onclick = function () {
                        idResult.value = - idResult.value;
                    }
                    break;
                case ".":
                    button.onclick = function () {
                        var _value = idResult.value;
                        var _length = _value.length;
                        let space = _value.lastIndexOf(" ");
                        //fistNumber isFloat?
                        if (space == -1) {
                            if (_value.indexOf(".") == -1)
                                idResult.value += ".";
                        }
                        //lastNumber isFloat?
                        else {
                            let lastNumber = _value.slice(space, _length);
                            if (lastNumber.indexOf(".") == -1)
                                idResult.value += ".";
                        }
                    }
                    break;
                default: break;
            }
        } else {
            var _index = this.indexController;
            button.onclick = function () {
                idResult = document.getElementsByClassName("result")[_index];
                var _value = idResult.value;
                if (button.className == "btn") { //button is Number
                    if (_value == 0 && val != 0) {
                        idResult.value = val;
                        if (_value === "0.")
                            idResult.value = "0." + val;
                    }
                    else if (_value != 0) {
                        idResult.value += val;
                    }
                } else { //button is operator
                    if (_value != 0) {
                        var character = _value.substr(_value.length - 1, 1);
                        //last character = number: add operator
                        if (Number(character) || parseInt(character) == 0)
                            idResult.value += val;
                        //last character = operator: delete last 3 character, add new operator
                        else if (!Number(character))
                            idResult.value = _value.substr(0, _value.length - 3) + val;
                    }
                }
            }
        }
        return button;
    }

    generateButtons() {
        var button = this.createButton("CE", "", "others");
        this.model.buttons.push(button);

        button = this.createButton("C", "", "others");
        this.model.buttons.push(button);
        button = this.createButton("DEL", "", "others");
        this.model.buttons.push(button);

        //create numbers
        for (var i = 1; i < 10; i++) {
            this.model.buttons.push(this.createButton(i, i));
        }

        button = this.createButton("+/-", "", "others");
        this.model.buttons.push(button);
        button = this.createButton("0", "0");
        this.model.buttons.push(button);
        button = this.createButton(".", ".", "others");
        this.model.buttons.push(button);

        //create operators
        button = this.createButton("/", " / ", "operator");
        this.model.buttons.push(button);
        button = this.createButton("*", " * ", "operator");
        this.model.buttons.push(button);
        button = this.createButton("-", " - ", "operator");
        this.model.buttons.push(button);
        button = this.createButton("+", " + ", "operator");
        this.model.buttons.push(button);

        button = this.createButton("=", "=", "operator");
        var func = this.equal.bind(this); //using global variable
        button.onclick = function () {
            //this.equal() //this is button, not Controller
            func();
        }
        this.model.buttons.push(button);
    }

    equal() {
        var string = document.getElementsByClassName("result")[this.indexController].value;
        var arrayCharacter = string.split(" ");
        var _length = arrayCharacter.length;

        for (let i = 1; i < _length; i += 2) {
            switch (arrayCharacter[i]) {
                case "+":
                    arrayCharacter[i + 1] = parseFloat(arrayCharacter[i - 1]) + parseFloat(arrayCharacter[i + 1]);
                    break;
                case "-":
                    arrayCharacter[i + 1] = parseFloat(arrayCharacter[i - 1]) - parseFloat(arrayCharacter[i + 1]);
                    break;
                case "*":
                    arrayCharacter[i + 1] = parseFloat(arrayCharacter[i - 1]) * parseFloat(arrayCharacter[i + 1]);
                    break;
                case "/":
                    arrayCharacter[i + 1] = parseFloat(arrayCharacter[i - 1]) / parseFloat(arrayCharacter[i + 1]);
                    break;
                default: break;
            }
        }

        var result = arrayCharacter[_length - 1];
        this.view.renderAnswer(result);
    }
}

const calc = new Array();
for (var i = 0; i < 100; i++) {
    calc[i] = new Controller(new Model(), new View(i));
}