export default class Text {
  constructor({ id, text, container, prepend = true, style }) {
    id && (this.id = id);
    this.text = text;
    this.container = container;
    this.style = style;
    this.spanEl = document.createElement("span");
    this.prepend = prepend;
    this.render();
  }

  #setAttrs() {
    Object.assign(this.spanEl.style, this.style);
  }

  render() {
    this.#setAttrs();
    this.spanEl.textContent = this.text;
    this.prepend
      ? this.container.prepend(this.spanEl)
      : this.container.appendChild(this.spanEl);
  }

  remove() {
    this.container.removeChild(this.spanEl);
  }

  update(args) {
    if (typeof args === "function") {
      this.text = args(this.text);
    } else {
      this.text = args;
    }
    this.spanEl.textContent = this.text;
  }
}
