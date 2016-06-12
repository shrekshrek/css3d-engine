/*!
 * VERSION: 0.7.0
 * DATE: 2015-12-20
 * GIT:https://github.com/shrekshrek/css3d-engine
 *
 * @author: Shrek.wang, shrekshrek@gmail.com
 **/

(function (factory) {
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global);

    if (typeof define === 'function' && define.amd) {
        define(['exports'], function (exports) {
            root.C3D = factory(root, exports);
        });
    } else if (typeof exports !== 'undefined') {
        factory(root, exports);
    } else {
        root.C3D = factory(root, {});
    }

}(function (root, C3D) {
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
        _orgO: {x: 0, y: 0, z: 0},
        _orgT: {x: 0, y: 0, z: 0},
        _orgF: {x: 0, y: 0, z: 0},
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

        _name: '',
        name: function (str) {
            this._name = str;
            if (str == '') delete this.el.dataset.name;
            else this.el.dataset.name = str;
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
            this._orgO = {x: '50%', y: '50%', z: '0px'};
            this._orgT = {x: '-50%', y: '-50%', z: '0px'};
            this._orgF = {x: 0, y: 0, z: 0};
            this.children = [];
            this._name = '';
        },

        parent: null,
        children: null,
        addChild: function (view) {
            if (view.parent != null) view.parent.removeChild(view);
            if (view._name != '') {
                if (this[view._name] !== undefined) throw view._name + ' already exist!';
                this[view._name] = view;
            }
            this.children.push(view);
            view.parent = this;
            return this;
        },
        removeChild: function (view) {
            for (var i = this.children.length - 1; i >= 0; i--) {
                if (this.children[i] === view) {
                    if (view._name != '') delete this[view._name];
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
                if (view._name != '') delete this[view._name];
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
        mat: null,
        initialize: function (params) {
            C3D.Sprite.__super__.initialize.apply(this, [params]);

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
            if (!this.mat) return this;

            for (var i in this.mat) {
                switch (i) {
                    case 'bothsides':
                        this.el.style[prefix + 'BackfaceVisibility'] = this.mat[i] ? 'visible' : 'hidden';
                        break;
                    case 'image':
                        this.el.style['background' + firstUper(i)] = this.mat[i] !== '' ? ('url(' + this.mat[i] + ')') : '';
                        break;
                    default:
                        this.el.style['background' + firstUper(i)] = this.mat[i];
                        break;
                }
            }

            return this;
        },

        updateO: function () {
            if (typeof(this.originX) == 'number') {
                var _x = this.originX - this._orgF.x;
                this._orgO.x = _x + 'px';
                this._orgT.x = -_x + 'px';
            } else {
                this._orgO.x = this.originX;
                this._orgT.x = '-' + this.originX;
            }

            if (typeof(this.originY) == 'number') {
                var _y = this.originY - this._orgF.y;
                this._orgO.y = _y + 'px';
                this._orgT.y = -_y + 'px';
            } else {
                this._orgO.y = this.originY;
                this._orgT.y = '-' + this.originY;
            }

            if (typeof(this.originZ) == 'number') {
                var _z = this.originZ - this._orgF.z;
                this._orgO.z = _z + 'px';
                this._orgT.z = -_z + 'px';
            } else {
                this._orgO.z = this._orgT.z = '0px';
            }

            this.el.style[prefix + 'TransformOrigin'] = this._orgO.x + ' ' + this._orgO.y + ' ' + this._orgO.z;

            return this;
        },

        updateT: function () {
            this.el.style[prefix + 'Transform'] = 'translate3d(' + this._orgT.x + ', ' + this._orgT.y + ', ' + this._orgT.z + ') ' + 'translate3d(' + this.x + 'px,' + this.y + 'px,' + this.z + 'px) ' + 'rotateX(' + this.rotationX % 360 + 'deg) ' + 'rotateY(' + this.rotationY % 360 + 'deg) ' + 'rotateZ(' + this.rotationZ % 360 + 'deg) ' + 'scale3d(' + this.scaleX + ', ' + this.scaleY + ', ' + this.scaleZ + ') ';
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
                    if (view._name != '') delete this[view._name];
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
                if (view._name != '') delete this[view._name];
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

        material: function (obj) {
            this.mat = obj;
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
        flt: null,
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
            if (!this.flt) return this;

            var _flt = '';
            for (var i in this.flt) {
                _flt += (this.flt[i] !== '' ? (i + '(' + this.flt[i].join(',') + ')') : '');
            }
            if (_flt !== '') this.el.style[prefix + 'Filter'] = _flt;

            return this;
        },

        filter: function (obj) {
            this.flt = obj;
            return this;
        }
    });

    C3D.Cube = C3D.Sprite.extend({
        front: null,
        back: null,
        left: null,
        right: null,
        up: null,
        down: null,
        flt: null,
        initialize: function (params) {
            C3D.Cube.__super__.initialize.apply(this, [params]);

            this.front = new C3D.Plane();
            this.addChild(this.front);

            this.back = new C3D.Plane();
            this.addChild(this.back);

            this.left = new C3D.Plane();
            this.addChild(this.left);

            this.right = new C3D.Plane();
            this.addChild(this.right);

            this.up = new C3D.Plane();
            this.addChild(this.up);

            this.down = new C3D.Plane();
            this.addChild(this.down);
        },

        update: function () {
            C3D.Cube.__super__.update.apply(this);
            this.updateF();
            return this;
        },

        updateS: function () {
            var _w = fixed0(this.width);
            var _h = fixed0(this.height);
            var _d = fixed0(this.depth);

            this._orgF.x = this.width / 2;
            this._orgF.y = this.height / 2;
            this._orgF.z = this.depth / 2;

            this.front.size(_w, _h, 0).position(0, 0, -_d / 2).rotation(0, 0, 0).updateS().updateT();
            this.back.size(_w, _h, 0).position(0, 0, _d / 2).rotation(0, 180, 0).updateS().updateT();
            this.left.size(_d, _h, 0).position(-_w / 2, 0, 0).rotation(0, 90, 0).updateS().updateT();
            this.right.size(_d, _h, 0).position(_w / 2, 0, 0).rotation(0, -90, 0).updateS().updateT();
            this.up.size(_w, _d, 0).position(0, -_h / 2, 0).rotation(-90, 0, 0).updateS().updateT();
            this.down.size(_w, _d, 0).position(0, _h / 2, 0).rotation(90, 0, 0).updateS().updateT();

            return this;
        },

        updateM: function () {
            if (!this.mat) return this;

            for (var i in this.mat) {
                switch (i) {
                    case 'front':
                    case 'back':
                    case 'left':
                    case 'right':
                    case 'up':
                    case 'down':
                        this[i].material({
                            image: this.mat[i]
                        }).updateM();
                        break;
                    default:
                        this.front.material(this.mat).updateM();
                        this.back.material(this.mat).updateM();
                        this.left.material(this.mat).updateM();
                        this.right.material(this.mat).updateM();
                        this.up.material(this.mat).updateM();
                        this.down.material(this.mat).updateM();
                        break;
                }
            }

            return this;
        },

        updateF: function () {
            if (!this.flt) return this;

            this.front.filter(this.flt).updateF();
            this.back.filter(this.flt).updateF();
            this.left.filter(this.flt).updateF();
            this.right.filter(this.flt).updateF();
            this.up.filter(this.flt).updateF();
            this.down.filter(this.flt).updateF();

            return this;
        },

        filter: function (obj) {
            this.flt = obj;
            return this;
        }
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
            case 'cube':
                _o = new C3D.Cube(obj.el ? {el: obj.el} : undefined);
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
