export default class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    this.dist = {
      finalPosition: 0,
      startX: 0,
      movement: 0,
    };
  }

  moveSlide(distX) {
    this.dist.movePosition = distX;
    this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
  }

  updatePosition(clientX) {
    this.dist.movement = (this.dist.startX - clientX) * 1.5;
    return this.dist.finalPosition - this.dist.movement;
  }

  onStart(evt) {
    let moveType;
    if (evt.type === "mousedown") {
      evt.preventDefault();
      this.dist.startX = evt.clientX;
      moveType = "mousemove";
    } else {
      this.dist.startX = evt.changedTouches[0].clientX;
      moveType = "touchmove";
    }
    this.wrapper.addEventListener(moveType, this.onMove);
  }

  onMove(evt) {
    const pointerPosition =
      evt.type === "mousemove" ? evt.clientX : evt.changedTouches[0].clientX;
    const finalPosition = this.updatePosition(pointerPosition);
    this.moveSlide(finalPosition);
  }

  onEnd(evt) {
    const movetype = evt.type === "mouseup" ? "mousemove" : "touchmove";
    this.wrapper.removeEventListener(movetype, this.onMove);
    this.dist.finalPosition = this.dist.movePosition;
  }

  addSlideEvents() {
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("touchstart", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onEnd);
    this.wrapper.addEventListener("touchend", this.onEnd);
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  //slide config

  slidePosition(slide) {
    const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
    return -(slide.offsetLeft - margin);
  }

  slidesConfig() {
    this.slideArray = [...this.slide.children].map((element) => {
      const position = this.slidePosition(element);
      return { position, element };
    });
  }

  slideIndexNav(index) {
    const last = this.slideArray.length - 1
    this.index = {
      prev: index ? index - 1 : undefined,
      active: 0,
      next: index === last ? undefined : index + 1
    };
  }

  changeSlide(index) {
    const activeSlide = this.slideArray[index]
    this.moveSlide(activeSlide.position);
    this.slideIndexNav(index);
    this.dist.finalPosition = activeSlide.finalPosition
  }

  init() {
    this.bindEvents();
    this.addSlideEvents();
    this.slidesConfig();
    return this;
  }
}
