/* 
const $spinner = document.getElementById("spinner");
const $circles = $spinner.getElementsByTagName("circle");


 */

import EditableDiv from "./EditableDiv.js";
import SpinWheel from "./spinWheel.js";
import { getDeepCopy } from "./utils/getDeepCopy.js";

/* spin wheel section */

const $container = document.getElementById("container");

let sectorData = [
  { id: "1", ratio: 1, sectorColor: "tomato", text: "돌림판" },
  { id: "2", ratio: 1, sectorColor: "pink", text: "입니다" },
];

const spineWheel = new SpinWheel({
  size: 600,
  radius: 150,
  sectorData,
  container: $container,
});

const $spinButton = document.getElementById("spin-button");
const $stopButton = document.getElementById("stop-button");

$spinButton.addEventListener("click", () => {
  spineWheel.rotate();
});
$stopButton.addEventListener("click", () => {
  spineWheel.stopRotate();
});

const $arrow = document.getElementById("arrow");
const $getSectorButton = document.getElementById("get-sector-button");

const { x: targetX, y: targetY } = $arrow.getBoundingClientRect();

$getSectorButton.addEventListener("click", () => {
  console.log(
    document.elementsFromPoint(targetX, targetY + 10)[1].getAttribute("stroke")
  );
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

const getCurrentNodeArray = (target) => [...target.parentNode.childNodes];

const onBackSpace = (e, container) => {
  const currentNodeArr = getCurrentNodeArray(e.target).slice(1);
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
  const currentNodeArr = getCurrentNodeArray(e.target).slice(1);
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
