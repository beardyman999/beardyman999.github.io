/* Made with ct.js http://ctjs.rocks/ */
const deadPool = []; // a pool of `kill`-ed copies for delaying frequent garbage collection
const copyTypeSymbol = Symbol('I am a ct.js copy');
setInterval(function () {
    deadPool.length = 0;
}, 1000 * 60);

/**
 * @typedef ILibMeta
 *
 * @property {string} name
 * @property {string} version
 * @property {string} [info]
 * @property {Array} authors
 */

/**
 * The ct.js library
 * @namespace
 */
const ct = {
    /**
     * An array with metadata of all the modules used in a ct.js game
     * @type {Object.<string,ILibMeta>}
     */
    libs: [{
    "CORE": {
        "name": "ct.js Game Framework",
        "info": "A game made with ct.js game framework and ct.IDE. Create your 2D games for free!",
        "authors": [
            {
                "name": "Cosmo Myzrail Gorynych",
                "site": "https://ctjs.rocks/"
            }
        ]
    },
    "place": {
        "name": "ct.place",
        "version": "3.0.0",
        "authors": [
            {
                "name": "Cosmo Myzrail Gorynych",
                "mail": "admin@nersta.ru"
            }
        ]
    },
    "fittoscreen": {
        "name": "Fit to Screen",
        "version": "2.0.0",
        "authors": [
            {
                "name": "Cosmo Myzrail Gorynych",
                "mail": "admin@nersta.ru"
            }
        ]
    },
    "mouse": {
        "name": "Mouse Input",
        "version": "2.1.0",
        "authors": [
            {
                "name": "Cosmo Myzrail Gorynych",
                "mail": "admin@nersta.ru"
            }
        ]
    },
    "keyboard": {
        "name": "Keyboard",
        "version": "3.0.0",
        "authors": [
            {
                "name": "Cosmo Myzrail Gorynych",
                "mail": "admin@nersta.ru"
            }
        ]
    },
    "keyboard.polyfill": {
        "name": "Keyboard Polyfill",
        "version": "1.0.0",
        "authors": [
            {
                "name": "Cosmo Myzrail Gorynych",
                "mail": "admin@nersta.ru"
            },
            {
                "name": "Joshua Bell"
            }
        ]
    },
    "sound.howler": {
        "name": "ct.sound.howler",
        "version": "1.2.0",
        "authors": [
            {
                "name": "Cosmo Myzrail Gorynych",
                "mail": "admin@nersta.ru"
            }
        ]
    },
    "akatemplate": {
        "name": "Basic Template",
        "version": "1.0.0",
        "authors": [
            {
                "name": "Cosmo Myzrail Gorynych",
                "mail": "admin@nersta.ru"
            }
        ]
    },
    "random": {
        "name": "ct.random",
        "version": "1.1.0",
        "authors": [
            {
                "name": "Cosmo Myzrail Gorynych",
                "mail": "admin@nersta.ru"
            }
        ]
    }
}][0],
    speed: [NaN][0] || 60,
    types: {},
    snd: {},
    stack: [],
    fps: [NaN][0] || 60,
    /**
     * A measure of how long a frame took time to draw, usually equal to 1 and larger on lags.
     * For example, if it is equal to 2, it means that the previous frame took twice as much time
     * compared to expected FPS rate.
     *
     * Use ct.delta to balance your movement and other calculations on different framerates by
     * multiplying it with your reference value.
     *
     * Note that `this.move()` already uses it, so there is no need to premultiply `this.speed` with it.
     *
     * **A minimal example:**
     * ```js
     * this.x += this.windSpeed * ct.delta;
     * ```
     *
     * @type {number}
     */
    delta: 1,
    /**
     * ct.js version in form of a string `X.X.X`.
     * @type {string}
     */
    version: '1.2.1',
    meta: [{"name":"Yersisland","author":"Atavismus","site":"https://twitter.com/DustbowlAGS","version":"0.9.5"}][0],
    main: {
        fpstick: 0,
        pi: 0
    },
    get width() {
        return ct.pixiApp.renderer.view.width;
    },
    /**
     * Resizes the drawing canvas and viewport to the given value in pixels.
     * When used with ct.fittoscreen, can be used to enlarge/shrink the viewport.
     * @param {number} value New width in pixels
     * @type {number}
     */
    set width(value) {
        ct.viewWidth = ct.roomWidth = value;
        if (!ct.fittoscreen || ct.fittoscreen.mode === 'fastScale') {
            ct.pixiApp.renderer.resize(value, ct.height);
        }
        if (ct.fittoscreen) {
            ct.fittoscreen();
        }
        return value;
    },
    get height() {
        return ct.pixiApp.renderer.view.height;
    },
    /**
     * Resizes the drawing canvas and viewport to the given value in pixels.
     * When used with ct.fittoscreen, can be used to enlarge/shrink the viewport.
     * @param {number} value New height in pixels
     * @type {number}
     */
    set height(value) {
        ct.viewHeight = ct.roomHeight = value;
        if (!ct.fittoscreen || ct.fittoscreen.mode === 'fastScale') {
            ct.pixiApp.renderer.resize(ct.width, value);
        }
        if (ct.fittoscreen) {
            ct.fittoscreen();
        }
        return value;
    },
    /**
     * The width of the current view, in game units
     * @type {number}
     */
    viewWidth: null,
    /**
     * The height of the current view, in game units
     * @type {number}
     */
    viewHeight: null
};

// eslint-disable-next-line no-console
console.table({
    '😺 Made with:': 'ct.js game editor',
    '🙀 Version:': `v${ct.version}`,
    '😻 Website:': 'https://ctjs.rocks/',
});

ct.highDensity = [/*@highDensity@*/][0];
/**
 * The PIXI.Application that runs ct.js game
 * @type {PIXI.Application}
 */
ct.pixiApp = new PIXI.Application({
    width: [320][0],
    height: [176][0],
    antialias: ![true][0],
    powerPreference: 'high-performance',
    sharedTicker: true,
    sharedLoader: true
});
PIXI.settings.ROUND_PIXELS = [true][0];
PIXI.Ticker.shared.maxFPS = [NaN][0] || 0;
if (!ct.pixiApp.renderer.options.antialias) {
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
}
/**
 * @type PIXI.Container
 */
ct.stage = ct.pixiApp.stage;
ct.pixiApp.renderer.autoDensity = ct.highDensity;
document.getElementById('ct').appendChild(ct.pixiApp.view);

/**
 * A library of different utility functions, mainly Math-related, but not limited to them.
 * @namespace
 */
ct.u = {
    /**
     * Returns the length of a vector projection onto an X axis.
     * @param {number} l The length of the vector
     * @param {number} d The direction of the vector
     * @returns {number} The length of the projection
     */
    ldx(l, d) {
        return l * Math.cos(d * Math.PI / -180);
    },
    /**
     * Returns the length of a vector projection onto an Y axis.
     * @param {number} l The length of the vector
     * @param {number} d The direction of the vector
     * @returns {number} The length of the projection
     */
    ldy(l, d) {
        return l * Math.sin(d * Math.PI / -180);
    },
    /**
     * Returns the direction of a vector that points from the first point to the second one.
     * @param {number} x1 The x location of the first point
     * @param {number} y1 The y location of the first point
     * @param {number} x2 The x location of the second point
     * @param {number} y2 The y location of the second point
     * @returns {number} The angle of the resulting vector, in degrees
     */
    pdn(x1, y1, x2, y2) {
        return (Math.atan2(y2 - y1, x2 - x1) * -180 / Math.PI + 360) % 360;
    },
    // Point-point DistanCe
    /**
     * Returns the distance between two points
     * @param {number} x1 The x location of the first point
     * @param {number} y1 The y location of the first point
     * @param {number} x2 The x location of the second point
     * @param {number} y2 The y location of the second point
     * @returns {number} The distance between the two points
     */
    pdc(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    },
    /**
     * Convers degrees to radians
     * @param {number} deg The degrees to convert
     * @returns {number} The resulting radian value
     */
    degToRad(deg) {
        return deg * Math.PI / -180;
    },
    /**
     * Convers radians to degrees
     * @param {number} rad The radian value to convert
     * @returns {number} The resulting degree
     */
    radToDeg(rad) {
        return rad / Math.PI * -180;
    },
    /**
     * Rotates a vector (x; y) by `deg` around (0; 0)
     * @param {number} x The x component
     * @param {number} y The y component
     * @param {number} deg The degree to rotate by
     * @returns {Array<number>} A pair of new `x` and `y` parameters.
     */
    rotate(x, y, deg) {
        return ct.u.rotateRad(x, y, ct.u.degToRad(deg));
    },
    /**
     * Rotates a vector (x; y) by `rad` around (0; 0)
     * @param {number} x The x component
     * @param {number} y The y component
     * @param {number} rad The radian value to rotate around
     * @returns {Array<number>} A pair of new `x` and `y` parameters.
     */
    rotateRad(x, y, rad) {
        const sin = Math.sin(rad),
              cos = Math.cos(rad);
        return [
            cos * x - sin * y,
            cos * y + sin * x
        ];
    },
    /**
     * Gets the most narrow angle between two vectors of given directions
     * @param {number} dir1 The direction of the first vector
     * @param {number} dir2 The direction of the second vector
     * @returns {number} The resulting angle
     */
    deltaDir(dir1, dir2) {
        dir1 = ((dir1 % 360) + 360) % 360;
        dir2 = ((dir2 % 360) + 360) % 360;
        var t = dir1,
            h = dir2,
            ta = h - t;
        if (ta > 180) {
            ta -= 360;
        }
        if (ta < -180) {
            ta += 360;
        }
        return ta;
    },
    /**
     * Returns a number in between the given range (clamps it).
     * @param {number} min The minimum value of the given number
     * @param {number} val The value to fit in the range
     * @param {number} max The maximum value of the given number
     * @returns {number} The clamped value
     */
    clamp(min, val, max) {
        return Math.max(min, Math.min(max, val));
    },
    /**
     * Linearly interpolates between two values by the apha value.
     * Can also be describing as mixing between two values with a given proportion `alpha`.
     * @param {number} a The first value to interpolate from
     * @param {number} b The second value to interpolate to
     * @param {number} alpha The mixing value
     * @returns {number} The result of the interpolation
     */
    lerp(a, b, alpha) {
        return a + (b-a)*alpha;
    },
    /**
     * Returns the position of a given value in a given range. Opposite to linear interpolation.
     * @param  {number} a The first value to interpolate from
     * @param  {number} b The second value to interpolate top
     * @param  {number} val The interpolated values
     * @return {number} The position of the value in the specified range. When a <= val <= b, the result will be inside the [0;1] range.
     */
    unlerp(a, b, val) {
        return (val - a) / (b - a);
    },
    /**
     * Tests whether a given point is inside the given rectangle (it can be either a copy or an array)
     * @param {number} x The x coordinate of the point
     * @param {number} y The y coordinate of the point
     * @param {(Copy|Array<Number>)} arg Either a copy (it must have a rectangular shape) or an array in a form of [x1, y1, x2, y2], where (x1;y1) and (x2;y2) specify the two opposite corners of the rectangle
     * @returns {boolean} `true` if the point is inside the rectangle, `false` otherwise
     */
    prect(x, y, arg) {
        var xmin, xmax, ymin, ymax;
        if (arg.splice) {
            xmin = Math.min(arg[0], arg[2]);
            xmax = Math.max(arg[0], arg[2]);
            ymin = Math.min(arg[1], arg[3]);
            ymax = Math.max(arg[1], arg[3]);
        } else {
            xmin = arg.x - arg.shape.left * arg.scale.x;
            xmax = arg.x + arg.shape.right * arg.scale.x;
            ymin = arg.y - arg.shape.top * arg.scale.y;
            ymax = arg.y + arg.shape.bottom * arg.scale.y;
        }
        return x >= xmin && y >= ymin && x <= xmax && y <= ymax;
    },
    /**
     * Tests whether a given point is inside the given circle (it can be either a copy or an array)
     * @param {number} x The x coordinate of the point
     * @param {number} y The y coordinate of the point
     * @param {(Copy|Array<Number>)} arg Either a copy (it must have a circular shape) or an array in a form of [x1, y1, r], where (x1;y1) define the center of the circle and `r` defines the radius of it
     * @returns {boolean} `true` if the point is inside the circle, `false` otherwise
     */
    pcircle(x, y, arg) {
        if (arg.splice) {
            return ct.u.pdc(x, y, arg[0], arg[1]) < arg[2];
        }
        return ct.u.pdc(0, 0, (arg.x - x) / arg.scale.x, (arg.y - y) / arg.scale.y) < arg.shape.r;
    },
    /**
     * Copies all the properties of the source object to the destination object. This is **not** a deep copy. Useful for extending some settings with default values, or for combining data.
     * @param {object} o1 The destination object
     * @param {object} o2 The source object
     * @param {any} [arr] An optional array of properties to copy. If not specified, all the properties will be copied.
     * @returns {object} The modified destination object
     */
    ext (o1, o2, arr) {
        if (arr) {
            for (const i in arr) {
                if (o2[arr[i]]) {
                    o1[arr[i]] = o2[arr[i]];
                }
            }
        } else {
            for (const i in o2) {
                o1[i] = o2[i];
            }
        }
        return o1;
    },
    /**
     * Loads and executes a script by its URL, optionally with a callback
     * @param {string} url The URL of the script file, with its extension. Can be relative or absolute
     * @param {Function} callback An optional callback that fires when the script is loaded
     * @returns {void}
     */
    load(url, callback) {
        var script = document.createElement('script');
        script.src = url;
        if (callback) {
            script.onload = callback;
        }
        document.getElementsByTagName('head')[0].appendChild(script);
    },
    /**
     * Returns a Promise that resolves after the given time
     * @param {number} time Time to wait, in milliseconds
     * @returns {Promise<void>} The promise with no data
     */
    wait(time) {
        var room = ct.room.name;
        return new Promise((resolve, reject) => setTimeout(() => {
            if (ct.room.name === room) {
                resolve();
            } else {
                reject({
                    info: 'Room switch',
                    from: 'ct.u.wait'
                });
            }
        }, time));
    }
};
ct.u.ext(ct.u, {// make aliases
    lengthDirX: ct.u.ldx,
    lengthDirY: ct.u.ldy,
    pointDirection: ct.u.pdn,
    pointDistance: ct.u.pdc,
    pointRectangle: ct.u.prect,
    pointCircle: ct.u.pcircle,
    extend: ct.u.ext
});

const removeKilledCopies = (array) => {
    let j = 0;
    for (let i = 0; i < array.length; i++) {
        if (!array[i].kill) {
            array[j++] = array[i];
        }
    }

    array.length = j;
    return array;
};
const killRecursive = copy => {
    copy.kill = true;
    ct.types.onDestroy.apply(copy);
    copy.onDestroy.apply(copy);
    for (const child of copy.children) {
        if (child[copyTypeSymbol]) {
            killRecursive(child);
        }
    }
};
ct.loop = function(delta) {
    ct.delta = delta;
    ct.inputs.updateActions();
    for (let i = 0, li = ct.stack.length; i < li; i++) {
        ct.types.beforeStep.apply(ct.stack[i]);
        ct.stack[i].onStep.apply(ct.stack[i]);
        ct.types.afterStep.apply(ct.stack[i]);
    }

    ct.rooms.beforeStep.apply(ct.room);
    ct.room.onStep.apply(ct.room);
    ct.rooms.afterStep.apply(ct.room);
    // copies
    for (let i = 0; i < ct.stack.length; i++) {
        // eslint-disable-next-line no-underscore-dangle
        if (ct.stack[i].kill && !ct.stack[i]._destroyed) {
            killRecursive(ct.stack[i]); // This will also allow a parent to eject children to a new container before they are destroyed as well
            ct.stack[i].destroy({children: true});
        }
    }
    for (const copy of ct.stack) {
        // eslint-disable-next-line no-underscore-dangle
        if (copy._destroyed) {
            deadPool.push(copy);
        }
    }
    removeKilledCopies(ct.stack);

    // ct.types.list[type: String]
    for (const i in ct.types.list) {
        removeKilledCopies(ct.types.list[i]);
    }

    for (const cont of ct.stage.children) {
        cont.children.sort((a, b) =>
            ((a.depth || 0) - (b.depth || 0)) || ((a.uid || 0) - (b.uid || 0)) || 0
        );
    }
    const r = ct.room;
    if (r.follow) {
        const speed = Math.min(1, (1-r.followDrift)*ct.delta);
        if (r.follow.kill) {
            delete r.follow;
        } else if (r.center) {
            r.x += speed * (r.follow.x + r.followShiftX - r.x - ct.viewWidth / 2);
            r.y += speed * (r.follow.y + r.followShiftY - r.y - ct.viewHeight / 2);
        } else {
            let cx = 0,
                cy = 0,
                w = 0,
                h = 0;
            w = Math.min(r.borderX, ct.viewWidth / 2);
            h = Math.min(r.borderY, ct.viewHeight / 2);
            if (r.follow.x + r.followShiftX - r.x < w) {
                cx = r.follow.x + r.followShiftX - r.x - w;
            }
            if (r.follow.y + r.followShiftY - r.y < h) {
                cy = r.follow.y + r.followShiftY - r.y - h;
            }
            if (r.follow.x + r.followShiftX - r.x > ct.viewWidth - w) {
                cx = r.follow.x + r.followShiftX - r.x - ct.viewWidth + w;
            }
            if (r.follow.y + r.followShiftY - r.y > ct.viewHeight - h) {
                cy = r.follow.y + r.followShiftY - r.y - ct.viewHeight + h;
            }
            r.x = Math.floor(r.x + speed * cx);
            r.y = Math.floor(r.y + speed * cy);
        }
    }
    r.x = r.x || 0;
    r.y = r.y || 0;
    r.x = Math.round(r.x);
    r.y = Math.round(r.y);

    // console.log("loop")
    for (let i = 0, li = ct.stack.length; i < li; i++) {
        // console.log(ct.stack[i].type);
        ct.types.beforeDraw.apply(ct.stack[i]);
        ct.stack[i].onDraw.apply(ct.stack[i]);
        ct.types.afterDraw.apply(ct.stack[i]);
        ct.stack[i].xprev = ct.stack[i].x;
        ct.stack[i].yprev = ct.stack[i].y;
    }

    ct.rooms.beforeDraw.apply(r);
    ct.room.onDraw.apply(r);
    ct.rooms.afterDraw.apply(r);

    ct.main.fpstick++;
    if (ct.rooms.switching) {
        ct.rooms.forceSwitch();
    }
};



/**
 * @property {number} value The current value of an action. It is always in the range from -1 to 1.
 * @property {string} name The name of the action.
 */
class CtAction {
    /**
     * This is a custom action defined in the Settings tab → Edit actions section.
     * Actions are used to abstract different input methods into one gameplay-related interface:
     * for example, joystick movement, WASD keys and arrows can be turned into two actions: `MoveHorizontally`
     * and `MoveVertically`.
     * @param {string} name The name of the new action.
     */
    constructor(name) {
        this.name = name;
        this.methodCodes = [];
        this.methodMultipliers = [];
        this.prevValue = 0;
        this.value = 0;
        return this;
    }
    /**
     * Checks whether the current action listens to a given input method.
     * This *does not* check whether this input method is supported by ct.
     *
     * @param {string} code The code to look up.
     * @returns {boolean} `true` if it exists, `false` otherwise.
     */
    methodExists(code) {
        return this.methodCodes.indexOf(code) !== -1;
    }
    /**
     * Adds a new input method to listen.
     *
     * @param {string} code The input method's code to listen to. Must be unique per action.
     * @param {number} [multiplier] An optional multiplier, e.g. to flip its value. Often used with two buttons to combine them into a scalar input identical to joysticks
     * @returns {void}
     */
    addMethod(code, multiplier) {
        if (this.methodCodes.indexOf(code) === -1) {
            this.methodCodes.push(code);
            this.methodMultipliers.push(multiplier !== void 0? multiplier : 1);
        } else {
            throw new Error(`[ct.inputs] An attempt to add an already added input "${code}" to an action "${name}".`);
        }
    }
    /**
     * Removes the provided input method for an action.
     *
     * @param {string} code The input method to remove.
     * @returns {void}
     */
    removeMethod(code) {
        const ind = this.methodCodes.indexOf(code);
        if (ind !== -1) {
            this.methodCodes.splice(ind, 1);
            this.methodMultipliers.splice(ind, 1);
        }
    }
    /**
     * Changes the multiplier for an input method with the provided code.
     * This method will produce a warning if one is trying to change an input method
     * that is not listened by this action.
     *
     * @param {string} code The input method's code to change
     * @param {number} multiplier The new value
     * @returns {void}
     */
    setMultiplier(code, multiplier) {
        const ind = this.methodCodes.indexOf(code);
        if (ind !== -1) {
            this.methodMultipliers[ind] = multiplier;
        } else {
            console.warning(`[ct.inputs] An attempt to change multiplier of a non-existent method "${code}" at event ${this.name}`);
            console.trace();
        }
    }
    /**
     * Recalculates the digital value of an action.
     *
     * @returns {number} A scalar value between -1 and 1.
     */
    update() {
        this.prevValue = this.value;
        this.value = 0;
        for (let i = 0, l = this.methodCodes.length; i < l; i++) {
            this.value += (ct.inputs.registry[this.methodCodes[i]] || 0) * this.methodMultipliers[i];
        }
        this.value = Math.max(-1, Math.min(this.value, 1));
    }
    /**
     * Returns whether the action became active in the current frame,
     * either by a button just pressed or by using a scalar input.
     *
     * `true` for being pressed and `false` otherwise
     * @type {boolean}
     */
    get pressed() {
        return this.prevValue === 0 && this.value !== 0;
    }
    /**
     * Returns whether the action became inactive in the current frame,
     * either by releasing all buttons or by resting all scalar inputs.
     *
     * `true` for being released and `false` otherwise
     * @type {boolean}
     */
    get released() {
        return this.prevValue !== 0 && this.value === 0;
    }
    /**
     * Returns whether the action is active, e.g. by a pressed button
     * or a currently used scalar input.
     *
     * `true` for being active and `false` otherwise
     * @type {boolean}
     */
    get down() {
        return this.value !== 0;
    }
    /* In case you need to be hated for the rest of your life, uncomment this */
    /*
    valueOf() {
        return this.value;
    }
    */
}

/**
 * A list of custom Actions. They are defined in the Settings tab → Edit actions section.
 * @type {Object.<string,CtAction>}
 */
ct.actions = {};
/**
 * @namespace
 */
ct.inputs = {
    registry: {},
    /**
     * Adds a new action and puts it into `ct.actions`.
     *
     * @param {string} name The name of an action, as it will be used in `ct.actions`.
     * @param {Array<Object>} methods A list of input methods. This list can be changed later.
     * @returns {CtAction} The created action
     */
    addAction(name, methods) {
        if (name in ct.actions) {
            throw new Error(`[ct.inputs] An action "${name}" already exists, can't add a new one with the same name.`);
        }
        const action = new CtAction(name);
        for (const method of methods) {
            action.addMethod(method.code, method.multiplier);
        }
        ct.actions[name] = action;
        return action;
    },
    /**
     * Removes an action with a given name.
     * @param {string} name The name of an action
     * @returns {void}
     */
    removeAction(name) {
        delete ct.actions[name];
    },
    /**
     * Recalculates values for every action in a game.
     * @returns {void}
     */
    updateActions() {
        for (const i in ct.actions) {
            ct.actions[i].update();
        }
    }
};

ct.inputs.addAction('mouseLeft', [{"code":"mouse.Left"}]);
ct.inputs.addAction('mouseRight', [{"code":"mouse.Right"}]);
ct.inputs.addAction('endTurnAction', [{"code":"keyboard.Space"},{"code":"keyboard.Enter"}]);
ct.inputs.addAction('mouseWheel', [{"code":"mouse.Wheel"}]);
ct.inputs.addAction('mouseMiddle', [{"code":"mouse.Middle"}]);
ct.inputs.addAction('moveMapN', [{"code":"keyboard.ArrowUp"}]);
ct.inputs.addAction('moveMapE', [{"code":"keyboard.ArrowRight"}]);
ct.inputs.addAction('moveMapS', [{"code":"keyboard.ArrowDown"}]);
ct.inputs.addAction('moveMapW', [{"code":"keyboard.ArrowLeft"}]);
ct.inputs.addAction('muteMusic', [{"code":"keyboard.KeyM"},{"code":"keyboard.Semicolon"}]);


