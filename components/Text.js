export default class Text {
  constructor({ id, text, container }) {
    this.id = id;
    this.text = text;
    this.container = container;
    this.spanEl = document.createElement("span");
    this.render();
  }

  render() {
    this.spanEl.textContent = this.text;
    this.container.prepend(this.spanEl);
  }

  remove() {
    this.container.removeChild(this.spanEl);
  }

  update({ newText }) {
    this.text = newText;
    this.remove();
    this.render();
  }
}
