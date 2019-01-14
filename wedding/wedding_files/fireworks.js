'use strict';
console.clear();

var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
   || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
    isMobile = true;
}
const IS_MOBILE = isMobile;
const IS_DESKTOP = window.innerWidth > 800;
const IS_HEADER = IS_DESKTOP && window.innerHeight < 300;
// Detect high end devices. This will be a moving target.
const IS_HIGH_END_DEVICE = (() => {
const hwConcurrency = navigator.hardwareConcurrency;
if (!hwConcurrency) {
return false;
}
// Large screens indicate a full size computer, which often have hyper threading these days.
// So a quad core desktop machine has 8 cores. We'll place a higher min threshold there.
const minCount = window.innerWidth <= 1024 ? 4 : 8;
console.log(`minCount ( ${minCount})`);
return hwConcurrency >= minCount;
})();
// Prevent canvases from getting too large on ridiculous screen sizes.
// 8K - can restrict this if needed
const MAX_WIDTH = 7680;
const MAX_HEIGHT = 4320;
const GRAVITY = 0.9; // Acceleration in px/s
let simSpeed = 1;

// Width/height values that take scale into account.
// USE THESE FOR DRAWING POSITIONS
let stageW, stageH;

// All quality globals will be overwritten and updated via `configDidUpdate`.
let quality = 1;
let isLowQuality = true;
let isNormalQuality = false;
let isHighQuality = false;

const QUALITY_LOW = 1;
const QUALITY_NORMAL = 2;
const QUALITY_HIGH = 3;

const COLOR = {
    Red: '#ff0043',
    Green: '#14fc56',
    Blue: '#1e7fff',
    Purple: '#e60aff',
    Gold: '#ffbf36',
    White: '#ffffff'
};

// Special invisible color (not rendered, and therefore not in COLOR map)
const INVISIBLE = '_INVISIBLE_';

const PI_2 = Math.PI * 2;
const PI_HALF = Math.PI * 0.5;

// Stage.disableHighDPI = true;
const trailsStage = new Stage('trails-canvas');
const mainStage = new Stage('main-canvas');
const stages = [
trailsStage,
mainStage
];

 // Simple state container; the source of truth.
 const store = {
     _listeners: new Set(),
     _dispatch(prevState) {
         this._listeners.forEach(listener => listener(this.state, prevState))
     },

     state: {
         // will be unpaused in init()
         paused: true,
         menuOpen: false,
         openHelpTopic: null,
         // Note that config values used for <select>s must be strings, unless manually converting values to strings
         // at render time, and parsing on change.
         config: {
         quality: String(QUALITY_LOW), // will be mirrored to a global variable named `quality` in `configDidUpdate`, for perf.
             shell: 'Random',
             size: IS_DESKTOP
             ? '3' // Desktop default
             : IS_HEADER
             ? '1.2' // Profile header default (doesn't need to be an int)
             : '2', // Mobile default
         }
     },

     setState(nextState) {
         const prevState = this.state;
         this.state = Object.assign({}, this.state, nextState);
         this._dispatch(prevState);
         this.persist();
     },

     subscribe(listener) {
         this._listeners.add(listener);
         return () => this._listeners.remove(listener);
     },

     // Load / persist select state to localStorage
     // Mutates state because `store.load()` should only be called once immediately after store is created, before any subscriptions.
     load() {
         const serializedData = localStorage.getItem('cm_fireworks_data');
         if (serializedData) {
             const {
                 schemaVersion,
                 data
             } = JSON.parse(serializedData);

             const config = this.state.config;
             switch(schemaVersion) {
                 case '1.1':
                 config.quality = data.quality;
                 config.size = data.size;
                 break;
                 case '1.2':
                 config.quality = data.quality;
                 config.size = data.size;
                 break;
                 default:
                 throw new Error('version switch should be exhaustive');
             }
             console.log(`Loaded config (schema version ${schemaVersion})`);
             console.log(`Size ( ${config.size})`);

         }
         // Deprecated data format. Checked with care (it's not namespaced).
         else if (localStorage.getItem('schemaVersion') === '1') {
             let size;
             // Attempt to parse data, ignoring if there is an error.
             try {
                 const sizeRaw = localStorage.getItem('configSize');
                 size = typeof sizeRaw === 'string' && JSON.parse(sizeRaw);
             }
             catch(e) {
                 console.log('Recovered from error parsing saved config:');
                 console.error(e);
                 return;
             }
             // Only restore validated values
             const sizeInt = parseInt(size, 10);
             if (sizeInt >= 0 && sizeInt <= 4) {
                 this.state.config.size = String(sizeInt);
             }
         }
     },

     persist() {
         const config = this.state.config;
         localStorage.setItem('cm_fireworks_data', JSON.stringify({
          schemaVersion: '1.2',
          data: {
          quality: config.quality,
          size: config.size,
          }
          }));
     }
 };


if (!IS_HEADER) {
    store.load();
}

// Actions
// ---------

function togglePause(toggle) {
    const paused = store.state.paused;
    let newValue;
    if (typeof toggle === 'boolean') {
        newValue = toggle;
    } else {
        newValue = !paused;
    }

    if (paused !== newValue) {
        store.setState({ paused: newValue });
    }
}

function updateConfig(nextConfig) {
    nextConfig = nextConfig || getConfigFromDOM();
    store.setState({
                   config: Object.assign({}, store.state.config, nextConfig)
                   });
                   configDidUpdate();
}

// Map config to various properties & apply side effects
function configDidUpdate() {
    const config = store.state.config;

    quality = QUALITY_LOW;
    isLowQuality = quality === QUALITY_LOW;
    isNormalQuality = quality === QUALITY_NORMAL;
    isHighQuality = quality === QUALITY_HIGH;
    console.log(`quality ( ${quality})`);
    
    Spark.drawWidth = quality === QUALITY_HIGH ? 0.75 : 1;
}

// Selectors
// -----------

