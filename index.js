const $button = document.getElementById("button");
const $button2 = document.getElementById("button2");
const $spinner = document.getElementById("spinner");
const $circles = $spinner.getElementsByTagName("circle");
const $arrow = document.getElementById("arrow");
let intervalId = null;

$button.addEventListener("click", () => {
  $spinner.classList.toggle("rotating");
});
const { x: targetX, y: targetY } = $arrow.getBoundingClientRect();
$button2.addEventListener("click", () => {
  console.log(
    document.elementsFromPoint(targetX, targetY + 1)[1].getAttribute("stroke")
  );
});
