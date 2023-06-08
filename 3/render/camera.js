import { matr } from "../math/matr.js";
import { vec3 } from "../math/vec3.js";

/* Camera module */
class _camera {
  projSize;
  projDist;
  projFarClip;

  matrVP;
  matrView;
  matrProj;

  loc;
  at;
  dir;
  up;
  right;

  frameW;
  frameH;

  constructor(gl) {
    this.frameW = gl.drawingBufferWidth;
    this.frameH = gl.drawingBufferHeight;

    this.matrVP = matr();
    this.matrView = matr();
    this.matrProj = matr();
    this.loc = vec3();
    this.at = vec3();
    this.dir = vec3();
    this.up = vec3();
    this.right = vec3();

    this.setProj(0.5, 0.5, 100);
    this.set(vec3(0, 3, 3), vec3(0), vec3(0, 1, 0));
  }
  set(Loc, At, Up) {
    this.matrView.view(Loc, At, Up);
    this.matrVP.matrMulmatr(this.matrView, this.matrProj);

    this.loc = Loc;
    this.at = At;
    this.up = Up;

    this.dir.set(
      -this.matrView.m[0][2],
      -this.matrView.m[1][2],
      -this.matrView.m[2][2]
    );
    this.up.set(
      -this.matrView.m[0][1],
      -this.matrView.m[1][1],
      -this.matrView.m[2][1]
    );
    this.right.set(
      -this.matrView.m[0][0],
      -this.matrView.m[1][0],
      -this.matrView.m[2][0]
    );
  }
  setProj(ProjSize, ProjDist, ProjFarClip) {
    let rx, ry;

    rx = ry = ProjSize;

    this.projDist = ProjDist;
    this.projSize = ProjSize;
    this.projFarClip = ProjFarClip;

    /* Correct aspect ratio */
    if (this.frameW > this.frameH) rx *= this.frameW / this.frameH;
    else ry *= this.frameH / this.frameW;

    /* pre-calculate view matrix */
    this.matrProj.frustum(
      -rx / 2,
      rx / 2,
      -ry / 2,
      ry / 2,
      ProjDist,
      ProjFarClip
    );
    this.matrVP.matrMulmatr(this.matrView, this.matrProj);
  }
  setSize(FrameW, FrameH) {
    this.frameW = FrameW;
    this.frameH = FrameH;

    this.setProj(this.projSize, this.projDist, this.projFarClip);
  }
  update(input, timer) {
    /*
    if (
      input.keys == undefined &&
      input.mdx == 0 &&
      input.mdy == 0 &&
      input.mdz == 0
    )
      return;
    */
    let speed = 10,
      time = timer.globalDeltaTime,
      Dist = vec3(this.at).sub(this.loc).len(),
      CosT = (this.loc.y - this.at.y) / Dist,
      SinT = Math.sqrt(1 - CosT * CosT),
      plen = Dist * SinT,
      CosP = (this.loc.z - this.at.z) / plen,
      SinP = (this.loc.x - this.at.x) / plen,
      Azimuth = (180 / Math.PI) * Math.atan2(SinP, CosP),
      Elevator = (180 / Math.PI) * Math.atan2(SinT, CosT),
      Wp = this.projSize,
      Hp = this.projSize,
      koef1 = ((Dist - 1) * (Dist - 1)) / (18 * Dist),
      koef2 = 1 /*sqrt((Dist - 1) * (Dist - 1) * (Dist - 1)) / (18 * Dist)*/,
      sx = 0,
      sy = 0,
      dv = vec3();

    Azimuth +=
      time *
      (input.keys["ControlLeft"] == 1) *
      koef2 *
      -speed *
      ((((input.mButton[2] == 1) * 500 * input.mdx) / (1 + this.frameW)) * 2 +
        ((input.keys["ArrowLeft"] == 1) - (input.keys["ArrowRight"] == 1)) *
          (15 + 45 * (input.keys["ShiftLeft"] == 1)));
    Elevator +=
      time *
        (input.keys["ControlLeft"] == 1) *
        koef2 *
        -speed *
        (((input.mButton[2] == 1) * 500 * input.mdy) / (1 + this.frameH)) *
        2 +
      ((input.keys["ArrowUp"] == 1) - (input.keys["ArrowDown"] == 1)) *
        (15 + 45 * (input.keys["ShiftLeft"] == 1));

    Elevator = Math.min(179.9, Elevator);
    Elevator = Math.max(0.1, Elevator);

    Dist +=
      time *
      (input.keys["ControlLeft"] == 1) *
      koef1 *
      (-input.mdz * (1 + 25 * (input.keys["ShiftLeft"] == 1)) +
        (8 + 25 * (input.keys == "keys")) *
          ((input.keys["ArrowUp"] == 1) - (input.keys["ArrowDown"] == 1)));

    Dist = Math.max(Dist, 1.1);
    Dist = Math.min(Dist, 10 * this.projFarClip);

    if (this.frameW > this.frameH) Wp *= this.frameW / this.frameH;
    else Hp *= this.frameH / this.frameW;

    sx =
      ((((input.mButton[1] == 1) * -input.mdx * Wp) / this.frameW) * Dist) /
      this.projDist;
    sy =
      ((((input.mButton[1] == 1) * input.mdy * Hp) / this.frameH) * Dist) /
      this.projDist;

    dv = vec3(this.right).mul(sx).add(vec3(this.up).mul(sy));
    this.at.add(dv);
    this.loc.add(dv);

    if (input.keys["KeyF"] == 1) {
      this.camSet(vec3(20), vec3(0), vec3(0, 1, 0));
      return;
    }

    /*
    if (input.keys[VK_LCONTROL] && input.keys[VK_RCONTROL]) {
      this.CamSet(this.Loc, vec3(0), vec3(0, 1, 0));
      return;
    }
    */
    if (input.keys["KeyP"] == 1) timer.isPause = !timer.isPause;

    /*
  if (input.keys[VK_SHIFT] && input.keys['D'] && !input.keys[VK_CONTROL] && !input.keys[VK_PRIOR])
    Ttp->PipelineDebugMode = !Ttp->PipelineDebugMode;
  */

    this.set(
      matr()
        .matrMulmatr(
          matr().rotateX(Elevator),
          matr().rotateX(Azimuth),
          matr().translate(this.at)
        )
        .pointTransform(vec3(0, Dist, 0)),
      this.at,
      vec3(0, 1, 0)
    );
  }
}

export function camera(...arg) {
  return new _camera(...arg);
}
