// Based on: https://github.com/ondras/fastiles/blob/master/ts/shaders.ts (v2.1.0)

export const VS = `
#version 300 es
in uvec2 position;
in uvec2 uv;
in uint style;
out vec2 fsUv;
flat out uint fsStyle;
uniform highp uvec2 tileSize;
uniform uvec2 viewportSize;
void main() {
	ivec2 positionPx = ivec2(position * tileSize);
	vec2 positionNdc = (vec2(positionPx * 2) / vec2(viewportSize))-1.0;
	positionNdc.y *= -1.0;
	gl_Position = vec4(positionNdc, 0.0, 1.0);
	fsUv = vec2(uv);
	fsStyle = style;
}`.trim();

export const FS = `
#version 300 es
precision highp float;
in vec2 fsUv;
flat in uint fsStyle;
out vec4 fragColor;
uniform sampler2D font;
uniform highp uvec2 tileSize;
void main() {
	uvec2 fontTiles = uvec2(textureSize(font, 0)) / tileSize;

	uint glyph = (fsStyle & uint(0xFF000000)) >> 24;
	uint glyphX = (glyph & uint(0xF));
	uint glyphY = (glyph >> 4);
	uvec2 fontPosition = uvec2(glyphX, glyphY);

	uvec2 fontPx = (tileSize * fontPosition) + uvec2(vec2(tileSize) * fsUv);
	vec3 texel = texelFetch(font, ivec2(fontPx), 0).rgb;

	float s = 15.0;
	uint fr = (fsStyle & uint(0xF00)) >> 8;
	uint fg = (fsStyle & uint(0x0F0)) >> 4;
	uint fb = (fsStyle & uint(0x00F)) >> 0;
	vec3 fgRgb = vec3(fr, fg, fb) / s;
  
	uint br = (fsStyle & uint(0xF00000)) >> 20;
	uint bg = (fsStyle & uint(0x0F0000)) >> 16;
	uint bb = (fsStyle & uint(0x00F000)) >> 12;
	vec3 bgRgb = vec3(br, bg, bb) / s;
  
	fragColor = vec4(mix(bgRgb, fgRgb, texel), 1.0);
}`.trim();
