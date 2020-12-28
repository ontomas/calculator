(() => {
  const display = document.querySelector(".display");
  const buttonsGroup = document.querySelector(".buttons");
  const buttons = buttonsGroup.querySelectorAll("button");
  const clearBtn = buttonsGroup.querySelector('button[data-input="Backspace"]');

  const operands = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
  const operators = ["+", "-", "*", "/"];

  let operation = {
    firstOperand: "",
    operator: "",
    secondOperand: "",
    result: "",
  };

  const clear = () => {
    operation = {
      firstOperand: "",
      operator: "",
      secondOperand: "",
      result: "",
    };
    display.textContent = "0";
    clearBtn.textContent = "AC";
  };

  const roundLonger = (num) => {
    let numLength = num.toString().length;
    return numLength > 15 ? num.toPrecision(15) : num;
  };

  const calculate = (firstOperand, operator, secondOperand) => {
    switch (operator) {
      case "+":
        return +firstOperand + +secondOperand;
      case "-":
        return +firstOperand - +secondOperand;
      case "*":
        let multiplication = +firstOperand * +secondOperand;
        return roundLonger(multiplication);
      case "/":
        let duplication = +firstOperand / +secondOperand;
        return roundLonger(duplication);
    }
  };

  const isDoubleDot = (operand, input) => {
    if (operand.split("").includes(".") && input === ".") return true;
  };

  const removeOperatorStyling = () => {
    buttons.forEach((button) => {
      button.classList.remove("active");
    });
  };

  const updateDisplay = (input) => {
    display.textContent = input;
  };

  const init = (e) => {
    const input = e.dataset.input;

    if (input === "%") {
      if (!operation.secondOperand) {
        operation.firstOperand = (+operation.firstOperand / 100).toString();
        updateDisplay(operation.firstOperand);
      } else {
        operation.result = (
          +operation.firstOperand -
          (+operation.firstOperand * +operation.secondOperand) / 100
        ).toString();
        updateDisplay(operation.secondOperand);
      }
    }

    if (input === "Invert") {
      let inverted = -operation.firstOperand;
      operation.firstOperand = inverted.toString();
      updateDisplay(operation.firstOperand);
    }

    if (input === "Enter") {
      if (operation.result) {
        updateDisplay(operation.result);
      }
      if (
        operation.firstOperand &&
        operation.operator &&
        operation.secondOperand
      ) {
        operation.result = calculate(
          operation.firstOperand,
          operation.operator,
          operation.secondOperand
        ).toString();
        operation.firstOperand = "";
        operation.operator = "";
        operation.secondOperand = "";

        removeOperatorStyling();

        if (operation.firstOperand === "0") {
          clear();
        } else {
          updateDisplay(operation.result);
        }
      }
    }

    if (input === "Backspace") {
      if (clearBtn.textContent === "AC" || operation.result) {
        removeOperatorStyling();
        clear();
      }

      if (operation.secondOperand) {
        operation.secondOperand = "";
        updateDisplay("0");
        clearBtn.textContent = "AC";
        return;
      }

      if (operation.operator) {
        operation.operator = "";
        clearBtn.textContent = "AC";
        removeOperatorStyling();
        return;
      }

      if (operation.firstOperand) clear();
    }

    // if we want to continue using result
    if (operation.result && operators.includes(input)) {
      operation.firstOperand = operation.result;
      operation.result = "";
      clearBtn.textContent = "C";
      operation.operator = input;
    }

    // if input is operator
    if (operators.includes(input)) {
      clearBtn.textContent = "C";
      operation.operator = input;
      e.classList.add("active");
    }

    // if input is firstOperand
    if (!operation.operator && operands.includes(input)) {
      // prevent multiple zeros before dot
      if (
        (operation.firstOperand[0] === "0" &&
          operation.firstOperand[1] !== "." &&
          input === "0") ||
        isDoubleDot(operation.firstOperand, input)
      ) {
        return;
      }

      // if input is zero and another digit is clicked - overwrite it
      if (operation.firstOperand === "0" && input !== ".") {
        operation.firstOperand = input;
        updateDisplay(operation.firstOperand);
        return;
      }

      // clear result if present
      operation.result = "";
      // default for regular input
      operation.firstOperand += input;
      clearBtn.textContent = "C";
      updateDisplay(operation.firstOperand);
    }

    // if input is secondOperand
    if (
      operands.includes(input) &&
      operation.firstOperand &&
      operation.operator
    ) {
      if (isDoubleDot(operation.secondOperand, input)) return;
      operation.secondOperand += input;
      clearBtn.textContent = "C";
      updateDisplay(operation.secondOperand);
    }
  };

  buttonsGroup.addEventListener("click", (e) => init(e.target));
  document.addEventListener("keydown", (e) => {
    let key;
    if (e.ctrlKey && e.key === "-") {
      key = buttonsGroup.querySelector('button[data-input="Invert"]');
    } else {
      key = buttonsGroup.querySelector(`button[data-input="${e.key}"]`);
    }
    if (key) init(key);
  });
})();
