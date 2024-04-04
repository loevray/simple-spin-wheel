/* 
const $spinner = document.getElementById("spinner");
const $circles = $spinner.getElementsByTagName("circle");


 */

import EditableDiv from "./EditableDiv.js";
import SpinWheel from "./spinWheel.js";

/* spin wheel section */

const $container = document.getElementById("container");

const sectorData = [
  { id: "1", ratio: 1, sectorColor: "tomato", text: "가나" },
  { id: "2", ratio: 1, sectorColor: "pink", text: "다라" },
  { id: "3", ratio: 1, sectorColor: "blue", text: "마바" },
  { id: "4", ratio: 1, sectorColor: "green", text: "사아" },
  { id: "5", ratio: 1, sectorColor: "gray", text: "자차" },
  { id: "6", ratio: 3, sectorColor: "yellow", text: "카타" },
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
    text: "이건 기본 입력창1",
  });

  new EditableDiv({
    id: "text2",
    container: $inputContainer,
    text: "이건 기본입력창2",
  });
};

initializeEditableDiv();

const onKeyEnter = (e, container) => {
  e.preventDefault();
  if (!e.target.textContent.length) return;
  if (e.target.nextElementSibling) {
    return e.target.nextElementSibling.focus();
  }

  const { id: currentId } = e.target;
  const newId = `text${+currentId.split("text")[1] + 1}`;

  const nextDiv = new EditableDiv({
    id: `${newId}`,
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

const onBackSpace = (e, container) => {
  if (e.target.textContent.length || e.target.id.split("text")[1] <= 2) return;
  const currentDivEl = document.getElementById(e.target.id);
  const prevEl = currentDivEl.previousElementSibling;
  container.removeChild(currentDivEl);
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

  keyFns?.[e.key](e);
});

$inputContainer.addEventListener("input", (e) => {
  const { dataset } = e.target;
  if (!dataset) return;

  /* spineWheel.update({ sectorData: [...sectorData] }); */
});
/* 

1. contenteditable div다
2. 2개는 기본값으로 존재한다
3. 엔터키를 누를시 만약 아래 형제노드가 없다면, 새로운 div를 생성한다.
  a. 형제가 있다면, 그 형제로 focus
4. div에 이벤트를 걸어서 내부 텍스트가 바뀔때 마다 spinWheel update메서드를 호출한다.
*/
