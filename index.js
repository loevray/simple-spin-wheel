import EditableDiv from "./components/EditableDiv.js";
import SpinWheel from "./components/SpinWheel.js";
import Button from "./components/Button.js";
import { getDeepCopy } from "./utils/getDeepCopy.js";
import Text from "./components/Text.js";
import Div from "./components/Div.js";

/* spin wheel section */

const $spinWheelContainer = document.getElementById("spin-wheel-container");

let sectorData = [
  { ratio: 1, sectorColor: "tomato", text: "돌림판" },
  { ratio: 1, sectorColor: "pink", text: "입니다" },
];

const getWinningText = () => {
  const $arrow = document.getElementById("arrow");
  const { x: targetX, y: targetY } = $arrow.getBoundingClientRect();
  const winningText = document
    .elementsFromPoint(targetX, targetY + 10)
    .find((node) => node.nodeName === "circle").nextElementSibling.textContent;

  return winningText;
};

/* Winning Text section */
const $leftSection = document.getElementsByClassName("left-section")[0];

const textComponent = new Text({
  id: "winning-text",
  text: "돌려돌려 돌림판!",
  container: $leftSection,
});

let intervalId = null;

const updateText = () => {
  intervalId = setInterval(() => textComponent.update(getWinningText()), 100);
};

const DEFAULT_SPIN_WHEEL_SIZE = 560;
const DEFAULT_SPIN_WHEEL_R = DEFAULT_SPIN_WHEEL_SIZE / 4;
const spineWheel = new SpinWheel({
  size: DEFAULT_SPIN_WHEEL_SIZE,
  radius: DEFAULT_SPIN_WHEEL_R,
  sectorData,
  container: $spinWheelContainer,
});

/* input section */

const $inputContainer = document.getElementById("input-container");

const handleButtonClick = (e, add = true) => {
  const editableDivWrapper = e.target.closest("[data-id=editable-div-wrapper]");
  const editableDivNodes = getChildNodesArr(
    editableDivWrapper.parentNode
  ).slice(1);
  const currentEditableDivIndex = editableDivNodes.indexOf(editableDivWrapper);
  if (currentEditableDivIndex === -1) {
    return console.error(
      "버튼클릭후, 해당하는 editable div를 찾지 못했습니다."
    );
  }
  const newSectorData = getDeepCopy(sectorData);
  const currentRatio = newSectorData[currentEditableDivIndex].ratio;
  newSectorData[currentEditableDivIndex].ratio = add
    ? currentRatio + 1
    : currentRatio > 1
    ? currentRatio - 1
    : currentRatio;

  sectorData = getDeepCopy(newSectorData);

  spineWheel.update({ sectorData: newSectorData });
};

const initializeEditableDiv = () => {
  const initialData = [
    {
      textId: "text1",
      text: "돌림판",
    },
    {
      textId: "text2",
      text: "입니다",
    },
  ];

  initialData.forEach(({ textId, text }) => {
    const container = new Div({
      container: $inputContainer,
      style: {
        display: "flex",
      },
      dataSet: "editable-div-wrapper",
    }).element;

    new EditableDiv({
      id: textId,
      container,
      text,
    });

    const ratioText = new Text({
      container,
      text: "1",
      prepend: false,
      style: {
        display: "flex",
        alignItems: "center",
        padding: "0 5px 0 5px",
      },
    });

    const buttonContainer = new Div({
      container,
      style: {
        display: "flex",
        flexDirection: "column",
      },
    }).element;

    new Button({
      id: `btn${(Math.random() * 1000000000).toFixed(0)}`,
      onClick: (e) => {
        handleButtonClick(e);
        ratioText.update((prevText) => +prevText + 1);
      },
      container: buttonContainer,
      text: "+",
    });

    new Button({
      id: `btn${(Math.random() * 1000000000).toFixed(0)}`,
      onClick: (e) => {
        handleButtonClick(e, false);
        ratioText.update((prevText) => {
          if (+prevText > 1) return +prevText - 1;
          return prevText;
        });
      },
      container: buttonContainer,
      text: "-",
    });
  });
};

initializeEditableDiv();