/* eslint-disable no-underscore-dangle */
/* global SSCD */
/* eslint prefer-destructuring: 0 */
(function (ct) {
    const circlePrecision = 16,
          twoPi = Math.PI * 0;
    var getSSCDShape = function (copy) {
        const {shape} = copy,
              position = new SSCD.Vector(copy.x, copy.y);
        if (shape.type === 'rect') {
            if (copy.rotation === 0) {
                position.x -= copy.scale.x > 0? (shape.left * copy.scale.x) : (-copy.scale.x * shape.right);
                position.y -= copy.scale.y > 0? (shape.top * copy.scale.y) : (-shape.bottom * copy.scale.y);
                return new SSCD.Rectangle(
                    position,
                    new SSCD.Vector(Math.abs((shape.left + shape.right) * copy.scale.x), Math.abs((shape.bottom + shape.top) * copy.scale.y))
                );
            }
            const upperLeft = ct.u.rotate(-shape.left * copy.scale.x, -shape.top * copy.scale.y, copy.rotation),
                  bottomLeft = ct.u.rotate(-shape.left * copy.scale.x, shape.bottom * copy.scale.y, copy.rotation),
                  bottomRight = ct.u.rotate(shape.right * copy.scale.x, shape.bottom * copy.scale.y, copy.rotation),
                  upperRight = ct.u.rotate(shape.right * copy.scale.x, -shape.top * copy.scale.y, copy.rotation);
            return new SSCD.LineStrip(position, [
                new SSCD.Vector(upperLeft[0], upperLeft[1]),
                new SSCD.Vector(bottomLeft[0], bottomLeft[1]),
                new SSCD.Vector(bottomRight[0], bottomRight[1]),
                new SSCD.Vector(upperRight[0], upperRight[1])
            ], true);
        }
        if (shape.type === 'circle') {
            if (Math.abs(copy.scale.x) === Math.abs(copy.scale.y)) {
                return new SSCD.Circle(position, shape.r * Math.abs(copy.scale.x));
            }
            const vertices = [];
            for (let i = 0; i < circlePrecision; i++) {
                const point = [
                    Math.sin(twoPi / circlePrecision * i) * shape.r * copy.scale.x,
                    Math.cos(twoPi / circlePrecision * i) * shape.r * copy.scale.y
                ];
                if (copy.rotation !== 0) {
                    vertices.push(ct.u.rotate(point[0], point[1], copy.rotation));
                } else {
                    vertices.push(point);
                }
            }
            return new SSCD.LineStrip(position, vertices, true);
        }
        if (shape.type === 'strip') {
            const vertices = [];
            if (copy.rotation !== 0) {
                for (const point of shape.points) {
                    const [x, y] = ct.u.rotate(point.x * copy.scale.x, point.y * copy.scale.y, copy.rotation);
                    vertices.push(new SSCD.Vector(x, y));
                }
            } else {
                for (const point of shape.points) {
                    vertices.push(new SSCD.Vector(point.x * copy.scale.x, point.y * copy.scale.y));
                }
            }
            return new SSCD.LineStrip(position, vertices, Boolean(shape.closedStrip));
        }
        if (shape.type === 'line') {
            return new SSCD.Line(
                new SSCD.Vector(copy.x + shape.x1 * copy.scale.x, copy.y + shape.y1 * copy.scale.y),
                new SSCD.Vector(copy.x + (shape.x2 - shape.x1) * copy.scale.x, copy.y + (shape.y2 - shape.y1) * copy.scale.y)
            );
        }
        return new SSCD.Circle(position, 0);
    };

    ct.place = {
        m: 1, // direction modifier in ct.place.go,
        gridX: [512][0] || 512,
        gridY: [512][0] || 512,
        grid: {},
        tileGrid: {},
        getHashes(copy) {
            var hashes = [];
            var x = Math.round(copy.x / ct.place.gridX),
                y = Math.round(copy.y / ct.place.gridY),
                dx = Math.sign(copy.x - ct.place.gridX * x),
                dy = Math.sign(copy.y - ct.place.gridY * y);
            hashes.push(`${x}:${y}`);
            if (dx) {
                hashes.push(`${x+dx}:${y}`);
                if (dy) {
                    hashes.push(`${x+dx}:${y+dy}`);
                }
            }
            if (dy) {
                hashes.push(`${x}:${y+dy}`);
            }
            return hashes;
        },
        /**
         * Applied to copies in the debug mode. Draws a collision shape
         * @this Copy
         * @returns {void}
         */
        drawDebugGraphic() {
            const shape = this._shape || getSSCDShape(this);
            const g = this.$cDebugCollision;
            const color = this.$cHadCollision? 0x00ff00 : 0x0066ff;
            if (shape instanceof SSCD.Rectangle) {
                const pos = shape.get_position(),
                      size = shape.get_size();
                g.lineStyle(2, color)
                .drawRect(pos.x - this.x, pos.y - this.y, size.x, size.y);
            } else if (shape instanceof SSCD.LineStrip) {
                g.lineStyle(2, color)
                .moveTo(shape.__points[0].x, shape.__points[0].y);
                for (let i = 1; i < shape.__points.length; i++) {
                    g.lineTo(shape.__points[i].x, shape.__points[i].y);
                }
            } else if (shape instanceof SSCD.Circle) {
                g.lineStyle(2, color)
                .drawCircle(0, 0, shape.get_radius());
            } else {
                g.lineStyle(4, 0xff0000)
                .moveTo(-40, -40)
                .lineTo(40, 40,)
                .moveTo(-40, 40)
                .lineTo(40, -40);
            }
        },
        collide(c1, c2) {
            // ct.place.collide(<c1: Copy, c2: Copy>)
            // Test collision between two copies
            c1._shape = c1._shape || getSSCDShape(c1);
            c2._shape = c2._shape || getSSCDShape(c2);
            if (c1._shape.__type === 'complex' || c2._shape.__type === 'strip'
            || c2._shape.__type === 'complex' || c2._shape.__type === 'strip') {
                const aabb1 = c1._shape.get_aabb(),
                      aabb2 = c2._shape.get_aabb();
                if (!aabb1.intersects(aabb2)) {
                    return false;
                }
            }
            if (SSCD.CollisionManager.test_collision(c1._shape, c2._shape)) {
                if ([false][0]) {
                    c1.$cHadCollision = true;
                    c2.$cHadCollision = true;
                }
                return true;
            }
            return false;
        },
        /**
         * Determines if the place in (x,y) is occupied.
         * Optionally can take 'ctype' as a filter for obstackles' collision group (not shape type)
         *
         * @param {Copy} me The object to check collisions on
         * @param {number} [x] The x coordinate to check, as if `me` was placed there.
         * @param {number} [y] The y coordinate to check, as if `me` was placed there.
         * @param {String} [ctype] The collision group to check against
         * @param {Boolean} [multiple=false] If it is true, the function will return an array of all the collided objects.
         *                                   If it is false (default), it will return a copy with the first collision
         * @returns {Copy|Array<Copy>} The collided copy, or an array of all the detected collisions (if `multiple` is `true`)
         */
        occupied(me, x, y, ctype, multiple) {
            var oldx = me.x,
                oldy = me.y,
                shapeCashed = me._shape;
            let hashes;
            var results;
            if (typeof y === 'number') {
                me.x = x;
                me.y = y;
            } else {
                ctype = x;
                multiple = y;
                x = me.x;
                y = me.y;
            }
            if (typeof ctype === 'boolean') {
                multiple = ctype;
            }
            if (oldx !== me.x || oldy !== me.y) {
                me._shape = getSSCDShape(me);
                hashes = ct.place.getHashes(me);
            } else {
                hashes = me.$chashes || ct.place.getHashes(me);
            }
            if (multiple) {
                results = [];
            }
            for (const hash of hashes) {
                const array = ct.place.grid[hash];
                if (!array) {
                    continue;
                }
                for (let i = 0, l = array.length; i < l; i++) {
                    if (array[i] !== me && (!ctype || array[i].$ctype === ctype)) {
                        if (ct.place.collide(me, array[i])) {
                            /* eslint {"max-depth": "off"} */
                            if (!multiple) {
                                if (oldx !== me.x || oldy !== me.y) {
                                    me.x = oldx;
                                    me.y = oldy;
                                    me._shape = shapeCashed;
                                }
                                return array[i];
                            }
                            results.push(array[i]);
                        }
                    }
                }
            }
            if (oldx !== me.x || oldy !== me.y) {
                me.x = oldx;
                me.y = oldy;
                me._shape = shapeCashed;
            }
            if (!multiple) {
                return false;
            }
            return results;
        },
        free(me, x, y, ctype) {
            return !ct.place.occupied(me, x, y, ctype);
        },
        meet(me, x, y, type, multiple) {
            // ct.place.meet(<me: Copy, x: number, y: number>[, type: Type])
            // detects collision between a given copy and a copy of a certain type
            var oldx = me.x,
                oldy = me.y,
                shapeCashed = me._shape;
            let hashes;
            var results;
            if (typeof y === 'number') {
                me.x = x;
                me.y = y;
            } else {
                type = x;
                multiple = y;
                x = me.x;
                y = me.y;
            }
            if (typeof type === 'boolean') {
                multiple = type;
            }
            if (oldx !== me.x || oldy !== me.y) {
                me._shape = getSSCDShape(me);
                hashes = ct.place.getHashes(me);
            } else {
                hashes = me.$chashes || ct.place.getHashes(me);
            }
            if (multiple) {
                results = [];
            }
            for (const hash of hashes) {
                const array = ct.place.grid[hash];
                if (!array) {
                    continue;
                }
                for (let i = 0, l = array.length; i < l; i++) {
                    if (array[i].type === type && array[i] !== me && ct.place.collide(me, array[i])) {
                        if (!multiple) {
                            if (oldx !== me.x || oldy !== me.y) {
                                me._shape = shapeCashed;
                                me.x = oldx;
                                me.y = oldy;
                            }
                            return array[i];
                        }
                        results.push(array[i]);
                    }
                }
            }
            if (oldx !== me.x || oldy !== me.y) {
                me.x = oldx;
                me.y = oldy;
                me._shape = shapeCashed;
            }
            if (!multiple) {
                return false;
            }
            return results;
        },
        tile(me, x, y, depth) {
            if (!me.shape || !me.shape.type) {
                return false;
            }
            var oldx = me.x,
                oldy = me.y,
                shapeCashed = me._shape;
            let hashes;
            if (y !== void 0) {
                me.x = x;
                me.y = y;
            } else {
                depth = x;
                x = me.x;
                y = me.y;
            }
            if (oldx !== me.x || oldy !== me.y) {
                me._shape = getSSCDShape(me);
                hashes = ct.place.getHashes(me);
            } else {
                hashes = me.$chashes || ct.place.getHashes(me);
            }
            for (const hash of hashes) {
                const array = ct.place.tileGrid[hash];
                if (!array) {
                    continue;
                }
                for (let i = 0, l = array.length; i < l; i++) {
                    const tile = array[i];
                    if (!depth || tile.depth === depth && ct.place.collide(tile, me)) {
                        if (oldx !== me.x || oldy !== me.y) {
                            me.x = oldx;
                            me.y = oldy;
                            me._shape = shapeCashed;
                        }
                        return true;
                    }
                }
            }
            if (oldx !== me.x || oldy !== me.y) {
                me.x = oldx;
                me.y = oldy;
                me._shape = shapeCashed;
            }
            return false;
        },
        lastdist: null,
        nearest(x, y, type) {
            // ct.place.nearest(<x: number, y: number, type: Type>)
            if (ct.types.list[type].length > 0) {
                var dist = Math.hypot(x-ct.types.list[type][0].x, y-ct.types.list[type][0].y);
                var inst = ct.types.list[type][0];
                for (const copy of ct.types.list[type]) {
                    if (Math.hypot(x-copy.x, y-copy.y) < dist) {
                        dist = Math.hypot(x-copy.x, y-copy.y);
                        inst = copy;
                    }
                }
                ct.place.lastdist = dist;
                return inst;
            }
            return false;
        },
        furthest(x, y, type) {
            // ct.place.furthest(<x: number, y: number, type: Type>)
            if (ct.types.list[type].length > 0) {

                var dist = Math.hypot(x-ct.types.list[type][0].x, y-ct.types.list[type][0].y);
                var inst = ct.types.list[type][0];
                for (const copy of ct.types.list[type]) {
                    if (Math.hypot(x - copy.x, y - copy.y) > dist) {
                        dist = Math.hypot(x - copy.x, y - copy.y);
                        inst = copy;
                    }
                }
                ct.place.lastdist = dist;
                return inst;
            }
            return false;
        },
        moveAlong(me, dir, length, ctype, precision) {
            if (typeof ctype === 'number') {
                precision = ctype;
                ctype = void 0;
            }
            precision = Math.abs(precision || 1);
            if (length < 0) {
                length *= -1;
                dir += 180;
            }
            var dx = Math.cos(dir*Math.PI/-180) * precision,
                dy = Math.sin(dir*Math.PI/-180) * precision;
            for (let i = 0; i < length; i+= precision) {
                const occupied = ct.place.occupied(me, me.x + dx, me.y + dy, ctype);
                if (!occupied) {
                    me.x += dx;
                    me.y += dy;
                    delete me._shape;
                } else {
                    return occupied;
                }
            }
            return false;
        },
        go(me, x, y, length, ctype) {
            // ct.place.go(<me: Copy, x: number, y: number, length: number>[, ctype: String])
            // tries to reach the target with a simple obstacle avoidance algorithm

            // if we are too close to the destination, exit
            if (ct.u.pdc(me.x, me.y, x, y) < length) {
                if (ct.place.free(me, x, y, ctype)) {
                    me.x = x;
                    me.y = y;
                    delete me._shape;
                }
                return;
            }
            var dir = ct.u.pdn(me.x, me.y, x, y);

            //if there are no obstackles in front of us, go forward
            if (ct.place.free(me, me.x+ct.u.ldx(length, dir), me.y+ct.u.ldy(length, dir), ctype)) {
                me.x += ct.u.ldx(length, dir);
                me.y += ct.u.ldy(length, dir);
                delete me._shape;
                me.dir = dir;
            // otherwise, try to change direction by 30...60...90 degrees.
            // Direction changes over time (ct.place.m).
            } else {
                for (var i = -1; i <= 1; i+= 2) {
                    for (var j = 30; j < 150; j += 30) {
                        if (ct.place.free(me, me.x+ct.u.ldx(length, dir+j * ct.place.m*i), me.y+ct.u.ldy(length, dir+j * ct.place.m*i), ctype)) {
                            me.x += ct.u.ldx(length, dir+j * ct.place.m*i);
                            me.y += ct.u.ldy(length, dir+j * ct.place.m*i);
                            delete me._shape;
                            me.dir = dir+j * ct.place.m*i;
                            return;
                        }
                    }
                }
            }
        },
        /**
         * Throws a ray from point (x1, y1) to (x2, y2), returning all the instances that touched the ray.
         * The first copy in the returned array is the closest copy, the last one is the furthest.
         *
         * @param {number} x1 A horizontal coordinate of the starting point of the ray.
         * @param {number} y1 A vertical coordinate of the starting point of the ray.
         * @param {number} x2 A horizontal coordinate of the ending point of the ray.
         * @param {number} y2 A vertical coordinate of the ending point of the ray.
         * @param {String} [ctype] An optional collision group to trace against. If omitted, will trace through all the copies in the current room.
         *
         * @returns {Array<Copy>} Array of all the copies that touched the ray
         */
        trace(x1, y1, x2, y2, ctype) {
            var copies = [],
                ray = {
                    x: 0,
                    y: 0,
                    scale: {
                        x: 1,
                        y: 1
                    },
                    rotation: 0,
                    shape: {
                        type: 'line',
                        x1: x1,
                        y1: y1,
                        x2: x2,
                        y2: y2
                    }
                };
            for (var i in ct.stack) {
                if (!ctype || ct.stack[i].ctype === ctype) {
                    if (ct.place.collide(ray, ct.stack[i])) {
                        copies.push(ct.stack[i]);
                    }
                }
            }
            if (copies.length > 1) {
                copies.sort(function (a, b) {
                    var dist1, dist2;
                    dist1 = ct.u.pdc(x1, y1, a.x, a.y);
                    dist2 = ct.u.pdc(x1, y1, b.x, b.y);
                    return dist1 - dist2;
                });
            }
            return copies;
        }
    };
    // a magic procedure which tells 'go' function to change its direction
    setInterval(function() {
        ct.place.m *= -1;
    }, 789);
})(ct);

(function (ct) {
    var width,
        height;
    var oldWidth, oldHeight;
    var canv = ct.pixiApp.view;
    var manageViewport = function (room) {
        room = room || ct.room;
        room.x -= (width - oldWidth) / 2;
        room.y -= (height - oldHeight) / 2;
    };
    var resize = function() {
        const {mode} = ct.fittoscreen;
        width = window.innerWidth;
        height = window.innerHeight;
        var kw = width / ct.roomWidth,
            kh = height / ct.roomHeight,
            minorWidth = kw > kh;
        var k = Math.min(kw, kh);
        if (mode === 'fastScale') {
            canv.style.transform = 'scale(' + k + ')';
            canv.style.position = 'absolute';
            canv.style.left = (width - ct.width) / 2 + 'px';
            canv.style.top = (height - ct.height) / 2 + 'px';
        } else {
            var {room} = ct;
            if (!room) {
                return;
            }
            oldWidth = ct.width;
            oldHeight = ct.height;
            if (mode === 'expandViewport' || mode === 'expand') {
                for (const bg of ct.types.list.BACKGROUND) {
                    bg.width = width;
                    bg.height = height;
                }
                ct.viewWidth = width;
                ct.viewHeight = height;
            }
            if (mode !== 'scaleFit') {
                ct.pixiApp.renderer.resize(width, height);
                if (mode === 'scaleFill') {
                    if (minorWidth) {
                        ct.viewWidth = Math.ceil(width / k);
                    } else {
                        ct.viewHeight = Math.ceil(height / k);
                    }
                    for (const bg of ct.types.list.BACKGROUND) {
                        bg.width = ct.viewWidth;
                        bg.height = ct.viewHeight;
                    }
                }
            } else {
                ct.pixiApp.renderer.resize(Math.floor(ct.viewWidth * k), Math.floor(ct.viewHeight * k));
                canv.style.position = 'absolute';
                canv.style.left = (width - ct.width) / 2 + 'px';
                canv.style.top = (height - ct.height) / 2 + 'px';
            }
            if (mode === 'scaleFill' || mode === 'scaleFit') {
                ct.pixiApp.stage.scale.x = k;
                ct.pixiApp.stage.scale.y = k;
            }
            if (mode === 'expandViewport') {
                manageViewport(room);
            }
        }
    };
    var toggleFullscreen = function () {
        var element = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement,
            requester = document.getElementById('ct'),
            request = requester.requestFullscreen || requester.webkitRequestFullscreen || requester.mozRequestFullScreen || requester.msRequestFullscreen,
            exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
        if (!element) {
            var promise = request.call(requester);
            if (promise) {
                promise
                .catch(function (err) {
                    console.error('[ct.fittoscreen]', err);
                });
            }
        } else if (exit) {
            exit.call(document);
        }
    };
    var queuedFullscreen = function () {
        toggleFullscreen();
        document.removeEventListener('mouseup', queuedFullscreen);
        document.removeEventListener('keyup', queuedFullscreen);
        document.removeEventListener('click', queuedFullscreen);
    };
    var queueFullscreen = function() {
        document.addEventListener('mouseup', queuedFullscreen);
        document.addEventListener('keyup', queuedFullscreen);
        document.addEventListener('click', queuedFullscreen);
    };
    width = window.innerWidth;
    height = window.innerHeight;
    window.addEventListener('resize', resize);
    ct.fittoscreen = resize;
    ct.fittoscreen.manageViewport = manageViewport;
    ct.fittoscreen.toggleFullscreen = queueFullscreen;
    var $mode = 'scaleFit';
    Object.defineProperty(ct.fittoscreen, 'mode', {
        configurable: false,
        enumerable: true,
        set(value) {
            if ($mode === 'fastScale' && value !== 'fastScale') {
                canv.style.transform = '';
            } else if (value === 'fastScale' || value === 'expand' || value === 'expandViewport') {
                ct.pixiApp.stage.scale.x = ct.pixiApp.stage.scale.y = 1;
            }
            $mode = value;
            ct.fittoscreen();
        },
        get() {
            return $mode;
        }
    });
    ct.fittoscreen.mode = $mode;
    ct.fittoscreen.getIsFullscreen = function () {
        return document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen;
    };
})(ct);

(function () {
    var keyPrefix = 'mouse.';
    var setKey = function(key, value) {
        ct.inputs.registry[keyPrefix + key] = value;
    };
    var buttonMap = {
        0: 'Left',
        1: 'Middle',
        2: 'Right',
        3: 'Special1',
        4: 'Special2',
        5: 'Special3',
        6: 'Special4',
        7: 'Special5',
        8: 'Special6',
        unknown: 'Unknown'
    };

    ct.mouse = {
        rx: 0,
        ry: 0,
        xprev: 0,
        yprev: 0,
        inside: false,
        pressed: false,
        down: false,
        released: false,
        button: 0,
        hovers(copy) {
            if (!copy.shape) {
                return false;
            }
            if (copy.shape.type === 'rect') {
                return ct.u.prect(ct.mouse.x, ct.mouse.y, copy);
            }
            if (copy.shape.type === 'circle') {
                return ct.u.pcircle(ct.mouse.x, ct.mouse.y, copy);
            }
            if (copy.shape.type === 'point') {
                return ct.mouse.x === copy.x && ct.mouse.y === copy.y;
            }
            return false;
        },
        get x() {
            return ct.mouse.rx + ct.rooms.current.x;
        },
        get y() {
            return ct.mouse.ry + ct.rooms.current.y;
        },
        hide() {
            ct.pixiApp.renderer.view.style.cursor = 'none';
        },
        show() {
            ct.pixiApp.renderer.view.style.cursor = '';
        }
    };

    ct.mouse.listenerMove = function(e) {
        var rect = ct.pixiApp.view.getBoundingClientRect();
        ct.mouse.rx = (e.clientX - rect.left) * ct.viewWidth / rect.width;
        ct.mouse.ry = (e.clientY - rect.top) * ct.viewHeight / rect.height;
        ct.mouse.x = ct.mouse.rx + ct.rooms.current.x;
        ct.mouse.y = ct.mouse.ry + ct.rooms.current.y;
        if (ct.mouse.rx > 0 && ct.mouse.ry > 0 && ct.mouse.ry < ct.viewHeight && ct.mouse.rx < ct.viewWidth) {
            ct.mouse.inside = true;
        } else {
            ct.mouse.inside = false;
        }
        window.focus();
    };
    ct.mouse.listenerDown = function (e) {
        setKey(buttonMap[e.button] || buttonMap.unknown, 1);
        ct.mouse.pressed = true;
        ct.mouse.down = true;
        ct.mouse.button = e.button;
        window.focus();
        e.preventDefault();
    };
    ct.mouse.listenerUp = function (e) {
        setKey(buttonMap[e.button] || buttonMap.unknown, 0);
        ct.mouse.released = true;
        ct.mouse.down = false;
        ct.mouse.button = e.button;
        window.focus();
        e.preventDefault();
    };
    ct.mouse.listenerContextMenu = function (e) {
        e.preventDefault();
    };
    ct.mouse.listenerWheel = function (e) {
        ct.mouse.wheel = e.wheelDelta || -e.detail < 0? -1 : 1;
        setKey('wheel', ct.mouse.wheel);
        e.preventDefault();
    };

    ct.mouse.setupListeners = function () {
        if (document.addEventListener) {
            document.addEventListener('mousemove', ct.mouse.listenerMove, false);
            document.addEventListener('mouseup', ct.mouse.listenerUp, false);
            document.addEventListener('mousedown', ct.mouse.listenerDown, false);
            document.addEventListener('wheel', ct.mouse.listenerWheel, false);
            document.addEventListener('contextmenu', ct.mouse.listenerContextMenu, false);
            document.addEventListener('DOMMouseScroll', ct.mouse.listenerWheel, false);
        } else { // IE?
            document.attachEvent('onmousemove', ct.mouse.listenerMove);
            document.attachEvent('onmouseup', ct.mouse.listenerUp);
            document.attachEvent('onmousedown', ct.mouse.listenerDown);
            document.attachEvent('oncontextmenu', ct.mouse.listenerWheel);
            document.attachEvent('onmousewheel', ct.mouse.listenerContextMenu);
        }
    };
})();

/* global ct */
/* eslint {"no-multi-spaces": "off", "object-property-newline": "off"} */

(function() {
    var keyPrefix = 'keyboard.';
    var setKey = function(key, value) {
        ct.inputs.registry[keyPrefix + key] = value;
    };

    ct.keyboard = {
        string: '',
        lastKey: '',
        lastCode: '',
        alt: false,
        shift: false,
        ctrl: false,
        clear() {
            delete ct.keyboard.lastKey;
            delete ct.keyboard.lastCode;
            ct.keyboard.string = '';
            ct.keyboard.alt = false;
            ct.keyboard.shift = false;
            ct.keyboard.ctrl = false;
        },
        check: [],
        onDown(e) {
            ct.keyboard.shift = e.shiftKey;
            ct.keyboard.alt = e.altKey;
            ct.keyboard.ctrl = e.ctrlKey;
            ct.keyboard.lastKey = e.key;
            ct.keyboard.lastCode = e.code;
            if (e.code) {
                setKey(e.code, 1);
            } else {
                setKey('Unknown', 1);
            }
            if (e.key) {
                if (e.key.length === 1) {
                    ct.keyboard.string += e.key;
                } else if (e.key === 'Backspace') {
                    ct.keyboard.string = ct.keyboard.string.slice(0, -1);
                } else if (e.key === 'Enter') {
                    ct.keyboard.string = '';
                }
            }
            e.preventDefault();
        },
        onUp(e) {
            ct.keyboard.shift = e.shiftKey;
            ct.keyboard.alt = e.altKey;
            ct.keyboard.ctrl = e.ctrlKey;
            if (e.code) {
                setKey(e.code, 0);
            } else {
                setKey('Unknown', 0);
            }
            e.preventDefault();
        }
    };

    if (document.addEventListener) {
        document.addEventListener('keydown', ct.keyboard.onDown, false);
        document.addEventListener('keyup', ct.keyboard.onUp, false);
    } else {
        document.attachEvent('onkeydown', ct.keyboard.onDown);
        document.attachEvent('onkeyup', ct.keyboard.onUp);
    }
})();