const isRunning = (state=store.state) => !state.paused && !state.menuOpen;
// Convert quality to number.
const qualitySelector = () => +store.state.config.quality;
const shellNameSelector = () => store.state.config.shell;
// Convert shell size to number.
const shellSizeSelector = () => +store.state.config.size;

const nodeKeyToHelpKey = {
    shellTypeLabel: 'shellType',
    shellSizeLabel: 'shellSize',
    qualityLabel: 'quality',
};

// Render app UI / keep in sync with state
const appNodes = {
    stageContainer: '.stage-container',
    canvasContainer: '.canvas-container',
    menu: '.menu',
    menuInnerWrap: '.menu__inner-wrap',
    shellType: '.shell-type',
    shellTypeLabel: '.shell-type-label',
    shellSize: '.shell-size',
    shellSizeLabel: '.shell-size-label',
    quality: '.quality-ui',
    qualityLabel: '.quality-ui-label',
};

// Convert appNodes selectors to dom nodes
Object.keys(appNodes).forEach(key => {
  appNodes[key] = document.querySelector(appNodes[key]);
  });

// First render is called in init()
function renderApp(state) {
    appNodes.quality.value = state.config.quality;
    appNodes.shellType.value = state.config.shell;
    appNodes.shellSize.value = state.config.size;
}

store.subscribe(renderApp);

function getConfigFromDOM() {
    return {
        quality: appNodes.quality.value,
        shell: 'Random',
        size: appNodes.shellSize.value,
        // Store value as number.
    };
};

const updateConfigNoEvent = () => updateConfig();
appNodes.quality.addEventListener('input', updateConfigNoEvent);
appNodes.shellType.addEventListener('input', updateConfigNoEvent);
appNodes.shellSize.addEventListener('input', updateConfigNoEvent);

// Constant derivations
const COLOR_NAMES = Object.keys(COLOR);
const COLOR_CODES = COLOR_NAMES.map(colorName => COLOR[colorName]);
// Invisible stars need an indentifier, even through they won't be rendered - physics still apply.
const COLOR_CODES_W_INVIS = [...COLOR_CODES, INVISIBLE];
// Map of color codes to their index in the array. Useful for quickly determining if a color has already been updated in a loop.
const COLOR_CODE_INDEXES = COLOR_CODES_W_INVIS.reduce((obj, code, i) => {
obj[code] = i;
return obj;
}, {});
// Tuples is a map keys by color codes (hex) with values of { r, g, b } tuples (still just objects).
const COLOR_TUPLES = {};
COLOR_CODES.forEach(hex => {
COLOR_TUPLES[hex] = {
r: parseInt(hex.substr(1, 2), 16),
g: parseInt(hex.substr(3, 2), 16),
b: parseInt(hex.substr(5, 2), 16),
};
});

// Get a random color.
function randomColorSimple() {
 return COLOR_CODES[Math.random() * COLOR_CODES.length | 0];
}

// Get a random color, with some customization options available.
let lastColor;
function randomColor(options) {
    const notSame = options && options.notSame;
    const notColor = options && options.notColor;
    const limitWhite = options && options.limitWhite;
    let color = randomColorSimple();

    // limit the amount of white chosen randomly
    if (limitWhite && color === COLOR.White && Math.random() < 0.6) {
        color = randomColorSimple();
    }

    if (notSame) {
        while (color === lastColor) {
            color = randomColorSimple();
        }
    }
    else if (notColor) {
        while (color === notColor) {
            color = randomColorSimple();
        }
    }

    lastColor = color;
    return color;
}

function whiteOrGold() {
    return Math.random() < 0.5 ? COLOR.Gold : COLOR.White;
}


// Shell helpers
function makePistilColor(shellColor) {
    return (shellColor === COLOR.White || shellColor === COLOR.Gold) ? randomColor({ notColor: shellColor }) : whiteOrGold();
}

// Unique shell types
const crysanthemumShell = (size=1) => {
    const glitter = Math.random() < 0.25;
    const singleColor = Math.random() < 0.72;
    const color = singleColor ? randomColor({ limitWhite: true }) : [randomColor(), randomColor({ notSame: true })];
    const pistil = singleColor && Math.random() < 0.42;
    const pistilColor = pistil && makePistilColor(color);
    const secondColor = singleColor && (Math.random() < 0.2 || color === COLOR.White) ? pistilColor || randomColor({ notColor: color, limitWhite: true }) : null;
    const streamers = !pistil && color !== COLOR.White && Math.random() < 0.42;
    let starDensity = glitter ? 1.1 : 1.25;
    if (isLowQuality) starDensity *= 0.8;
    if (isHighQuality) starDensity = 1.2;
    return {
        shellSize: size,
        spreadSize: 300 + size * 100,
        starLife: 900 + size * 200,
        starDensity,
        color,
        secondColor,
        glitter: glitter ? 'light' : '',
        glitterColor: whiteOrGold(),
        pistil,
        pistilColor,
        streamers
    };
};

const ghostShell = (size=1) => {
    // Extend crysanthemum shell
    const shell = crysanthemumShell(size);
    // Ghost effect can be fast, so extend star life
    shell.starLife *= 1.5;
    // Ensure we always have a single color other than white
    let ghostColor = randomColor({ notColor: COLOR.White });
    // Always use streamers, and sometimes a pistil
    shell.streamers = true;
    const pistil = Math.random() < 0.42;
    const pistilColor = pistil && makePistilColor(ghostColor);
    // Ghost effect - transition from invisible to chosen color
    shell.color = INVISIBLE;
    shell.secondColor = ghostColor;
    // We don't want glitter to be spewed by invisible stars, and we don't currently
    // have a way to transition glitter state. So we'll disable it.
    shell.glitter = '';

    return shell;
};


const strobeShell = (size=1) => {
    const color = randomColor({ limitWhite: true });
    return {
        shellSize: size,
        spreadSize: 280 + size * 92,
        starLife: 1100 + size * 200,
        starLifeVariation: 0.40,
        starDensity: 1.1,
        color,
        glitter: 'light',
        glitterColor: COLOR.White,
        strobe: true,
        strobeColor: Math.random() < 0.5 ? COLOR.White : null,
        pistil: Math.random() < 0.5,
        pistilColor: makePistilColor(color)
    };
};


