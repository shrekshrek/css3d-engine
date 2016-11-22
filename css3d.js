/*!
 * VERSION: 0.8.2
 * DATE: 2016-09-13
 * GIT: https://github.com/shrekshrek/css3d-engine
 * @author: Shrek.wang
 **/

(function (factory) {

    if (typeof define === 'function' && define.amd) {
        define(['exports'], function(exports) {
            window.C3D = factory(exports);
        });
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        window.C3D = factory({});
    }

}(function (C3D) {
    // --------------------------------------------------------------------extend
    var keys = function (obj) {
        var keys = [];
        for (var key in obj) {
            keys.push(key);
        }
        return keys;
    };

    var extend = function (obj) {
        var length = arguments.length;
        if (length < 2 || obj == null) return obj;
        for (var index = 1; index < length; index++) {
            var source = arguments[index],
                ks = keys(source),
                l = ks.length;
            for (var i = 0; i < l; i++) {
                var key = ks[i];
                obj[key] = source[key];
            }
        }
        return obj;
    };

    var extend2 = function (protoProps, staticProps) {
        var parent = this;
        var child;

        if (protoProps && Object.prototype.hasOwnProperty.call(protoProps, 'constructor')) {
            child = protoProps.constructor;
        } else {
            child = function () {
                return parent.apply(this, arguments);
            };
        }

        extend(child, parent, staticProps);

        var Surrogate = function () {
            this.constructor = child;
        };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate;

        if (protoProps) extend(child.prototype, protoProps);

        child.__super__ = parent.prototype;

        return child;
    };


    // --------------------------------------------------------------------检测是否支持,浏览器补全方法
    var prefix = '';

    (function () {
        var _d = document.createElement('div');
        var _prefixes = ['Webkit', 'Moz', 'Ms', 'O'];

        for (var i in _prefixes) {
            if ((_prefixes[i] + 'Transform') in _d.style) {
                prefix = _prefixes[i];
                break;
            }
        }
    }());


    // --------------------------------------------------------------------color辅助方法
    C3D.getRandomColor = function () {
        return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
    };

    C3D.rgb2hex = function (r, g, b) {
        return ((r << 16) | (g << 8) | b).toString(16);
    };

    C3D.hex2rgb = function (s) {
        var _n = Math.floor('0x' + s);
        var _r = _n >> 16 & 255;
        var _g = _n >> 8 & 255;
        var _b = _n & 255;
        return [_r, _g, _b];
    };


    // --------------------------------------------------------------------其他辅助方法
    function fixed0(n) {
        return Math.round(n);
    }

    function fixed2(n) {
        return Math.round(n * 100) / 100;
    }

    //  webkitTransform 转 WebkitTransform
    function firstUper(str) {
        return str.replace(/\b(\w)|\s(\w)/g, function (m) {
            return m.toUpperCase();
        });
    }


    // --------------------------------------------------------------------3d元素基类
    C3D.Object = function () {
        this.initialize.apply(this, arguments);
    };

    extend(C3D.Object.prototype, {
        x: 0,
        y: 0,
        z: 0,
        position: function (x, y, z) {
            switch (arguments.length) {
                case 1 :
                    this.x = x;
                    this.y = x;
                    this.z = x;
                    break;
                case 2 :
                    this.x = x;
                    this.y = y;
                    break;
                case 3 :
                    this.x = x;
                    this.y = y;
                    this.z = z;
                    break;
            }
            return this;
        },
        move: function (x, y, z) {
            switch (arguments.length) {
                case 1 :
                    this.x += x;
                    this.y += x;
                    this.z += x;
                    break;
                case 2 :
                    this.x += x;
                    this.y += y;
                    break;
                case 3 :
                    this.x += x;
                    this.y += y;
                    this.z += z;
                    break;
            }
            return this;
        },

        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        rotation: function (x, y, z) {
            switch (arguments.length) {
                case 1 :
                    this.rotationX = x;
                    this.rotationY = x;
                    this.rotationZ = x;
                    break;
                case 2 :
                    this.rotationX = x;
                    this.rotationY = y;
                    break;
                case 3 :
                    this.rotationX = x;
                    this.rotationY = y;
                    this.rotationZ = z;
                    break;
            }
            return this;
        },
        rotate: function (x, y, z) {
            switch (arguments.length) {
                case 1 :
                    this.rotationX += x;
                    this.rotationY += x;
                    this.rotationZ += x;
                    break;
                case 2 :
                    this.rotationX += x;
                    this.rotationY += y;
                    break;
                case 3 :
                    this.rotationX += x;
                    this.rotationY += y;
                    this.rotationZ += z;
                    break;
            }
            return this;
        },

        scaleX: 1,
        scaleY: 1,
        scaleZ: 1,
        scale: function (x, y, z) {
            switch (arguments.length) {
                case 1 :
                    this.scaleX = x;
                    this.scaleY = x;
                    this.scaleZ = x;
                    break;
                case 2 :
                    this.scaleX = x;
                    this.scaleY = y;
                    break;
                case 3 :
                    this.scaleX = x;
                    this.scaleY = y;
                    this.scaleZ = z;
                    break;
            }
            return this;
        },

        width: 0,
        height: 0,
        depth: 0,
        size: function (x, y, z) {
            switch (arguments.length) {
                case 1 :
                    this.width = x;
                    this.height = x;
                    this.depth = x;
                    break;
                case 2 :
                    this.width = x;
                    this.height = y;
                    break;
                case 3 :
                    this.width = x;
                    this.height = y;
                    this.depth = z;
                    break;
            }
            return this;
        },

        originX: 0,
        originY: 0,
        originZ: 0,
        __orgO: {x: 0, y: 0, z: 0},
        __orgT: {x: 0, y: 0, z: 0},
        __orgF: {x: 0, y: 0, z: 0},
        origin: function (x, y, z) {
            switch (arguments.length) {
                case 1 :
                    this.originX = x;
                    this.originY = x;
                    this.originZ = x;
                    break;
                case 2 :
                    this.originX = x;
                    this.originY = y;
                    break;
                case 3 :
                    this.originX = x;
                    this.originY = y;
                    this.originZ = z;
                    break;
            }
            return this;
        },

        __sort: ['X', 'Y', 'Z'],
        sort: function (s0, s1, s2) {
            if (arguments.length > 3) throw 'sort arguments is wrong!';
            this.__sort = [s0, s1, s2];
            return this;
        },

        initialize: function () {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.rotationX = 0;
            this.rotationY = 0;
            this.rotationZ = 0;
            this.scaleX = 1;
            this.scaleY = 1;
            this.scaleZ = 1;
            this.width = 0;
            this.height = 0;
            this.depth = 0;
            this.originX = '50%';
            this.originY = '50%';
            this.originZ = '0px';
            this.__orgO = {x: '50%', y: '50%', z: '0px'};
            this.__orgT = {x: '-50%', y: '-50%', z: '0px'};
            this.__orgF = {x: 0, y: 0, z: 0};
            this.children = [];
        },

        parent: null,
        children: null,
        addChild: function (view) {
            if (view.parent != null) view.parent.removeChild(view);
            if (view.__name != '') {
                if (this[view.__name] !== undefined) throw view.__name + ' already exist!';
                this[view.__name] = view;
            }
            this.children.push(view);
            view.parent = this;
            return this;
        },
        removeChild: function (view) {
            for (var i = this.children.length - 1; i >= 0; i--) {
                if (this.children[i] === view) {
                    if (view.__name != '') delete this[view.__name];
                    this.children.splice(i, 1);
                    view.parent = null;
                    return this;
                }
            }
            return this;
        },
        removeAllChild: function () {
            for (var i = this.children.length - 1; i >= 0; i--) {
                var view = this.children[i];
                if (view.__name != '') delete this[view.__name];
                view.parent = null;
            }
            this.children = [];
            return this;
        },
        remove: function () {
            if (this.parent != null) {
                this.parent.removeChild(this);
            }
            return this;
        }

    });
    C3D.Object.extend = extend2;

    C3D.Sprite = C3D.Object.extend({
        el: null,
        alpha: 1,
        visible: true,
        initialize: function (params) {
            C3D.Sprite.__super__.initialize.apply(this, [params]);

            this.__name = '';
            this.__id = '';
            this.__class = '';

            this.alpha = 1;
            this.visible = true;

            var _dom;

            if (params && params.el) {
                switch (typeof params.el) {
                    case 'string':
                        _dom = document.createElement('div');
                        _dom.innerHTML = params.el;
                        break;
                    case 'object':
                        if (params.el.nodeType === 1) {
                            _dom = params.el;
                        }
                        break;
                }
            }

            if (!_dom) {
                _dom = document.createElement('div');
            }

            _dom.style.position = 'absolute';
            _dom.style[prefix + 'Transform'] = 'translateZ(0px)';
            _dom.style[prefix + 'TransformStyle'] = 'preserve-3d';
            this.el = _dom;
            _dom.le = this;

        },

        __name: '',
        name: function (str) {
            this.__name = str;
            if (str == '') delete this.el.dataset.name;
            else this.el.dataset.name = str;
            return this;
        },

        __id: '',
        id: function (str) {
            this.__id = str;
            this.el.id = str;
            return this;
        },

        __class: '',
        class: function (str) {
            this.__class = str;
            this.el.className = str;
            return this;
        },

        update: function () {
            this.updateS();
            this.updateM();
            this.updateO();
            this.updateT();
            this.updateV();
            return this;
        },

        updateS: function () {
            //this.el.style[prefix + 'TransformOrigin'] = '50% 50%';
            return this;
        },

        updateM: function () {
            if (!this.__mat) return this;

            for (var i in this.__mat) {
                switch (i) {
                    case 'bothsides':
                        this.el.style[prefix + 'BackfaceVisibility'] = this.__mat[i] ? 'visible' : 'hidden';
                        break;
                    case 'image':
                        this.el.style['background' + firstUper(i)] = this.__mat[i] !== '' ? ('url(' + this.__mat[i] + ')') : '';
                        break;
                    default:
                        this.el.style['background' + firstUper(i)] = this.__mat[i];
                        break;
                }
            }

            return this;
        },

        updateO: function () {
            if (typeof(this.originX) == 'number') {
                var _x = fixed0(this.originX - this.__orgF.x);
                this.__orgO.x = _x + 'px';
                this.__orgT.x = -_x + 'px';
            } else {
                this.__orgO.x = this.originX;
                this.__orgT.x = '-' + this.originX;
            }

            if (typeof(this.originY) == 'number') {
                var _y = fixed0(this.originY - this.__orgF.y);
                this.__orgO.y = _y + 'px';
                this.__orgT.y = -_y + 'px';
            } else {
                this.__orgO.y = this.originY;
                this.__orgT.y = '-' + this.originY;
            }

            if (typeof(this.originZ) == 'number') {
                var _z = fixed0(this.originZ - this.__orgF.z);
                this.__orgO.z = _z + 'px';
                this.__orgT.z = -_z + 'px';
            } else {
                this.__orgO.z = this.__orgT.z = '0px';
            }

            this.el.style[prefix + 'TransformOrigin'] = this.__orgO.x + ' ' + this.__orgO.y + ' ' + this.__orgO.z;

            return this;
        },

        updateT: function () {
            var _S0 = this.__sort[0];
            var _S1 = this.__sort[1];
            var _S2 = this.__sort[2];
            this.el.style[prefix + 'Transform'] = 'translate3d(' + this.__orgT.x + ', ' + this.__orgT.y + ', ' + this.__orgT.z + ') ' + 'translate3d(' + fixed2(this.x) + 'px,' + fixed2(this.y) + 'px,' + fixed2(this.z) + 'px) ' + 'rotate' + _S0 + '(' + fixed2(this['rotation' + _S0]) % 360 + 'deg) ' + 'rotate' + _S1 + '(' + fixed2(this['rotation' + _S1]) % 360 + 'deg) ' + 'rotate' + _S2 + '(' + fixed2(this['rotation' + _S2]) % 360 + 'deg) ' + 'scale3d(' + fixed2(this.scaleX) + ', ' + fixed2(this.scaleY) + ', ' + fixed2(this.scaleZ) + ') ';
            return this;
        },

        updateV: function () {
            this.el.style.opacity = this.alpha;
            this.el.style.display = this.visible ? 'block' : 'none';
            return this;
        },

        addChild: function (view) {
            C3D.Sprite.__super__.addChild.apply(this, [view]);
            if (this.el && view.el)
                this.el.appendChild(view.el);
            return this;
        },

        removeChild: function (view) {
            for (var i = this.children.length - 1; i >= 0; i--) {
                if (this.children[i] === view) {
                    if (view.__name != '') delete this[view.__name];
                    this.children.splice(i, 1);
                    view.parent = null;
                    this.el.removeChild(view.el);
                    return this;
                }
            }
            return this;
        },

        removeAllChild: function () {
            for (var i = this.children.length - 1; i >= 0; i--) {
                var view = this.children[i];
                if (view.__name != '') delete this[view.__name];
                view.parent = null;
                this.el.removeChild(view.el);
            }
            this.children = [];
            return this;
        },

        on: function (events) {
            if (typeof (events) === 'object') {
                for (var i in events) {
                    this.el.addEventListener(i, events[i], false);
                }
            } else if (arguments.length === 2) {
                this.el.addEventListener(arguments[0], arguments[1], false);
            } else if (arguments.length === 3) {
                this.el.addEventListener(arguments[0], arguments[1], arguments[2]);
            }
            return this;
        },
        off: function (events) {
            if (typeof (events) === 'object') {
                for (var i in events) {
                    this.el.removeEventListener(i, events[i], false);
                }
            } else if (arguments.length === 2) {
                this.el.removeEventListener(arguments[0], arguments[1], false);
            }
            return this;
        },

        buttonMode: function (bool) {
            if (bool) {
                this.el.style.cursor = 'pointer';
            } else {
                this.el.style.cursor = 'auto';
            }
            return this;
        },

        __mat: null,
        material: function (obj) {
            this.__mat = obj;
            return this;
        },

        visibility: function (obj) {
            if (obj.visible !== undefined)
                this.visible = obj.visible;

            if (obj.alpha !== undefined)
                this.alpha = obj.alpha;

            return this;
        }
    });

    // --------------------------------------------------------------------3d核心元件
    C3D.Stage = C3D.Sprite.extend({
        camera: null,
        fov: null,
        __rfix: null,
        __pfix: null,
        initialize: function (params) {
            C3D.Stage.__super__.initialize.apply(this, [params]);

            if (!(params && params.el)) {
                this.el.style.top = '0px';
                this.el.style.left = '0px';
                this.el.style.width = '0px';
                this.el.style.height = '0px';
            }
            this.el.style[prefix + 'Perspective'] = '800px';
            this.el.style[prefix + 'TransformStyle'] = 'flat';
            this.el.style[prefix + 'Transform'] = '';
            this.el.style.overflow = 'hidden';

            this.__rfix = new C3D.Sprite();
            this.el.appendChild(this.__rfix.el);

            this.__pfix = new C3D.Sprite();
            this.__rfix.el.appendChild(this.__pfix.el);

            this.setCamera(new C3D.Camera());
        },

        updateS: function () {
            this.el.style.width = fixed0(this.width) + 'px';
            this.el.style.height = fixed0(this.height) + 'px';
            return this;
        },
        updateT: function () {
            this.fov = fixed0(0.5 / Math.tan((this.camera.fov * 0.5) / 180 * Math.PI) * this.height);
            this.el.style[prefix + 'Perspective'] = this.fov + 'px';
            this.__rfix.position(fixed0(this.width / 2), fixed0(this.height / 2), this.fov).rotation(-this.camera.rotationX, -this.camera.rotationY, -this.camera.rotationZ).updateT();
            this.__pfix.position(-this.camera.x, -this.camera.y, -this.camera.z).updateT();
            return this;
        },

        addChild: function (view) {
            this.__pfix.addChild(view);
            return this;
        },
        removeChild: function (view) {
            this.__pfix.removeChild(view);
            return this;
        },
        setCamera: function (cam) {
            if (this.camera) {
                this.camera.stage = null;
            }
            this.camera = cam;
            this.camera.stage = this;
            return this;
        }
    });

    C3D.Camera = C3D.Object.extend({
        fov: null,
        stage: null,
        initialize: function (params) {
            C3D.Camera.__super__.initialize.apply(this, [params]);
            this.fov = 75;
        },
        update: function () {
            this.updateT();
            return this;
        },
        updateS: function () {
            return this;
        },
        updateM: function () {
            return this;
        },
        updateT: function () {
            if (this.stage) this.stage.updateT();
            return this;
        },
        updateV: function () {
            return this;
        }
    });

    // --------------------------------------------------------------------3d显示元件
    C3D.Plane = C3D.Sprite.extend({
        initialize: function (params) {
            C3D.Plane.__super__.initialize.apply(this, [params]);
        },

        update: function () {
            C3D.Plane.__super__.update.apply(this);
            this.updateF();
            return this;
        },

        updateS: function () {
            this.el.style.width = fixed0(this.width) + 'px';
            this.el.style.height = fixed0(this.height) + 'px';
            return this;
        },

        updateF: function () {
            if (!this.__flt) return this;

            var _flt = '';
            for (var i in this.__flt) {
                _flt += (this.__flt[i] !== '' ? (i + '(' + this.__flt[i].join(',') + ')') : '');
            }
            if (_flt !== '') this.el.style[prefix + 'Filter'] = _flt;

            return this;
        },

        __flt: null,
        filter: function (obj) {
            this.__flt = obj;
            return this;
        }
    });

    C3D.Box = C3D.Sprite.extend({
        front: null,
        back: null,
        left: null,
        right: null,
        up: null,
        down: null,
        initialize: function (params) {
            C3D.Box.__super__.initialize.apply(this, [params]);

            this.front = new C3D.Plane();
            this.front.name = 'front';
            this.addChild(this.front);

            this.back = new C3D.Plane();
            this.back.name = 'back';
            this.addChild(this.back);

            this.left = new C3D.Plane();
            this.left.name = 'left';
            this.addChild(this.left);

            this.right = new C3D.Plane();
            this.right.name = 'right';
            this.addChild(this.right);

            this.up = new C3D.Plane();
            this.up.name = 'up';
            this.addChild(this.up);

            this.down = new C3D.Plane();
            this.down.name = 'down';
            this.addChild(this.down);
        },

        update: function () {
            C3D.Box.__super__.update.apply(this);
            this.updateF();
            return this;
        },

        updateS: function () {
            var _w = fixed0(this.width);
            var _h = fixed0(this.height);
            var _d = fixed0(this.depth);

            this.__orgF.x = this.width / 2;
            this.__orgF.y = this.height / 2;
            this.__orgF.z = this.depth / 2;

            this.front.size(_w, _h, 0).position(0, 0, _d / 2).rotation(0, 0, 0).updateS().updateT();
            this.back.size(_w, _h, 0).position(0, 0, -_d / 2).rotation(0, 180, 0).updateS().updateT();
            this.left.size(_d, _h, 0).position(-_w / 2, 0, 0).rotation(0, -90, 0).updateS().updateT();
            this.right.size(_d, _h, 0).position(_w / 2, 0, 0).rotation(0, 90, 0).updateS().updateT();
            this.up.size(_w, _d, 0).position(0, -_h / 2, 0).rotation(90, 0, 0).updateS().updateT();
            this.down.size(_w, _d, 0).position(0, _h / 2, 0).rotation(-90, 0, 0).updateS().updateT();

            return this;
        },

        updateM: function () {
            if (!this.__mat) return this;

            var _unique = true;
            for (var i in this.__mat) {
                switch (i) {
                    case 'front':
                    case 'back':
                    case 'left':
                    case 'right':
                    case 'up':
                    case 'down':
                        if (this.__mat[i].bothsides == undefined) this.__mat[i].bothsides = false;
                        this[i].material(this.__mat[i]).updateM();
                        _unique = false;
                        break;
                }
            }

            if (_unique) {
                if (this.__mat.bothsides == undefined) this.__mat.bothsides = false;
                this.front.material(this.__mat).updateM();
                this.back.material(this.__mat).updateM();
                this.left.material(this.__mat).updateM();
                this.right.material(this.__mat).updateM();
                this.up.material(this.__mat).updateM();
                this.down.material(this.__mat).updateM();
            }

            return this;
        },

        updateF: function () {
            if (!this.__flt) return this;

            this.front.filter(this.__flt).updateF();
            this.back.filter(this.__flt).updateF();
            this.left.filter(this.__flt).updateF();
            this.right.filter(this.__flt).updateF();
            this.up.filter(this.__flt).updateF();
            this.down.filter(this.__flt).updateF();

            return this;
        },

        __flt: null,
        filter: function (obj) {
            this.__flt = obj;
            return this;
        }
    });

    C3D.Skybox = C3D.Box.extend({
        updateS: function () {
            var _w = fixed0(this.width);
            var _h = fixed0(this.height);
            var _d = fixed0(this.depth);

            this.__orgF.x = this.width / 2;
            this.__orgF.y = this.height / 2;
            this.__orgF.z = this.depth / 2;

            this.front.size(_w, _h, 0).position(0, 0, -_d / 2).rotation(0, 0, 0).updateS().updateT();
            this.back.size(_w, _h, 0).position(0, 0, _d / 2).rotation(0, 180, 0).updateS().updateT();
            this.left.size(_d, _h, 0).position(-_w / 2, 0, 0).rotation(0, 90, 0).updateS().updateT();
            this.right.size(_d, _h, 0).position(_w / 2, 0, 0).rotation(0, -90, 0).updateS().updateT();
            this.up.size(_w, _d, 0).position(0, -_h / 2, 0).rotation(-90, 0, 0).updateS().updateT();
            this.down.size(_w, _d, 0).position(0, _h / 2, 0).rotation(90, 0, 0).updateS().updateT();

            return this;
        },

    });


    // --------------------------------------------------------------------创建场景
    function createObj(obj) {
        var _o;
        switch (obj.type) {
            case 'sprite':
                _o = new C3D.Sprite(obj.el ? {el: obj.el} : undefined);
                break;
            case 'plane':
                _o = new C3D.Plane(obj.el ? {el: obj.el} : undefined);
                break;
            case 'box':
                _o = new C3D.Box(obj.el ? {el: obj.el} : undefined);
                break;
            case 'skybox':
                _o = new C3D.Skybox(obj.el ? {el: obj.el} : undefined);
                break;
        }

        if (obj.size != undefined) _o.size.apply(_o, obj.size);
        if (obj.position != undefined) _o.position.apply(_o, obj.position);
        if (obj.rotation != undefined) _o.rotation.apply(_o, obj.rotation);
        if (obj.scale != undefined) _o.scale.apply(_o, obj.scale);
        if (obj.origin != undefined) _o.origin.apply(_o, obj.origin);
        if (obj.visibility != undefined) _o.visibility.apply(_o, obj.visibility);
        if (obj.material != undefined) _o.material.apply(_o, obj.material);
        if (obj.filter != undefined) _o.filter.apply(_o, obj.filter);
        if (obj.name != undefined) _o.name.apply(_o, [obj.name]);
        if (obj.id != undefined) _o.id.apply(_o, [obj.id]);
        if (obj.class != undefined) _o.class.apply(_o, [obj.class]);

        _o.update();

        if (obj.children) {
            for (var i = 0, _len = obj.children.length; i < _len; i++) {
                var _obj = obj.children[i];
                var _o2 = createObj(_obj);
                _o.addChild(_o2);
            }
        }

        return _o;
    }

    C3D.create = function (obj) {
        var _obj;
        switch (typeof(obj)) {
            case 'array':
                _obj = {type: 'sprite', children: obj};
                break;
            case 'object':
                _obj = obj;
                break;
            default:
                return;
        }

        return createObj(_obj);
    };

    return C3D;
}));