(function(global) {
    'use strict';

    var nativeKeyboardEvent = ('KeyboardEvent' in global);
    if (!nativeKeyboardEvent)
      global.KeyboardEvent = function KeyboardEvent() { throw TypeError('Illegal constructor'); };

    [
      ['DOM_KEY_LOCATION_STANDARD', 0x00], // Default or unknown location
      ['DOM_KEY_LOCATION_LEFT', 0x01], // e.g. Left Alt key
      ['DOM_KEY_LOCATION_RIGHT', 0x02], // e.g. Right Alt key
      ['DOM_KEY_LOCATION_NUMPAD', 0x03], // e.g. Numpad 0 or +
    ].forEach(function(p) { if (!(p[0] in global.KeyboardEvent)) global.KeyboardEvent[p[0]] = p[1]; });

    var STANDARD = global.KeyboardEvent.DOM_KEY_LOCATION_STANDARD,
        LEFT = global.KeyboardEvent.DOM_KEY_LOCATION_LEFT,
        RIGHT = global.KeyboardEvent.DOM_KEY_LOCATION_RIGHT,
        NUMPAD = global.KeyboardEvent.DOM_KEY_LOCATION_NUMPAD;

    //--------------------------------------------------------------------
    //
    // Utilities
    //
    //--------------------------------------------------------------------

    function contains(s, ss) { return String(s).indexOf(ss) !== -1; }

    var os = (function() {
      if (contains(navigator.platform, 'Win')) { return 'win'; }
      if (contains(navigator.platform, 'Mac')) { return 'mac'; }
      if (contains(navigator.platform, 'CrOS')) { return 'cros'; }
      if (contains(navigator.platform, 'Linux')) { return 'linux'; }
      if (contains(navigator.userAgent, 'iPad') || contains(navigator.platform, 'iPod') || contains(navigator.platform, 'iPhone')) { return 'ios'; }
      return '';
    } ());

    var browser = (function() {
      if (contains(navigator.userAgent, 'Chrome/')) { return 'chrome'; }
      if (contains(navigator.vendor, 'Apple')) { return 'safari'; }
      if (contains(navigator.userAgent, 'MSIE')) { return 'ie'; }
      if (contains(navigator.userAgent, 'Gecko/')) { return 'moz'; }
      if (contains(navigator.userAgent, 'Opera/')) { return 'opera'; }
      return '';
    } ());

    var browser_os = browser + '-' + os;

    function mergeIf(baseTable, select, table) {
      if (browser_os === select || browser === select || os === select) {
        Object.keys(table).forEach(function(keyCode) {
          baseTable[keyCode] = table[keyCode];
        });
      }
    }

    function remap(o, key) {
      var r = {};
      Object.keys(o).forEach(function(k) {
        var item = o[k];
        if (key in item) {
          r[item[key]] = item;
        }
      });
      return r;
    }

    function invert(o) {
      var r = {};
      Object.keys(o).forEach(function(k) {
        r[o[k]] = k;
      });
      return r;
    }

    //--------------------------------------------------------------------
    //
    // Generic Mappings
    //
    //--------------------------------------------------------------------

    // "keyInfo" is a dictionary:
    //   code: string - name from UI Events KeyboardEvent code Values
    //     https://w3c.github.io/uievents-code/
    //   location (optional): number - one of the DOM_KEY_LOCATION values
    //   keyCap (optional): string - keyboard label in en-US locale
    // USB code Usage ID from page 0x07 unless otherwise noted (Informative)

    // Map of keyCode to keyInfo
    var keyCodeToInfoTable = {
      // 0x01 - VK_LBUTTON
      // 0x02 - VK_RBUTTON
      0x03: { code: 'Cancel' }, // [USB: 0x9b] char \x0018 ??? (Not in D3E)
      // 0x04 - VK_MBUTTON
      // 0x05 - VK_XBUTTON1
      // 0x06 - VK_XBUTTON2
      0x06: { code: 'Help' }, // [USB: 0x75] ???
      // 0x07 - undefined
      0x08: { code: 'Backspace' }, // [USB: 0x2a] Labelled Delete on Macintosh keyboards.
      0x09: { code: 'Tab' }, // [USB: 0x2b]
      // 0x0A-0x0B - reserved
      0X0C: { code: 'Clear' }, // [USB: 0x9c] NumPad Center (Not in D3E)
      0X0D: { code: 'Enter' }, // [USB: 0x28]
      // 0x0E-0x0F - undefined

      0x10: { code: 'Shift' },
      0x11: { code: 'Control' },
      0x12: { code: 'Alt' },
      0x13: { code: 'Pause' }, // [USB: 0x48]
      0x14: { code: 'CapsLock' }, // [USB: 0x39]
      0x15: { code: 'KanaMode' }, // [USB: 0x88]
      0x16: { code: 'Lang1' }, // [USB: 0x90]
      // 0x17: VK_JUNJA
      // 0x18: VK_FINAL
      0x19: { code: 'Lang2' }, // [USB: 0x91]
      // 0x1A - undefined
      0x1B: { code: 'Escape' }, // [USB: 0x29]
      0x1C: { code: 'Convert' }, // [USB: 0x8a]
      0x1D: { code: 'NonConvert' }, // [USB: 0x8b]
      0x1E: { code: 'Accept' }, // [USB: ????]
      0x1F: { code: 'ModeChange' }, // [USB: ????]

      0x20: { code: 'Space' }, // [USB: 0x2c]
      0x21: { code: 'PageUp' }, // [USB: 0x4b]
      0x22: { code: 'PageDown' }, // [USB: 0x4e]
      0x23: { code: 'End' }, // [USB: 0x4d]
      0x24: { code: 'Home' }, // [USB: 0x4a]
      0x25: { code: 'ArrowLeft' }, // [USB: 0x50]
      0x26: { code: 'ArrowUp' }, // [USB: 0x52]
      0x27: { code: 'ArrowRight' }, // [USB: 0x4f]
      0x28: { code: 'ArrowDown' }, // [USB: 0x51]
      0x29: { code: 'Select' }, // (Not in D3E)
      0x2A: { code: 'Print' }, // (Not in D3E)
      0x2B: { code: 'Execute' }, // [USB: 0x74] (Not in D3E)
      0x2C: { code: 'PrintScreen' }, // [USB: 0x46]
      0x2D: { code: 'Insert' }, // [USB: 0x49]
      0x2E: { code: 'Delete' }, // [USB: 0x4c]
      0x2F: { code: 'Help' }, // [USB: 0x75] ???

      0x30: { code: 'Digit0', keyCap: '0' }, // [USB: 0x27] 0)
      0x31: { code: 'Digit1', keyCap: '1' }, // [USB: 0x1e] 1!
      0x32: { code: 'Digit2', keyCap: '2' }, // [USB: 0x1f] 2@
      0x33: { code: 'Digit3', keyCap: '3' }, // [USB: 0x20] 3#
      0x34: { code: 'Digit4', keyCap: '4' }, // [USB: 0x21] 4$
      0x35: { code: 'Digit5', keyCap: '5' }, // [USB: 0x22] 5%
      0x36: { code: 'Digit6', keyCap: '6' }, // [USB: 0x23] 6^
      0x37: { code: 'Digit7', keyCap: '7' }, // [USB: 0x24] 7&
      0x38: { code: 'Digit8', keyCap: '8' }, // [USB: 0x25] 8*
      0x39: { code: 'Digit9', keyCap: '9' }, // [USB: 0x26] 9(
      // 0x3A-0x40 - undefined

      0x41: { code: 'KeyA', keyCap: 'a' }, // [USB: 0x04]
      0x42: { code: 'KeyB', keyCap: 'b' }, // [USB: 0x05]
      0x43: { code: 'KeyC', keyCap: 'c' }, // [USB: 0x06]
      0x44: { code: 'KeyD', keyCap: 'd' }, // [USB: 0x07]
      0x45: { code: 'KeyE', keyCap: 'e' }, // [USB: 0x08]
      0x46: { code: 'KeyF', keyCap: 'f' }, // [USB: 0x09]
      0x47: { code: 'KeyG', keyCap: 'g' }, // [USB: 0x0a]
      0x48: { code: 'KeyH', keyCap: 'h' }, // [USB: 0x0b]
      0x49: { code: 'KeyI', keyCap: 'i' }, // [USB: 0x0c]
      0x4A: { code: 'KeyJ', keyCap: 'j' }, // [USB: 0x0d]
      0x4B: { code: 'KeyK', keyCap: 'k' }, // [USB: 0x0e]
      0x4C: { code: 'KeyL', keyCap: 'l' }, // [USB: 0x0f]
      0x4D: { code: 'KeyM', keyCap: 'm' }, // [USB: 0x10]
      0x4E: { code: 'KeyN', keyCap: 'n' }, // [USB: 0x11]
      0x4F: { code: 'KeyO', keyCap: 'o' }, // [USB: 0x12]

      0x50: { code: 'KeyP', keyCap: 'p' }, // [USB: 0x13]
      0x51: { code: 'KeyQ', keyCap: 'q' }, // [USB: 0x14]
      0x52: { code: 'KeyR', keyCap: 'r' }, // [USB: 0x15]
      0x53: { code: 'KeyS', keyCap: 's' }, // [USB: 0x16]
      0x54: { code: 'KeyT', keyCap: 't' }, // [USB: 0x17]
      0x55: { code: 'KeyU', keyCap: 'u' }, // [USB: 0x18]
      0x56: { code: 'KeyV', keyCap: 'v' }, // [USB: 0x19]
      0x57: { code: 'KeyW', keyCap: 'w' }, // [USB: 0x1a]
      0x58: { code: 'KeyX', keyCap: 'x' }, // [USB: 0x1b]
      0x59: { code: 'KeyY', keyCap: 'y' }, // [USB: 0x1c]
      0x5A: { code: 'KeyZ', keyCap: 'z' }, // [USB: 0x1d]
      0x5B: { code: 'MetaLeft', location: LEFT }, // [USB: 0xe3]
      0x5C: { code: 'MetaRight', location: RIGHT }, // [USB: 0xe7]
      0x5D: { code: 'ContextMenu' }, // [USB: 0x65] Context Menu
      // 0x5E - reserved
      0x5F: { code: 'Standby' }, // [USB: 0x82] Sleep

      0x60: { code: 'Numpad0', keyCap: '0', location: NUMPAD }, // [USB: 0x62]
      0x61: { code: 'Numpad1', keyCap: '1', location: NUMPAD }, // [USB: 0x59]
      0x62: { code: 'Numpad2', keyCap: '2', location: NUMPAD }, // [USB: 0x5a]
      0x63: { code: 'Numpad3', keyCap: '3', location: NUMPAD }, // [USB: 0x5b]
      0x64: { code: 'Numpad4', keyCap: '4', location: NUMPAD }, // [USB: 0x5c]
      0x65: { code: 'Numpad5', keyCap: '5', location: NUMPAD }, // [USB: 0x5d]
      0x66: { code: 'Numpad6', keyCap: '6', location: NUMPAD }, // [USB: 0x5e]
      0x67: { code: 'Numpad7', keyCap: '7', location: NUMPAD }, // [USB: 0x5f]
      0x68: { code: 'Numpad8', keyCap: '8', location: NUMPAD }, // [USB: 0x60]
      0x69: { code: 'Numpad9', keyCap: '9', location: NUMPAD }, // [USB: 0x61]
      0x6A: { code: 'NumpadMultiply', keyCap: '*', location: NUMPAD }, // [USB: 0x55]
      0x6B: { code: 'NumpadAdd', keyCap: '+', location: NUMPAD }, // [USB: 0x57]
      0x6C: { code: 'NumpadComma', keyCap: ',', location: NUMPAD }, // [USB: 0x85]
      0x6D: { code: 'NumpadSubtract', keyCap: '-', location: NUMPAD }, // [USB: 0x56]
      0x6E: { code: 'NumpadDecimal', keyCap: '.', location: NUMPAD }, // [USB: 0x63]
      0x6F: { code: 'NumpadDivide', keyCap: '/', location: NUMPAD }, // [USB: 0x54]

      0x70: { code: 'F1' }, // [USB: 0x3a]
      0x71: { code: 'F2' }, // [USB: 0x3b]
      0x72: { code: 'F3' }, // [USB: 0x3c]
      0x73: { code: 'F4' }, // [USB: 0x3d]
      0x74: { code: 'F5' }, // [USB: 0x3e]
      0x75: { code: 'F6' }, // [USB: 0x3f]
      0x76: { code: 'F7' }, // [USB: 0x40]
      0x77: { code: 'F8' }, // [USB: 0x41]
      0x78: { code: 'F9' }, // [USB: 0x42]
      0x79: { code: 'F10' }, // [USB: 0x43]
      0x7A: { code: 'F11' }, // [USB: 0x44]
      0x7B: { code: 'F12' }, // [USB: 0x45]
      0x7C: { code: 'F13' }, // [USB: 0x68]
      0x7D: { code: 'F14' }, // [USB: 0x69]
      0x7E: { code: 'F15' }, // [USB: 0x6a]
      0x7F: { code: 'F16' }, // [USB: 0x6b]

      0x80: { code: 'F17' }, // [USB: 0x6c]
      0x81: { code: 'F18' }, // [USB: 0x6d]
      0x82: { code: 'F19' }, // [USB: 0x6e]
      0x83: { code: 'F20' }, // [USB: 0x6f]
      0x84: { code: 'F21' }, // [USB: 0x70]
      0x85: { code: 'F22' }, // [USB: 0x71]
      0x86: { code: 'F23' }, // [USB: 0x72]
      0x87: { code: 'F24' }, // [USB: 0x73]
      // 0x88-0x8F - unassigned

      0x90: { code: 'NumLock', location: NUMPAD }, // [USB: 0x53]
      0x91: { code: 'ScrollLock' }, // [USB: 0x47]
      // 0x92-0x96 - OEM specific
      // 0x97-0x9F - unassigned

      // NOTE: 0xA0-0xA5 usually mapped to 0x10-0x12 in browsers
      0xA0: { code: 'ShiftLeft', location: LEFT }, // [USB: 0xe1]
      0xA1: { code: 'ShiftRight', location: RIGHT }, // [USB: 0xe5]
      0xA2: { code: 'ControlLeft', location: LEFT }, // [USB: 0xe0]
      0xA3: { code: 'ControlRight', location: RIGHT }, // [USB: 0xe4]
      0xA4: { code: 'AltLeft', location: LEFT }, // [USB: 0xe2]
      0xA5: { code: 'AltRight', location: RIGHT }, // [USB: 0xe6]

      0xA6: { code: 'BrowserBack' }, // [USB: 0x0c/0x0224]
      0xA7: { code: 'BrowserForward' }, // [USB: 0x0c/0x0225]
      0xA8: { code: 'BrowserRefresh' }, // [USB: 0x0c/0x0227]
      0xA9: { code: 'BrowserStop' }, // [USB: 0x0c/0x0226]
      0xAA: { code: 'BrowserSearch' }, // [USB: 0x0c/0x0221]
      0xAB: { code: 'BrowserFavorites' }, // [USB: 0x0c/0x0228]
      0xAC: { code: 'BrowserHome' }, // [USB: 0x0c/0x0222]
      0xAD: { code: 'AudioVolumeMute' }, // [USB: 0x7f]
      0xAE: { code: 'AudioVolumeDown' }, // [USB: 0x81]
      0xAF: { code: 'AudioVolumeUp' }, // [USB: 0x80]

      0xB0: { code: 'MediaTrackNext' }, // [USB: 0x0c/0x00b5]
      0xB1: { code: 'MediaTrackPrevious' }, // [USB: 0x0c/0x00b6]
      0xB2: { code: 'MediaStop' }, // [USB: 0x0c/0x00b7]
      0xB3: { code: 'MediaPlayPause' }, // [USB: 0x0c/0x00cd]
      0xB4: { code: 'LaunchMail' }, // [USB: 0x0c/0x018a]
      0xB5: { code: 'MediaSelect' },
      0xB6: { code: 'LaunchApp1' },
      0xB7: { code: 'LaunchApp2' },
      // 0xB8-0xB9 - reserved
      0xBA: { code: 'Semicolon',  keyCap: ';' }, // [USB: 0x33] ;: (US Standard 101)
      0xBB: { code: 'Equal', keyCap: '=' }, // [USB: 0x2e] =+
      0xBC: { code: 'Comma', keyCap: ',' }, // [USB: 0x36] ,<
      0xBD: { code: 'Minus', keyCap: '-' }, // [USB: 0x2d] -_
      0xBE: { code: 'Period', keyCap: '.' }, // [USB: 0x37] .>
      0xBF: { code: 'Slash', keyCap: '/' }, // [USB: 0x38] /? (US Standard 101)

      0xC0: { code: 'Backquote', keyCap: '`' }, // [USB: 0x35] `~ (US Standard 101)
      // 0xC1-0xCF - reserved

      // 0xD0-0xD7 - reserved
      // 0xD8-0xDA - unassigned
      0xDB: { code: 'BracketLeft', keyCap: '[' }, // [USB: 0x2f] [{ (US Standard 101)
      0xDC: { code: 'Backslash',  keyCap: '\\' }, // [USB: 0x31] \| (US Standard 101)
      0xDD: { code: 'BracketRight', keyCap: ']' }, // [USB: 0x30] ]} (US Standard 101)
      0xDE: { code: 'Quote', keyCap: '\'' }, // [USB: 0x34] '" (US Standard 101)
      // 0xDF - miscellaneous/varies

      // 0xE0 - reserved
      // 0xE1 - OEM specific
      0xE2: { code: 'IntlBackslash',  keyCap: '\\' }, // [USB: 0x64] \| (UK Standard 102)
      // 0xE3-0xE4 - OEM specific
      0xE5: { code: 'Process' }, // (Not in D3E)
      // 0xE6 - OEM specific
      // 0xE7 - VK_PACKET
      // 0xE8 - unassigned
      // 0xE9-0xEF - OEM specific

      // 0xF0-0xF5 - OEM specific
      0xF6: { code: 'Attn' }, // [USB: 0x9a] (Not in D3E)
      0xF7: { code: 'CrSel' }, // [USB: 0xa3] (Not in D3E)
      0xF8: { code: 'ExSel' }, // [USB: 0xa4] (Not in D3E)
      0xF9: { code: 'EraseEof' }, // (Not in D3E)
      0xFA: { code: 'Play' }, // (Not in D3E)
      0xFB: { code: 'ZoomToggle' }, // (Not in D3E)
      // 0xFC - VK_NONAME - reserved
      // 0xFD - VK_PA1
      0xFE: { code: 'Clear' } // [USB: 0x9c] (Not in D3E)
    };

    // No legacy keyCode, but listed in D3E:

    // code: usb
    // 'IntlHash': 0x070032,
    // 'IntlRo': 0x070087,
    // 'IntlYen': 0x070089,
    // 'NumpadBackspace': 0x0700bb,
    // 'NumpadClear': 0x0700d8,
    // 'NumpadClearEntry': 0x0700d9,
    // 'NumpadMemoryAdd': 0x0700d3,
    // 'NumpadMemoryClear': 0x0700d2,
    // 'NumpadMemoryRecall': 0x0700d1,
    // 'NumpadMemoryStore': 0x0700d0,
    // 'NumpadMemorySubtract': 0x0700d4,
    // 'NumpadParenLeft': 0x0700b6,
    // 'NumpadParenRight': 0x0700b7,

    //--------------------------------------------------------------------
    //
    // Browser/OS Specific Mappings
    //
    //--------------------------------------------------------------------

    mergeIf(keyCodeToInfoTable,
            'moz', {
              0x3B: { code: 'Semicolon', keyCap: ';' }, // [USB: 0x33] ;: (US Standard 101)
              0x3D: { code: 'Equal', keyCap: '=' }, // [USB: 0x2e] =+
              0x6B: { code: 'Equal', keyCap: '=' }, // [USB: 0x2e] =+
              0x6D: { code: 'Minus', keyCap: '-' }, // [USB: 0x2d] -_
              0xBB: { code: 'NumpadAdd', keyCap: '+', location: NUMPAD }, // [USB: 0x57]
              0xBD: { code: 'NumpadSubtract', keyCap: '-', location: NUMPAD } // [USB: 0x56]
            });

    mergeIf(keyCodeToInfoTable,
            'moz-mac', {
              0x0C: { code: 'NumLock', location: NUMPAD }, // [USB: 0x53]
              0xAD: { code: 'Minus', keyCap: '-' } // [USB: 0x2d] -_
            });

    mergeIf(keyCodeToInfoTable,
            'moz-win', {
              0xAD: { code: 'Minus', keyCap: '-' } // [USB: 0x2d] -_
            });

    mergeIf(keyCodeToInfoTable,
            'chrome-mac', {
              0x5D: { code: 'MetaRight', location: RIGHT } // [USB: 0xe7]
            });

    // Windows via Bootcamp (!)
    if (0) {
      mergeIf(keyCodeToInfoTable,
              'chrome-win', {
                0xC0: { code: 'Quote', keyCap: '\'' }, // [USB: 0x34] '" (US Standard 101)
                0xDE: { code: 'Backslash',  keyCap: '\\' }, // [USB: 0x31] \| (US Standard 101)
                0xDF: { code: 'Backquote', keyCap: '`' } // [USB: 0x35] `~ (US Standard 101)
              });

      mergeIf(keyCodeToInfoTable,
              'ie', {
                0xC0: { code: 'Quote', keyCap: '\'' }, // [USB: 0x34] '" (US Standard 101)
                0xDE: { code: 'Backslash',  keyCap: '\\' }, // [USB: 0x31] \| (US Standard 101)
                0xDF: { code: 'Backquote', keyCap: '`' } // [USB: 0x35] `~ (US Standard 101)
              });
    }

    mergeIf(keyCodeToInfoTable,
            'safari', {
              0x03: { code: 'Enter' }, // [USB: 0x28] old Safari
              0x19: { code: 'Tab' } // [USB: 0x2b] old Safari for Shift+Tab
            });

    mergeIf(keyCodeToInfoTable,
            'ios', {
              0x0A: { code: 'Enter', location: STANDARD } // [USB: 0x28]
            });

    mergeIf(keyCodeToInfoTable,
            'safari-mac', {
              0x5B: { code: 'MetaLeft', location: LEFT }, // [USB: 0xe3]
              0x5D: { code: 'MetaRight', location: RIGHT }, // [USB: 0xe7]
              0xE5: { code: 'KeyQ', keyCap: 'Q' } // [USB: 0x14] On alternate presses, Ctrl+Q sends this
            });

    //--------------------------------------------------------------------
    //
    // Identifier Mappings
    //
    //--------------------------------------------------------------------

    // Cases where newer-ish browsers send keyIdentifier which can be
    // used to disambiguate keys.

    // keyIdentifierTable[keyIdentifier] -> keyInfo

    var keyIdentifierTable = {};
    if ('cros' === os) {
      keyIdentifierTable['U+00A0'] = { code: 'ShiftLeft', location: LEFT };
      keyIdentifierTable['U+00A1'] = { code: 'ShiftRight', location: RIGHT };
      keyIdentifierTable['U+00A2'] = { code: 'ControlLeft', location: LEFT };
      keyIdentifierTable['U+00A3'] = { code: 'ControlRight', location: RIGHT };
      keyIdentifierTable['U+00A4'] = { code: 'AltLeft', location: LEFT };
      keyIdentifierTable['U+00A5'] = { code: 'AltRight', location: RIGHT };
    }
    if ('chrome-mac' === browser_os) {
      keyIdentifierTable['U+0010'] = { code: 'ContextMenu' };
    }
    if ('safari-mac' === browser_os) {
      keyIdentifierTable['U+0010'] = { code: 'ContextMenu' };
    }
    if ('ios' === os) {
      // These only generate keyup events
      keyIdentifierTable['U+0010'] = { code: 'Function' };

      keyIdentifierTable['U+001C'] = { code: 'ArrowLeft' };
      keyIdentifierTable['U+001D'] = { code: 'ArrowRight' };
      keyIdentifierTable['U+001E'] = { code: 'ArrowUp' };
      keyIdentifierTable['U+001F'] = { code: 'ArrowDown' };

      keyIdentifierTable['U+0001'] = { code: 'Home' }; // [USB: 0x4a] Fn + ArrowLeft
      keyIdentifierTable['U+0004'] = { code: 'End' }; // [USB: 0x4d] Fn + ArrowRight
      keyIdentifierTable['U+000B'] = { code: 'PageUp' }; // [USB: 0x4b] Fn + ArrowUp
      keyIdentifierTable['U+000C'] = { code: 'PageDown' }; // [USB: 0x4e] Fn + ArrowDown
    }

    //--------------------------------------------------------------------
    //
    // Location Mappings
    //
    //--------------------------------------------------------------------

    // Cases where newer-ish browsers send location/keyLocation which
    // can be used to disambiguate keys.

    // locationTable[location][keyCode] -> keyInfo
    var locationTable = [];
    locationTable[LEFT] = {
      0x10: { code: 'ShiftLeft', location: LEFT }, // [USB: 0xe1]
      0x11: { code: 'ControlLeft', location: LEFT }, // [USB: 0xe0]
      0x12: { code: 'AltLeft', location: LEFT } // [USB: 0xe2]
    };
    locationTable[RIGHT] = {
      0x10: { code: 'ShiftRight', location: RIGHT }, // [USB: 0xe5]
      0x11: { code: 'ControlRight', location: RIGHT }, // [USB: 0xe4]
      0x12: { code: 'AltRight', location: RIGHT } // [USB: 0xe6]
    };
    locationTable[NUMPAD] = {
      0x0D: { code: 'NumpadEnter', location: NUMPAD } // [USB: 0x58]
    };

    mergeIf(locationTable[NUMPAD], 'moz', {
      0x6D: { code: 'NumpadSubtract', location: NUMPAD }, // [USB: 0x56]
      0x6B: { code: 'NumpadAdd', location: NUMPAD } // [USB: 0x57]
    });
    mergeIf(locationTable[LEFT], 'moz-mac', {
      0xE0: { code: 'MetaLeft', location: LEFT } // [USB: 0xe3]
    });
    mergeIf(locationTable[RIGHT], 'moz-mac', {
      0xE0: { code: 'MetaRight', location: RIGHT } // [USB: 0xe7]
    });
    mergeIf(locationTable[RIGHT], 'moz-win', {
      0x5B: { code: 'MetaRight', location: RIGHT } // [USB: 0xe7]
    });


    mergeIf(locationTable[RIGHT], 'mac', {
      0x5D: { code: 'MetaRight', location: RIGHT } // [USB: 0xe7]
    });

    mergeIf(locationTable[NUMPAD], 'chrome-mac', {
      0x0C: { code: 'NumLock', location: NUMPAD } // [USB: 0x53]
    });

    mergeIf(locationTable[NUMPAD], 'safari-mac', {
      0x0C: { code: 'NumLock', location: NUMPAD }, // [USB: 0x53]
      0xBB: { code: 'NumpadAdd', location: NUMPAD }, // [USB: 0x57]
      0xBD: { code: 'NumpadSubtract', location: NUMPAD }, // [USB: 0x56]
      0xBE: { code: 'NumpadDecimal', location: NUMPAD }, // [USB: 0x63]
      0xBF: { code: 'NumpadDivide', location: NUMPAD } // [USB: 0x54]
    });


    //--------------------------------------------------------------------
    //
    // Key Values
    //
    //--------------------------------------------------------------------

    // Mapping from `code` values to `key` values. Values defined at:
    // https://w3c.github.io/uievents-key/
    // Entries are only provided when `key` differs from `code`. If
    // printable, `shiftKey` has the shifted printable character. This
    // assumes US Standard 101 layout

    var codeToKeyTable = {
      // Modifier Keys
      ShiftLeft: { key: 'Shift' },
      ShiftRight: { key: 'Shift' },
      ControlLeft: { key: 'Control' },
      ControlRight: { key: 'Control' },
      AltLeft: { key: 'Alt' },
      AltRight: { key: 'Alt' },
      MetaLeft: { key: 'Meta' },
      MetaRight: { key: 'Meta' },

      // Whitespace Keys
      NumpadEnter: { key: 'Enter' },
      Space: { key: ' ' },

      // Printable Keys
      Digit0: { key: '0', shiftKey: ')' },
      Digit1: { key: '1', shiftKey: '!' },
      Digit2: { key: '2', shiftKey: '@' },
      Digit3: { key: '3', shiftKey: '#' },
      Digit4: { key: '4', shiftKey: '$' },
      Digit5: { key: '5', shiftKey: '%' },
      Digit6: { key: '6', shiftKey: '^' },
      Digit7: { key: '7', shiftKey: '&' },
      Digit8: { key: '8', shiftKey: '*' },
      Digit9: { key: '9', shiftKey: '(' },
      KeyA: { key: 'a', shiftKey: 'A' },
      KeyB: { key: 'b', shiftKey: 'B' },
      KeyC: { key: 'c', shiftKey: 'C' },
      KeyD: { key: 'd', shiftKey: 'D' },
      KeyE: { key: 'e', shiftKey: 'E' },
      KeyF: { key: 'f', shiftKey: 'F' },
      KeyG: { key: 'g', shiftKey: 'G' },
      KeyH: { key: 'h', shiftKey: 'H' },
      KeyI: { key: 'i', shiftKey: 'I' },
      KeyJ: { key: 'j', shiftKey: 'J' },
      KeyK: { key: 'k', shiftKey: 'K' },
      KeyL: { key: 'l', shiftKey: 'L' },
      KeyM: { key: 'm', shiftKey: 'M' },
      KeyN: { key: 'n', shiftKey: 'N' },
      KeyO: { key: 'o', shiftKey: 'O' },
      KeyP: { key: 'p', shiftKey: 'P' },
      KeyQ: { key: 'q', shiftKey: 'Q' },
      KeyR: { key: 'r', shiftKey: 'R' },
      KeyS: { key: 's', shiftKey: 'S' },
      KeyT: { key: 't', shiftKey: 'T' },
      KeyU: { key: 'u', shiftKey: 'U' },
      KeyV: { key: 'v', shiftKey: 'V' },
      KeyW: { key: 'w', shiftKey: 'W' },
      KeyX: { key: 'x', shiftKey: 'X' },
      KeyY: { key: 'y', shiftKey: 'Y' },
      KeyZ: { key: 'z', shiftKey: 'Z' },
      Numpad0: { key: '0' },
      Numpad1: { key: '1' },
      Numpad2: { key: '2' },
      Numpad3: { key: '3' },
      Numpad4: { key: '4' },
      Numpad5: { key: '5' },
      Numpad6: { key: '6' },
      Numpad7: { key: '7' },
      Numpad8: { key: '8' },
      Numpad9: { key: '9' },
      NumpadMultiply: { key: '*' },
      NumpadAdd: { key: '+' },
      NumpadComma: { key: ',' },
      NumpadSubtract: { key: '-' },
      NumpadDecimal: { key: '.' },
      NumpadDivide: { key: '/' },
      Semicolon: { key: ';', shiftKey: ':' },
      Equal: { key: '=', shiftKey: '+' },
      Comma: { key: ',', shiftKey: '<' },
      Minus: { key: '-', shiftKey: '_' },
      Period: { key: '.', shiftKey: '>' },
      Slash: { key: '/', shiftKey: '?' },
      Backquote: { key: '`', shiftKey: '~' },
      BracketLeft: { key: '[', shiftKey: '{' },
      Backslash: { key: '\\', shiftKey: '|' },
      BracketRight: { key: ']', shiftKey: '}' },
      Quote: { key: '\'', shiftKey: '"' },
      IntlBackslash: { key: '\\', shiftKey: '|' }
    };

    mergeIf(codeToKeyTable, 'mac', {
      MetaLeft: { key: 'Meta' },
      MetaRight: { key: 'Meta' }
    });

    // Corrections for 'key' names in older browsers (e.g. FF36-, IE9, etc)
    // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent.key#Key_values
    var keyFixTable = {
      Add: '+',
      Decimal: '.',
      Divide: '/',
      Subtract: '-',
      Multiply: '*',
      Spacebar: ' ',
      Esc: 'Escape',
      Nonconvert: 'NonConvert',
      Left: 'ArrowLeft',
      Up: 'ArrowUp',
      Right: 'ArrowRight',
      Down: 'ArrowDown',
      Del: 'Delete',
      Menu: 'ContextMenu',
      MediaNextTrack: 'MediaTrackNext',
      MediaPreviousTrack: 'MediaTrackPrevious',
      SelectMedia: 'MediaSelect',
      HalfWidth: 'Hankaku',
      FullWidth: 'Zenkaku',
      RomanCharacters: 'Romaji',
      Crsel: 'CrSel',
      Exsel: 'ExSel',
      Zoom: 'ZoomToggle'
    };

    //--------------------------------------------------------------------
    //
    // Exported Functions
    //
    //--------------------------------------------------------------------


    var codeTable = remap(keyCodeToInfoTable, 'code');

    try {
      var nativeLocation = nativeKeyboardEvent && ('location' in new KeyboardEvent(''));
    } catch (_) {}

    function keyInfoForEvent(event) {
      var keyCode = 'keyCode' in event ? event.keyCode : 'which' in event ? event.which : 0;
      var keyInfo = (function(){
        if (nativeLocation || 'keyLocation' in event) {
          var location = nativeLocation ? event.location : event.keyLocation;
          if (location && keyCode in locationTable[location]) {
            return locationTable[location][keyCode];
          }
        }
        if ('keyIdentifier' in event && event.keyIdentifier in keyIdentifierTable) {
          return keyIdentifierTable[event.keyIdentifier];
        }
        if (keyCode in keyCodeToInfoTable) {
          return keyCodeToInfoTable[keyCode];
        }
        return null;
      }());

      // TODO: Track these down and move to general tables
      if (0) {
        // TODO: Map these for newerish browsers?
        // TODO: iOS only?
        // TODO: Override with more common keyIdentifier name?
        switch (event.keyIdentifier) {
        case 'U+0010': keyInfo = { code: 'Function' }; break;
        case 'U+001C': keyInfo = { code: 'ArrowLeft' }; break;
        case 'U+001D': keyInfo = { code: 'ArrowRight' }; break;
        case 'U+001E': keyInfo = { code: 'ArrowUp' }; break;
        case 'U+001F': keyInfo = { code: 'ArrowDown' }; break;
        }
      }

      if (!keyInfo)
        return null;

      var key = (function() {
        var entry = codeToKeyTable[keyInfo.code];
        if (!entry) return keyInfo.code;
        return (event.shiftKey && 'shiftKey' in entry) ? entry.shiftKey : entry.key;
      }());

      return {
        code: keyInfo.code,
        key: key,
        location: keyInfo.location,
        keyCap: keyInfo.keyCap
      };
    }

    function queryKeyCap(code, locale) {
      code = String(code);
      if (!codeTable.hasOwnProperty(code)) return 'Undefined';
      if (locale && String(locale).toLowerCase() !== 'en-us') throw Error('Unsupported locale');
      var keyInfo = codeTable[code];
      return keyInfo.keyCap || keyInfo.code || 'Undefined';
    }

    if ('KeyboardEvent' in global && 'defineProperty' in Object) {
      (function() {
        function define(o, p, v) {
          if (p in o) return;
          Object.defineProperty(o, p, v);
        }

        define(KeyboardEvent.prototype, 'code', { get: function() {
          var keyInfo = keyInfoForEvent(this);
          return keyInfo ? keyInfo.code : '';
        }});

        // Fix for nonstandard `key` values (FF36-)
        if ('key' in KeyboardEvent.prototype) {
          var desc = Object.getOwnPropertyDescriptor(KeyboardEvent.prototype, 'key');
          Object.defineProperty(KeyboardEvent.prototype, 'key', { get: function() {
            var key = desc.get.call(this);
            return keyFixTable.hasOwnProperty(key) ? keyFixTable[key] : key;
          }});
        }

        define(KeyboardEvent.prototype, 'key', { get: function() {
          var keyInfo = keyInfoForEvent(this);
          return (keyInfo && 'key' in keyInfo) ? keyInfo.key : 'Unidentified';
        }});

        define(KeyboardEvent.prototype, 'location', { get: function() {
          var keyInfo = keyInfoForEvent(this);
          return (keyInfo && 'location' in keyInfo) ? keyInfo.location : STANDARD;
        }});

        define(KeyboardEvent.prototype, 'locale', { get: function() {
          return '';
        }});
      }());
    }

    if (!('queryKeyCap' in global.KeyboardEvent))
      global.KeyboardEvent.queryKeyCap = queryKeyCap;

    // Helper for IE8-
    global.identifyKey = function(event) {
      if ('code' in event)
        return;

      var keyInfo = keyInfoForEvent(event);
      event.code = keyInfo ? keyInfo.code : '';
      event.key = (keyInfo && 'key' in keyInfo) ? keyInfo.key : 'Unidentified';
      event.location = ('location' in event) ? event.location :
        ('keyLocation' in event) ? event.keyLocation :
        (keyInfo && 'location' in keyInfo) ? keyInfo.location : STANDARD;
      event.locale = '';
    };

  }(self));

