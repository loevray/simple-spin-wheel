import EditableDiv from "./components/EditableDiv.js";
import SpinWheel from "./components/SpinWheel.js";
import Button from "./components/Button.js";
import { getDeepCopy } from "./utils/getDeepCopy.js";

/* spin wheel section */

const $spinWheelContainer = document.getElementById("spin-wheel-container");

let sectorData = [
  { ratio: 1, sectorColor: "tomato", text: "돌림판" },
  { ratio: 1, sectorColor: "pink", text: "입니다" },
];

const spineWheel = new SpinWheel({
  size: 600,
  radius: 150,
  sectorData,
  container: $spinWheelContainer,
});

/* input section */

const $inputContainer = document.getElementById("input-container");

const initializeEditableDiv = () => {
  new EditableDiv({
    id: "text1",
    container: $inputContainer,
    text: "돌림판",
  });

  new EditableDiv({
    id: "text2",
    container: $inputContainer,
    text: "입니다",
  });
};

initializeEditableDiv();

const onKeyEnter = (e, container) => {
  e.preventDefault();
  if (!e.target.textContent.length) return;
  if (e.target.nextElementSibling) {
    return e.target.nextElementSibling.focus();
  }

  const nextDiv = new EditableDiv({
    id: "",
    container,
    text: "추가된 입력창",
  });

  nextDiv.element.focus();
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
  const currentIndex = currentNodeArr.indexOf(e.target);
  if (e.target.textContent.length || currentIndex <= 1) return;

  const currentDivEl = e.target;
  const prevEl = currentDivEl.previousElementSibling;

  container.removeChild(currentDivEl);

  const newSectorData = getDeepCopy(sectorData).slice(0, currentIndex);
  sectorData = getDeepCopy(newSectorData);
  spineWheel.update({ sectorData: newSectorData });
  prevEl && prevEl.focus();
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
  console.log(e.currentTarget.childNodes);
  const currentNodeArr = getChildNodesArr(e.currentTarget).slice(1);
  const currentIndex = currentNodeArr.indexOf(e.target);
  const newSectorData = getDeepCopy(sectorData);

  console.log(newSectorData);
  if (newSectorData.length > currentIndex) {
    newSectorData[currentIndex] = {
      ...newSectorData[currentIndex],
      text: e.target.textContent,
    };
  } else {
    newSectorData.push({
      id: "",
      ratio: 1,
      sectorColor: "gray",
      text: e.target.textContent,
    });
  }

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

const $arrow = document.getElementById("arrow");

const { x: targetX, y: targetY } = $arrow.getBoundingClientRect();

new Button({
  id: "get-sector",
  onClick: () =>
    console.log(
      document
        .elementsFromPoint(targetX, targetY + 10)[1]
        .getAttribute("stroke")
    ),
  container: $buttonContainer,
  text: "원들의 위치를 가져오자",
});
