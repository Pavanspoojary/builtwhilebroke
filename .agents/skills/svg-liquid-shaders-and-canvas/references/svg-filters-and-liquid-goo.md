# SVG Filters & Liquid Goo Guide

Creating fluid, morphing liquid visual interfaces using native browser SVG filters.

---

## 1. SVG ColorMatrix Alpha Clamping Math

The color matrix transformation works on `[R, G, B, A, 1]`.
To turn a fuzzy blur into a sharp droplet shape, the 4th row (Alpha) is multiplied by 18-20 and offset by -7 to -10:

```xml
<filter id="liquid-droplet">
  <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
  <feColorMatrix
    in="blur"
    type="matrix"
    values="1 0 0 0 0
            0 1 0 0 0
            0 0 1 0 0
            0 0 0 19 -9"
    result="liquid"
  />
  <feBlend in="SourceGraphic" in2="liquid" />
</filter>
```

---

## 2. Animated Water Ripples with `feTurbulence` & `feDisplacementMap`

Creates dynamic wavy distortion across any HTML/CSS content:

```html
<svg class="hidden">
  <defs>
    <filter id="water-ripple">
      <feTurbulence
        id="turbulence"
        type="fractalNoise"
        baseFrequency="0.02 0.05"
        numOctaves="2"
        result="noise"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="noise"
        scale="20"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  </defs>
</svg>
```

Animate the `baseFrequency` property using GSAP or CSS for fluid ocean waves!