/* global Howler Howl */
(function () {
    ct.sound = {};
    ct.sound.howler = Howler;
    Howler.orientation(0, -1, 0, 0, 0, 1);
    Howler.pos(0, 0, 0);
    ct.sound.howl = Howl;

    var defaultMaxDistance = [][0] || 2500;
    ct.sound.useDepth = [false][0] === void 0? false : [false][0];
    ct.sound.manageListenerPosition = [false][0] === void 0? true : [false][0];

    /**
     * Detects if a particular codec is supported in the system
     * @param {string} type One of: "mp3", "mpeg", "opus", "ogg", "oga", "wav", "aac", "caf", m4a", "mp4", "weba", "webm", "dolby", "flac".
     * @returns {boolean} true/false
     */
    ct.sound.detect = Howler.codecs;

    /**
     * Creates a new Sound object and puts it in resource object
     *
     * @param {string} name Sound's name
     * @param {object} formats A collection of sound files of specified extension, in format `extension: path`
     * @param {string} [formats.ogg] Local path to the sound in ogg format
     * @param {string} [formats.wav] Local path to the sound in wav format
     * @param {string} [formats.mp3] Local path to the sound in mp3 format
     * @param {object} options An options object
     *
     * @returns {object} Sound's object
     */
    ct.sound.init = function (name, formats, options) {
        options = options || {};
        var sounds = [];
        if (formats.wav && formats.wav.slice(-4) === '.wav') {
            sounds.push(formats.wav);
        }
        if (formats.mp3 && formats.mp3.slice(-4) === '.mp3') {
            sounds.push(formats.mp3);
        }
        if (formats.ogg && formats.ogg.slice(-4) === '.ogg') {
            sounds.push(formats.ogg);
        }
        var howl = new Howl({
            src: sounds,
            autoplay: false,
            preload: !options.music,
            html5: Boolean(options.music),
            loop: options.loop,
            pool: options.poolSize || 5,

            onload: function () {
                if (!options.music) {
                    ct.res.soundsLoaded++;
                }
            },
            onloaderror: function () {
                ct.res.soundsError++;
                howl.buggy = true;
                console.error('[ct.sound.howler] Oh no! We couldn\'t load ' +
                    (formats.wav || formats.mp3 || formats.ogg) + '!');
            }
        });
        if (options.music) {
            ct.res.soundsLoaded++;
        }
        ct.res.sounds[name] = howl;
    };

    var set3Dparameters = (howl, opts, id) => {
        howl.pannerAttr({
            coneInnerAngle: opts.coneInnerAngle || 360,
            coneOuterAngle: opts.coneOuterAngle || 360,
            coneOuterGain: opts.coneOuterGain || 1,
            distanceModel: opts.distanceModel || 'linear',
            maxDistance: opts.maxDistance || defaultMaxDistance,
            refDistance: opts.refDistance || 1,
            rolloffFactor: opts.rolloffFactor || 1,
            panningModel: opts.panningModel || 'HRTF',
        }, id);
    };
    /**
     * Spawns a new sound and plays it.
     *
     * @param {string} name The name of a sound to be played
     * @param {object} [opts] Options object.
     * @param {Function} [cb] A callback, which is called when the sound finishes playing
     *
     * @returns {number} The ID of the created sound. This can be passed to Howler methods.
     */
    ct.sound.spawn = function(name, opts, cb) {
        opts = opts || {};
        if (typeof opts === 'function') {
            cb = opts;
            opts = {};
        }
        var howl = ct.res.sounds[name];
        var id = howl.play();
        if (opts.loop) {
            howl.loop(true, id);
        }
        if (opts.volume !== void 0) {
            howl.volume(opts.volume, id);
        }
        if (opts.rate !== void 0) {
            howl.rate(opts.rate, id);
        }
        if (opts.x !== void 0 || opts.position) {
            if (opts.x !== void 0) {
                howl.pos(opts.x, opts.y || 0, opts.z || 0, id);
            } else {
                const copy = opts.position;
                howl.pos(copy.x, copy.y, opts.z || (ct.sound.useDepth? copy.depth : 0), id);
            }
            set3Dparameters(howl, opts, id);
        }
        if (cb) {
            howl.once('end', cb, id);
        }
        return id;
    };

    /**
     * Stops playback of a sound, resetting its time to 0.
     *
     * @param {string} name The name of a sound
     * @param {number} [id] An optional ID of a particular sound
     * @returns {void}
     */
    ct.sound.stop = function(name, id) {
        ct.res.sounds[name].stop(id);
    };

    /**
     * Pauses playback of a sound or group, saving the seek of playback.
     *
     * @param {string} name The name of a sound
     * @param {number} [id] An optional ID of a particular sound
     * @returns {void}
     */
    ct.sound.pause = function(name, id) {
        ct.res.sounds[name].pause(id);
    };

    /**
     * Resumes a given sound, e.g. after pausing it.
     *
     * @param {string} name The name of a sound
     * @param {number} [id] An optional ID of a particular sound
     * @returns {void}
     */
    ct.sound.resume = function(name, id) {
        ct.res.sounds[name].play(id);
    };
    /**
     * Returns whether a sound is currently playing,
     * either an exact sound (found by its ID) or any sound of a given name.
     *
     * @param {string} name The name of a sound
     * @param {number} [id] An optional ID of a particular sound
     * @returns {boolean} `true` if the sound is playing, `false` otherwise.
     */
    ct.sound.playing = function(name, id) {
        return ct.res.sounds[name].playing(id);
    };
    /**
     * Preloads a sound. This is usually applied to music files before playing
     * as they are not preloaded by default.
     *
     * @param {string} name The name of a sound
     * @returns {void}
     */
    ct.sound.load = function(name) {
        ct.res.sounds[name].load();
    };


    /**
     * Changes/returns the volume of the given sound.
     *
     * @param {string} name The name of a sound to affect.
     * @param {number} [volume] The new volume from `0.0` to `1.0`. If empty, will return the existing volume.
     * @param {number} [id] If specified, then only the given sound instance is affected.
     *
     * @returns {number} The current volume of the sound.
     */
    ct.sound.volume = function (name, volume, id) {
        return ct.res.sounds[name].volume(volume, id);
    };

    /**
     * Fades a sound to a given volume. Can affect either a specific instance or the whole group.
     *
     * @param {string} name The name of a sound to affect.
     * @param {number} newVolume The new volume from `0.0` to `1.0`.
     * @param {number} duration The duration of transition, in milliseconds.
     * @param {number} [id] If specified, then only the given sound instance is affected.
     *
     * @returns {void}
     */
    ct.sound.fade = function(name, newVolume, duration, id) {
        var howl = ct.res.sounds[name],
            oldVolume = id? howl.volume(id) : howl.volume;
        howl.fade(oldVolume, newVolume, duration, id);
    };

    /**
     * Moves the 3D listener to a new position.
     *
     * @see https://github.com/goldfire/howler.js#posx-y-z
     *
     * @param {number} x The new x coordinate
     * @param {number} y The new y coordinate
     * @param {number} [z] The new z coordinate
     *
     * @returns {void}
     */
    ct.sound.moveListener = function(x, y, z) {
        Howler.pos(x, y, z || 0);
    };

    /**
     * Moves a 3D sound to a new location
     *
     * @param {string} name The name of a sound to move
     * @param {number} id The ID of a particular sound. Pass `null` if you want to affect all the sounds of a given name.
     * @param {number} x The new x coordinate
     * @param {number} y The new y coordinate
     * @param {number} [z] The new z coordinate
     *
     * @returns {void}
     */
    ct.sound.position = function(name, id, x, y, z) {
        var howl = ct.res.sounds[name],
            oldPosition = howl.pos(id);
        howl.pos(x, y, z || oldPosition[2], id);
    };

    /**
     * Get/set the global volume for all sounds, relative to their own volume.
     * @param {number} [volume] The new volume from `0.0` to `1.0`. If omitted, will return the current global volume.
     *
     * @returns {number} The current volume.
     */
    ct.sound.globalVolume = Howler.volume.bind(Howler);

    ct.sound.exists = function(name) {
        return (name in ct.res.sounds);
    };
})();


/* global ct */

