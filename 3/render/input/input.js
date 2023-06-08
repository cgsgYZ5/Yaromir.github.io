class _input {
  canva;
  mx;
  my;

  mdx;
  mdy;
  mdz; /* Wheel rotate */

  mButton = [];
  keys = [];

  constructor(canva) {
    this.mdx = 0;
    this.mdy = 0;
    this.mdz = 0;
    this.canva = canva;
    canva.addEventListener("wheel", this.mWheel, false);
    canva.addEventListener("mousemove", this.mMove, false);

    window.addEventListener("keydown", this.keyDown, false);
    window.addEventListener("keyup", this.keyUp, false);
  }

  mWheel = (e) => {
    this.mdz = e.deltaY;
  };
  mMove = (e) => {
    this.mButton[e.buttons] = 1;

    this.mdx = e.movementX;
    this.mdy = e.movementY;
    this.mx = e.offsetX;
    this.my = e.offsetY;
  };
  keyDown = (e) => {
    this.keys[e.code] = 1;
  };
  keyUp = () => {
    this.keys[e.code] = 0;
  };
  reset() {
    this.mButton = [];
    this.keys = [];
    this.mdx = this.mdy = this.mdz = 0;
  }
}

export function input(...arg) {
  return new _input(...arg);
}
