const buttons = document.querySelector(".buttons");
const display = document.querySelector(".display");

const operands = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
const operators = ["plus", "minus", "multiply", "divide"];

let operation = {
  firstOperand: "",
  operator: "",
  secondOperand: "",
};

const clear = () => {
  operation = {
    firstOperand: "",
    operator: "",
    secondOperand: "",
    output: "",
  };
  display.textContent = "0";
};

const roundLonger = (num) => {
  let numLength = num.toString().length;
  return numLength > 15 ? num.toPrecision(15) : num;
};

const calculate = (firstOperand, operator, secondOperand) => {
  switch (operator) {
    case "plus":
      return +firstOperand + +secondOperand;
    case "minus":
      return +firstOperand - +secondOperand;
    case "multiply":
      let multiplication = +firstOperand * +secondOperand;
      return roundLonger(multiplication);
    case "divide":
      let duplication = +firstOperand / +secondOperand;
      return roundLonger(duplication);
  }
};

buttons.addEventListener("click", (e) => {
  const userInput = e.target.dataset.input;

  if (userInput === "percent") {
    if (!operation.secondOperand) {
      operation.firstOperand = (+operation.firstOperand / 100).toString();
      display.textContent = operation.firstOperand;
    } else {
      operation.secondOperand = (
        +operation.firstOperand -
        (+operation.firstOperand * +operation.secondOperand) / 100
      ).toString();
      display.textContent = operation.secondOperand;
    }
  }

  if (userInput === "invert") {
    let inverted = -operation.firstOperand;
    operation.firstOperand = inverted.toString();
    display.textContent = operation.firstOperand;
  }

  if (userInput === "return") {
    operation.firstOperand = calculate(
      operation.firstOperand,
      operation.operator,
      operation.secondOperand
    ).toString();
    operation.operator = "";
    operation.secondOperand = "";

    if (operation.firstOperand === "0") {
      clear();
    } else {
      display.textContent = operation.firstOperand;
    }
  }

  // clear
  userInput === "clear" && clear();
  if (operators.includes(userInput)) {
    operation.operator = userInput;
  }

  // if firstOperand
  if (!operation.operator && operands.includes(userInput)) {
    // prevent multiple zeros before dot
    if (
      operation.firstOperand[0] === "0" &&
      operation.firstOperand[1] !== "." &&
      userInput === "0"
    )
      return;

    if (operation.firstOperand === "0" && userInput !== ".") {
      operation.firstOperand = e.target.dataset.input;
      display.textContent = operation.firstOperand;
      return;
    }

    operation.firstOperand += e.target.dataset.input;
    display.textContent = operation.firstOperand;
  }

  // if secondOperand
  if (
    operands.includes(userInput) &&
    operation.firstOperand &&
    operation.operator
  ) {
    operation.secondOperand += e.target.dataset.input;
    display.textContent = operation.secondOperand;
  }
  console.table(operation);
});