ct.random = function (x) {
    return Math.random()*x;
};
ct.u.ext(ct.random,{
    dice() {
        return arguments[Math.floor(Math.random() * arguments.length)];
    },
    range(x1, x2) {
        return x1 + Math.random() * (x2-x1);
    },
    deg() {
        return Math.random()*360;
    },
    coord() {
        return [Math.floor(Math.random()*ct.width),Math.floor(Math.random()*ct.height)];
    },
    chance(x, y) {
        if (y) {
            return (Math.random()*y < x);
        }
        return (Math.random()*100 < x);
    },
    from(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
});

let cursor = null;

let overlay = null;

let introPopup = null;
let introLbl = null;

let tileToKill = null; //tile to remove when you build on it

let idleLabel;
let workersLabel = { wood: null, food: null, herb: null, cure: null };

let statsLabel = new PIXI.Text();
statsLabel.resolution = 2;
statsLabel.x = 3;
statsLabel.y = 0;

let botBar = new PIXI.Text();
botBar.resolution = 2;
botBar.x = 3;
botBar.y = 0;
//resources amount
let res = {
    pop: 5,
    wood: 0,
    food: 0,
    herb: 0,
    cure: 0
}

function getPop() {
    return res.pop;
}

let capacity = {
    pop: 5,
    wood: getPop(),
    food: 5,
    herb: getPop(),
    cure: 0
}

//workers on a job
let job = {
    wood: 0,
    food: 0,
    herb: 0,
    cure: 0
}

//production of one worker per turn
let prod = {
    wood: 3,
    food: 3,
    herb: 2,
    cure: 1
}

//buildings cost
let cost = {
    townCenter: 40,
    house: 30,
    farm: 30,
    temple: 30,
    bridge: 5
}

//buildings bonus
let buildingEffect = {
    house: 5,//+5 pop capacity
    farm: 5,//+5 food capacity
    temple: 5,//+5 cure capacity
}

let herbToCure = 4;

let reputation = 0;

let turn = 1;

let treeWood = 20;// one tree = 20 wood
let cutWood = 0;

function setStatsTopBar() {
    statsLabel.text = "Pop: " + res.pop + "/" + capacity.pop + " | Food: " + res.food + " | Wood: " + res.wood + " | Herb: " + res.herb + " | Cure: " + res.cure + " | Plague: " + ct.types.list.Plague.length + " | Reputation: " + getReputation() + "/10 | Turn: " + turn;
}

function checkIfGameOver() {
    if(res.pop <= 0) {
        res.pop = 0;
        setStatsTopBar();
        let x = ct.room.x;
        let y = ct.room.y;
        overlay = ct.types.copy("Overlay", x, y);
        let gameover = ct.types.copy("GameOver", 0, y + 30);
        gameover.x = x + ((ct.viewWidth - gameover.width) / 2);
        let gameoverlbl = new PIXI.Text("- G A M E  O V E R -\nYou lasted "+ turn + " turns.", ct.styles.get('StatsCenter'));
        gameoverlbl.resolution = 2;
        gameoverlbl.x = 15;
        gameoverlbl.y = 15;
        gameover.addChild(gameoverlbl);
        ct.sound.spawn("gameover");
    }
}

function getReputation() {

    let reputation = 0;

    //House space
    let housing = capacity.pop - res.pop;
    if(housing === 0) {
        reputation--;
    }
    else if(housing > 0 && housing < 5) {
        reputation++;
    }
    else if(housing > 5) {
        reputation += 2;
    }
    // else if(housing === 5) {
    //     reputation += 2;
    // }
    // else if(housing > 5) {
    //     reputation += 3
    // }

    //Food stock (comparing to pop)
    let foodStock = res.food;
    let pop = res.pop;
    if(foodStock === 0) {
        reputation -= 2;
    }
    else if(foodStock < pop) {
        reputation--;
    }
    else if(foodStock > pop && foodStock < pop * 2) {
        reputation++;
    }
    else if(foodStock >= pop * 2) {
        reputation += 2;
    }
    else if(foodStock >= pop * 3) {
        reputation += 3;
    }

    //Cure stock (comparing to plague)
    if(turn > 30) {
        let plagues = ct.types.list.Plague.length;
        let cureStock = res.cure - plagues;
        if(cureStock < 0) {
            reputation--;
        }
        else if(cureStock > plagues && cureStock < plagues * 2) {
            reputation++;
        }
        else if(cureStock >= plagues * 2) {
            reputation += 2;
        }
        else if(cureStock >= plagues * 3) {
            reputation += 3;
        }
    }

    //TODO: malus if ppl die of plague

    if(reputation < 0) {
        reputation = 0;
    }
    else if(reputation > 10) {
        reputation = 10;
    }
    return reputation;
}

function chanceOfPopGrow() {
    return ct.random.chance(getReputation() * 10);
}

function endTurn() {
    ct.sound.spawn("endturn");
    ct.sound.volume("endturn", 0.3);
    turn++;
    let availableTrees = getWoodableTrees().length;

    //Prod:
    for(resource in prod) {
        if(resource === "wood") {
            if(availableTrees > 0) {
                res[resource] += prod[resource] * job[resource];
            }
        }
        else {
            res[resource] += prod[resource] * job[resource];
        }
    }
    //Each pop eat 1 food by turn:
    res.food -= res.pop;
    if(res.food <= 0) {
        res.food = 0;
        res.pop--; //-1 pop if no food

        //Remove that ppl from workers
        let jobsWithWorker = getJobsWithWorker();
        const jobsWithWorkerL = Object.keys(jobsWithWorker).length;
        let resource;
        let ran;
        if(jobsWithWorkerL > 0) {
            if(jobsWithWorkerL === 1)
            {
                ran = 0;
            }
            else {
                ran = Math.floor((Math.random() * jobsWithWorkerL));

            }
            resource = Object.keys(jobsWithWorker)[ran];
            job[resource]--;
            updateWorkerLabel(resource);
        }
        idleLabel.text = getIdle();
        checkIfGameOver();
    }
    //Each "shaman" use X herbs by turn to create 1 cure:
    res.herb -= job.cure * herbToCure;
    if(res.herb < 0) {
        let delta = res.herb;
        res.herb = 0;
        //Remove cure that cant have been created:
        res.cure -= Math.round(delta / herbToCure);
    }

    //Remove cut trees
    cutWood += (prod.wood * job.wood);
    if(cutWood >= treeWood) {
        let neededTrees = Math.floor(cutWood / treeWood);
        cutWood = cutWood % treeWood; //rest
        if(availableTrees >= neededTrees && neededTrees > 0 && availableTrees > 0) {
            cutTree(neededTrees);
        }
        //TODO: test later
        // else {
        //     let uncutTrees = neededTrees - availableTrees;
        //     if(uncutTrees > 0) {
        //         cutTree(availableTrees);
        //         //Remove wood that cant have been cut:
        //         res.wood -= uncutTrees * treeWood; //TODO: test later
        //     }
        // }
    }

    //Remove cut trees
    // console.log("wood that will be cut ", prod.wood * job.wood)
    // let neededTrees = Math.floor((prod.wood * job.wood) / treeWood);
    // console.log("neededTrees", neededTrees)
    // let availableTrees = getWoodableTrees().length;
    // if(availableTrees >= neededTrees && neededTrees > 0) {
    //     cutTree(neededTrees);
    // }
    // else {
    //     let uncutTrees = neededTrees - availableTrees;
    //     if(uncutTrees > 0) {
    //         cutTree(availableTrees);
    //         //Remove wood that cant have been cut:
    //         res.wood -= uncutTrees * treeWood; //TODO: test later
    //     }
    // }

    //Old pop grow
    // if(res.pop < capacity.pop && res.food > 0 && (turn % 5 === 0)) {
    //     res.pop++;
    //     idleLabel.text = getIdle();
    //     capacity.wood = getPop();
    //     capacity.herb = getPop();
    //     updateWorkerLabel("wood");
    //     updateWorkerLabel("herb");
    // }
    //New pop grow
    if(res.pop < capacity.pop && res.food > 0 && chanceOfPopGrow()) {
        res.pop++;
        idleLabel.text = getIdle();
        capacity.wood = getPop();
        capacity.herb = getPop();
        updateWorkerLabel("wood");
        updateWorkerLabel("herb");
        ct.sound.spawn("gainPop");
        ct.sound.volume("endturn", 0.3);
    }

    if(turn % 5 === 0) {
        yersiniaProgress();
        yersiniaSpawn();
    }

    if(ct.types.list.Plague.length > 0) {
        let hecatomb = blackDeath();
        if(hecatomb.total > 0) {
            ct.sound.spawn("plagueOnBuilding");
            for(dead in hecatomb) {
                if(dead === "total") {
                    res.pop -= hecatomb.total;
                }
                else {
                    job[dead] -= hecatomb[dead];
                    if(job[dead] < 0) {
                        job[dead] = 0;
                    }
                    updateWorkerLabel(dead);
                }
            }
        }
    }

    idleLabel.text = getIdle();

    setStatsTopBar();

    checkIfGameOver();

};
function getIdle() {
    let busy = 0;
    let idle;
    for(resource in job) {
        busy += job[resource];
    }
    idle = res.pop - busy
    if(idle < 0) {
        idle = 0;
    }
    return idle;
}

function updateWorkerLabel(resource) {
    workersLabel[resource].text = job[resource] + "/" + capacity[resource];
}

function getJobsWithWorker() {
    let jobsWithWorker = {};
    for(j in job) {
        if(job[j] > 0) {
            jobsWithWorker[j] = job[j];
        }
    }
    return jobsWithWorker;
}

function setWorkers(resource, val) {

    ct.sound.spawn("worker");
    ct.sound.volume("worker", 0.3);

    let res = job[resource] + 1;
    if(val === 0) {
        job[resource] = 0;
    }
    else if (val === -1 && job[resource] >= 1) {
        job[resource]--;
    }
    else if (val === 1 && getIdle() > 0 && res <= capacity[resource]) {
        job[resource]++;
    }

    updateWorkerLabel(resource);

    idleLabel.text = getIdle();
}

function workersOnCreate(copy) {

    copy.onStep = function() { workersOnStep(copy) };

    let lbl = new PIXI.Text(copy.label);
    lbl.resolution = 2;
    lbl.x = 2
    lbl.style = ct.styles.get('Stats');
    copy.addChild(lbl);

    workersLabel[copy.resource] = new PIXI.Text(job[copy.resource] + "/" + capacity[copy.resource]);
    workersLabel[copy.resource].resolution = 2;
    workersLabel[copy.resource].x = 2;
    workersLabel[copy.resource].y = 6;
    workersLabel[copy.resource].style = ct.styles.get('Stats');
    copy.addChild(workersLabel[copy.resource]);
}

function workersOnStep(copy)
{
    if(ct.mouse.hovers(copy) && overlay === null) {
        let msg;
        switch(copy.resource) {
            case "food":
                msg = "1 worker produces " + prod.food + " food per turn. Each people consume 1 food per turn. Without food, pop decrease.";
            break;
            case "wood":
                msg = "1 worker produces " + prod.wood + " wood per turn. Wood is needed for buildings and bridges.";
            break;
            case "herb":
                msg = "1 worker produces " + prod.herb + " herb per turn. Herb is needed to produce cure.";
            break;
            case "cure":
                msg = "1 worker produces " + prod.cure + " cure per turn. 1 cure need 2 herbs. A temple is needed.";
            break;
        }
        botBar.text = msg;
    }


    if(ct.actions.mouseLeft.pressed && overlay === null) {

        if(ct.mouse.hovers(copy)) {
            let workers = setWorkers(copy.resource, 1);
        }

    }

    else if(ct.actions.mouseRight.pressed && overlay === null) {

        if(ct.mouse.hovers(copy)) {
            let workers = setWorkers(copy.resource, -1);
        }

    }

    else if(ct.actions.mouseMiddle.pressed && overlay === null) {

        if(ct.mouse.hovers(copy)) {
            let workers = setWorkers(copy.resource, 0);
        }

    }
    // TODO: doesn't seems to work
    // else if(ct.actions.mouseWheel) {
    //     if(ct.mouse.hovers(copy)) {
    //         console.log(ct.actions.mouseWheel.value)
    //     }
    // }
};
const tileSize = 16;
let mapInTiles = {};
let map = {};

const types = [
"Water", //0
"ShoreN",//1
"ShoreE",//2
"ShoreS",//3
"ShoreW",//4
"Grass", //5
"Tree",  //6
"TownCenter",//7
"House",  //8
"Farm",  //9
"Stump", //10
"ShoreNB",//11 shore with bridge
"ShoreEB",//12 shore with bridge
"ShoreSB",//13 shore with bridge
"ShoreWB",//14 shore with bridge
"BridgeV",//15 vertical bridge
"BridgeH",//16 vertical bridge
"ShoreNE",//17 corner north east
"ShoreSE",//18 corner south east
"ShoreSW",//19 corner south west
"ShoreNW",//20 corner north west
];

function getIslandIndice(cursorX, cursorY) {
    let current;
    cursorX = cursorX / tileSize;
    cursorY = cursorY / tileSize;

    //Check if tile belongs to an island (if water or bridge it doesn't)
    //TODO test the try catch
    try {
        let tile = mapDatas[cursorY][cursorX];
        if(tile === 0 || tile === 15 || tile === 16) {
            return -1;
        }
        for(i in islands) {
            current = islands[i];
            let startX = current.x1;
            let startY = current.y1;
            let endX = current.x2;
            let endY = current.y2;
            let x = startX;
            let y = startY;
            for(y; y <= endY; y++) {
                for(x; x <= endX; x++) {
                    if(x == cursorX && y == cursorY) {
                        return i;
                    }
                }
                x = startX;
            }
        }
    }
    catch(error) {
        console.log(error)
    }
}

function islandStatus(cursorX, cursorY) {
    //TODO try catch not the right way maybe...
    try {
        let island = getIslandIndice(cursorX, cursorY);
        let connectedIsland = false;
        let claimedIsland = false;
        if(island != -1) {
            connectedIsland = islands[island].connected;
            claimedIsland = islands[island].town;
            //console.log("island" + island + "is" + connectedIsland + " and " + claimedIsland);
        }
        return { id: island, connected: connectedIsland, claimed: claimedIsland };
    }
    catch(error)
    {
        console.log(error)
    }
}

function getWoodableTrees() {
    let current;
    let trees = [];
    for(i in islands) {
        current = islands[i];
        if(current.connected && current.town) {
            let startX = current.x1;
            let startY = current.y1;
            let endX = current.x2;
            let endY = current.y2;
            let x = startX;
            let y = startY;
            for(y; y <= endY; y++) {
                for(x; x <= endX; x++) {
                    if(mapDatas[y][x] === 6) {
                        trees.push( { x: x, y: y } );
                    }
                }
                x = startX;
            }
        }
    }
    return trees;
}

function cutTree(amount) {
    let cutableTrees = getWoodableTrees();
    let allTrees = ct.types.list.Tree;
    let copy;
    for (let tree of allTrees) {
        copy = { x: tree.x / tileSize, y: tree.y / tileSize };
        for(let woodable in cutableTrees) {
            if(cutableTrees[woodable].x === copy.x && cutableTrees[woodable].y === copy.y) {
                mapDatas[copy.y][copy.x] = 10; //stump
                tree.kill = true;
                ct.types.copy("Stump", copy.x * tileSize, copy.y * tileSize);
                amount--;
                if(amount === 0) {
                    return;
                }
            }
        }
    }
}

function checkAroundWaterTile(x, y) {
    const xTile = x / tileSize;
    const yTile = y / tileSize;

    //TODO: fix bug: out of bounds

    //Check in 4 directions:
    try {
        if(mapDatas[yTile - 1][xTile] === 13 || mapDatas[yTile - 1][xTile] === 15) {     //check on N if ShoreSB or vertical bridge => bridge vertical
            return "BridgeVB";
        }
        else if(mapDatas[yTile][xTile + 1] === 14 || mapDatas[yTile][xTile + 1] === 16) {//check on E if ShoreWB or horizontal bridge => bridge horizontal
            return "BridgeHB";
        }
        else if(mapDatas[yTile + 1][xTile] === 11 || mapDatas[yTile + 1][xTile] === 15) {//check on S if ShoreNB or vertical bridge => bridge vertical
            return "BridgeVB";
        }
        else if(mapDatas[yTile][xTile - 1] === 12 || mapDatas[yTile][xTile - 1] === 16) {//check on W if ShoreEB or horizontal bridge => bridge horizontal
            return "BridgeHB";
        }
        else return "";
    }
    catch(e) {
        console.log(e)
    }
    return "";
}

const islandSize = {wMin: 3, hMin: 3, wMax: 7, hMax: 7};
const islandDistance = {min: 2, max: 6};
const numberOfIsland = 12;
let islands = [];
let mapDatas;
let startIsland = null;

function ranBetween(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}

function isColliding(a, b) {
    if (a.x1-1 < b.x2 &&
    a.x2+1 > b.x1 &&
    a.y1-1 < b.y2 &&
    a.y2+1 > b.y1) {
        return true;
    }
    else {
        return false;
    }
}

function genIslands() {
    let i = 0;
    islands = [];
    let islandW;
    let islandH;
    for(i; i < numberOfIsland; i++) {
        islandW = ranBetween(islandSize.wMin, islandSize.wMax);
        islandH = ranBetween(islandSize.hMin, islandSize.hMax);
        //Avoid island minW x minH
        if(islandW === islandSize.wMin && islandH === islandSize.hMin) {
            if(ct.random.chance(50)) {
                islandW++;
            }
            else {
                islandH++;
            }
        }
        islands.push({
            w: islandW,
            h: islandH,
            distanceN: ranBetween(islandDistance.min, islandDistance.max),
            distanceW: ranBetween(islandDistance.min, islandDistance.max),
            connected: false,
            town: false,
            start: false
        });
    }
}

function ranStartingIsland() {
    let ran = Math.floor((Math.random() * numberOfIsland));
    let isle = islands[ran];
    startIsland = ran;
    let buildings = [8, 7, 9];//House, Town Center, Farm
    let buildingIndex = 0;
    let removedTree = 0;
    let addedTree = 0;
    if(isle.grass > 3 && isle.trees > 4) {
        isle.connected = true;
        isle.town = true;
        isle.start = true;
        for(y = isle.y1; y <= isle.y2; y++) {
            for(x = isle.x1; x <= isle.x2; x++) {
                if(y !== isle.y1
                && y !== isle.y2
                && x !== isle.x1
                && x !== isle.x2) {
                    if(buildingIndex < 3) {
                        if(mapDatas[y][x] === 6) {
                            removedTree++;
                        }
                        mapDatas[y][x] = buildings[buildingIndex];
                        buildingIndex++;
                    }
                    if(buildingIndex === 3 && removedTree === addedTree) {
                        return;
                    }
                    else {
                        if(buildingIndex === 3  && removedTree > 0) {
                            if(mapDatas[y][x] === 5) {
                                mapDatas[y][x] = 6;
                                addedTree++;
                            }
                        }
                    }
                }
            }
        }
    }
    else {
        ranStartingIsland();
    }
}

function posIslands() {
    let i = 0;
    let xStack = 0;
    let yStack = 0;
    for(i; i < numberOfIsland; i++) {

        if(i === 4 || i === 8) { //TODO no harcoding
            xStack = 0;
        }
        if(i < 4) {
            yStack = 0;
        }
        else if(i > 3 && i < 8) {
            yStack = islands[i-4].distanceN + islands[i-4].h;
        }
        else if(i > 7) {
            yStack = islands[i-4].distanceN + islands[i-4].h + islands[i-8].distanceN + islands[i-8].h;
        }

        xStack += islands[i].distanceW;
        yStack += islands[i].distanceN;
        islands[i].x1 = xStack;
        islands[i].y1 = yStack;
        xStack += islands[i].w;
        islands[i].x2 = xStack;
        islands[i].y2 = yStack + islands[i].h;
    }
    //Check collision
    i = 0;
    let j = 0;
    let colliding = false;
    for(i; i < numberOfIsland; i++) {
        for(j; j < numberOfIsland; j++) {
            if(i !== j) {
                if(isColliding(islands[i], islands[j])) {
                    colliding = true;
                    console.log("some islands are colliding!")
                    return false;
                }
            }
        }
        j = 0;
    }
    return true;
}

function getHigherXY() {
    let i = 0;
    let higherX = 0;
    let higherY = 0;
    for(i; i < numberOfIsland; i++) {
        if(islands[i].x2 > higherX) {
            higherX = islands[i].x2;
        }
        if(islands[i].y2 > higherY) {
            higherY = islands[i].y2;
        }
    }
    return {w: higherX + 2, h: higherY + 2};
}

function genEmpty2Darray() {
    let size = getHigherXY();
    let ar = [];
    let x = 0;
    let y = 0;
    for(y; y < size.h; y ++) {
        let arX = [];
        arX.length = size.w;
        arX.fill(0);
        ar[y] = arX;
    }
    return ar;
}

function genMap() {
    genIslands();
    if(posIslands()) {
        drawMap(genMapIslands());
    }
    else {
        console.log("on relance genMap() car collision")
        genMap();
    }
}

function genMapIslands() {
    mapDatas = genEmpty2Darray();
    mapInTiles = { w: mapDatas[0].length, h: mapDatas.length };
    map = { w: mapInTiles.w * tileSize, h: mapInTiles.h * tileSize };
    let i = 0;
    let x;
    let y;
    let grass = 0;
    let trees = 0;
    for(i; i < numberOfIsland; i++) {

        for(y = islands[i].y1; y <= islands[i].y2; y++) {

            for(x = islands[i].x1; x <= islands[i].x2; x++) {
                if(x === islands[i].x1 && y === islands[i].y1) {
                    mapDatas[y][x] = 20;//ShoreNW
                }
                else if(x === islands[i].x2 && y === islands[i].y1) {
                    mapDatas[y][x] = 17;//ShoreNE
                }
                else if(x === islands[i].x1 && y === islands[i].y2) {
                    mapDatas[y][x] = 19;//ShoreSW
                }
                else if(x === islands[i].x2 && y === islands[i].y2) {
                    mapDatas[y][x] = 18;//ShoreSE
                }
                else if(y === islands[i].y1) {
                    mapDatas[y][x] = 1;//ShoreN
                }
                else if(y === islands[i].y2) {
                    mapDatas[y][x] = 3;//ShoreS
                }
                else if(x === islands[i].x1) {
                    mapDatas[y][x] = 4;//ShoreW
                }
                else if(x === islands[i].x2) {
                    mapDatas[y][x] = 2;//ShoreE
                }
                else {
                    if(ct.random.chance(45)) {
                        mapDatas[y][x] = 6;//Tree
                        trees++;
                    }
                    else {
                        mapDatas[y][x] = 5;//Grass
                        grass++;
                    }

                }
            }
        }
        islands[i].grass = grass;
        islands[i].trees = trees;
        grass = 0;
        trees = 0;
    }
    //console.log(mapDatas)
    return mapDatas;
}

function drawMap(datas) {
    ranStartingIsland();
    let x = 0;
    let y = 0;
    let xL = datas[0].length;
    let yL = datas.length;
    for(y; y < yL; y++) {
        for(x; x < xL; x++) {
            ct.types.copy(types[datas[y][x]], x*tileSize, y*tileSize);
        }
        x = 0;
    }
}

function debugIsles() {
    let i = 0;
    for(i; i < numberOfIsland; i++) {
        console.log(i + ": " + islands[i].x1 + "," + islands[i].y1 + " -> " + islands[i].x2 + "," + islands[i].y2 + " / w:" + islands[i].w + " x " + islands[i].h  + " / dn:" + islands[i].distanceN + " dw " + islands[i].distanceN)
        console.log("   " + islands[i].grass + " grass and " + islands[i].trees + " trees | ration: " + islands[i].grass / islands[i].trees)
    }
}
;

// TODO ! no harcoding!!!

let plagueMaxBorders = {};

function addPlague() {
    if(ct.types.list.Plague.length < 500) { //TODO: no hardcoding totally arbitrary => to balance
        plagueMaxBorders = { x: mapInTiles.w - 1, y: mapInTiles.h - 1 };
        let ranX = Math.floor((Math.random() * plagueMaxBorders.x)) * tileSize;
        let ranY = Math.floor((Math.random() * plagueMaxBorders.y)) * tileSize;
        if(ranX === 0) {
            ranX = 16;
        }
        if(ranY === 0) {
            ranY = 16;
        }
        if(!ct.place.meet(cursor, ranX, ranY, "Plague")) { //i put cursor, but we don't care i just want a 16x16 collision shape
            ct.types.copy("Plague", ranX, ranY);
        }
        else {
            addPlague();
        }
    }
}

function yersiniaSpawn() {
    let plagues = ct.types.list.Plague.length;
    if(plagues < 20) {
        //Increase plague progression according to turn
        let morePlague = Math.floor(turn / 15);
        let oldPlague = plagues;
        plagues += morePlague;
        console.log("plagues to add: " + plagues + "(" + oldPlague + " + " + morePlague + ")")
        if(plagues > 0) {
            ct.sound.spawn("plagueTurn");
        }
        let i = 0;
        for(i; i < plagues; i++) {
            addPlague();
        }
    }
}

let dirP = [
    {x: 0, y: -16},
    {x: 0, y: 16},
    {x: -16, y: 0},
    {x: 16, y: 0},
];
function yersiniaProgress() {
    let pest;
    let dir;
    let dirs; //direction free of plague
    let dirsL;
    let ran;
    let plagueToSpawn = [];
    for (pest of ct.types.list['Plague']) {
        dirs = [];
        for(dir in dirP) {
            if(!ct.place.meet(pest, pest.x + dirP[dir].x, pest.y + dirP[dir].y, "Plague")) {
                dirs.push(dirP[dir]);
            }
        }
        dirsL = dirs.length;
        if(dirsL === 1) {
            plagueToSpawn.push( { x: pest.x + dirs[0].x, y: pest.y + dirs[0].y } );
        }
        else if(dirsL > 1) {
            ran = Math.floor((Math.random() * dirsL));
            plagueToSpawn.push( { x: pest.x + dirs[0].x, y: pest.y + dirs[0].y } );
        }
    }
    let p;
    for(p in plagueToSpawn) {
        if(!ct.place.meet(pest, plagueToSpawn[p].x, plagueToSpawn[p].y, "Plague")) {
            ct.types.copy("Plague", plagueToSpawn[p].x, plagueToSpawn[p].y);
        }
    }
}

function blackDeath() {
    let pest;
    let hecatomb = { wood: 0, food: 0, herb: 0, cure: 0, total: 0}
    let ran;
    for (pest of ct.types.list['Plague']) {
        //WIP: retirer des workers seulement s'il y a bien des workers dessus
        if(ct.place.meet(pest, "TownCenter")) {
            ran = Math.round(Math.random());// 0 or 1
            if(ran === 0) {
                hecatomb.wood++;
            }
            else {
                hecatomb.herb++;
            }
            hecatomb.total++;
        }
        else if(ct.place.meet(pest, "House")) {
            ran = Math.round(Math.random());// 0 or 1
            if(ran === 0) {
                hecatomb.wood++;
            }
            else {
                hecatomb.herb++;
            }
            hecatomb.total++;
        }
        else if(ct.place.meet(pest, "Farm")) {
            hecatomb.food++;
            hecatomb.total++;
        }
        else if(ct.place.meet(pest, "Temple")) {
            hecatomb.cure++;
            hecatomb.total++;
        }

    }
    //WIP...
    let toRemove = 0;
    let res;
    for(res in hecatomb) {
        if(res !== "total") {
            if(hecatomb[res] > job[res]) {
                toRemove += hecatomb[res] - job[res];
            }
        }
    }

    return hecatomb;
};
function getTileInfo(cursorX, cursorY) {
    //TODO try catch not the right way maybe...
    try {
        let island = islandStatus(cursorX, cursorY);
        let tile = mapDatas[cursorY / tileSize][cursorX / tileSize];
        let msg;
        if(tile === 0) { //Water
            msg = "Sea. To connect islands, you have to start a bridge on a shore. Use arrows to move map.";
        }
        else {
            if(!island.connected) {
                msg = "Build a bridge to that island to claim it.";
            }
            else if(!island.claimed){
                msg = "Build a tower center to claim that island.";
            }
            else {
                switch(tile) {
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                        msg = "Shore. You can only build bridge here. To connect islands, you have to start a bridge on a shore.";
                        break;
                    case 5:
                        msg = "Grass."
                        break;
                    case 6:
                        msg = "Tree. Workers turn it to wood. Wood is important and rare. 1 tree gives " + treeWood + " wood.";
                        break;
                    case 10:
                        msg = "Tree stump. You can build on it.";
                        break;
                    case 17:
                    case 18:
                    case 19:
                    case 20:
                        msg = "Shore. You can't build bridge here.";
                        break;
                }
            }
        }
        botBar.text = msg;
        return island.connected;
    }
    catch(error) {
        console.log(error)
    }

}

function tileOnStep(tile) {

    if(ct.mouse.hovers(tile) && overlay === null) {
        let type = tile.type;
        if(type !== "Plague") {
            getTileInfo(cursor.x, cursor.y)
            if(ct.actions.mouseLeft.pressed && ct.place.free(cursor, "UI") && !ct.place.meet(cursor, "Plague")) {
                if(type !== "ShoreNE" && type !== "ShoreSE" && type !== "ShoreSW" && type !== "ShoreNW") {
                    tileToKill = ct.place.meet(cursor, type);
                    showBuildingMenu(cursor.x, cursor.y, type);
                }
            }
        }
        else {
            let nocure = "";
            if(res.cure === 0) {
                nocure = " - NO CURE -"
            }
            botBar.text = "Plague! If you have cure in stock, click on it before it spread!" + nocure;
            if(ct.actions.mouseLeft.pressed && ct.place.free(cursor, "UI")) {
                if(res.cure > 0) {
                    //ct.sound.spawn("plagueCure");
                    ct.sound.spawn("killPlague");
                    tileToKill = ct.place.meet(cursor, type);
                    tileToKill.kill = true;
                    res.cure--;
                    setStatsTopBar();
                }
                else {
                    ct.sound.spawn("cancel");
                }

            }
        }
    }

};
let buildHere = null;
let townCenterB = null;
let farmB = null;
let houseB = null;
let templeB = null;
let shoreB = null;
let bridgeB = null;

let UIB = {
    "BuildHere": buildHere,
    "TownCenter": townCenterB,
    "Farm": farmB,
    "House": houseB,
    "Temple": templeB,
    "Shore": shoreB,
    "Bridge": bridgeB,
};

function showBuildingMenu(x, y, typ) {

    //TODO: find something else than try catch?
    try {
        let claimedIsland;
        let connected;

        if(!typ.startsWith("Bridge") && typ !== "Water") {
            claimedIsland = islands[getIslandIndice(x, y)].town;
            connected = islands[getIslandIndice(x, y)].connected;
        }

        hideBuildingMenu();

        if(!typ.startsWith("Shore") && !typ.startsWith("Bridge") && !typ.startsWith("Water") && connected){
            UIB.BuildHere = ct.types.copy("Here", x, y);
            if(!claimedIsland) {
                UIB.TownCenter = ct.types.copy("TownCenterB", x, y + tileSize);
            }
            else {
                UIB.Farm = ct.types.copy("FarmB", x, y + tileSize);
                UIB.House = ct.types.copy("HouseB", x, y + (tileSize * 2));
                UIB.Temple = ct.types.copy("TempleB", x, y + (tileSize * 3));
            }
        }
        else {
            if(typ === "Water") {
                let bridge = checkAroundWaterTile(x, y);
                if(bridge !== "") {
                    UIB.Bridge = ct.types.copy(bridge, x, y);
                }

            }
            else if(typ.startsWith("Shore")) {
                UIB.Shore = ct.types.copy(typ+"BB", x, y);
            }
        }
    }
    catch(error) {
        console.log(error)
    }
}

function hideBuildingMenu() {
    for(let i in UIB) {
        if(UIB[i]) {
            UIB[i].kill = true;
        }
        UIB[i] = null;
    }
}

function enoughResource(building) {
    let str = "";
    if(res.wood < cost[building]) {
        str = " - NOT ENOUGH WOOD -"
    }
    return str;
}

function build(building) {

    try {
        let buildingLowerCase;
        if(building === "TownCenter") {
            buildingLowerCase = "townCenter";
        }
        else if(building.startsWith("Shore")) {
            buildingLowerCase = "bridge";
        }
        else if(building.startsWith("Bridge")) {
            buildingLowerCase = "bridge";
        }
        else {
            buildingLowerCase = building.toLowerCase();
        }
        let buildingCost = cost[buildingLowerCase];

        if(res.wood >= buildingCost) {

            let buildPos = {x: tileToKill.x, y: tileToKill.y };

            if(tileToKill) tileToKill.kill = true;
            tileToKill = null;
            ct.types.copy(building, buildPos.x, buildPos.y);
            mapDatas[buildPos.y / tileSize][buildPos.x / tileSize] = types.indexOf(building);
            res.wood -= buildingCost;
            ct.sound.spawn("build");

            if(building.startsWith("Shore")) {
                //Check if it connects to another island:
                let x = buildPos.x / tileSize;
                let y = buildPos.y / tileSize;
                let connect = false;
                //TODO: no harcoding!!!
                switch(building) {
                    case "ShoreNB":
                        for(y; y > 0; y--) {
                            if(mapDatas[y][x] === 13) { //looking for a shore south on north
                                islands[getIslandIndice(buildPos.x, buildPos.y)].connected = true;
                                hideBuildingMenu();
                                return;
                            }
                        }
                        break;
                    case "ShoreEB":
                        // for(x; x < 40; x++) {
                        for(x; x < mapInTiles.w; x++) { //maybe not the right way but hotfix
                            if(mapDatas[y][x] === 14) { //looking for a shore west on east
                                islands[getIslandIndice(buildPos.x, buildPos.y)].connected = true;
                                hideBuildingMenu();
                                return;
                            }
                        }
                        break;
                    case "ShoreSB":
                        for(y; y < mapInTiles.h; y++) { //maybe not the right way but hotfix
                            if(mapDatas[y][x] === 11) { //looking for a shore north on south
                                islands[getIslandIndice(buildPos.x, buildPos.y)].connected = true;
                                hideBuildingMenu();
                                return;
                            }
                        }
                        break;
                    case "ShoreWB":
                        for(x; x > 0; x--) {
                            if(mapDatas[y][x] === 12) { //looking for a shore east on west
                                islands[getIslandIndice(buildPos.x, buildPos.y)].connected = true;
                                hideBuildingMenu();
                                return;
                            }
                        }
                        break;
                }
            }

            switch(building) {
                case "TownCenter":
                    islands[getIslandIndice(buildPos.x, buildPos.y)].town = true;
                    break;
                case "Farm":
                    capacity.food += 5;
                    workersLabel.food.text = job.food + "/" + capacity.food;
                    break;
                case "House":
                    capacity.pop += 5;
                    setStatsTopBar();
                    break;
                case "Temple":
                    capacity.cure += 5;
                    workersLabel.cure.text = job.cure + "/" + capacity.cure;
                    break;
            }
            setStatsTopBar();
        }
        else {
            ct.sound.spawn("cancel");
        }
        hideBuildingMenu();
    }
    catch(error) {
        console.log(error)
    }

};
let introText = [];
introText[0] = `Приветствую Вас, Мэр!

В эти смутные времена чумы твой долг еще более велик, чем когда-либо.
Чтобы защитить горожан и отразить Черную смерть, вам придется произвести "излечение".
"Лекарство" изготовлено из особой "травы", растущей только на наших изолированных островах.
Но вы не можете оставаться взаперти на своем стартовом острове.
Вам придется расширять и претендовать на другие острова, соединяя их мостами и строя городские центры.`;

introText[1] = `Так что вам придется собирать дерево для зданий, травы для лечения и, конечно же еду.
Если у вас есть хорошая репутация (достаточно еды, жилья и лечения), люди присоединятся и будут упорно трудиться, чтобы пережить бедствие.
Вы должны распределить рабочую силу с помощью кнопок справа от вас.
Как только вы закончите, вы можете завершить день.

Удачи.`

introTextIndex = 0;

function intro(room) {
    let x = room.x;
    let y = room.y;
    overlay = ct.types.copy("Overlay", x, y);
    introPopup = ct.types.copy("Intro", 0, y + 20);
    introPopup.x = x + ((ct.viewWidth - introPopup.width) / 2);
    introLbl = new PIXI.Text(introText[0], ct.styles.get('Intro'));
    introLbl.resolution = 2;
    introLbl.x = 7;
    introLbl.y = 5;
    introPopup.addChild(introLbl);
    room.addChild(introPopup);
};
(function () {
    /* global deadPool */
    class Room extends PIXI.Container {
        constructor(template) {
            super();
            this.x = this.y = 0;
            this.uid = 0;
            this.follow = this.borderX = this.borderY = this.followShiftX = this.followShiftY = this.followDrift = 0;
            this.tileLayers = [];
            this.backgrounds = [];
            if (!ct.room) {
                ct.room = ct.rooms.current = this;
            }
            if (template) {
                this.onCreate = template.onCreate;
                this.onStep = template.onStep;
                this.onDraw = template.onDraw;
                this.onLeave = template.onLeave;
                this.template = template;
                this.name = template.name;
                for (let i = 0, li = template.bgs.length; i < li; i++) {
                    const bg = new ct.types.Background(template.bgs[i].texture, null, template.bgs[i].depth, template.bgs[i].extends);
                    this.backgrounds.push(bg);
                    ct.stack.push(bg);
                    this.addChild(bg);
                }
                for (let i = 0, li = template.tiles.length; i < li; i++) {
                    const tl = ct.rooms.addTileLayer(template.tiles[i]);
                    this.tileLayers.push(tl);
                    this.addChild(tl);
                }
                for (let i = 0, li = template.objects.length; i < li; i++) {
                    ct.types.make(template.objects[i].type, template.objects[i].x, template.objects[i].y, {
                        tx: template.objects[i].tx,
                        ty: template.objects[i].ty
                    }, this);
                }
            }
            return this;
        }
        get x () {
            return -this.position.x;
        }
        set x (value) {
            this.position.x = -value;
            return value;
        }
        get y () {
            return -this.position.y;
        }
        set y (value) {
            this.position.y = -value;
            return value;
        }
    }
    var nextRoom;
    /**
     * @namespace
     */
    ct.rooms = {
        templates: {},
        /**
         * Creates and adds a background to the current room, at the given depth.
         * @param {string} texture The name of the texture to use
         * @param {number} depth The depth of the new background
         * @returns {Background} The created background
         */
        addBg(texture, depth) {
            const bg = new ct.types.Background(texture, null, depth);
            ct.room.addChild(bg);
            return bg;
        },
        /**
         * Adds a new empty tile layer to the room, at the given depth
         * @param {number} layer The depth of the layer
         * @returns {Tileset} The created tile layer
         */
        addTileLayer(layer) {
            return new ct.types.Tileset(layer);
        },
        /**
         * Clears the current room
         * @return {void}
         */
        clear() {
            ct.stage.children = [];
            ct.stack = [];
            for (var i in ct.types.list) {
                ct.types.list[i] = [];
            }
        },
        /*
         * Switches to the given room. Note that this transition happens at the end
         * of the frame, so the name of a new room may be overridden.
         */
        'switch'(room) {
            if (ct.rooms.templates[room]){
                nextRoom = room;
                ct.rooms.switching = true;
            } else {
                console.error('[ct.rooms] The room "' + room + '" does not exist!');
            }
        },
        switching: false,
        /**
         * Loads a given room and adds it to the stage. Useful for embedding prefabs and UI screens.
         * @param  {string} roomName The name of a room to add to the stage
         * @returns {Room} The newly created room
         */
        load(roomName) {
            const room = new Room(ct.rooms.templates[roomName]);
            ct.stage.addChild(ct.room);
            return room;
        },
        forceSwitch(roomName) {
            if (nextRoom) {
                roomName = nextRoom;
            }
            if (ct.room) {
                ct.room.onLeave();
                ct.rooms.onLeave.apply(ct.room);
                ct.room = void 0;
            }
            ct.rooms.clear();
            deadPool.length = 0;
            var template = ct.rooms.templates[roomName];
            ct.viewWidth = ct.roomWidth = template.width;
            ct.viewHeight = ct.roomHeight = template.height;
            ct.pixiApp.renderer.resize(template.width, template.height);
            ct.rooms.current = ct.room = new Room(template);
            ct.room.onCreate();
            ct.rooms.onCreate.apply(ct.room);
            ct.fittoscreen();

            ct.rooms.switching = false;
            ct.stage.addChild(ct.room);
            nextRoom = void 0;
        },
        onCreate() {
            /* global SSCD */
ct.place.tileGrid = {};
if (ct.types.list.TILELAYER) {
    for (const layer of ct.types.list.TILELAYER) {
        for (let i = 0, l = layer.tiles.length; i < l; i++) {
            const t = layer.tiles[i];
            // eslint-disable-next-line no-underscore-dangle
            t._shape = new SSCD.Rectangle(new SSCD.Vector(t.x, t.y), new SSCD.Vector(t.width, t.height));
            t.$chashes = ct.place.getHashes(t);
            /* eslint max-depth: 0 */
            for (const hash of t.$chashes) {
                if (!(hash in ct.place.tileGrid)) {
                    ct.place.tileGrid[hash] = [t];
                } else {
                    ct.place.tileGrid[hash].push(t);
                }
            }
            t.depth = layer.depth;
        }
    }
}

        },
        onLeave() {
            ct.place.grid = {};
ct.place.ctypeCollections = {};

        },
        /**
         * The name of the starting room, as it was set in ct.IDE.
         * @type {string}
         */
        starting: 'Title'
    };
})();
/**
 * The current room
 * @type {Room}
 */
ct.room = null;

ct.rooms.beforeStep = function () {

};
ct.rooms.afterStep = function () {

};
ct.rooms.beforeDraw = function () {

};
ct.rooms.afterDraw = function () {
    ct.mouse.xprev = ct.mouse.x;
ct.mouse.yprev = ct.mouse.y;
ct.mouse.pressed = ct.mouse.released = false;
/* global ct */

ct.keyboard.clear();
if (ct.sound.follow && !ct.sound.follow.kill) {
    ct.sound.howler.pos(ct.sound.follow.x, ct.sound.follow.y, ct.sound.useDepth? ct.sound.follow.z : 0);
} else if (ct.sound.manageListenerPosition) {
    ct.sound.howler.pos(ct.room.x + ct.viewWidth / 2, ct.room.y + ct.viewHeight / 2, 0);
}

};


ct.rooms.templates['Room1'] = {
    name: 'Room1',
    width: 320,
    height: 176,
    objects: [{"x":64,"y":32,"type":"Grass"},{"x":80,"y":32,"type":"Grass"},{"x":160,"y":48,"type":"Grass"},{"x":160,"y":64,"type":"Grass"},{"x":64,"y":48,"type":"Grass"},{"x":144,"y":32,"type":"Grass"},{"x":128,"y":32,"type":"Grass"},{"x":144,"y":32,"type":"Grass"},{"x":128,"y":32,"type":"Grass"},{"x":128,"y":32,"type":"Grass"},{"x":144,"y":32,"type":"Grass"},{"x":160,"y":32,"type":"Grass"},{"x":160,"y":48,"type":"Grass"},{"x":176,"y":48,"type":"Grass"},{"x":176,"y":64,"type":"Grass"},{"x":192,"y":64,"type":"Grass"},{"x":192,"y":80,"type":"Grass"},{"x":192,"y":80,"type":"Grass"},{"x":176,"y":80,"type":"Grass"},{"x":160,"y":80,"type":"Grass"},{"x":160,"y":96,"type":"Grass"},{"x":144,"y":96,"type":"Grass"},{"x":128,"y":112,"type":"Grass"},{"x":64,"y":96,"type":"Grass"},{"x":48,"y":96,"type":"Grass"},{"x":48,"y":80,"type":"Grass"},{"x":48,"y":64,"type":"Grass"},{"x":48,"y":48,"type":"Grass"},{"x":128,"y":96,"type":"Grass"},{"x":128,"y":32,"type":"Grass"},{"x":128,"y":16,"type":"Grass"},{"x":112,"y":16,"type":"Grass"},{"x":96,"y":16,"type":"Grass"},{"x":80,"y":16,"type":"Grass"},{"x":80,"y":32,"type":"Grass"},{"x":80,"y":32,"type":"Grass"},{"x":96,"y":112,"type":"Grass"},{"x":64,"y":112,"type":"Grass"},{"x":64,"y":96,"type":"Grass"},{"x":48,"y":80,"type":"Grass"},{"x":32,"y":64,"type":"Grass"},{"x":32,"y":80,"type":"Grass"},{"x":32,"y":80,"type":"Grass"},{"x":96,"y":128,"type":"Grass"},{"x":112,"y":128,"type":"Grass"},{"x":128,"y":128,"type":"Grass"},{"x":128,"y":128,"type":"Grass"},{"x":176,"y":32,"type":"ShoreE"},{"x":192,"y":48,"type":"ShoreE"},{"x":208,"y":64,"type":"ShoreE"},{"x":208,"y":80,"type":"ShoreE"},{"x":160,"y":112,"type":"ShoreE"},{"x":144,"y":128,"type":"ShoreE"},{"x":80,"y":0,"type":"ShoreN"},{"x":96,"y":0,"type":"ShoreN"},{"x":112,"y":0,"type":"ShoreN"},{"x":128,"y":0,"type":"ShoreN"},{"x":128,"y":0,"type":"ShoreN"},{"x":160,"y":16,"type":"ShoreN"},{"x":192,"y":96,"type":"ShoreS"},{"x":128,"y":144,"type":"ShoreS"},{"x":112,"y":144,"type":"ShoreS"},{"x":96,"y":144,"type":"ShoreS"},{"x":96,"y":144,"type":"ShoreS"},{"x":80,"y":128,"type":"ShoreS"},{"x":64,"y":128,"type":"ShoreS"},{"x":64,"y":128,"type":"ShoreS"},{"x":48,"y":112,"type":"ShoreS"},{"x":32,"y":96,"type":"ShoreS"},{"x":16,"y":80,"type":"ShoreW"},{"x":16,"y":64,"type":"ShoreW"},{"x":16,"y":64,"type":"ShoreW"},{"x":32,"y":48,"type":"ShoreW"},{"x":48,"y":32,"type":"ShoreW"},{"x":64,"y":16,"type":"ShoreW"},{"x":176,"y":96,"type":"ShoreS"},{"x":144,"y":16,"type":"ShoreN"},{"x":112,"y":32,"type":"Tree"},{"x":112,"y":48,"type":"Tree"},{"x":112,"y":64,"type":"Tree"},{"x":112,"y":80,"type":"Tree"},{"x":112,"y":96,"type":"Tree"},{"x":112,"y":96,"type":"Tree"},{"x":96,"y":96,"type":"Tree"},{"x":80,"y":96,"type":"Tree"},{"x":80,"y":80,"type":"Tree"},{"x":64,"y":80,"type":"Tree"},{"x":80,"y":80,"type":"Tree"},{"x":80,"y":64,"type":"Tree"},{"x":96,"y":64,"type":"Tree"},{"x":96,"y":80,"type":"Tree"},{"x":96,"y":64,"type":"Tree"},{"x":96,"y":48,"type":"Tree"},{"x":80,"y":48,"type":"Tree"},{"x":80,"y":64,"type":"Tree"},{"x":96,"y":64,"type":"Tree"},{"x":96,"y":64,"type":"Tree"},{"x":64,"y":64,"type":"Tree"},{"x":128,"y":48,"type":"Tree"},{"x":144,"y":48,"type":"Tree"},{"x":144,"y":64,"type":"Tree"},{"x":144,"y":80,"type":"Tree"},{"x":128,"y":80,"type":"Tree"},{"x":128,"y":64,"type":"Tree"},{"x":128,"y":64,"type":"Tree"},{"x":96,"y":32,"type":"Tree"},{"x":0,"y":0,"type":"Water"},{"x":16,"y":0,"type":"Water"},{"x":32,"y":0,"type":"Water"},{"x":48,"y":0,"type":"Water"},{"x":64,"y":0,"type":"Water"},{"x":64,"y":0,"type":"Water"},{"x":48,"y":16,"type":"Water"},{"x":32,"y":16,"type":"Water"},{"x":16,"y":16,"type":"Water"},{"x":0,"y":16,"type":"Water"},{"x":0,"y":32,"type":"Water"},{"x":16,"y":32,"type":"Water"},{"x":32,"y":32,"type":"Water"},{"x":32,"y":32,"type":"Water"},{"x":16,"y":48,"type":"Water"},{"x":0,"y":48,"type":"Water"},{"x":0,"y":64,"type":"Water"},{"x":0,"y":80,"type":"Water"},{"x":0,"y":96,"type":"Water"},{"x":16,"y":96,"type":"Water"},{"x":16,"y":96,"type":"Water"},{"x":0,"y":112,"type":"Water"},{"x":16,"y":112,"type":"Water"},{"x":32,"y":112,"type":"Water"},{"x":32,"y":128,"type":"Water"},{"x":16,"y":128,"type":"Water"},{"x":16,"y":144,"type":"Water"},{"x":0,"y":144,"type":"Water"},{"x":16,"y":144,"type":"Water"},{"x":16,"y":128,"type":"Water"},{"x":16,"y":128,"type":"Water"},{"x":48,"y":128,"type":"Water"},{"x":48,"y":144,"type":"Water"},{"x":48,"y":160,"type":"Water"},{"x":32,"y":160,"type":"Water"},{"x":16,"y":160,"type":"Water"},{"x":0,"y":160,"type":"Water"},{"x":0,"y":144,"type":"Water"},{"x":0,"y":128,"type":"Water"},{"x":16,"y":128,"type":"Water"},{"x":16,"y":144,"type":"Water"},{"x":32,"y":144,"type":"Water"},{"x":48,"y":160,"type":"Water"},{"x":48,"y":160,"type":"Water"},{"x":64,"y":144,"type":"Water"},{"x":80,"y":144,"type":"Water"},{"x":80,"y":160,"type":"Water"},{"x":64,"y":160,"type":"Water"},{"x":80,"y":160,"type":"Water"},{"x":96,"y":160,"type":"Water"},{"x":112,"y":160,"type":"Water"},{"x":128,"y":160,"type":"Water"},{"x":144,"y":160,"type":"Water"},{"x":160,"y":160,"type":"Water"},{"x":160,"y":144,"type":"Water"},{"x":144,"y":144,"type":"Water"},{"x":160,"y":144,"type":"Water"},{"x":160,"y":160,"type":"Water"},{"x":176,"y":160,"type":"Water"},{"x":176,"y":144,"type":"Water"},{"x":160,"y":144,"type":"Water"},{"x":160,"y":128,"type":"Water"},{"x":176,"y":128,"type":"Water"},{"x":176,"y":144,"type":"Water"},{"x":192,"y":144,"type":"Water"},{"x":208,"y":144,"type":"Water"},{"x":208,"y":160,"type":"Water"},{"x":192,"y":160,"type":"Water"},{"x":192,"y":144,"type":"Water"},{"x":176,"y":128,"type":"Water"},{"x":192,"y":128,"type":"Water"},{"x":192,"y":112,"type":"Water"},{"x":208,"y":112,"type":"Water"},{"x":192,"y":112,"type":"Water"},{"x":192,"y":128,"type":"Water"},{"x":176,"y":128,"type":"Water"},{"x":192,"y":128,"type":"Water"},{"x":208,"y":128,"type":"Water"},{"x":208,"y":144,"type":"Water"},{"x":208,"y":128,"type":"Water"},{"x":224,"y":128,"type":"Water"},{"x":224,"y":112,"type":"Water"},{"x":208,"y":112,"type":"Water"},{"x":208,"y":96,"type":"Water"},{"x":224,"y":96,"type":"Water"},{"x":224,"y":80,"type":"Water"},{"x":224,"y":64,"type":"Water"},{"x":224,"y":48,"type":"Water"},{"x":208,"y":48,"type":"Water"},{"x":208,"y":32,"type":"Water"},{"x":192,"y":32,"type":"Water"},{"x":192,"y":16,"type":"Water"},{"x":176,"y":16,"type":"Water"},{"x":176,"y":16,"type":"Water"},{"x":144,"y":0,"type":"Water"},{"x":160,"y":0,"type":"Water"},{"x":176,"y":0,"type":"Water"},{"x":192,"y":0,"type":"Water"},{"x":192,"y":0,"type":"Water"},{"x":208,"y":0,"type":"Water"},{"x":208,"y":16,"type":"Water"},{"x":224,"y":16,"type":"Water"},{"x":224,"y":32,"type":"Water"},{"x":224,"y":32,"type":"Water"},{"x":176,"y":112,"type":"Water"},{"x":304,"y":112,"type":"Tree"},{"x":304,"y":96,"type":"Tree"},{"x":288,"y":96,"type":"Tree"},{"x":288,"y":80,"type":"Tree"},{"x":304,"y":80,"type":"Tree"},{"x":304,"y":64,"type":"Tree"},{"x":320,"y":64,"type":"Tree"},{"x":336,"y":64,"type":"Tree"},{"x":336,"y":80,"type":"Tree"},{"x":352,"y":80,"type":"Tree"},{"x":352,"y":96,"type":"Tree"},{"x":336,"y":96,"type":"Tree"},{"x":336,"y":112,"type":"Tree"},{"x":320,"y":112,"type":"Tree"},{"x":320,"y":96,"type":"Tree"},{"x":320,"y":80,"type":"Tree"},{"x":336,"y":80,"type":"Tree"},{"x":320,"y":80,"type":"Tree"},{"x":304,"y":80,"type":"Tree"},{"x":304,"y":64,"type":"Tree"},{"x":304,"y":64,"type":"Tree"},{"x":288,"y":64,"type":"Grass"},{"x":304,"y":48,"type":"Grass"},{"x":320,"y":48,"type":"Grass"},{"x":336,"y":48,"type":"Grass"},{"x":352,"y":64,"type":"Grass"},{"x":368,"y":80,"type":"Grass"},{"x":368,"y":96,"type":"Grass"},{"x":352,"y":112,"type":"Grass"},{"x":336,"y":128,"type":"Grass"},{"x":320,"y":128,"type":"Grass"},{"x":304,"y":128,"type":"Grass"},{"x":288,"y":112,"type":"Grass"},{"x":272,"y":96,"type":"Grass"},{"x":272,"y":80,"type":"Grass"},{"x":256,"y":80,"type":"ShoreW"},{"x":256,"y":96,"type":"ShoreW"},{"x":272,"y":64,"type":"ShoreW"},{"x":288,"y":48,"type":"ShoreW"},{"x":272,"y":112,"type":"ShoreW"},{"x":288,"y":128,"type":"ShoreW"},{"x":352,"y":48,"type":"ShoreE"},{"x":368,"y":64,"type":"ShoreE"},{"x":384,"y":80,"type":"ShoreE"},{"x":384,"y":96,"type":"ShoreE"},{"x":368,"y":112,"type":"ShoreE"},{"x":352,"y":128,"type":"ShoreE"},{"x":304,"y":32,"type":"ShoreN"},{"x":320,"y":32,"type":"ShoreN"},{"x":336,"y":32,"type":"ShoreN"},{"x":304,"y":144,"type":"ShoreS"},{"x":336,"y":144,"type":"ShoreS"},{"x":320,"y":144,"type":"ShoreS"},{"x":224,"y":0,"type":"Water"},{"x":240,"y":0,"type":"Water"},{"x":256,"y":0,"type":"Water"},{"x":272,"y":0,"type":"Water"},{"x":288,"y":0,"type":"Water"},{"x":304,"y":0,"type":"Water"},{"x":320,"y":0,"type":"Water"},{"x":320,"y":16,"type":"Water"},{"x":336,"y":16,"type":"Water"},{"x":336,"y":16,"type":"Water"},{"x":240,"y":16,"type":"Water"},{"x":256,"y":16,"type":"Water"},{"x":272,"y":16,"type":"Water"},{"x":288,"y":16,"type":"Water"},{"x":304,"y":16,"type":"Water"},{"x":304,"y":16,"type":"Water"},{"x":240,"y":32,"type":"Water"},{"x":256,"y":32,"type":"Water"},{"x":272,"y":32,"type":"Water"},{"x":288,"y":32,"type":"Water"},{"x":288,"y":32,"type":"Water"},{"x":304,"y":32,"type":"Water"},{"x":240,"y":48,"type":"Water"},{"x":256,"y":48,"type":"Water"},{"x":272,"y":48,"type":"Water"},{"x":272,"y":48,"type":"Water"},{"x":240,"y":64,"type":"Water"},{"x":256,"y":64,"type":"Water"},{"x":256,"y":64,"type":"Water"},{"x":240,"y":80,"type":"Water"},{"x":240,"y":96,"type":"Water"},{"x":240,"y":112,"type":"Water"},{"x":256,"y":112,"type":"Water"},{"x":256,"y":128,"type":"Water"},{"x":240,"y":128,"type":"Water"},{"x":240,"y":144,"type":"Water"},{"x":240,"y":160,"type":"Water"},{"x":224,"y":160,"type":"Water"},{"x":224,"y":144,"type":"Water"},{"x":240,"y":144,"type":"Water"},{"x":256,"y":144,"type":"Water"},{"x":272,"y":144,"type":"Water"},{"x":272,"y":128,"type":"Water"},{"x":272,"y":128,"type":"Water"},{"x":256,"y":160,"type":"Water"},{"x":272,"y":160,"type":"Water"},{"x":288,"y":160,"type":"Water"},{"x":288,"y":144,"type":"Water"},{"x":288,"y":144,"type":"Water"},{"x":304,"y":160,"type":"Water"},{"x":320,"y":160,"type":"Water"},{"x":336,"y":160,"type":"Water"},{"x":352,"y":160,"type":"Water"},{"x":352,"y":176,"type":"Water"},{"x":352,"y":160,"type":"Water"},{"x":368,"y":160,"type":"Water"},{"x":368,"y":144,"type":"Water"},{"x":352,"y":144,"type":"Water"},{"x":368,"y":144,"type":"Water"},{"x":384,"y":144,"type":"Water"},{"x":384,"y":128,"type":"Water"},{"x":368,"y":128,"type":"Water"},{"x":384,"y":128,"type":"Water"},{"x":400,"y":128,"type":"Water"},{"x":400,"y":112,"type":"Water"},{"x":384,"y":112,"type":"Water"},{"x":400,"y":112,"type":"Water"},{"x":416,"y":112,"type":"Water"},{"x":400,"y":112,"type":"Water"},{"x":400,"y":96,"type":"Water"},{"x":400,"y":80,"type":"Water"},{"x":400,"y":64,"type":"Water"},{"x":384,"y":64,"type":"Water"},{"x":384,"y":48,"type":"Water"},{"x":368,"y":48,"type":"Water"},{"x":368,"y":32,"type":"Water"},{"x":352,"y":32,"type":"Water"},{"x":352,"y":16,"type":"Water"},{"x":352,"y":16,"type":"Water"},{"x":0,"y":176,"type":"Water"},{"x":16,"y":176,"type":"Water"},{"x":32,"y":176,"type":"Water"},{"x":48,"y":176,"type":"Water"},{"x":64,"y":176,"type":"Water"},{"x":80,"y":176,"type":"Water"},{"x":96,"y":176,"type":"Water"},{"x":112,"y":176,"type":"Water"},{"x":128,"y":176,"type":"Water"},{"x":144,"y":176,"type":"Water"},{"x":160,"y":176,"type":"Water"},{"x":176,"y":176,"type":"Water"},{"x":192,"y":176,"type":"Water"},{"x":208,"y":176,"type":"Water"},{"x":224,"y":176,"type":"Water"},{"x":240,"y":176,"type":"Water"},{"x":256,"y":176,"type":"Water"},{"x":272,"y":176,"type":"Water"},{"x":288,"y":176,"type":"Water"},{"x":304,"y":176,"type":"Water"},{"x":320,"y":176,"type":"Water"},{"x":336,"y":176,"type":"Water"},{"x":352,"y":176,"type":"Water"},{"x":352,"y":176,"type":"Water"},{"x":272,"y":224,"type":"Tree"},{"x":288,"y":224,"type":"Tree"},{"x":304,"y":224,"type":"Tree"},{"x":320,"y":224,"type":"Tree"},{"x":336,"y":224,"type":"Tree"},{"x":336,"y":240,"type":"Tree"},{"x":336,"y":256,"type":"Tree"},{"x":320,"y":256,"type":"Tree"},{"x":304,"y":256,"type":"Tree"},{"x":288,"y":256,"type":"Tree"},{"x":272,"y":256,"type":"Tree"},{"x":272,"y":240,"type":"Tree"},{"x":256,"y":240,"type":"Tree"},{"x":272,"y":240,"type":"Tree"},{"x":288,"y":240,"type":"Tree"},{"x":304,"y":240,"type":"Tree"},{"x":320,"y":240,"type":"Tree"},{"x":336,"y":240,"type":"Tree"},{"x":352,"y":240,"type":"Tree"},{"x":352,"y":240,"type":"Tree"},{"x":304,"y":208,"type":"Grass"},{"x":320,"y":208,"type":"Grass"},{"x":336,"y":208,"type":"Grass"},{"x":336,"y":208,"type":"Grass"},{"x":256,"y":224,"type":"Grass"},{"x":240,"y":240,"type":"Grass"},{"x":256,"y":256,"type":"Grass"},{"x":272,"y":272,"type":"Grass"},{"x":288,"y":272,"type":"Grass"},{"x":304,"y":272,"type":"Grass"},{"x":320,"y":272,"type":"Grass"},{"x":336,"y":272,"type":"Grass"},{"x":336,"y":272,"type":"Grass"},{"x":352,"y":256,"type":"Grass"},{"x":352,"y":224,"type":"Grass"},{"x":368,"y":240,"type":"Grass"},{"x":288,"y":192,"type":"ShoreN"},{"x":304,"y":192,"type":"ShoreN"},{"x":320,"y":192,"type":"ShoreN"},{"x":304,"y":192,"type":"ShoreN"},{"x":288,"y":192,"type":"ShoreN"},{"x":272,"y":192,"type":"ShoreN"},{"x":336,"y":192,"type":"ShoreN"},{"x":288,"y":208,"type":"Grass"},{"x":272,"y":208,"type":"Grass"},{"x":352,"y":208,"type":"ShoreE"},{"x":368,"y":224,"type":"ShoreE"},{"x":384,"y":240,"type":"ShoreE"},{"x":368,"y":256,"type":"ShoreE"},{"x":352,"y":272,"type":"ShoreE"},{"x":272,"y":288,"type":"ShoreS"},{"x":288,"y":288,"type":"ShoreS"},{"x":320,"y":288,"type":"ShoreS"},{"x":336,"y":288,"type":"ShoreS"},{"x":320,"y":288,"type":"ShoreS"},{"x":304,"y":288,"type":"ShoreS"},{"x":304,"y":288,"type":"ShoreS"},{"x":256,"y":272,"type":"ShoreW"},{"x":240,"y":256,"type":"ShoreW"},{"x":224,"y":240,"type":"ShoreW"},{"x":240,"y":224,"type":"ShoreW"},{"x":256,"y":208,"type":"ShoreW"},{"x":352,"y":192,"type":"Water"},{"x":368,"y":192,"type":"Water"},{"x":368,"y":208,"type":"Water"},{"x":384,"y":208,"type":"Water"},{"x":384,"y":224,"type":"Water"},{"x":400,"y":224,"type":"Water"},{"x":400,"y":240,"type":"Water"},{"x":416,"y":240,"type":"Water"},{"x":416,"y":256,"type":"Water"},{"x":400,"y":256,"type":"Water"},{"x":384,"y":256,"type":"Water"},{"x":384,"y":272,"type":"Water"},{"x":384,"y":288,"type":"Water"},{"x":368,"y":288,"type":"Water"},{"x":368,"y":272,"type":"Water"},{"x":368,"y":288,"type":"Water"},{"x":384,"y":288,"type":"Water"},{"x":368,"y":288,"type":"Water"},{"x":352,"y":288,"type":"Water"},{"x":352,"y":304,"type":"Water"},{"x":336,"y":304,"type":"Water"},{"x":320,"y":304,"type":"Water"},{"x":304,"y":304,"type":"Water"},{"x":288,"y":304,"type":"Water"},{"x":272,"y":304,"type":"Water"},{"x":256,"y":304,"type":"Water"},{"x":256,"y":288,"type":"Water"},{"x":240,"y":288,"type":"Water"},{"x":240,"y":272,"type":"Water"},{"x":224,"y":272,"type":"Water"},{"x":224,"y":256,"type":"Water"},{"x":208,"y":256,"type":"Water"},{"x":208,"y":240,"type":"Water"},{"x":208,"y":224,"type":"Water"},{"x":224,"y":224,"type":"Water"},{"x":224,"y":208,"type":"Water"},{"x":240,"y":208,"type":"Water"},{"x":240,"y":192,"type":"Water"},{"x":256,"y":192,"type":"Water"},{"x":256,"y":192,"type":"Water"},{"x":304,"y":32,"type":"ShoreN"},{"x":80,"y":112,"type":"Farm"},{"x":112,"y":112,"type":"TownCenter"},{"x":144,"y":112,"type":"House"}],
    bgs: [],
    tiles: [{"depth":-10,"tiles":[]}],
    onStep() {
        //console.log(this.x + "," + this.y)
//console.log(this.getBounds())
//console.log(this.getGlobalPosition())
//console.log(this.getLocalBounds())
//console.log(this.position)

if(ct.actions.moveMapN.pressed) {
    this.y -= 16;
    this.moveUIs(0, -16);
}
if(ct.actions.moveMapE.pressed) {
    this.x += 16;
    this.moveUIs(16, 0);
}
if(ct.actions.moveMapS.pressed) {
    this.y += 16;
    this.moveUIs(0, 16);

// console.log(this.x + "," + this.y)
// console.log(this.getBounds())
// console.log(this.getGlobalPosition())
// console.log(this.getLocalBounds())
// console.log(this.position)

}
if(ct.actions.moveMapW.pressed) {
    this.x -= 16;
    this.moveUIs(-16, 0);
}
    },
    onDraw() {

    },
    onLeave() {

    },
    onCreate() {
        cursor = ct.types.copy("Cursor");

ct.mouse.hide();

this.topBar = ct.types.copy("TopBar");
this.workers = ct.types.copy("Workers");
this.wooders = ct.types.copy("Wooders");
this.fooders = ct.types.copy("Fooders");
this.herbers = ct.types.copy("Herbers");
this.curers = ct.types.copy("Curers");
this.idle = ct.types.copy("Idle");
this.endTurn = ct.types.copy("EndTurn");

this.UIs = [this.topBar, this.workers, this.wooders, this.fooders, this.herbers, this.curers, this.idle, this.endTurn];
const UIsL = this.UIs.length;

const UIsX = ct.width - 16;
let UIsY = 16;

for(let i = 0; i < UIsL; i++ ) {
    if(i === 0) {
        this.UIs[i].x = 0;
        this.UIs[i].y = 0;
    }
    else {
        this.UIs[i].x = UIsX;
        this.UIs[i].y = UIsY;
        UIsY += 16;
    }
}

this.moveUIs = function(offsetX, offsetY) {
    for(let i in this.UIs){
        this.UIs[i].x += offsetX;
        this.UIs[i].y += offsetY;
    }
}
    }
}
ct.rooms.templates['Room0'] = {
    name: 'Room0',
    width: 320,
    height: 176,
    objects: [],
    bgs: [],
    tiles: [{"depth":-10,"tiles":[]}],
    onStep() {
        if(ct.actions.endTurnAction.pressed && overlay === null) {
    endTurn();
}

if(ct.actions.moveMapN.down && overlay === null) {
    if(this.y - 16 >= 0) {
        this.y -= 16;
        this.moveUIs(0, -16);
    }
}
if(ct.actions.moveMapE.down && overlay === null) {
    if(this.x + 16 <= this.width - ct.viewWidth) {
        this.x += 16;
        this.moveUIs(16, 0);
    }
}
if(ct.actions.moveMapS.down && overlay === null) {
    if(this.y + 16 <= this.height - ct.viewHeight) {
        this.y += 16;
        this.moveUIs(0, 16);
    }
}
if(ct.actions.moveMapW.down && overlay === null) {
    if(this.x - 16 >= 0) {
        this.x -= 16;
        this.moveUIs(-16, 0);
    }
}

if(ct.actions.muteMusic.released) {
    if(ct.sound.playing("Sadness")) {
        ct.sound.pause("Sadness");
    }
    else {
        ct.sound.resume("Sadness");
    }
}
    },
    onDraw() {

    },
    onLeave() {

    },
    onCreate() {
        genMap();

//console.log("Surface utile: ", ct.types.list.Grass.length + ct.types.list.Tree.length)

ct.sound.stop("Title");
ct.sound.spawn("Sadness", { loop: true });
ct.sound.volume("Sadness", 0.4);

//debugIsles();

cursor = ct.types.copy("Cursor");

ct.mouse.hide();

//this.scrollSpeed = 16;

this.x = islands[startIsland].x1 * tileSize;
this.y = islands[startIsland].y1 * tileSize;

// this.x = (islands[startIsland].x1 * tileSize) - (islands[startIsland].w * tileSize);
// this.y = (islands[startIsland].y1 * tileSize) - ((islands[startIsland].h * tileSize) / 2);

// this.x =  (islands[startIsland].x1 * tileSize) + ((this.width - (islands[startIsland].w * tileSize)) / 2);
// this.y =  (islands[startIsland].y1 * tileSize) + ((this.height - (islands[startIsland].h * tileSize)) / 2);

this.topBar = ct.types.copy("TopBar");
this.workers = ct.types.copy("Workers");
this.fooders = ct.types.copy("Fooders");
this.wooders = ct.types.copy("Wooders");
this.herbers = ct.types.copy("Herbers");
this.curers = ct.types.copy("Curers");
this.idle = ct.types.copy("Idle");
this.endTurn = ct.types.copy("EndTurn");
this.botBar = ct.types.copy("BotBar");

this.UIs = [this.topBar, this.workers, this.fooders, this.wooders, this.herbers, this.curers, this.idle, this.endTurn, this.botBar];
const UIsL = this.UIs.length;

const UIsX = ct.width - 16;
let UIsY = 16;

for(let i = 0; i < UIsL; i++ ) {
    if(i === 0) {
        this.UIs[i].x = 0;
        this.UIs[i].y = 0;
    }
    else if(i === 8) {
        this.UIs[i].x = 0;
        this.UIs[i].y = ct.viewHeight - this.UIs[i].height;
    }
    else {
        this.UIs[i].x = UIsX;
        this.UIs[i].y = UIsY;
        UIsY += 16;
    }
}

this.moveUIs = function(offsetX, offsetY) {
    for(let i in this.UIs){
        this.UIs[i].x += offsetX;
        this.UIs[i].y += offsetY;
    }
}

this.moveUIs(this.x, this.y);//move ui at start according to room pos i set

intro(this);
    }
}
ct.rooms.templates['Title'] = {
    name: 'Title',
    width: 320,
    height: 176,
    objects: [{"x":116,"y":64,"type":"PressStart"}],
    bgs: [{"depth":0,"texture":"titleWIPwithoutStart","extends":{"repeat":"no-repeat"}}],
    tiles: [{"depth":-10,"tiles":[]}],
    onStep() {
        if(ct.mouse.down) {
    ct.sound.spawn("start");
    ct.rooms.switch("Room0");
}

if(ct.actions.muteMusic.released) {
    if(ct.sound.playing("Title")) {
        ct.sound.pause("Title");
    }
    else {
        ct.sound.resume("Title");
    }
}
    },
    onDraw() {

    },
    onLeave() {

    },
    onCreate() {
        cursor = ct.types.copy("Cursor");

ct.mouse.hide();

ct.sound.spawn("Title", { loop: true });
ct.sound.volume("Title", 0.6);
    }
}

/**
 * @namespace
 */
ct.styles = {
    types: { },
    /*
     * Creates a new style with a given name. Technically, it just writes `data` to `ct.styles.types`
     */
    new(name, data) {
        ct.styles.types[name] = data;
        return data;
    },
    /**
     * Returns a style of a given name. The actual behavior strongly depends on `copy` parameter.
     * @param {string} name The name of the style to load
     * @param {boolean|Object} [copy] If not set, returns the source style object. Editing it will affect all new style calls.
     *      When set to `true`, will create a new object, which you can safely modify without affecting the source style.
     *      When set to an object, this will create a new object as well, augmenting it with given properties.
     * @returns {object} The resulting style
     */
    get(name, copy) {
        if (copy === true) {
            return ct.u.ext({}, ct.styles.types[name]);
        }
        if (copy) {
            return ct.u.ext(ct.u.ext({}, ct.styles.types[name]), copy);
        }
        return ct.styles.types[name];
    }
};

ct.styles.new(
    "Stats",
    {
    "fontFamily": "myfont",
    "fontSize": 12,
    "fontStyle": "normal",
    "fontWeight": "100",
    "lineJoin": "round",
    "lineHeight": 10
});

ct.styles.new(
    "DELStatsCenter",
    {
    "fontFamily": "myfont",
    "fontSize": 13,
    "fontStyle": "normal",
    "fontWeight": 400,
    "align": "center",
    "lineJoin": "round",
    "lineHeight": 17.55,
    "fill": "#FFF1E8"
});

ct.styles.new(
    "Intro",
    {
    "fontFamily": "myfont",
    "fontSize": 12,
    "fontStyle": "normal",
    "fontWeight": "100",
    "lineJoin": "round",
    "lineHeight": 14,
    "wordWrap": true,
    "wordWrapWidth": 245
});

ct.styles.new(
    "StatsCenter",
    {
    "fontFamily": "myfont",
    "fontSize": 12,
    "fontStyle": "normal",
    "fontWeight": "100",
    "align": "center",
    "lineJoin": "round",
    "lineHeight": 10
});



(function (ct) {
    const loader = new PIXI.Loader();
    const loadingLabel = ct.pixiApp.view.previousSibling,
          loadingBar = loadingLabel.querySelector('.ct-aLoadingBar');
    /* global dragonBones */
    const dbFactory = window.dragonBones? dragonBones.PixiFactory.factory : null;
    /**
     * An utility object that managess and stores textures and other entities
     * @namespace
     */
    ct.res = {
        soundsLoaded: 0,
        soundsTotal: [15][0],
        soundsError: 0,
        sounds: {},
        registry: [{"SMSshoreE":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"SMSwater":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"SMStree":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"SMSshoreW":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"SMSshoreN":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"SMSgrass":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"SMSshoreS":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"SMSjobs":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"SMStemple":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"SMShouse":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"SMScursor":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"SMStempleMenu":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"SMShouseMenu":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"SMStopbar":{"frames":1,"shape":{"type":"rect","top":0,"bottom":10,"left":0,"right":320},"anchor":{"x":0,"y":0}},"SMScursor2":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"SMSlabels":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"SMShere":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"SMSfarm":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"SMSfarmMenu":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"SMStowncenter":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"SMStowncenterMenu":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"SMStopbar2":{"frames":1,"shape":{"type":"rect","top":0,"bottom":10,"left":0,"right":320},"anchor":{"x":0,"y":0}},"stump":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"SMSshoreEbridge":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"SMSshoreWbridge":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"SMSshoreSbridge":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"SMSshoreNbridge":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"SMSbridgeH":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"SMSbridgeV":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"SMSbridgeHmenu":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"SMSshoreNbridgeMenu":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"SMSshoreWbridgeMenu":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"SMSshoreEbridgeMenu":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"SMSbridgeVmenu":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"SMSshoreSbridgeMenu":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"plague":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"pointer":{"frames":1,"shape":{"type":"rect","top":0,"bottom":7,"left":0,"right":7},"anchor":{"x":0,"y":0}},"SMSshoreSE":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"SMSshoreNW":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"SMSshoreNE":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"SMSshoreSW":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"overlay":{"frames":1,"shape":{"type":"rect","top":0,"bottom":176,"left":0,"right":320},"anchor":{"x":0,"y":0}},"gameover":{"frames":1,"shape":{"type":"rect","top":0,"bottom":50,"left":0,"right":100},"anchor":{"x":0,"y":0}},"intro":{"frames":1,"shape":{"type":"rect","top":0,"bottom":130,"left":0,"right":260},"anchor":{"x":0,"y":0}},"titleWIPwithoutStart":{"frames":1,"shape":{"type":"rect","top":0,"bottom":176,"left":0,"right":320},"anchor":{"x":0,"y":0}},"press_start":{"frames":1,"shape":{"type":"rect","top":0,"bottom":7,"left":0,"right":87},"anchor":{"x":0,"y":0}},"SMSjobs2":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}},"SMSlabels2":{"frames":1,"shape":{"type":"rect","top":0,"bottom":16,"left":0,"right":16},"anchor":{"x":0,"y":0}}}][0],
        atlases: [["./img/a0.json"]][0],
        skelRegistry: [{}][0],
        fetchImage(url, callback) {
            loader.add(url, url);
            loader.load((loader, resources) => {
                callback(resources);
            });
            loader.onError((loader, resources) => {
                loader.add(url, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NkAAIAAAoAAggA9GkAAAAASUVORK5CYII=');
                console.error('[ct.res] An image from ' + resources + ' wasn\'t loaded :( Maybe refreshing the page will solve this problem…');
                ct.res.texturesError++;
            });
        },
        parseImages() {
            // filled by IDE and catmods. As usual, atlases are splitted here.
            PIXI.Loader.shared
.add('./img/a0.json');


            PIXI.Loader.shared.load();
        },
        /*
         * Gets a pixi.js texture from a ct.js' texture name, so that it can be used in pixi.js objects.
         * @param {string} name The name of the ct.js texture
         * @param {number} [frame] The frame to extract
         * @returns {PIXI.Texture|Array<PIXI.Texture>} If `frame` was specified, returns a single PIXI.Texture. Otherwise, returns an array with all the frames of this ct.js' texture.
         *
         * @note Formatted as a non-jsdoc comment as it requires a better ts declaration than the auto-generated one
         */
        getTexture(name, frame) {
            if (name === -1) {
                if (frame !== void 0) {
                    return PIXI.Texture.EMPTY;
                }
                return [PIXI.Texture.EMPTY];
            }
            const reg = ct.res.registry[name];
            if (frame !== void 0) {
                return reg.textures[frame];
            }
            return reg.textures;
        },
        /**
         * Creates a DragonBones skeleton, ready to be added to your copies.
         * @param {string} name The name of the skeleton asset
         * @returns {object} The created skeleton
         */
        makeSkeleton(name) {
            const r = ct.res.skelRegistry[name],
                  skel = dbFactory.buildArmatureDisplay('Armature', r.data.name);
            skel.ctName = name;
            skel.on(dragonBones.EventObject.SOUND_EVENT, function (event) {
                if (ct.sound.exists(event.name)) {
                    ct.sound.spawn(event.name);
                } else {
                    console.warn(`Skeleton ${skel.ctName} tries to play a non-existing sound ${event.name} at animation ${skel.animation.lastAnimationName}`);
                }
            });
            return skel;
        }
    };

    PIXI.Loader.shared.onLoad.add(e => {
        loadingLabel.setAttribute('data-progress', e.progress);
        loadingBar.style.width = e.progress + '%';
    });
    PIXI.Loader.shared.onComplete.add(() => {
        for (const texture in ct.res.registry) {
            const reg = ct.res.registry[texture];
            reg.textures = [];
            if (reg.frames) {
                for (let i = 0; i < reg.frames; i++) {
                    const frame = `${texture}@frame${i}`;
                    const atlas = PIXI.Loader.shared.resources[ct.res.atlases.find(atlas =>
                        frame in PIXI.Loader.shared.resources[atlas].textures
                    )];
                    const tex = atlas.textures[frame];
                    tex.defaultAnchor = new PIXI.Point(reg.anchor.x, reg.anchor.y);
                    reg.textures.push(tex);
                }
            } else {
                const texture = PIXI.Loader.shared.resources[reg.atlas].texture;
                texture.defaultAnchor = new PIXI.Point(reg.anchor.x, reg.anchor.y);
                reg.textures.push(texture);
            }
        }
        for (const skel in ct.res.skelRegistry) {
            ct.res.skelRegistry[skel].data = PIXI.Loader.shared.resources[ct.res.skelRegistry[skel].origname + '_ske.json'].data;
        }


        loadingLabel.classList.add('hidden');
        setTimeout(() => {
            ct.place.ctypeCollections = {};
Object.defineProperty(ct.types.Copy.prototype, 'ctype', {
    set: function(value) {
        if (this.ctype) {
            ct.place.ctypeCollections[this.ctype].splice(ct.place.ctypeCollections[this.ctype].indexOf(this), 1);
        }
        if (value) {
            if (!(value in ct.place.ctypeCollections)) {
                ct.place.ctypeCollections[value] = [];
            }
            ct.place.ctypeCollections[value].push(this);
        }
        this.$ctype = value;
    },
    get: function() {
        return this.$ctype;
    }
});
Object.defineProperty(ct.types.Copy.prototype, 'moveContinuous', {
    value: function (ctype, precision) {
        if (this.gravity) {
            this.hspeed += this.gravity * ct.delta * Math.cos(this.gravityDir*Math.PI/-180);
            this.vspeed += this.gravity * ct.delta * Math.sin(this.gravityDir*Math.PI/-180);
        }
        return ct.place.moveAlong(this, this.direction, this.speed, ctype, precision);
    }
});
setTimeout(ct.fittoscreen, 0);
ct.mouse.setupListeners();

            ct.pixiApp.ticker.add(ct.loop);
            ct.rooms.forceSwitch(ct.rooms.starting);
        }, 0);
    });
    ct.res.parseImages();
})(ct);

