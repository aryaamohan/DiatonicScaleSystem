let notes = {};
let whiteKeys = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K'];
let blackKeys = ['W', 'E', 'T', 'Y', 'U'];
let noteFiles = ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'Cs3', 'Ds3', 'Fs3', 'Gs3', 'As3'];
let keyRects = {};
let keyWidth, keyHeight, blackKeyWidth, blackKeyHeight;
let motifs = {};
let activeNotes = [];
let backgroundColor;

// Interval display
let intervalMessage = '';
let intervalDisplayed = false;
let intervalAnimation = 0;
let intervalOpacity = 0;

// Content for the text display
let points = [
  "Ancient Beginnings: The diatonic scale started in Ancient Greece, where musicians discovered that certain notes sounded good together using mathematical ratios.",
  "Pythagoras’s Influence: Pythagoras, a Greek mathematician, found that if you divide a string into certain lengths, you get pleasing sounds, like the notes of today’s scales.",
  "Four-Note Groups: Ancient Greeks used groups of four notes, called tetrachords, to build their scales. Combining these groups created early versions of what we now call the diatonic scale.",
  "Church Modes: In the Middle Ages, the Christian Church used these Greek ideas to create different 'modes' (like Dorian and Lydian), which are similar to our modern scales.",
  "Guidonian Hand: A monk named Guido of Arezzo created a hand chart to help singers learn and remember pitches. This made it easier for people to understand and use the diatonic scale.",
  "Do-Re-M: Guido also invented the first version of 'Do-Re-Mi' to help singers practice and recognize notes in the scale. This system evolved into the solfège we use today.",
  "Rise of Major and Minor Scales: In the Renaissance, musicians began to prefer the major and minor scales, which became the most popular forms of the diatonic scale.",
  "Tuning Adjustments: To make it easier to play in all keys, musicians started tuning notes slightly differently, creating the equal temperament system that made every note feel equal.",
  "Bach’s Influence: Composer Johann Sebastian Bach wrote music (The Well-Tempered Clavier) that showed how the new tuning system could be used to play music in any key using the diatonic scale.",
  "Keys and Flexibility: With the new tuning system, the diatonic scale could easily shift between keys, making it more flexible for musicians and composers.",
  "Chords and Harmony: The diatonic scale became the basis for building chords, leading to the development of harmony rules that are still taught today.",
  "Classical Music: By the time of Mozart and Beethoven, the diatonic scale was the main structure used in Western classical music, shaping the sound of their compositions.",
  "Modern Music: Today, the diatonic scale remains essential for learning and playing Western music, from classical pieces to pop songs, as it helps musicians understand melodies, chords, and harmony."
];
let currentPoint = 0;
let fadeValue = 0;
let fadeDirection = 1;
let pointDisplayDuration = 15 * 60; // 15 seconds in frames