const palmShell = (size=1) => {
    const color = randomColor();
    const thick = Math.random() < 0.5;
    return {
        shellSize: size,
        color,
        spreadSize: 250 + size * 75,
        starDensity: thick ? 0.15 : 0.4,
        starLife: 1800 + size * 200,
        glitter: thick ? 'thick' : 'heavy'
    };
};

const ringShell = (size=1) => {
    const color = randomColor();
    const pistil = Math.random() < 0.75;
    return {
        shellSize: size,
        ring: true,
        color,
        spreadSize: 300 + size * 100,
        starLife: 900 + size * 200,
        starCount: 2.2 * PI_2 * (size+1),
        pistil,
        pistilColor: makePistilColor(color),
        glitter: !pistil ? 'light' : '',
        glitterColor: color === COLOR.Gold ? COLOR.Gold : COLOR.White,
        streamers: Math.random() < 0.3
    };
    // return Object.assign({}, defaultShell, config);
};

const crossetteShell = (size=1) => {
    const color = randomColor({ limitWhite: true });
    return {
        shellSize: size,
        spreadSize: 300 + size * 100,
        starLife: 750 + size * 160,
        starLifeVariation: 0.4,
        starDensity: 0.85,
        color,
        crossette: true,
        pistil: Math.random() < 0.5,
        pistilColor: makePistilColor(color)
    };
};

const floralShell = (size=1) => ({
 shellSize: size,
 spreadSize: 300 + size * 120,
 starDensity: 0.12,
 starLife: 500 + size * 50,
 starLifeVariation: 0.5,
 color: Math.random() < 0.65 ? 'random' : (Math.random() < 0.15 ? randomColor() : [randomColor(), randomColor({ notSame: true })]),
 floral: true
 });

 const fallingLeavesShell = (size=1) => ({
 shellSize: size,
 color: INVISIBLE,
 spreadSize: 300 + size * 120,
 starDensity: 0.12,
 starLife: 500 + size * 50,
 starLifeVariation: 0.5,
 glitter: 'medium',
 glitterColor: COLOR.Gold,
 fallingLeaves: true
 });

 const willowShell = (size=1) => ({
  shellSize: size,
  spreadSize: 300 + size * 100,
  starDensity: 0.6,
  starLife: 3000 + size * 300,
  glitter: 'willow',
  glitterColor: COLOR.Gold,
  color: INVISIBLE
  });

  const crackleShell = (size=1) => {
      // favor gold
      const color = Math.random() < 0.75 ? COLOR.Gold : randomColor();
      return {
          shellSize: size,
          spreadSize: 380 + size * 75,
          starDensity: isLowQuality ? 0.65 : 1,
          starLife: 600 + size * 100,
          starLifeVariation: 0.32,
          glitter: 'light',
          glitterColor: COLOR.Gold,
          color,
          crackle: true,
          pistil: Math.random() < 0.65,
          pistilColor: makePistilColor(color)
      };
  };

const horsetailShell = (size=1) => {
    const color = randomColor();
    return {
        shellSize: size,
        horsetail: true,
        color,
        spreadSize: 250 + size * 38,
        starDensity: 0.9,
        starLife: 2500 + size * 300,
        glitter: 'medium',
        glitterColor: Math.random() < 0.5 ? whiteOrGold() : color,
        // Add strobe effect to white horsetails, to make them more interesting
        strobe: color === COLOR.White
    };
};

function randomShellName() {
    return Math.random() < 0.5 ? 'Crysanthemum' : shellNames[(Math.random() * (shellNames.length - 1) + 1) | 0 ];
}

function randomShell(size) {
    return shellTypes[randomShellName()](size);
}

function shellFromConfig(size) {
    return shellTypes[shellNameSelector()](size);
}

// Get a random shell, not including processing intensive varients
// Note this is only random when "Random" shell is selected in config.
// Also, this does not create the shell, only returns the factory function.
const fastShellBlacklist = ['Falling Leaves', 'Floral', 'Willow'];
function randomFastShell() {
    const isRandom = shellNameSelector() === 'Random';
    let shellName = isRandom ? randomShellName() : shellNameSelector();
    if (isRandom) {
        while (fastShellBlacklist.includes(shellName)) {
            shellName = randomShellName();
        }
    }
    return shellTypes[shellName];
}


const shellTypes = {
    'Random': randomShell,
    'Crackle': crackleShell,
    'Crossette': crossetteShell,
    'Crysanthemum': crysanthemumShell,
    'Falling Leaves': fallingLeavesShell,
    'Floral': floralShell,
    'Ghost': ghostShell,
    'Horse Tail': horsetailShell,
    'Palm': palmShell,
    'Ring': ringShell,
    'Strobe': strobeShell,
    'Willow': willowShell
};

const shellNames = Object.keys(shellTypes);

function init() {
    // Populate dropdowns
    function setOptionsForSelect(node, options) {
        node.innerHTML = options.reduce((acc, opt) => acc += `<option value="${opt.value}">${opt.label}</option>`, '');
    }

    // shell type
    let options = '';
    shellNames.forEach(opt => options += `<option value="${opt}">${opt}</option>`);
    appNodes.shellType.innerHTML = options;
    // shell size
    options = '';
    ['3"', '4"', '6"', '8"', '12"', '16"'].forEach((opt, i) => options += `<option value="${i}">${opt}</option>`);
    appNodes.shellSize.innerHTML = options;

    setOptionsForSelect(appNodes.quality, [
   { label: 'Low', value: QUALITY_LOW },
   { label: 'Normal', value: QUALITY_NORMAL },
   { label: 'High', value: QUALITY_HIGH }
   ]);

  // Begin simulation
  togglePause(false);

  // initial render
  renderApp(store.state);

  // Apply initial config
  configDidUpdate();
}