/**
 * @extends {PIXI.TilingSprite}
 */
class Background extends PIXI.TilingSprite {
    constructor(bgName, frame, depth, exts) {
        exts = exts || {};
        var width = ct.viewWidth,
            height = ct.viewHeight;
        if (exts.repeat === 'no-repeat' || exts.repeat === 'repeat-x') {
            height = ct.res.getTexture(bgName, frame || 0).orig.height * (exts.scaleY || 1);
        }
        if (exts.repeat === 'no-repeat' || exts.repeat === 'repeat-y') {
            width = ct.res.getTexture(bgName, frame || 0).orig.width * (exts.scaleX || 1);
        }
        super(ct.res.getTexture(bgName, frame || 0), width, height);
        ct.types.list.BACKGROUND.push(this);
        this.anchor.x = this.anchor.y = 0;
        this.depth = depth;
        this.shiftX = this.shiftY = this.movementX = this.movementY = 0;
        this.parallaxX = this.parallaxY = 1;
        if (exts) {
            ct.u.extend(this, exts);
        }
        if (this.scaleX) {
            this.tileScale.x = Number(this.scaleX);
        }
        if (this.scaleY) {
            this.tileScale.y = Number(this.scaleY);
        }
    }
    onStep() {
        this.shiftX += ct.delta * this.movementX;
        this.shiftY += ct.delta * this.movementY;
    }
    onDraw() {
        if (this.repeat !== 'repeat-x' && this.repeat !== 'no-repeat') {
            this.y = ct.room.y;
            this.tilePosition.y = -this.y*this.parallaxY + this.shiftY;
        } else {
            this.y = this.shiftY + ct.room.y * (this.parallaxY - 1);
        }
        if (this.repeat !== 'repeat-y' && this.repeat !== 'no-repeat') {
            this.x = ct.room.x;
            this.tilePosition.x = -this.x*this.parallaxX + this.shiftX;
        } else {
            this.x = this.shiftX + ct.room.x * (this.parallaxX - 1);
        }
    }
    static onCreate() {
        void 0;
    }
    static onDestroy() {
        void 0;
    }
}
/**
 * @extends {PIXI.Container}
 */