const onKeyEnter = (e, _container) => {
  e.preventDefault();
  if (!e.target.textContent.length) return;

  const currentNode = e.target.parentNode;

  if (currentNode.nextElementSibling) {
    return currentNode.nextElementSibling.focus();
  }

  const container = new Div({
    container: _container,
    style: {
      display: "flex",
    },
    dataSet: "editable-div-wrapper",
  }).element;

  const nextDiv = new EditableDiv({
    container,
    text: "",
  });

  const ratioText = new Text({
    container,
    text: "1",
    prepend: false,
    style: {
      display: "flex",
      alignItems: "center",
      padding: "0 5px 0 5px",
    },
  });

  const buttonContainer = new Div({
    container,
    style: {
      display: "flex",
      flexDirection: "column",
    },
  }).element;

  new Button({
    id: `btn${(Math.random() * 1000000000).toFixed(0)}`,
    onClick: (e) => {
      handleButtonClick(e);
      ratioText.update((prevText) => +prevText + 1);
    },
    container: buttonContainer,
    text: "+",
  });

  new Button({
    id: `btn${(Math.random() * 1000000000).toFixed(0)}`,
    onClick: (e) => {
      handleButtonClick(e, false);
      ratioText.update((prevText) => {
        if (+prevText > 1) return +prevText - 1;
        return prevText;
      });
    },
    container: buttonContainer,
    text: "-",
  });

  nextDiv.element.focus();

  const newSectorData = getDeepCopy(sectorData);

  newSectorData.push({
    id: "",
    ratio: 1,
    sectorColor: "gray",
    text: "",
  });

  sectorData = getDeepCopy(newSectorData);

  spineWheel.update({ sectorData: newSectorData });
};

const onArrowUp = (e) => {
  if (!e.target.previousElementSibling) return;
  e.target.previousElementSibling.focus();
};

const onArrowDown = (e) => {
  if (!e.target.nextElementSibling) return;
  e.target.nextElementSibling.focus();
};

const getChildNodesArr = (target) => [...target.childNodes];

const onBackSpace = (e, container) => {
  const currentNodeArr = getChildNodesArr(e.currentTarget).slice(1);
  const currentDivEl = e.target.parentNode;
  const currentIndex = currentNodeArr.indexOf(currentDivEl);
  if (e.target.textContent.length || currentIndex <= 1) return;

  const prevEl = currentDivEl.previousElementSibling;

  container.removeChild(currentDivEl);

  const newSectorData = getDeepCopy(sectorData).slice(0, currentIndex);
  sectorData = getDeepCopy(newSectorData);
  spineWheel.update({ sectorData: newSectorData });
  prevEl && prevEl.firstChild.focus();
};

$inputContainer.addEventListener("keydown", (e) => {
  const { dataset } = e.target;
  if (!dataset) return;
  const keyFns = {
    Enter: (e) => onKeyEnter(e, $inputContainer),
    ArrowUp: (e) => onArrowUp(e),
    ArrowDown: (e) => onArrowDown(e),
    Backspace: (e) => onBackSpace(e, $inputContainer),
  };

  keyFns?.[e.key]?.(e);
});

$inputContainer.addEventListener("input", (e) => {
  const { dataset } = e.target;
  if (!dataset) return;

  const currentNodeArr = getChildNodesArr(e.currentTarget).slice(1);
  const currentIndex = currentNodeArr.indexOf(e.target.parentNode);
  const newSectorData = getDeepCopy(sectorData);

  newSectorData[currentIndex] = {
    ...newSectorData[currentIndex],
    text: e.target.textContent,
  };

  sectorData = getDeepCopy(newSectorData);

  spineWheel.update({ sectorData: newSectorData });
});

/* button section */

const $buttonContainer = document.getElementById("button-container");

new Button({
  id: "rotate-spin-wheel",
  onClick: spineWheel.rotate.bind(spineWheel),
  container: $buttonContainer,
  text: "회전!",
});

new Button({
  id: "stop-spin-wheel",
  onClick: spineWheel.stopRotate.bind(spineWheel),
  container: $buttonContainer,
  text: "회전 멈춰!",
});

function monitorRotationAngle() {
  const svgContainer = document.getElementById("svg-container");
  const rotationMatrix = window
    .getComputedStyle(svgContainer)
    .getPropertyValue("transform");

  // 회전 변환 행렬 추출
  let matrix = rotationMatrix.match(/^matrix\(([^\)]+)\)$/);
  if (matrix) {
    matrix = matrix[1].split(",").map(parseFloat);
    // 회전 각도 계산
    const rotationAngle = Math.atan2(matrix[1], matrix[0]) * (180 / Math.PI);
    console.log("회전 각도: " + rotationAngle.toFixed(2) + "도");
  }

  // 애니메이션 프레임마다 회전 각도 모니터링
  requestAnimationFrame(monitorRotationAngle);
}

// 페이지 로드 시 회전 각도 모니터링 시작
monitorRotationAngle();
