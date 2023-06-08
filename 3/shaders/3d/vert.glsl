#version 300 es
/**/
precision highp float;

in vec3 in_pos;
out vec3 DrawPos;  
/*
uniform atrix
{
    mat4 WVP;
    mat4 VP;
    mat4 W;
};
*/

uniform Matrix {
  mat4 WVP;
  mat4 VP;
  mat4 W;
};
out vec4 DrawColor; 
/* 
out vec2 TexCoord;  
out vec3 DrawNormal;

*/
void main(void) {
  //gl_Position = vec4((VP * in_pos).xyz, 1);
  gl_Position = WVP * vec4(in_pos, 1);
  DrawColor = vec4(WVP[0].x, WVP[0].x, WVP[0].x, WVP[0].x);
  DrawColor = vec4(in_pos.rgb, 1);
  //DrawColor = vec4(0.78, 0.2, 1, 1);
  /*
  DrawNormal = (MatrWInv * vec4(InNormal, 1)).rgb;
  TexCoord = InTexCoord;
  DrawColor = InColor;
  */
}
