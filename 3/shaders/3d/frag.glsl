#version 300 es
/**/
precision highp float;

out vec4 out_color;

in vec3 DrawPos;
in vec4 DrawColor; 
/*
in vec2 TexCoord;  
in vec3 DrawNormal;

*/

void main(void) {
  out_color = vec4(DrawPos, 1);
  out_color = DrawColor;
    /*
  if (IsTexture0)
    OutColor = vec4(texture(InTextures[0], TexCoord).rgb, 1);

  OutPosId = vec4(DrawPos, 1);
  OutKsPh = KsPh;             
  OutKaTrans = KaTrans;       

  OutKdDepth = vec4(MtlKd, DrawPos.z);      
  OutNormalIsShade = vec4(normalize(DrawNormal), 1);
  */
}