function fitShellPositionInBoundsH(position) {
    const edge = 0.18;
    return (1 - edge*2) * position + edge;
}

function fitShellPositionInBoundsV(position) {
    return position * 0.75;
}

function getRandomShellPositionH() {
    return fitShellPositionInBoundsH(Math.random());
}

function getRandomShellPositionV() {
    return fitShellPositionInBoundsV(Math.random());
}

function getRandomShellSize() {
    const baseSize = shellSizeSelector();
    const maxVariance = Math.min(2.5, baseSize);
    const variance = Math.random() * maxVariance;
    const size = baseSize - variance;
    const height = maxVariance === 0 ? Math.random() : 1 - (variance / maxVariance);
    const centerOffset = Math.random() * (1 - height * 0.65) * 0.5;
    const x = Math.random() < 0.5 ? 0.5 - centerOffset : 0.5 + centerOffset;
    return {
        size,
        x: fitShellPositionInBoundsH(x),
        height: fitShellPositionInBoundsV(height)
    };
}


// Launches a shell from a user pointer event, based on state.config
function launchShellFromConfig(event) {
    const shell = new Shell(shellFromConfig(shellSizeSelector()));
    const w = mainStage.width;
    const h = mainStage.height;

    shell.launch(
     event ? event.x / w : getRandomShellPositionH(),
     event ? 1 - event.y / h : getRandomShellPositionV()
     );
}

let activePointerCount = 0;
let isUpdatingSpeed = false;

function handlePointerStart(event) {
    activePointerCount++;
    const btnSize = 50;

    if (!isRunning()) return;

    if (updateSpeedFromEvent(event)) {
        isUpdatingSpeed = true;
    }
    else if (event.onCanvas) {
        launchShellFromConfig(event);
    }
}

function handlePointerEnd(event) {
    activePointerCount--;
    isUpdatingSpeed = false;
}

function handlePointerMove(event) {
    if (!isRunning()) return;

    if (isUpdatingSpeed) {
        updateSpeedFromEvent(event);
    }
}

mainStage.addEventListener('pointerstart', handlePointerStart);
mainStage.addEventListener('pointerend', handlePointerEnd);
mainStage.addEventListener('pointermove', handlePointerMove);


// Account for window resize and custom scale changes.
function handleResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    // Try to adopt screen size, heeding maximum sizes specified
    const containerW = Math.min(w, MAX_WIDTH);
    // On small screens, use full device height
    const containerH = w <= 420 ? h : Math.min(h, MAX_HEIGHT);
    appNodes.stageContainer.style.width = containerW + 'px';
    appNodes.stageContainer.style.height = containerH + 'px';

    stages.forEach(stage => stage.resize(containerW, containerH));
    // Account for scale
    stageW = containerW ;
    stageH = containerH ;
}

// Compute initial dimensions
handleResize();
window.addEventListener('resize', handleResize);

// Dynamic globals
let currentFrame = 0;
let speedBarOpacity = 0;
let autoLaunchTime = 0;

function updateSpeedFromEvent(event) {
    if (isUpdatingSpeed || event.y >= mainStage.height - 44) {
        // On phones it's hard to hit the edge pixels in order to set speed at 0 or 1, so some padding is provided to make that easier.
        const edge = 16;
        const newSpeed = (event.x - edge) / (mainStage.width - edge * 2);
        simSpeed = Math.min(Math.max(newSpeed, 0), 1);
        // show speed bar after an update
        speedBarOpacity = 1;
        // If we updated the speed, return true
        return true;
    }
    // Return false if the speed wasn't updated
    return false;
}


// Extracted function to keep `update()` optimized
function updateGlobals(timeStep, lag) {
    currentFrame++;

    // Always try to fade out speed bar
    if (!isUpdatingSpeed) {
        speedBarOpacity -= lag / 30; // half a second
        if (speedBarOpacity < 0) {
            speedBarOpacity = 0;
        }
    }
}


function update(frameTime, lag) {
    if (!isRunning()) return;

    const width = stageW;
    const height = stageH;
    const timeStep = frameTime * simSpeed;
    const speed = simSpeed * lag;

    updateGlobals(timeStep, lag);

    const starDrag = 1 - (1 - Star.airDrag) * speed;
    const starDragHeavy = 1 - (1 - Star.airDragHeavy) * speed;
    const sparkDrag = 1 - (1 - Spark.airDrag) * speed;
    const gAcc = timeStep / 1000 * GRAVITY;
    COLOR_CODES_W_INVIS.forEach(color => {
                                // Stars
                                const stars = Star.active[color];
                                for (let i=stars.length-1; i>=0; i=i-1) {
                                const star = stars[i];
                                // Only update each star once per frame. Since color can change, it's possible a star could update twice without this, leading to a "jump".
                                if (star.updateFrame === currentFrame) {
                                continue;
                                }
                                star.updateFrame = currentFrame;

                                star.life -= timeStep;
                                if (star.life <= 0) {
                                stars.splice(i, 1);
                                Star.returnInstance(star);
                                } else {
                                const burnRate = Math.pow(star.life / star.fullLife, 0.5);
                                const burnRateInverse = 1 - burnRate;

                                star.prevX = star.x;
                                star.prevY = star.y;
                                star.x += star.speedX * speed;
                                star.y += star.speedY * speed;
                                // Apply air drag if star isn't "heavy". The heavy property is used for the shell comets.
                                if (!star.heavy) {
                                star.speedX *= starDrag;
                                star.speedY *= starDrag;
                                }
                                else {
                                star.speedX *= starDragHeavy;
                                star.speedY *= starDragHeavy;
                                }
                                star.speedY += gAcc;

                                if (star.spinRadius) {
                                star.spinAngle += star.spinSpeed * speed;
                                star.x += Math.sin(star.spinAngle) * star.spinRadius * speed;
                                star.y += Math.cos(star.spinAngle) * star.spinRadius * speed;
                                }

                                if (star.sparkFreq) {
                                star.sparkTimer -= timeStep;
                                while (star.sparkTimer < 0) {
                                star.sparkTimer += star.sparkFreq * 0.75 + star.sparkFreq * burnRateInverse * 4;
                                Spark.add(
                                          star.x,
                                          star.y,
                                          star.sparkColor,
                                          Math.random() * PI_2,
                                          Math.random() * star.sparkSpeed * burnRate,
                                          star.sparkLife * 0.8 + Math.random() * star.sparkLifeVariation * star.sparkLife
                                          );
                                }
                                }

                                // Handle star transitions
                                if (star.life < star.transitionTime) {
                                if (star.secondColor && !star.colorChanged) {
                                star.colorChanged = true;
                                star.color = star.secondColor;
                                stars.splice(i, 1);
                                Star.active[star.secondColor].push(star);
                                if (star.secondColor === INVISIBLE) {
                                star.sparkFreq = 0;
                                }
                                }

                                if (star.strobe) {
                                // Strobes in the following pattern: on:off:off:on:off:off in increments of `strobeFreq` ms.
                                star.visible = Math.floor(star.life / star.strobeFreq) % 3 === 0;
                                }
                                }
                                }
                                }

                                // Sparks
                                const sparks = Spark.active[color];
                                for (let i=sparks.length-1; i>=0; i=i-1) {
                                const spark = sparks[i];
                                spark.life -= timeStep;
                                if (spark.life <= 0) {
                                sparks.splice(i, 1);
                                Spark.returnInstance(spark);
                                } else {
                                spark.prevX = spark.x;
                                spark.prevY = spark.y;
                                spark.x += spark.speedX * speed;
                                spark.y += spark.speedY * speed;
                                spark.speedX *= sparkDrag;
                                spark.speedY *= sparkDrag;
                                spark.speedY += gAcc;
                                }
                                }
                                });

                                render(speed);
}