function preload() {
  for (let i = 0; i < noteFiles.length; i++) {
    let note = noteFiles[i];
    notes[note] = loadSound(`assets/${note}.mp3`);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Georgia');
  textStyle(BOLD);
  updateKeyDimensions();
  setupKeys();
  backgroundColor = color(240); // Initial pastel background
}

function draw() {
  background(backgroundColor);
  drawKeys();
  drawMotifs();
  displayTextWithFade(); // Display the text with fade effect
  drawIntervalMessage(); // Display interval message
}

function updateKeyDimensions() {
  let totalWidth = min(width * 0.8, 700);
  keyWidth = totalWidth / 7;
  keyHeight = min(height * 0.4, 200);
  blackKeyWidth = keyWidth * 0.6;
  blackKeyHeight = keyHeight * 0.6;
}

function setupKeys() {
  let totalWhiteWidth = keyWidth * whiteKeys.length;
  let xOffset = (width - totalWhiteWidth) / 2;
  let yOffset = (height - keyHeight) / 2;

  for (let i = 0; i < whiteKeys.length; i++) {
    keyRects[whiteKeys[i]] = {
      x: xOffset + i * keyWidth,
      y: yOffset,
      width: keyWidth,
      height: keyHeight,
      active: false,
      isBlack: false,
      note: noteFiles[i],
      label: whiteKeys[i]
    };
  }

  let blackKeyMapping = {
    'W': 0,
    'E': 1,
    'T': 3,
    'Y': 4,
    'U': 5
  };

  for (let i = 0; i < blackKeys.length; i++) {
    let keyChar = blackKeys[i];
    let whiteIndex = blackKeyMapping[keyChar];
    keyRects[keyChar] = {
      x: keyRects[whiteKeys[whiteIndex]].x + keyWidth * 0.75,
      y: yOffset,
      width: blackKeyWidth,
      height: blackKeyHeight,
      active: false,
      isBlack: true,
      note: noteFiles[whiteKeys.length + i],
      label: blackKeys[i]
    };
  }
}

function drawKeys() {
  for (let i = 0; i < whiteKeys.length; i++) {
    let keyChar = whiteKeys[i];
    let rectInfo = keyRects[keyChar];
    fill(rectInfo.active ? '#FFD700' : '#FFFFFF');
    stroke(0);
    strokeWeight(2);
    rect(rectInfo.x, rectInfo.y, rectInfo.width, rectInfo.height, 5);

    fill(0);
    textSize(14);
    textAlign(CENTER, CENTER);
    text(rectInfo.label, rectInfo.x + rectInfo.width / 2, rectInfo.y + rectInfo.height - 15);
  }

  for (let i = 0; i < blackKeys.length; i++) {
    let keyChar = blackKeys[i];
    let rectInfo = keyRects[keyChar];
    fill(rectInfo.active ? '#FF8C00' : '#000000');
    noStroke();
    rect(rectInfo.x, rectInfo.y, rectInfo.width, rectInfo.height, 5);

    fill(255);
    textSize(12);
    textAlign(CENTER, CENTER);
    text(rectInfo.label, rectInfo.x + rectInfo.width / 2, rectInfo.y + rectInfo.height - 10);
  }
}

function drawMotifs() {
  for (let key in motifs) {
    let motif = motifs[key];
    if (motif.active) {
      fill(0);
      textSize(24);
      textAlign(CENTER, CENTER);
      let displayNote = motif.note.replace('s', '#');
      text(displayNote, motif.x, motif.y - motif.animationOffset);
      
      textSize(32);
      text('♩', motif.x, motif.y - motif.animationOffset - 40);

      motif.animationOffset = sin(frameCount * 0.1) * 5;
    }
  }
}

function displayTextWithFade() {
  fill(0, 0, 0, fadeValue);
  textSize(24);
  textAlign(CENTER, CENTER);
  let wrappedText = wrapText(points[currentPoint], width * 0.8); // Wrap the text
  text(wrappedText, width / 2, height * 0.15);

  // Fade logic over 15 seconds
  fadeValue += fadeDirection * 0.8;
  if (fadeValue >= 255) {
    fadeDirection = -1;
    fadeValue = 255;
  } else if (fadeValue <= 0) {
    fadeDirection = 1;
    fadeValue = 0;
    nextPoint();
  }
}

function nextPoint() {
  currentPoint = (currentPoint + 1) % points.length; // Cycle through points
}

function wrapText(text, maxWidth) {
  let words = text.split(' ');
  let lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    let word = words[i];
    let width = textWidth(currentLine + ' ' + word);
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines.join('\n');
}

function drawIntervalMessage() {
  if (intervalDisplayed) {
    fill(0, 0, 0, intervalOpacity);
    textSize(24);
    textAlign(CENTER, CENTER);
    text(intervalMessage, width / 2, height * 0.85 - intervalAnimation);
    intervalAnimation = lerp(intervalAnimation, 20, 0.05);
    intervalOpacity = lerp(intervalOpacity, 255, 0.05);
  }
}

function keyPressed() {
  let keyChar = key.toUpperCase();
  let sound = notes[keyRects[keyChar]?.note];
  if (sound) {
    if (sound.isPlaying()) {
      sound.stop();
    }
    sound.setVolume(0);
    sound.play();
    sound.amp(1, 0.1);

    if (keyRects[keyChar]) {
      keyRects[keyChar].active = true;
      let rectInfo = keyRects[keyChar];
      motifs[keyChar] = {
        x: rectInfo.x + rectInfo.width / 2,
        y: rectInfo.y - 20,
        note: rectInfo.note,
        active: true,
        animationOffset: 0
      };

      activeNotes.push(rectInfo.note);
      if (activeNotes.length === 2) {
        handleInterval(activeNotes[0], activeNotes[1]);
      }
    }
  }
}

function keyReleased() {
  let keyChar = key.toUpperCase();
  let sound = notes[keyRects[keyChar]?.note];
  if (sound && sound.isPlaying()) {
    sound.amp(0, 0.5, 0, () => {
      sound.stop();
    });
  }

  if (keyRects[keyChar]) {
    keyRects[keyChar].active = false;
    if (motifs[keyChar]) {
      motifs[keyChar].active = false;
    }
  }
  activeNotes = activeNotes.filter(note => note !== keyRects[keyChar]?.note);
}

function handleInterval(note1, note2) {
  let interval = getInterval(note1, note2);
  intervalMessage = `Interval: ${interval}`;
  intervalDisplayed = true;
  intervalAnimation = 0;
  intervalOpacity = 0;
  changeBackgroundColor(); // Change the background color
}

function getInterval(note1, note2) {
  const intervals = {
    'C3': 0,
    'Cs3': 1,
    'D3': 2,
    'Ds3': 3,
    'E3': 4,
    'F3': 5,
    'Fs3': 6,
    'G3': 7,
    'Gs3': 8,
    'A3': 9,
    'As3': 10,
    'B3': 11,
    'C4': 12
  };

  let intervalValue = Math.abs(intervals[note1] - intervals[note2]);
  const intervalNames = [
    'Unison', 'Minor Second', 'Major Second', 'Minor Third', 
    'Major Third', 'Perfect Fourth', 'Tritone', 'Perfect Fifth', 
    'Minor Sixth', 'Major Sixth', 'Minor Seventh', 'Major Seventh', 'Octave'
  ];

  return intervalNames[intervalValue] || '';
}

function changeBackgroundColor() {
  let r = random(200, 255);
  let g = random(200, 255);
  let b = random(200, 255);
  backgroundColor = color(r, g, b);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateKeyDimensions();
  setupKeys();
}
