class WordCounter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  init() {
    this.options = {};
    this.charsCounter = this.component.querySelector("output[name=chars]");
    this.wordsCounter = this.component.querySelector("output[name=words]");
    const idTargetElement = this.getAttribute("for");
    this.options.countCR = this.hasAttribute("count-cr");
    this.options.maxCharsAllowed = Number.parseInt(this.getAttribute("max-chars")) || false;
    console.log(this.options);
    this.elementTarget = document.querySelector(`#${idTargetElement}`);
    this.elementTarget.addEventListener("input", () => this.onElementTargetChange());
    this.updateCharsCount();
    this.updateWordsCount();
  }

  get component() {
    return this.shadowRoot || this;
  }

  onElementTargetChange() {
    this.updateCharsCount();
    this.updateWordsCount();
  }

  static get styles() {
    return /* css */`
      :host {
        display: block;
      }

      .container {
        background: #000;
        border-radius: 15px;
        width: var(--width, 360px);
        min-height: 75px;
        display: flex;
        justify-content: space-around;
        align-items: center;
      }

      .data {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .data.warning {
        --color: red;
      }

      output {
        font-family: "Bebas Neue", sans-serif;
        font-size: 1.5rem;
        color: var(--color, #fff);
      }

      span {
        font-family: Montserrat, sans-serif;
        color: var(--color, #888);
      }
    `;
  }

  updateCharsCount() {
    const cleanedChars = this.elementTarget.value.trim();
    const charsNumber = this.options.countCR ? cleanedChars : cleanedChars.replaceAll("\n", "");
    this.charsCounter.textContent = charsNumber.length;
    this.checkMaxChars(charsNumber.length);
  }

  checkMaxChars(charsNumber) {
    if (this.options.maxCharsAllowed) {
      const data = this.component.querySelector(".data");
      if (charsNumber > this.options.maxCharsAllowed) {
        data.classList.add("warning");
      } else {
        data.classList.remove("warning");
      }
    }
  }

  updateWordsCount() {
    const words = this.elementTarget.value.trim().split(" ").filter(word => word !== "");
    this.wordsCounter.textContent = words.length;
  }

  connectedCallback() {
    this.render();
    this.init();
  }

  render() {
    this.component.innerHTML = /* html */`
    <style>${WordCounter.styles}</style>
    <div class="container">
      <div class="data">
        <output name="chars">${this.charsCount}</output>
        <span>Caracteres</span>
      </div>

      <div class="data">
        <output name="words">${this.wordsCount}</output>
        <span>Palabras</span>
      </div>
    </div>`;
  }
}

customElements.define("word-counter", WordCounter);