function render(speed) {
    const { dpr } = mainStage;
    const width = stageW;
    const height = stageH;
    const trailsCtx = trailsStage.ctx;
    const mainCtx = mainStage.ctx;

    // Account for high DPI screens, and custom scale factor.
    trailsCtx.scale(dpr , dpr );
    mainCtx.scale(dpr , dpr );

    trailsCtx.globalCompositeOperation = 'destination-out';
    trailsCtx.fillStyle = `rgba(0, 0, 0,  0.1)`;//0.1 for long exposure, 0.5 will make it shorter
    trailsCtx.fillRect(0, 0, width, height);

    mainCtx.clearRect(0, 0, width, height);

    // Draw queued burst flashes
    // These must also be drawn using source-over due to Safari. Seems rendering the gradients using lighten draws large black boxes instead.
    // Thankfully, these burst flashes look pretty much the same either way.
    while (BurstFlash.active.length) {
        const bf = BurstFlash.active.pop();

        const burstGradient = trailsCtx.createRadialGradient(bf.x, bf.y, 0, bf.x, bf.y, bf.radius);
        burstGradient.addColorStop(0.024, 'rgba(255, 255, 255, 1)');
        burstGradient.addColorStop(0.125, 'rgba(255, 160, 20, 0.2)');
        burstGradient.addColorStop(0.32, 'rgba(255, 140, 20, 0.11)');
        burstGradient.addColorStop(1, 'rgba(255, 120, 20, 0)');
        trailsCtx.fillStyle = burstGradient;
        trailsCtx.fillRect(bf.x - bf.radius, bf.y - bf.radius, bf.radius * 2, bf.radius * 2);

        BurstFlash.returnInstance(bf);
    }

    // Remaining drawing on trails canvas will use 'lighten' blend mode
    trailsCtx.globalCompositeOperation = 'lighten';

    // Draw stars
    trailsCtx.lineWidth = Star.drawWidth;
    trailsCtx.lineCap = isLowQuality ? 'square' : 'round';
    mainCtx.strokeStyle = '#fff';
    mainCtx.lineWidth = 1;
    mainCtx.beginPath();
    COLOR_CODES.forEach(color => {
                        const stars = Star.active[color];
                        trailsCtx.strokeStyle = color;
                        trailsCtx.beginPath();
                        stars.forEach(star => {
                                      if (star.visible) {
                                      trailsCtx.moveTo(star.x, star.y);
                                      trailsCtx.lineTo(star.prevX, star.prevY);
                                      mainCtx.moveTo(star.x, star.y);
                                      mainCtx.lineTo(star.x - star.speedX * 1.6, star.y - star.speedY * 1.6);
                                      }
                                      });
                        trailsCtx.stroke();
                        });
                        mainCtx.stroke();

                        // Draw sparks
                        trailsCtx.lineWidth = Spark.drawWidth;
                        trailsCtx.lineCap = 'butt';
                        COLOR_CODES.forEach(color => {
                                            const sparks = Spark.active[color];
                                            trailsCtx.strokeStyle = color;
                                            trailsCtx.beginPath();
                                            sparks.forEach(spark => {
                                                           trailsCtx.moveTo(spark.x, spark.y);
                                                           trailsCtx.lineTo(spark.prevX, spark.prevY);
                                                           });
                                            trailsCtx.stroke();
                                            });

                                            trailsCtx.setTransform(1, 0, 0, 1, 0, 0);
                                            mainCtx.setTransform(1, 0, 0, 1, 0, 0);
}

mainStage.addEventListener('ticker', update);

// Helper used to semi-randomly spread particles over an arc
// Values are flexible - `start` and `arcLength` can be negative, and `randomness` is simply a multiplier for random addition.
function createParticleArc(start, arcLength, count, randomness, particleFactory) {
    const angleDelta = arcLength / count;
    // Sometimes there is an extra particle at the end, too close to the start. Subtracting half the angleDelta ensures that is skipped.
    // Would be nice to fix this a better way.
    const end = start + arcLength - (angleDelta * 0.5);

    if (end > start) {
        // Optimization: `angle=angle+angleDelta` vs. angle+=angleDelta
        // V8 deoptimises with let compound assignment
        for (let angle=start; angle<end; angle=angle+angleDelta) {
            particleFactory(angle + Math.random() * angleDelta * randomness);
        }
    } else {
        for (let angle=start; angle>end; angle=angle+angleDelta) {
            particleFactory(angle + Math.random() * angleDelta * randomness);
        }
    }
}