class Tileset extends PIXI.Container {
    constructor(data) {
        super();
        this.depth = data.depth;
        this.tiles = data.tiles;
        ct.types.list.TILELAYER.push(this);
        for (let i = 0, l = data.tiles.length; i < l; i++) {
            const textures = ct.res.getTexture(data.tiles[i].texture);
            const sprite = new PIXI.Sprite(textures[data.tiles[i].frame]);
            sprite.anchor.x = sprite.anchor.y = 0;
            this.addChild(sprite);
            sprite.x = data.tiles[i].x;
            sprite.y = data.tiles[i].y;
        }
        const bounds = this.getLocalBounds();
        const cols = Math.ceil(bounds.width / 1024),
                rows = Math.ceil(bounds.height / 1024);
        if (cols < 2 && rows < 2) {
            if (this.width > 0 && this.height > 0) {
                this.cacheAsBitmap = true;
            }
            return this;
        }
        /*const mask = new PIXI.Graphics();
        mask.lineStyle(0);
        mask.beginFill(0xffffff);
        mask.drawRect(0, 0, 1024, 1024);
        mask.endFill();*/
        this.cells = [];
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cell = new PIXI.Container();
                //cell.x = x * 1024 + bounds.x;
                //cell.y = y * 1024 + bounds.y;
                this.cells.push(cell);
            }
        }
        for (let i = 0, l = data.tiles.length; i < l; i++) {
            const tile = this.children[0],
                    x = Math.floor((tile.x - bounds.x) / 1024),
                    y = Math.floor((tile.y - bounds.y) / 1024);
            this.cells[y * cols + x].addChild(tile);
            /*if (tile.x - x * 1024 + tile.width > 1024) {
                this.cells[y*cols + x + 1].addChild(tile);
                if (tile.y - y * 1024 + tile.height > 1024) {
                    this.cells[(y+1)*cols + x + 1].addChild(tile);
                }
            }
            if (tile.y - y * 1024 + tile.height > 1024) {
                this.cells[(y+1)*cols + x].addChild(tile);
            }*/
        }
        this.removeChildren();
        for (let i = 0, l = this.cells.length; i < l; i++) {
            if (this.cells[i].children.length === 0) {
                this.cells.splice(i, 1);
                i--; l--;
                continue;
            }
            //this.cells[i].mask = mask;
            this.addChild(this.cells[i]);
            this.cells[i].cacheAsBitmap = true;
        }
    }
}
/**
 * @extends {PIXI.AnimatedSprite}
 * @class
 * @property {string} type The name of the type from which the copy was created
 * @property {IShapeTemplate} shape The collision shape of a copy
 * @property {number} xprev The horizontal location of a copy in the previous frame
 * @property {number} yprev The vertical location of a copy in the previous frame
 * @property {number} hspeed The horizontal speed of a copy
 * @property {number} vspeed The vertical speed of a copy
 * @property {number} gravity The acceleration that pulls a copy at each frame
 * @property {number} gravityDir The direction of acceleration that pulls a copy at each frame
 * @property {number} depth The position of a copy in draw calls
 * @property {boolean} kill If set to `true`, the copy will be destroyed by the end of a frame.
 */
const Copy = (function () {
    const textureAccessor = Symbol('texture');
    class Copy extends PIXI.AnimatedSprite {
        /**
         * Creates an instance of Copy.
         * @param {string} type The name of the type to copy
         * @param {number} [x] The x coordinate of a new copy. Defaults to 0.
         * @param {number} [y] The y coordinate of a new copy. Defaults to 0.
         * @param {object} [exts] An optional object with additional properties
         * that will exist prior to a copy's OnCreate event
         * @memberof Copy
         */
        constructor(type, x, y, exts) {
            var t;
            if (type) {
                if (!(type in ct.types.templates)) {
                    throw new Error(`[ct.types] An attempt to create a copy of a non-existent type \`${type}\` detected. A typo?`);
                }
                t = ct.types.templates[type];
                if (t.texture && t.texture !== '-1') {
                    const textures = ct.res.getTexture(t.texture);
                    super(textures);
                    this[textureAccessor] = t.texture;
                    this.anchor.x = textures[0].defaultAnchor.x;
                    this.anchor.y = textures[0].defaultAnchor.y;
                } else {
                    super([PIXI.Texture.EMPTY]);
                }
                this.type = type;
                if (t.extends) {
                    ct.u.ext(this, t.extends);
                }
            } else {
                super([PIXI.Texture.EMPTY]);
            }
            // it is defined in main.js
            // eslint-disable-next-line no-undef
            this[copyTypeSymbol] = true;
            if (exts) {
                ct.u.ext(this, exts);
                if (exts.tx) {
                    this.scale.x = exts.tx;
                    this.scale.y = exts.ty;
                }
            }
            this.position.set(x || 0, y || 0);
            this.xprev = this.xstart = this.x;
            this.yprev = this.ystart = this.y;
            this.speed = this.direction = this.gravity = this.hspeed = this.vspeed = 0;
            this.gravityDir = 270;
            this.depth = 0;
            this.uid = ++ct.room.uid;
            if (type) {
                ct.u.ext(this, {
                    type,
                    depth: t.depth,
                    onStep: t.onStep,
                    onDraw: t.onDraw,
                    onCreate: t.onCreate,
                    onDestroy: t.onDestroy,
                    shape: t.texture ? ct.res.registry[t.texture].shape : {}
                });
                if (ct.types.list[type]) {
                    ct.types.list[type].push(this);
                } else {
                    ct.types.list[type] = [this];
                }
                ct.types.templates[type].onCreate.apply(this);
            }
            return this;
        }

        /**
         * The name of the current copy's texture
         * @param {string} value The name of the new texture
         * @type {string}
         */
        set tex(value) {
            this.textures = ct.res.getTexture(value);
            this[textureAccessor] = value;
            this.shape = value !== -1 ? ct.res.registry[value].shape : {};
            this.anchor.x = this.textures[0].defaultAnchor.x;
            this.anchor.y = this.textures[0].defaultAnchor.y;
            return value;
        }
        get tex() {
            return this[textureAccessor];
        }

        get speed() {
            return Math.hypot(this.hspeed, this.vspeed);
        }
        /**
         * The speed of a copy that is used in `this.move()` calls
         * @param {number} value The new speed value
         * @type {number}
         */
        set speed(value) {
            if (this.speed === 0) {
                this.hspeed = value;
                return;
            }
            var multiplier = value / this.speed;
            this.hspeed *= multiplier;
            this.vspeed *= multiplier;
        }
        get direction() {
            return (Math.atan2(this.vspeed, this.hspeed) * -180 / Math.PI + 360) % 360;
        }
        /**
         * The moving direction of the copy, in degrees, starting with 0 at the right side
         * and going with 90 facing upwards, 180 facing left, 270 facing down.
         * This parameter is used by `this.move()` call.
         * @param {number} value New direction
         * @type {number}
         */
        set direction(value) {
            var speed = this.speed;
            this.hspeed = speed * Math.cos(value*Math.PI/-180);
            this.vspeed = speed * Math.sin(value*Math.PI/-180);
            return value;
        }
        get rotation() {
            return this.transform.rotation / Math.PI * -180;
        }
        /**
         * The direction of a copy's texture.
         * @param {number} value New rotation value
         * @type {number}
         */
        set rotation(value) {
            this.transform.rotation = value * Math.PI / -180;
            return value;
        }

        /**
         * Performs a movement step, reading such parameters as `gravity`, `speed`, `direction`.
         * @returns {void}
         */
        move() {
            if (this.gravity) {
                this.hspeed += this.gravity * ct.delta * Math.cos(this.gravityDir*Math.PI/-180);
                this.vspeed += this.gravity * ct.delta * Math.sin(this.gravityDir*Math.PI/-180);
            }
            this.x += this.hspeed * ct.delta;
            this.y += this.vspeed * ct.delta;
        }
        /**
         * Adds a speed vector to the copy, accelerating it by a given delta speed in a given direction.
         * @param {number} spd Additive speed
         * @param {number} dir The direction in which to apply additional speed
         * @returns {void}
         */
        addSpeed(spd, dir) {
            this.hspeed += spd * Math.cos(dir*Math.PI/-180);
            this.vspeed += spd * Math.sin(dir*Math.PI/-180);
        }
    }
    return Copy;
})();

