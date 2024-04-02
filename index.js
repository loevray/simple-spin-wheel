/* 
const $spinner = document.getElementById("spinner");
const $circles = $spinner.getElementsByTagName("circle");


 */

import SpinWheel from "./spinWheel.js";
const $container = document.getElementById("container");

const sectorData = [
  { id: "1", ratio: 1, sectorColor: "tomato", text: "가나" },
  { id: "2", ratio: 1, sectorColor: "pink", text: "다라" },
  { id: "3", ratio: 1, sectorColor: "blue", text: "마바" },
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
    document.elementsFromPoint(targetX, targetY + 1)[1].getAttribute("stroke")
  );
});