// Helper used to create a spherical burst of particles
function createBurst(count, particleFactory, startAngle=0, arcLength=PI_2) {
    // Assuming sphere with surface area of `count`, calculate various
    // properties of said sphere (unit is stars).
    // Radius
    const R = 0.5 * Math.sqrt(count/Math.PI);
    // Circumference
    const C = 2 * R * Math.PI;
    // Half Circumference
    const C_HALF = C / 2;

    // Make a series of rings, sizing them as if they were spaced evenly
    // along the curved surface of a sphere.
    for (let i=0; i<=C_HALF; i++) {
        const ringAngle = i / C_HALF * PI_HALF;
        const ringSize = Math.cos(ringAngle);
        const partsPerFullRing = C * ringSize;
        const partsPerArc = partsPerFullRing * (arcLength / PI_2);

        const angleInc = PI_2 / partsPerFullRing;
        const angleOffset = Math.random() * angleInc + startAngle;
        // Each particle needs a bit of randomness to improve appearance.
        const maxRandomAngleOffset = angleInc * 0.33;

        for (let i=0; i<partsPerArc; i++) {
            const randomAngleOffset = Math.random() * maxRandomAngleOffset;
            let angle = angleInc * i + angleOffset + randomAngleOffset;
            particleFactory(angle, ringSize);
        }
    }
}

// Various star effects.
// These are designed to be attached to a star's `onDeath` event.

// Crossette breaks star into four same-color pieces which branch in a cross-like shape.
function crossetteEffect(star) {
    const startAngle = Math.random() * PI_HALF;
    createParticleArc(startAngle, PI_2, 4, 0.5, (angle) => {
                      Star.add(
                               star.x,
                               star.y,
                               star.color,
                               angle,
                               Math.random() * 0.6 + 0.75,
                               600
                               );
                      });
}

// Flower is like a mini shell
function floralEffect(star) {
    const count = 12 + 6 * quality;
    createBurst(count, (angle, speedMult) => {
                Star.add(
                         star.x,
                         star.y,
                         star.color,
                         angle,
                         speedMult * 2.4,
                         1000 + Math.random() * 300,
                         star.speedX,
                         star.speedY
                         );
                });
                // Queue burst flash render
                BurstFlash.add(star.x, star.y, 46);
}

// Floral burst with willow stars
function fallingLeavesEffect(star) {
    createBurst(7, (angle, speedMult) => {
                const newStar = Star.add(
                                         star.x,
                                         star.y,
                                         INVISIBLE,
                                         angle,
                                         speedMult * 2.4,
                                         2400 + Math.random() * 600,
                                         star.speedX,
                                         star.speedY
                                         );

                newStar.sparkColor = COLOR.Gold;
                newStar.sparkFreq = 144 / quality;
                newStar.sparkSpeed = 0.28;
                newStar.sparkLife = 750;
                newStar.sparkLifeVariation = 3.2;
                });
                // Queue burst flash render
                BurstFlash.add(star.x, star.y, 46);
}

// Crackle pops into a small cloud of golden sparks.
function crackleEffect(star) {
    const count = isHighQuality ? 32 : 16;
    createParticleArc(0, PI_2, count, 1.8, (angle) => {
      Spark.add(
                star.x,
                star.y,
                COLOR.Gold,
                angle,
                // apply near cubic falloff to speed (places more particles towards outside)
                Math.pow(Math.random(), 0.45) * 2.4,
                300 + Math.random() * 200
                );
      });
}

/**
 * Shell can be constructed with options:
 *
 * spreadSize:      Size of the burst.
 * starCount: Number of stars to create. This is optional, and will be set to a reasonable quantity for size if omitted.
 * starLife:
 * starLifeVariation:
 * color:
 * glitterColor:
 * glitter: One of: 'light', 'medium', 'heavy', 'streamer', 'willow'
 * pistil:
 * pistilColor:
 * streamers:
 * crossette:
 * floral:
 * crackle:
 */
class Shell {
    constructor(options) {
        Object.assign(this, options);
        this.starLifeVariation = options.starLifeVariation || 0.125;
        this.color = options.color || randomColor();
        this.glitterColor = options.glitterColor || this.color;

        // Set default starCount if needed, will be based on shell size and scale exponentially, like a sphere's surface area.
        if (!this.starCount) {
            const density = options.starDensity || 1;
            const scaledSize = this.spreadSize / 54;
            this.starCount = Math.max(6, scaledSize * scaledSize * density);
        }
    }

    launch(position, launchHeight) {
        const width = stageW;
        const height = stageH;
        // Distance from sides of screen to keep shells.
        const hpad = 60;
        // Distance from top of screen to keep shell bursts.
        const vpad = 50;
        // Minimum burst height, as a percentage of stage height
        const minHeightPercent = 0.45;
        // Minimum burst height in px
        const minHeight = height - height * minHeightPercent;

        const launchX = position * (width - hpad * 2) + hpad;
        const launchY = height;
        const burstY = minHeight - (launchHeight * (minHeight - vpad));

        const launchDistance = launchY - burstY;
        // Using a custom power curve to approximate Vi needed to reach launchDistance under gravity and air drag.
        // Magic numbers came from testing.
        const launchVelocity = Math.pow(launchDistance * 0.04, 0.64);

        const comet = this.comet = Star.add(
        launchX,
        launchY,
        typeof this.color === 'string' && this.color !== 'random' ? this.color : COLOR.White,
        Math.PI,
        launchVelocity * (this.horsetail ? 1.2 : 1),
        // Hang time is derived linearly from Vi; exact number came from testing
        launchVelocity * (this.horsetail ? 100 : 400)
        );

        // making comet "heavy" limits air drag
        comet.heavy = true;
        // comet spark trail
        comet.spinRadius = MyMath.random(0.32, 0.85);
        comet.sparkFreq = 32 / quality;
        if (isHighQuality) comet.sparkFreq = 8;
        comet.sparkLife = 320;
        comet.sparkLifeVariation = 3;
        if (this.glitter === 'willow' || this.fallingLeaves) {
            comet.sparkFreq = 20 / quality;
            comet.sparkSpeed = 0.5;
            comet.sparkLife = 500;
        }
        if (this.color === INVISIBLE) {
            comet.sparkColor = COLOR.Gold;
        }

        // Randomly make comet "burn out" a bit early.
        // This is disabled for horsetail shells, due to their very short airtime.
        if (Math.random() > 0.4 && !this.horsetail) {
            comet.secondColor = INVISIBLE;
            comet.transitionTime = Math.pow(Math.random(), 1.5) * 700 + 500;
        }

        comet.onDeath = comet => this.burst(comet.x, comet.y);
    }