(function (ct) {
    const onCreateModifier = function () {
        this.$chashes = ct.place.getHashes(this);
for (const hash of this.$chashes) {
    if (!(hash in ct.place.grid)) {
        ct.place.grid[hash] = [this];
    } else {
        ct.place.grid[hash].push(this);
    }
}
if ([false][0] && this instanceof ct.types.Copy) {
    this.$cDebugText = new PIXI.Text('Not initialized', {
        fill: 0xffffff,
        dropShadow: true,
        dropShadowDistance: 2,
        fontSize: [][0] || 16
    });
    this.$cDebugCollision = new PIXI.Graphics();
    this.addChild(this.$cDebugCollision, this.$cDebugText);
}

    };

    /**
     * An object with properties and methods for manipulating types and copies,
     * mainly for finding particular copies and creating new ones.
     * @namespace
     */
    ct.types = {
        Copy,
        Background,
        Tileset,
        /**
         * An object that contains arrays of copies of all types.
         * @type {Object.<string,Array<Copy>>}
         */
        list: {
            BACKGROUND: [],
            TILELAYER: []
        },
        /**
         * A map of all the templates of types exported from ct.IDE.
         * @type {object}
         */
        templates: { },
        /**
         * Creates a new copy of a given type.
         * @param {string} type The name of the type to use
         * @param {number} [x] The x coordinate of a new copy. Defaults to 0.
         * @param {number} [y] The y coordinate of a new copy. Defaults to 0.
         * @param {object} [exts] An optional object which parameters will be applied to the copy prior to its OnCreate event.
         * @param {PIXI.Container} [container] The container to which add the copy. Defaults to the current room.
         * @returns {Copy} the created copy.
         * @alias ct.types.copy
         */
        make(type, x, y, exts, container) {
            // An advanced constructor. Returns a Copy
            if (exts instanceof PIXI.Container) {
                container = exts;
                exts = void 0;
            }
            const obj = new Copy(type, x, y, exts);
            if (container) {
                container.addChild(obj);
            } else {
                ct.room.addChild(obj);
            }
            ct.stack.push(obj);
            onCreateModifier.apply(obj);
            return obj;
        },
        /**
         * Calls `move` on a given copy, recalculating its position based on its speed.
         * @param {Copy} o The copy to move
         * @returns {void}
         * @deprecated
         */
        move(o) {
            o.move();
        },
        /**
         * Applies an acceleration to the copy, with a given additive speed and direction.
         * Technically, calls copy's `addSpeed(spd, dir)` method.
         * @param {any} o The copy to accelerate
         * @param {any} spd The speed to add
         * @param {any} dir The direction in which to push the copy
         * @returns {void}
         * @deprecated
         */
        addSpeed(o, spd, dir) {
            o.addSpeed(spd, dir);
        },
        /**
         * Applies a function to each copy in the current room
         * @param {Function} func The function to apply
         * @returns {void}
         */
        each(func) {
            for (const i in ct.stack) {
                func.apply(ct.stack[i], this);
            }
        },
        /*
         * Applies a function to a given object (e.g. to a copy)
         */
        'with'(obj, func) {
            func.apply(obj, this);
        }
    };
    ct.types.copy = ct.types.make;
    ct.types.addSpd = ct.types.addSpeed;

    ct.types.templates["Cursor"] = {
    depth:100,
    texture: "SMScursor2",
    onStep: function () {
cursor.x = Math.floor(ct.mouse.x / 16) * 16;
cursor.y = Math.floor(ct.mouse.y / 16) * 16;

//botBar.text = cursor.x /16 + "," + cursor.y /16

if(ct.actions.mouseRight.pressed) {
    hideBuildingMenu();
}

    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {

    },
    extends: {}};
ct.types.list['Cursor'] = [];
ct.types.templates["Farm"] = {
    depth:0,
    texture: "SMSfarm",
    onStep: function () {
if(ct.mouse.hovers(this)) {
    botBar.text = "Farm. Increase food workers capacity by " + buildingEffect.farm + ".";
}

    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {

    },
    extends: {"ctype":"Building"}};
ct.types.list['Farm'] = [];
ct.types.templates["FarmB"] = {
    depth:1,
    texture: "SMSfarmMenu",
    onStep: function () {
if(ct.mouse.hovers(this)) {
    botBar.text = "LMB to build a farm. Food workers capacity +" + buildingEffect.farm + ". Cost: " + cost.farm + " wood."  + enoughResource("farm");
}

if(ct.actions.mouseLeft.pressed) {
    if(ct.mouse.hovers(this)){
        build("Farm");
    }
}
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {

    },
    extends: {"ctype":"UI"}};
ct.types.list['FarmB'] = [];
ct.types.templates["Grass"] = {
    depth:0,
    texture: "SMSgrass",
    onStep: function () {
tileOnStep(this);
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {

    },
    extends: {"ctype":"Tile"}};
ct.types.list['Grass'] = [];
ct.types.templates["House"] = {
    depth:0,
    texture: "SMShouse",
    onStep: function () {
if(ct.mouse.hovers(this)) {
    botBar.text = "House. Increase pop capacity by " + buildingEffect.house + ".";
}

    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {

    },
    extends: {"ctype":"Building"}};
ct.types.list['House'] = [];
ct.types.templates["HouseB"] = {
    depth:1,
    texture: "SMShouseMenu",
    onStep: function () {
if(ct.mouse.hovers(this)) {
    botBar.text = "LMB to build a house. Pop capacity +" + buildingEffect.house + ". Cost: " + cost.house + " wood." + enoughResource("house");
}

if(ct.actions.mouseLeft.pressed) {
    if(ct.mouse.hovers(this)){
        build("House");
    }
}
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {

    },
    extends: {"ctype":"UI"}};
ct.types.list['HouseB'] = [];
ct.types.templates["ShoreE"] = {
    depth:0,
    texture: "SMSshoreE",
    onStep: function () {
tileOnStep(this);
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {

    },
    extends: {"ctype":"Tile"}};
ct.types.list['ShoreE'] = [];
ct.types.templates["ShoreN"] = {
    depth:0,
    texture: "SMSshoreN",
    onStep: function () {
tileOnStep(this);
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {

    },
    extends: {"ctype":"Tile"}};
ct.types.list['ShoreN'] = [];
ct.types.templates["ShoreW"] = {
    depth:0,
    texture: "SMSshoreW",
    onStep: function () {
tileOnStep(this);
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {

    },
    extends: {"ctype":"Tile"}};
ct.types.list['ShoreW'] = [];
ct.types.templates["ShoreS"] = {
    depth:0,
    texture: "SMSshoreS",
    onStep: function () {
tileOnStep(this);
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {

    },
    extends: {"ctype":"Tile"}};
ct.types.list['ShoreS'] = [];
ct.types.templates["Temple"] = {
    depth:0,
    texture: "SMStemple",
    onStep: function () {
if(ct.mouse.hovers(this)) {
    botBar.text = "Temple. Needed to produce cure. Increase cure workers capacity by " + buildingEffect.temple + ".";
}
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {

    },
    extends: {"ctype":"Building"}};
ct.types.list['Temple'] = [];
ct.types.templates["TempleB"] = {
    depth:1,
    texture: "SMStempleMenu",
    onStep: function () {
if(ct.mouse.hovers(this)) {
    botBar.text = "LMB to build a temple. Needed to produce cure. Cure workers capacity +" + buildingEffect.temple + ". Cost: " + cost.temple + " wood." + enoughResource("temple");
}

if(ct.actions.mouseLeft.pressed) {
    if(ct.mouse.hovers(this)){
        build("Temple");
    }
}
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {

    },
    extends: {"ctype":"UI"}};
ct.types.list['TempleB'] = [];
ct.types.templates["TownCenter"] = {
    depth:0,
    texture: "SMStowncenter",
    onStep: function () {
if(ct.mouse.hovers(this)) {
    botBar.text = "Town center. Needed to build on an island.";
}
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {

    },
    extends: {"ctype":"Building"}};
ct.types.list['TownCenter'] = [];
ct.types.templates["TownCenterB"] = {
    depth:1,
    texture: "SMStowncenterMenu",
    onStep: function () {
if(ct.mouse.hovers(this)) {
    botBar.text = "LMB to build a town center. Needed on each island. Cost: " + cost.townCenter + " wood." + enoughResource("townCenter");
}

if(ct.actions.mouseLeft.pressed) {
    if(ct.mouse.hovers(this)){
        build("TownCenter");
    }
}
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {

    },
    extends: {"ctype":"UI"}};
ct.types.list['TownCenterB'] = [];
ct.types.templates["Tree"] = {
    depth:0,
    texture: "SMStree",
    onStep: function () {
tileOnStep(this);
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {

    },
    extends: {"ctype":"Tile"}};
ct.types.list['Tree'] = [];
ct.types.templates["Water"] = {
    depth:0,
    texture: "SMSwater",
    onStep: function () {
// if(ct.mouse.hovers(this)) {
//     botBar.text = "Sea. To connect islands, you have to start a bridge on a shore. Use arrows to move map.";
// }
tileOnStep(this);
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {

    },
    extends: {"ctype":"Tile"}};
ct.types.list['Water'] = [];
ct.types.templates["Here"] = {
    depth:1,
    texture: "SMShere",
    onStep: function () {
if(ct.mouse.hovers(this)) {

    //TODO fix this
    // const claimedIsland = islands[getIslandIndice(cursor.x, cursor.y)].town;

    // if(claimedIsland) {
    //     botBar.text = "If you select a building, it will be placed here with LMB. Use RMB to close menu.";
    // }
    // else {
    //     botBar.text = "Build a town center to claim this island.";
    // }
    botBar.text = "If you select a building, it will be placed here with LMB. Use RMB to close menu.";

    if(ct.actions.mouseLeft.pressed) {
        hideBuildingMenu();
    }

}
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {

    },
    extends: {"ctype":"UI"}};
ct.types.list['Here'] = [];
ct.types.templates["TopBar"] = {
    depth:10,
    texture: "SMStopbar",
    onStep: function () {

    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {
statsLabel.style = ct.styles.get('Stats');
setStatsTopBar();
this.addChild(statsLabel);
    },
    extends: {"ctype":"UI"}};
ct.types.list['TopBar'] = [];
ct.types.templates["Wooders"] = {
    depth:10,
    texture: "SMSjobs2",
    onStep: function () {
//cf. workersOnCreate function
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {
this.label = "Wood";
this.resource = "wood";
workersOnCreate(this);
    },
    extends: {"ctype":"UI"}};
ct.types.list['Wooders'] = [];
ct.types.templates["Fooders"] = {
    depth:10,
    texture: "SMSjobs2",
    onStep: function () {
//cf. workersOnCreate function
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {
this.label = "Food";
this.resource = "food";
workersOnCreate(this);
    },
    extends: {"ctype":"UI"}};
ct.types.list['Fooders'] = [];
ct.types.templates["Herbers"] = {
    depth:10,
    texture: "SMSjobs2",
    onStep: function () {
//cf. workersOnCreate function
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {
this.label = "Herb";
this.resource = "herb";
workersOnCreate(this);
    },
    extends: {"ctype":"UI"}};
ct.types.list['Herbers'] = [];
ct.types.templates["Curers"] = {
    depth:10,
    texture: "SMSjobs2",
    onStep: function () {
//cf. workersOnCreate function
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {
this.label = "Cure";
this.resource = "cure";
workersOnCreate(this);
    },
    extends: {"ctype":"UI"}};
ct.types.list['Curers'] = [];
ct.types.templates["EndTurn"] = {
    depth:10,
    texture: "SMSjobs2",
    onStep: function () {
if(ct.mouse.hovers(this) && overlay === null) {
    let msg;
    let idle = getIdle();
    if(idle === 1) {
        msg = "NB: You have an idle worker. You should assign all workers before ending the turn.";
    }
    else if(idle > 1) {
        msg = "NB: You have " + idle + " idle workers. You should assign all workers before ending the turn.";
    }
    else {
        msg = "Click here when you are ready to go to next turn. You can also press Enter or Space."
    }
    botBar.text = msg;
}

if(ct.actions.mouseLeft.pressed  && overlay === null) {
    if(ct.mouse.hovers(this)) {
        endTurn();
    }
}
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {
let lbl1 = new PIXI.Text("End");
lbl1.resolution = 2;
lbl1.x = 3;
lbl1.style = ct.styles.get('Stats');
this.addChild(lbl1);

let lbl2 = new PIXI.Text("Turn");
lbl2.resolution = 2;
lbl2.x = 2;
lbl2.y = 6;
lbl2.style = ct.styles.get('Stats');
this.addChild(lbl2);
    },
    extends: {"ctype":"UI"}};
ct.types.list['EndTurn'] = [];
ct.types.templates["Idle"] = {
    depth:10,
    texture: "SMSlabels2",
    onStep: function () {
if(ct.mouse.hovers(this)) {
    botBar.text = "Number of people without a job.";
}
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {
let lbl1 = new PIXI.Text("Idle");
lbl1.resolution = 2;
lbl1.x = 2;
lbl1.style = ct.styles.get('Stats');
this.addChild(lbl1);

idleLabel = new PIXI.Text( getIdle() );
idleLabel.resolution = 2;
idleLabel.x = 6;
idleLabel.y = 6;
idleLabel.style = ct.styles.get('Stats');
this.addChild(idleLabel);
    },
    extends: {"ctype":"UI"}};
ct.types.list['Idle'] = [];
ct.types.templates["Workers"] = {
    depth:10,
    texture: "SMSlabels2",
    onStep: function () {
if(ct.mouse.hovers(this)) {
    botBar.text = "For each resource: LMB to add a worker, RMB to remove a worker, MMB for 0 worker.";
}
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {
let lbl1 = new PIXI.Text("Wor");
lbl1.resolution = 2;
lbl1.x = 2;
lbl1.style = ct.styles.get('Stats');
this.addChild(lbl1);

let lbl2 = new PIXI.Text("kers");
lbl2.resolution = 2;
lbl2.x = 2;
lbl2.y = 6;
lbl2.style = ct.styles.get('Stats');
this.addChild(lbl2);
    },
    extends: {"ctype":"UI"}};
ct.types.list['Workers'] = [];
ct.types.templates["BotBar"] = {
    depth:10,
    texture: "SMStopbar",
    onStep: function () {
this.move();
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {
botBar.style = ct.styles.get('Stats');
this.addChild(botBar);
    },
    extends: {}};
ct.types.list['BotBar'] = [];
ct.types.templates["Stump"] = {
    depth:0,
    texture: "stump",
    onStep: function () {
tileOnStep(this);
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {

    },
    extends: {"ctype":"Tile"}};
ct.types.list['Stump'] = [];
ct.types.templates["ShoreNB"] = {
    depth:0,
    texture: "SMSshoreNbridge",
    onStep: function () {
if(ct.mouse.hovers(this)) {
    botBar.text = "Bridge.";
}
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {

    },
    extends: {"ctype":"Building"}};
ct.types.list['ShoreNB'] = [];
ct.types.templates["ShoreEB"] = {
    depth:0,
    texture: "SMSshoreEbridge",
    onStep: function () {
if(ct.mouse.hovers(this)) {
    botBar.text = "Bridge.";
}
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {

    },
    extends: {"ctype":"Building"}};
ct.types.list['ShoreEB'] = [];
ct.types.templates["ShoreSB"] = {
    depth:0,
    texture: "SMSshoreSbridge",
    onStep: function () {
if(ct.mouse.hovers(this)) {
    botBar.text = "Bridge.";
}
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {

    },
    extends: {"ctype":"Building"}};
ct.types.list['ShoreSB'] = [];
ct.types.templates["ShoreWB"] = {
    depth:0,
    texture: "SMSshoreWbridge",
    onStep: function () {
if(ct.mouse.hovers(this)) {
    botBar.text = "Bridge.";
}
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {

    },
    extends: {"ctype":"Building"}};
ct.types.list['ShoreWB'] = [];
ct.types.templates["BridgeH"] = {
    depth:0,
    texture: "SMSbridgeH",
    onStep: function () {
if(ct.mouse.hovers(this)) {

    botBar.text = "Bridge";

}
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {

    },
    extends: {"ctype":"Building"}};
ct.types.list['BridgeH'] = [];
ct.types.templates["BridgeV"] = {
    depth:0,
    texture: "SMSbridgeV",
    onStep: function () {
if(ct.mouse.hovers(this)) {

    botBar.text = "Bridge";

}
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {

    },
    extends: {"ctype":"Building"}};
ct.types.list['BridgeV'] = [];
ct.types.templates["BridgeVB"] = {
    depth:1,
    texture: "SMSbridgeVmenu",
    onStep: function () {
if(ct.mouse.hovers(this)) {
    botBar.text = "LMB to build a bridge (so you can connect islands and colonize them). RMB to cancel. Cost: " + cost.bridge + " wood." + enoughResource("bridge");
}

if(ct.actions.mouseLeft.pressed) {
    if(ct.mouse.hovers(this)){
        build("BridgeV");
    }
}
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {

    },
    extends: {"ctype":"UI"}};
ct.types.list['BridgeVB'] = [];
ct.types.templates["BridgeHB"] = {
    depth:1,
    texture: "SMSbridgeHmenu",
    onStep: function () {
if(ct.mouse.hovers(this)) {
    botBar.text = "LMB to build a bridge (so you can connect islands and colonize them). RMB to cancel. Cost: " + cost.bridge + " wood." + enoughResource("bridge");
}

if(ct.actions.mouseLeft.pressed) {
    if(ct.mouse.hovers(this)){
        build("BridgeH");
    }
}
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {

    },
    extends: {"ctype":"UI"}};
ct.types.list['BridgeHB'] = [];
ct.types.templates["ShoreNBB"] = {
    depth:1,
    texture: "SMSshoreNbridgeMenu",
    onStep: function () {
if(ct.mouse.hovers(this)) {
    botBar.text = "LMB to build a bridge (so you can connect islands and colonize them). RMB to cancel. Cost: " + cost.bridge + " wood." + enoughResource("bridge");
}

if(ct.actions.mouseLeft.pressed) {
    if(ct.mouse.hovers(this)){
        build("ShoreNB");
    }
}
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {

    },
    extends: {"ctype":"UI"}};
ct.types.list['ShoreNBB'] = [];
ct.types.templates["ShoreEBB"] = {
    depth:1,
    texture: "SMSshoreEbridgeMenu",
    onStep: function () {
if(ct.mouse.hovers(this)) {
    botBar.text = "LMB to build a bridge (so you can connect islands and colonize them). RMB to cancel. Cost: " + cost.bridge + " wood." + enoughResource("bridge");
}

if(ct.actions.mouseLeft.pressed) {
    if(ct.mouse.hovers(this)){
        build("ShoreEB");
    }
}
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {

    },
    extends: {"ctype":"UI"}};
ct.types.list['ShoreEBB'] = [];
ct.types.templates["ShoreSBB"] = {
    depth:1,
    texture: "SMSshoreSbridgeMenu",
    onStep: function () {
if(ct.mouse.hovers(this)) {
    botBar.text = "LMB to build a bridge (so you can connect islands and colonize them). RMB to cancel. Cost: " + cost.bridge + " wood." + enoughResource("bridge");
}

if(ct.actions.mouseLeft.pressed) {
    if(ct.mouse.hovers(this)){
        build("ShoreSB");
    }
}
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {

    },
    extends: {"ctype":"UI"}};
ct.types.list['ShoreSBB'] = [];
ct.types.templates["ShoreWBB"] = {
    depth:1,
    texture: "SMSshoreWbridgeMenu",
    onStep: function () {
if(ct.mouse.hovers(this)) {
    botBar.text = "LMB to build a bridge (so you can connect islands and colonize them). RMB to cancel. Cost: " + cost.bridge + " wood." + enoughResource("bridge");
}

if(ct.actions.mouseLeft.pressed) {
    if(ct.mouse.hovers(this)){
        build("ShoreWB");
    }
}
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {

    },
    extends: {"ctype":"UI"}};
ct.types.list['ShoreWBB'] = [];
ct.types.templates["Plague"] = {
    depth:1,
    texture: "plague",
    onStep: function () {
tileOnStep(this);
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {




    },
    extends: {"ctype":"Tile"}};
ct.types.list['Plague'] = [];
ct.types.templates["ShoreNE"] = {
    depth:0,
    texture: "SMSshoreNE",
    onStep: function () {
tileOnStep(this);
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {

    },
    extends: {"ctype":"Tile"}};
ct.types.list['ShoreNE'] = [];
ct.types.templates["ShoreSE"] = {
    depth:0,
    texture: "SMSshoreSE",
    onStep: function () {
tileOnStep(this);
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {

    },
    extends: {"ctype":"Tile"}};
ct.types.list['ShoreSE'] = [];
ct.types.templates["ShoreSW"] = {
    depth:0,
    texture: "SMSshoreSW",
    onStep: function () {
tileOnStep(this);
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {

    },
    extends: {"ctype":"Tile"}};
ct.types.list['ShoreSW'] = [];
ct.types.templates["ShoreNW"] = {
    depth:0,
    texture: "SMSshoreNW",
    onStep: function () {
tileOnStep(this);
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {

    },
    extends: {"ctype":"Tile"}};
ct.types.list['ShoreNW'] = [];
ct.types.templates["Overlay"] = {
    depth:10,
    texture: "overlay",
    onStep: function () {
this.move();
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {

    },
    extends: {}};
ct.types.list['Overlay'] = [];
ct.types.templates["GameOver"] = {
    depth:10,
    texture: "gameover",
    onStep: function () {
if(ct.actions.mouseLeft.pressed) {
    if(ct.mouse.hovers(this)) {
        location.reload();
    }
}
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {

    },
    extends: {}};
ct.types.list['GameOver'] = [];
ct.types.templates["Intro"] = {
    depth:10,
    texture: "intro",
    onStep: function () {
if(ct.actions.mouseLeft.pressed) {
    if(ct.mouse.hovers(this)) {
        if(introTextIndex === 0) {
            introTextIndex++;
            introLbl.text = introText[1];
        }
        else {
            introPopup.kill = true;
            overlay.kill = true;
            overlay = null;
        }
    }
}
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {

    },
    extends: {}};
ct.types.list['Intro'] = [];
ct.types.templates["PressStart"] = {
    depth:1,
    texture: "press_start",
    onStep: function () {
this.timer--;
if(this.timer < 50) {
    this.visible = false;
}
if(this.timer > 50) {
    this.visible = true;
}

if(this.timer === 0) {
    this.timer = 100;
}
    },
    onDraw: function () {

    },
    onDestroy: function () {

    },
    onCreate: function () {
this.timer = 100;
    },
    extends: {}};
ct.types.list['PressStart'] = [];



    ct.types.beforeStep = function () {

    };
    ct.types.afterStep = function () {

    };
    ct.types.beforeDraw = function () {
        if ([false][0] && this instanceof ct.types.Copy) {
    this.$cDebugText.scale.x = this.$cDebugCollision.scale.x = 1 / this.scale.x;
    this.$cDebugText.scale.y = this.$cDebugCollision.scale.y = 1 / this.scale.y;
    this.$cDebugText.rotation = this.$cDebugCollision.rotation = -ct.u.degToRad(this.rotation);

    const newtext = `Partitions: ${this.$chashes.join(', ')}
Group: ${this.ctype}
Shape: ${this._shape && this._shape.__type}`;
    if (this.$cDebugText.text !== newtext) {
        this.$cDebugText.text = newtext;
    }
    this.$cDebugCollision
    .clear();
    ct.place.drawDebugGraphic.apply(this);
    this.$cHadCollision = false;
}

    };
    ct.types.afterDraw = function () {
        /* eslint-disable no-underscore-dangle */
if ((this.transform && (this.transform._localID !== this.transform._currentLocalID)) || this.x !== this.xprev || this.y !== this.yprev) {
    delete this._shape;
    const oldHashes = this.$chashes || [];
    this.$chashes = ct.place.getHashes(this);
    for (const hash of oldHashes) {
        if (this.$chashes.indexOf(hash) === -1) {
            ct.place.grid[hash].splice(ct.place.grid[hash].indexOf(this), 1);
        }
    }
    for (const hash of this.$chashes) {
        if (oldHashes.indexOf(hash) === -1) {
            if (!(hash in ct.place.grid)) {
                ct.place.grid[hash] = [this];
            } else {
                ct.place.grid[hash].push(this);
            }
        }
    }
}

    };
    ct.types.onDestroy = function () {
        if (this.ctype) {
    ct.place.ctypeCollections[this.$ctype].splice(ct.place.ctypeCollections[this.$ctype].indexOf(this), 1);
}
if (this.$chashes) {
    for (const hash of this.$chashes) {
        ct.place.grid[hash].splice(ct.place.grid[hash].indexOf(this), 1);
    }
}

    };
})(ct);

if (!ct.sound) {
    /**
     * @namespace
     */
    ct.sound = {
        /**
         * Detects if a particular codec is supported in the system
         * @param {string} type Codec/MIME-type to look for
         * @returns {boolean} true/false
         */
        detect(type) {
            var au = document.createElement('audio');
            return Boolean(au.canPlayType && au.canPlayType(type).replace(/no/, ''));
        },
        /**
         * Creates a new Sound object and puts it in resource object
         *
         * @param {string} name Sound's name
         * @param {object} formats A collection of sound files of specified extension, in format `extension: path`
         * @param {string} [formats.ogg] Local path to the sound in ogg format
         * @param {string} [formats.wav] Local path to the sound in wav format
         * @param {string} [formats.mp3] Local path to the sound in mp3 format
         * @param {number} [options] An options object
         *
         * @returns {object} Sound's object
         */
        init(name, formats, options) {
            var src = '';
            if (ct.sound.mp3 && formats.mp3) {
                src = formats.mp3;
            } else if (ct.sound.ogg && formats.ogg) {
                src = formats.ogg;
            } else if (ct.sound.wav && formats.wav) {
                src = formats.wav;
            }
            options = options || {};
            var audio = {
                src,
                direct: document.createElement('audio'),
                pool: [],
                poolSize: options.poolSize || 5
            };
            if (src !== '') {
                ct.res.soundsLoaded++;
                audio.direct.preload = options.music? 'metadata' : 'auto';
                audio.direct.onerror = audio.direct.onabort = function () {
                    console.error('[ct.sound] Oh no! We couldn\'t load ' + src + '!');
                    audio.buggy = true;
                    ct.res.soundsError++;
                    ct.res.soundsLoaded--;
                };
                audio.direct.src = src;
            } else {
                ct.res.soundsError++;
                audio.buggy = true;
                console.error('[ct.sound] We couldn\'t load sound named "' + name + '" because the browser doesn\'t support any of proposed formats.');
            }
            ct.res.sounds[name] = audio;
            return audio;
        },
        /**
         * Spawns a new sound and plays it.
         *
         * @param {string} name The name of sound to be played
         * @param {object} [opts] Options object that is applied to a newly created audio tag
         * @param {Function} [cb] A callback, which is called when the sound finishes playing
         *
         * @returns {HTMLTagAudio|Boolean} The created audio or `false` (if a sound wasn't created)
         */
        spawn(name, opts, cb) {
            opts = opts || {};
            if (typeof opts === 'function') {
                cb = opts;
            }
            var s = ct.res.sounds[name];
            if (s.pool.length < s.poolSize) {
                var a = document.createElement('audio');
                a.src = s.src;
                if (opts) {
                    ct.u.ext(a, opts);
                }
                s.pool.push(a);
                a.addEventListener('ended', function (e) {
                    s.pool.splice(s.pool.indexOf(a), 1);
                    if (cb) {
                        cb(true, e);
                    }
                });

                a.play();
                return a;
            } else if (cb) {
                cb(false);
            }
            return false;
        },
        exists(name) {
            return (name in ct.res.sounds);
        }
    };

    // define sound types we can support
    ct.sound.wav = ct.sound.detect('audio/wav; codecs="1"');
    ct.sound.mp3 = ct.sound.detect('audio/mpeg;');
    ct.sound.ogg = ct.sound.detect('audio/ogg;');
}


ct.sound.init('worker', {
    wav: './snd/54ee8bd3-3c0e-45b0-a837-ad5a0d98bbab.wav',
    mp3: false,
    ogg: false
}, {
    poolSize: 5,
    music: false
});
ct.sound.init('build', {
    wav: './snd/fe2132c2-609b-4a6e-b17c-9830430e70af.wav',
    mp3: false,
    ogg: false
}, {
    poolSize: 5,
    music: false
});
ct.sound.init('build2', {
    wav: './snd/66a8e8df-9884-4bd7-9ac6-b2a13db60584.wav',
    mp3: false,
    ogg: false
}, {
    poolSize: 5,
    music: false
});
ct.sound.init('cancel', {
    wav: './snd/73bb045b-4b82-4a99-9315-5d04746d2610.wav',
    mp3: false,
    ogg: false
}, {
    poolSize: 5,
    music: false
});
ct.sound.init('gainPop', {
    wav: './snd/0ab93e53-1c22-4370-8b6b-b24ee490cb41.wav',
    mp3: false,
    ogg: false
}, {
    poolSize: 5,
    music: false
});
ct.sound.init('gameover', {
    wav: './snd/38df1151-ae16-43d7-bfa4-61baeafff291.wav',
    mp3: false,
    ogg: false
}, {
    poolSize: 5,
    music: false
});
ct.sound.init('plagueTurn', {
    wav: './snd/627711fa-3072-47ef-925d-0526d5c22646.wav',
    mp3: false,
    ogg: false
}, {
    poolSize: 5,
    music: false
});
ct.sound.init('plagueOnBuilding', {
    wav: './snd/983c667a-f96c-4d47-a0d0-c3d6eb9b64a1.wav',
    mp3: false,
    ogg: false
}, {
    poolSize: 5,
    music: false
});
ct.sound.init('plagueCure', {
    wav: './snd/add8662e-7921-4b6b-86f0-d7b932e30cf0.wav',
    mp3: false,
    ogg: false
}, {
    poolSize: 5,
    music: false
});
ct.sound.init('Sadness', {
    wav: false,
    mp3: './snd/0e173b68-196c-4438-9c05-c7289ec0fe76.mp3',
    ogg: false
}, {
    poolSize: 5,
    music: true
});
ct.sound.init('Title', {
    wav: false,
    mp3: './snd/7f73fbfa-c31e-4ce4-a275-6b6bb8df9ffe.mp3',
    ogg: false
}, {
    poolSize: 5,
    music: true
});
ct.sound.init('start', {
    wav: './snd/f3cbec35-5948-4b64-93b4-5ff083c019eb.wav',
    mp3: false,
    ogg: false
}, {
    poolSize: 5,
    music: false
});
ct.sound.init('killPlague', {
    wav: './snd/62f8b0f7-51d8-4fc4-aad3-fa0f895944f4.wav',
    mp3: false,
    ogg: false
}, {
    poolSize: 5,
    music: false
});
ct.sound.init('endturn', {
    wav: './snd/e7d8b850-e3d6-4492-b9dc-2ae84474c65a.wav',
    mp3: false,
    ogg: false
}, {
    poolSize: 5,
    music: false
});
ct.sound.init('endturn', {
    wav: './snd/9580a9a5-d68d-4b73-b8bd-1a725124e0e7.wav',
    mp3: false,
    ogg: false
}, {
    poolSize: 5,
    music: false
});
if (document.fonts) { for (const font of document.fonts) { font.load(); }}
