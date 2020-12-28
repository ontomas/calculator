(() => {
  const display = document.querySelector(".display");
  const buttonsGroup = document.querySelector(".buttons");
  const buttons = buttonsGroup.querySelectorAll("button");
  const clearBtn = document.querySelector(
    '.buttons button[data-input="clear"]'
  );

  const operands = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
  const operators = ["plus", "minus", "multiply", "divide"];

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

  buttonsGroup.addEventListener("click", (e) => {
    const userInput = e.target.dataset.input;

    if (userInput === "percent") {
      if (!operation.secondOperand) {
        operation.firstOperand = (+operation.firstOperand / 100).toString();
        updateDisplay(operation.firstOperand);
      } else {
        operation.secondOperand = (
          +operation.firstOperand -
          (+operation.firstOperand * +operation.secondOperand) / 100
        ).toString();
        updateDisplay(operation.secondOperand);
      }
    }

    if (userInput === "invert") {
      let inverted = -operation.firstOperand;
      operation.firstOperand = inverted.toString();
      updateDisplay(operation.firstOperand);
    }

    if (userInput === "return") {
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

    if (userInput === "clear") {
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
    if (operation.result && operators.includes(userInput)) {
      operation.firstOperand = operation.result;
      operation.result = "";
      clearBtn.textContent = "C";
      operation.operator = userInput;
    }

    // if input is operator
    if (operators.includes(userInput)) {
      clearBtn.textContent = "C";
      operation.operator = userInput;
      e.target.classList.add("active");
    }

    // if input is firstOperand
    if (!operation.operator && operands.includes(userInput)) {
      // prevent multiple zeros before dot
      if (
        (operation.firstOperand[0] === "0" &&
          operation.firstOperand[1] !== "." &&
          userInput === "0") ||
        isDoubleDot(operation.firstOperand, userInput)
      ) {
        return;
      }

      // if input is zero and another digit is clicked - overwrite it
      if (operation.firstOperand === "0" && userInput !== ".") {
        operation.firstOperand = userInput;
        updateDisplay(operation.firstOperand);
        return;
      }

      // clear result if present
      operation.result = "";
      // default for regular input
      operation.firstOperand += userInput;
      clearBtn.textContent = "C";
      updateDisplay(operation.firstOperand);
    }

    // if input is secondOperand
    if (
      operands.includes(userInput) &&
      operation.firstOperand &&
      operation.operator
    ) {
      if (isDoubleDot(operation.secondOperand, userInput)) return;
      operation.secondOperand += userInput;
      clearBtn.textContent = "C";
      updateDisplay(operation.secondOperand);
    }
  });
})();