    burst(x, y) {
        // Set burst speed so overall burst grows to set size. This specific formula was derived from testing, and is affected by simulated air drag.
        const speed = this.spreadSize / 96;

        let color, onDeath, sparkFreq, sparkSpeed, sparkLife;
        let sparkLifeVariation = 0.25;
        // Some death effects, like crackle, play a sound, but should only be played once.

        if (this.crossette) onDeath = (star) => {
            crossetteEffect(star);
        }
        if (this.crackle) onDeath = (star) => {
            crackleEffect(star);
        }
        if (this.floral) onDeath = floralEffect;
        if (this.fallingLeaves) onDeath = fallingLeavesEffect;

        if (this.glitter === 'light') {
            sparkFreq = 400;
            sparkSpeed = 0.3;
            sparkLife = 300;
            sparkLifeVariation = 2;
        }
        else if (this.glitter === 'medium') {
            sparkFreq = 200;
            sparkSpeed = 0.44;
            sparkLife = 700;
            sparkLifeVariation = 2;
        }
        else if (this.glitter === 'heavy') {
            sparkFreq = 80;
            sparkSpeed = 0.8;
            sparkLife = 1400;
            sparkLifeVariation = 2;
        }
        else if (this.glitter === 'thick') {
            sparkFreq = 16;
            sparkSpeed = isHighQuality ? 1.65 : 1.5;
            sparkLife = 1400;
            sparkLifeVariation = 3;
        }
        else if (this.glitter === 'streamer') {
            sparkFreq = 32;
            sparkSpeed = 1.05;
            sparkLife = 620;
            sparkLifeVariation = 2;
        }
        else if (this.glitter === 'willow') {
            sparkFreq = 120;
            sparkSpeed = 0.34;
            sparkLife = 1400;
            sparkLifeVariation = 3.8;
        }

        // Apply quality to spark count
        sparkFreq = sparkFreq / quality;

        // Star factory for primary burst, pistils, and streamers.
        let firstStar = true;
        const starFactory = (angle, speedMult) => {
            // For non-horsetail shells, compute an initial vertical speed to add to star burst.
            // The magic number comes from testing what looks best. The ideal is that all shell
            // bursts appear visually centered for the majority of the star life (excl. willows etc.)
            const standardInitialSpeed = this.spreadSize / 1800;

            const star = Star.add(
              x,
              y,
              color || randomColor(),
              angle,
              speedMult * speed,
              // add minor variation to star life
              this.starLife + Math.random() * this.starLife * this.starLifeVariation,
              this.horsetail ? this.comet && this.comet.speedX : 0,
              this.horsetail ? this.comet && this.comet.speedY : -standardInitialSpeed
              );

              if (this.secondColor) {
                  star.transitionTime = this.starLife * (Math.random() * 0.05 + 0.32);
                  star.secondColor = this.secondColor;
              }

              if (this.strobe) {
                  star.transitionTime = this.starLife * (Math.random() * 0.08 + 0.46);
                  star.strobe = true;
                  // How many milliseconds between switch of strobe state "tick". Note that the strobe pattern
                  // is on:off:off, so this is the "on" duration, while the "off" duration is twice as long.
                  star.strobeFreq = Math.random() * 20 + 40;
                  if (this.strobeColor) {
                      star.secondColor = this.strobeColor;
                  }
              }

              star.onDeath = onDeath;

              if (this.glitter) {
                  star.sparkFreq = sparkFreq;
                  star.sparkSpeed = sparkSpeed;
                  star.sparkLife = sparkLife;
                  star.sparkLifeVariation = sparkLifeVariation;
                  star.sparkColor = this.glitterColor;
                  star.sparkTimer = Math.random() * star.sparkFreq;
              }
        };

        if (typeof this.color === 'string') {
            if (this.color === 'random') {
                color = null; // falsey value creates random color in starFactory
            } else {
                color = this.color;
            }

            // Rings have positional randomness, but are rotated randomly
            if (this.ring) {
                const ringStartAngle = Math.random() * Math.PI;
                const ringSquash = Math.pow(Math.random(), 2) * 0.85 + 0.15;;

                createParticleArc(0, PI_2, this.starCount, 0, angle => {
                  // Create a ring, squashed horizontally
                  const initSpeedX = Math.sin(angle) * speed * ringSquash;
                  const initSpeedY = Math.cos(angle) * speed;
                  // Rotate ring
                  const newSpeed = MyMath.pointDist(0, 0, initSpeedX, initSpeedY);
                  const newAngle = MyMath.pointAngle(0, 0, initSpeedX, initSpeedY) + ringStartAngle;
                  const star = Star.add(
                                        x,
                                        y,
                                        color,
                                        newAngle,
                                        // apply near cubic falloff to speed (places more particles towards outside)
                                        newSpeed,//speed,
                                        // add minor variation to star life
                                        this.starLife + Math.random() * this.starLife * this.starLifeVariation
                                        );

                  if (this.glitter) {
                  star.sparkFreq = sparkFreq;
                  star.sparkSpeed = sparkSpeed;
                  star.sparkLife = sparkLife;
                  star.sparkLifeVariation = sparkLifeVariation;
                  star.sparkColor = this.glitterColor;
                  star.sparkTimer = Math.random() * star.sparkFreq;
                  }
                  });
            }
            // Normal burst
            else {
                createBurst(this.starCount, starFactory);
            }
        }
        else if (Array.isArray(this.color)) {
            if (Math.random() < 0.5) {
                const start = Math.random() * Math.PI;
                const start2 = start + Math.PI;
                const arc = Math.PI;
                color = this.color[0];
                // Not creating a full arc automatically reduces star count.
                createBurst(this.starCount, starFactory, start, arc);
                color = this.color[1];
                createBurst(this.starCount, starFactory, start2, arc);
            } else {
                color = this.color[0];
                createBurst(this.starCount / 2, starFactory);
                color = this.color[1];
                createBurst(this.starCount / 2, starFactory);
            }
        }
        else {
            throw new Error('Invalid shell color. Expected string or array of strings, but got: ' + this.color);
        }

        if (this.pistil) {
            const innerShell = new Shell({
             spreadSize: this.spreadSize * 0.5,
             starLife: this.starLife * 0.6,
             starLifeVariation: this.starLifeVariation,
             starDensity: 1.4,
             color: this.pistilColor,
             glitter: 'light',
             glitterColor: this.pistilColor === COLOR.Gold ? COLOR.Gold : COLOR.White
             });
             innerShell.burst(x, y);
        }

        if (this.streamers) {
            const innerShell = new Shell({
             spreadSize: this.spreadSize * 0.9,
             starLife: this.starLife * 0.8,
             starLifeVariation: this.starLifeVariation,
             starCount: Math.floor(Math.max(6, this.spreadSize / 45)),
             color: COLOR.White,
             glitter: 'streamer'
             });
             innerShell.burst(x, y);
        }

        // Queue burst flash render
        BurstFlash.add(x, y, this.spreadSize / 4);

        // Play sound, but only for "original" shell, the one that was launched.
        // We don't want multiple sounds from pistil or streamer "sub-shells".
        // This can be detected by the presence of a comet.
        if (this.comet) {
            // Scale explosion sound based on current shell size and selected (max) shell size.
            // Shooting selected shell size will always sound the same no matter the selected size,
            // but when smaller shells are auto-fired, they will sound smaller. It doesn't sound great
            // when a value too small is given though, so instead of basing it on proportions, we just
            // look at the difference in size and map it to a range known to sound good.
            const maxDiff = 2;
            const sizeDifferenceFromMaxSize = Math.min(maxDiff, shellSizeSelector() - this.shellSize);
        }
    }
}

