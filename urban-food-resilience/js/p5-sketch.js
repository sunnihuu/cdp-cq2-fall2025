let preimage;

function preload() {
  // preimage = loadImage("20231025_ (2).png")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES)
  blendMode(MULTIPLY)

  cyan = color(random(255), random(255), random(255))
  magenta = color(random(255), random(255), random(255))
  yellow = color(random(255), random(255), random(255))
  black = color(random(255), random(255), random(255))

  let cg = createGraphics(width, height)
  cg.rectMode(CENTER)
  for (let index = 0; index < 100; index++) {
    let radius = random(70, 100)
    cg.fill(random(255), random(255), random(255))
    cg.circle(random(width), random(height), radius)
  }

  let diff = 8

  background(230, 230, 230)

  noStroke()

  let spotamp = random(20, 40)
  for (let Y = 50; Y < height - 50; Y = Y + 20) {

    for (let X = 50; X < width - 50; X = X + 20) {
      let thisRGB = cg.get(X, Y)
      let thisCMYK = RGBtoCMYK(thisRGB[0], thisRGB[1], thisRGB[2])

      let CMYKspotsize = CMYKtoSpotSize(...thisCMYK, spotamp)
      fill(black)
      circle(X, Y - diff, CMYKspotsize[3])
      fill(cyan)
      circle(X - diff, Y, CMYKspotsize[0])
      fill(magenta)
      circle(X, Y + diff, CMYKspotsize[1])
      fill(yellow)
      circle(X + diff, Y, CMYKspotsize[2])
    }
  }

  describe("This art is made using p5js. The dots are displayed and colorful.")

}

function draw() {

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function RGBtoCMYK(r, g, b) {
  let r1 = r / 255
  let g1 = g / 255
  let b1 = b / 255
  let c, m, y, k;
  k = min(1 - r1, 1 - g1, 1 - b1)
  if (k == 1) {
    c = m = y = 0;
  } else {
    c = (1 - r1 - k) / (1 - k);
    m = (1 - g1 - k) / (1 - k);
    y = (1 - b1 - k) / (1 - k);
  }
  return [c, m, y, k]
}

function CMYKtoSpotSize(c, m, y, k, spotSize) {
  let cs, ms, ys, ks;
  let circleRad = spotSize;
  cs = map(c, 0, 1, 0, circleRad);
  ms = map(m, 0, 1, 0, circleRad);
  ys = map(y, 0, 1, 0, circleRad);
  ks = map(k, 0, 1, 0, circleRad);
  return [cs, ms, ys, ks]
}
