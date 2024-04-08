export default class Button {
  constructor({ id, onClick, container, text }) {
    this.btnEl = document.createElement("button");
    this.text = text;
    this.id = id;
    this.onClick = onClick;
    this.container = container;
    this.setAttrs();
    this.addEvent();
    this.render();
  }
  setAttrs() {
    this.btnEl.setAttribute("id", this.id);
  }
  remove() {
    this.container.removeChild(this.btnEl);
  }

  render() {
    this.btnEl.textContent = this.text;
    this.container.appendChild(this.btnEl);
  }

  update() {
    this.remove();
    this.render();
  }

  addEvent() {
    this.container.addEventListener("click", (e) => {
      if (!e.target.closest(`#${this.id}`)) return;
      this.onClick(e);
    });
  }
}