const BurstFlash = {
    active: [],
    _pool: [],

    _new() {
        return {}
    },

    add(x, y, radius) {
        const instance = this._pool.pop() || this._new();

        instance.x = x;
        instance.y = y;
        instance.radius = radius;

        this.active.push(instance);
        return instance;
    },

    returnInstance(instance) {
        this._pool.push(instance);
    }
};

// Helper to generate objects for storing active particles.
// Particles are stored in arrays keyed by color (code, not name) for improved rendering performance.
function createParticleCollection() {
    const collection = {};
    COLOR_CODES_W_INVIS.forEach(color => {
                                collection[color] = [];
                                });
                                return collection;
}

// Star properties (WIP)
// -----------------------
// transitionTime - how close to end of life that star transition happens

const Star = {
    // Visual properties
    drawWidth: 3,
    airDrag: 0.98,
    airDragHeavy: 0.992,

    // Star particles will be keyed by color
    active: createParticleCollection(),
    _pool: [],

    _new() {
        return {};
    },

    add(x, y, color, angle, speed, life, speedOffX, speedOffY) {
        const instance = this._pool.pop() || this._new();

        instance.visible = true;
        instance.heavy = false;
        instance.x = x;
        instance.y = y;
        instance.prevX = x;
        instance.prevY = y;
        instance.color = color;
        instance.speedX = Math.sin(angle) * speed + (speedOffX || 0);
        instance.speedY = Math.cos(angle) * speed + (speedOffY || 0);
        instance.life = life;
        instance.fullLife = life;
        instance.spinAngle = Math.random() * PI_2;
        instance.spinSpeed = 0.8;
        instance.spinRadius = 0;
        instance.sparkFreq = 0; // ms between spark emissions
        instance.sparkSpeed = 1;
        instance.sparkTimer = 0;
        instance.sparkColor = color;
        instance.sparkLife = 750;
        instance.sparkLifeVariation = 0.25;
        instance.strobe = false;

        this.active[color].push(instance);
        return instance;
    },

    // Public method for cleaning up and returning an instance back to the pool.
    returnInstance(instance) {
        // Call onDeath handler if available (and pass it current star instance)
        instance.onDeath && instance.onDeath(instance);
        // Clean up
        instance.onDeath = null;
        instance.secondColor = null;
        instance.transitionTime = 0;
        instance.colorChanged = false;
        // Add back to the pool.
        this._pool.push(instance);
    }
};

const Spark = {
    // Visual properties
    drawWidth: 0, // set in `configDidUpdate()`
    airDrag: 0.9,

    // Star particles will be keyed by color
    active: createParticleCollection(),
    _pool: [],

    _new() {
        return {};
    },

    add(x, y, color, angle, speed, life) {
        const instance = this._pool.pop() || this._new();

        instance.x = x;
        instance.y = y;
        instance.prevX = x;
        instance.prevY = y;
        instance.color = color;
        instance.speedX = Math.sin(angle) * speed;
        instance.speedY = Math.cos(angle) * speed;
        instance.life = life;

        this.active[color].push(instance);
        return instance;
    },

        // Public method for cleaning up and returning an instance back to the pool.
        returnInstance(instance) {
        // Add back to the pool.
        this._pool.push(instance);
    }
};
