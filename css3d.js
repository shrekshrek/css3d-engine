/*!
 * VERSION: 0.4.0
 * DATE: 2015-09-15
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
    var previousCss3D = root.C3D;

    C3D.VERSION = '0.4.0';

    C3D.noConflict = function () {
        root.C3D = previousCss3D;
        return this;
    };

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


    // --------------------------------------------------------------------3d辅助方法
    //C3D.getDistance = function(o1, o2) {
    //    switch (arguments.length) {
    //    case 1 :
    //        return Math.pow(Math.pow(o1.x, 2) + Math.pow(o1.y, 2) + Math.pow(o1.z, 2), 0.5);
    //    case 2 :
    //        return Math.pow(Math.pow(o2.x - o1.x, 2) + Math.pow(o2.y - o1.y, 2) + Math.pow(o2.z - o1.z, 2), 0.5);
    //    }
    //};

    //三维变换，css的rotation属性作用顺序依次是x,y,z.所以推倒计算时需要反过来，计算顺序是z,y,x
    //C3D.positionRotate3D = function(o, r) {
    //    var _sinz = Math.sin(r[2] / 180 * Math.PI);
    //    var _cosz = Math.cos(r[2] / 180 * Math.PI);
    //    var _x1 = o.x * _cosz - o.y * _sinz;
    //    var _y1 = o.y * _cosz + o.x * _sinz;
    //    var _z1 = o.z;
    //
    //    var _siny = Math.sin(r[1] / 180 * Math.PI);
    //    var _cosy = Math.cos(r[1] / 180 * Math.PI);
    //    var _x2 = _x1 * _cosy + _z1 * _siny;
    //    var _y2 = _y1;
    //    var _z2 = _z1 * _cosy - _x1 * _siny;
    //
    //    var _sinx = Math.sin(r[0] / 180 * Math.PI);
    //    var _cosx = Math.cos(r[0] / 180 * Math.PI);
    //    var _x3 = _x2;
    //    var _y3 = _y2 * _cosx - _z2 * _sinx;
    //    var _z3 = _z2 * _cosx + _y2 * _sinx;
    //
    //    return {
    //        x : _x3,
    //        y : _y3,
    //        z : _z3
    //    };
    //};

    // --------------------------------------------------------------------3d元素基类
    C3D.Object3D = function () {
        this.init.apply(this, arguments);
    };

    extend(C3D.Object3D.prototype, {
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

        init: function () {
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
            this.children = [];
        },
        destroy: function () {
            for (var i in this.children) {
                this.children[i].destroy();
            }
            this.children = [];
        },

        parent: null,
        children: null,
        addChild: function (view) {
            if (view.parent)
                view.parent.removeChild(view);

            for (var i in this.children) {
                if (this.children[i] === view)
                    return this;
            }
            view.parent = this;
            this.children.push(view);
            return this;
        },
        removeChild: function (view) {
            var _self = this;
            for (var i = this.children.length - 1; i >= 0; i--) {
                if (this.children[i] === view) {
                    _self.children.splice(i, 1);
                    view.parent = null;
                    return this;
                }
            }
            return this;
        }

    });
    C3D.Object3D.extend = extend2;

    C3D.Sprite3D = C3D.Object3D.extend({
        el: null,
        alpha: 1,
        visible: true,
        mat: null,
        init: function (params) {
            C3D.Sprite3D.__super__.init.apply(this, [params]);

            this.alpha = 1;
            this.visible = true;

            var _dom;

            for (var i in params) {
                switch (i) {
                    case 'el':
                        _dom = params[i];
                        if (_dom.style.position === 'static')
                            _dom.style.position = 'relative';
                        break;
                    default:
                        this[i] = params[i];
                        break;
                }
            }

            if (!_dom) {
                _dom = document.createElement('div');
                _dom.style.position = 'absolute';
            }

            _dom.style[prefix + 'Transform'] = 'translateZ(0px)';
            _dom.style[prefix + 'TransformStyle'] = 'preserve-3d';
            this.el = _dom;
            _dom.le = this;

        },
        destroy: function () {
            C3D.Sprite3D.__super__.destroy.apply(this);
            if (this.el && this.el.parentNode) {
                this.el.parentNode.removeChild(this.el);
            }
        },

        update: function () {
            this.updateS();
            this.updateM();
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

            if (this.mat.image != undefined)
                this.el.style.backgroundImage = this.mat.image !== '' ? ('url(' + this.mat.image + ')') : '';

            if (this.mat.color != undefined)
                this.el.style.backgroundColor = this.mat.color;

            if (this.mat.position != undefined)
                this.el.style.backgroundPosition = this.mat.position;

            if (this.mat.size != undefined)
                this.el.style.backgroundSize = this.mat.size;

            if (this.mat.repeat != undefined)
                this.el.style.backgroundRepeat = this.mat.repeat;

            if (this.mat.origin != undefined)
                this.el.style.backgroundOrigin = this.mat.origin;

            return this;
        },

        updateT: function () {
            this.el.style[prefix + 'Transform'] = 'translate3d(-50%, -50%, 0px) ' + 'translate3d(' + this.x + 'px,' + this.y + 'px,' + this.z + 'px) ' + 'rotateX(' + this.rotationX + 'deg) ' + 'rotateY(' + this.rotationY + 'deg) ' + 'rotateZ(' + this.rotationZ + 'deg) ' + 'scale3d(' + this.scaleX + ', ' + this.scaleY + ', ' + this.scaleZ + ') ';
            return this;
        },

        updateV: function () {
            this.el.style.opacity = this.alpha;
            this.el.style.display = this.visible ? 'block' : 'none';
            return this;
        },

        addChild: function (view) {
            C3D.Sprite3D.__super__.addChild.apply(this, [view]);
            if (this.el && view.el)
                this.el.appendChild(view.el);
            return this;
        },
        removeChild: function (view) {
            C3D.Sprite3D.__super__.removeChild.apply(this, [view]);
            if (view.el && view.el.parentNode)
                view.el.parentNode.removeChild(view.el);
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
            if (obj.visible != undefined)
                this.visible = obj.visible;

            if (obj.alpha != undefined)
                this.alpha = obj.alpha;

            return this;
        }
    });

    // --------------------------------------------------------------------3d核心元件
    C3D.Stage = C3D.Sprite3D.extend({
        camera: null,
        fov: null,
        __rfix: null,
        __pfix: null,
        init: function (params) {
            C3D.Stage.__super__.init.apply(this, [params]);

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

            this.__rfix = new C3D.Sprite3D();
            this.el.appendChild(this.__rfix.el);

            this.__pfix = new C3D.Sprite3D();
            this.__rfix.el.appendChild(this.__pfix.el);

            this.camera = new C3D.Camera();
        },

        updateS: function () {
            this.el.style.width = parseInt(this.width) + 'px';
            this.el.style.height = parseInt(this.height) + 'px';
            return this;
        },
        updateT: function () {
            this.fov = parseInt(0.5 / Math.tan((this.camera.fov * 0.5) / 180 * Math.PI) * this.height);
            this.el.style[prefix + 'Perspective'] = this.fov + 'px';
            this.__rfix.position(parseInt(this.width/2), parseInt(this.height/2), this.fov).rotation(-this.camera.rotationX, -this.camera.rotationY, -this.camera.rotationZ).updateT();
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
        }
    });

    C3D.Camera = C3D.Object3D.extend({
        fov: null,
        init: function (params) {
            C3D.Camera.__super__.init.apply(this, [params]);
            this.fov = 75;
        }
    });

    // --------------------------------------------------------------------3d显示元件
    C3D.Plane = C3D.Sprite3D.extend({
        init: function (params) {
            C3D.Plane.__super__.init.apply(this, [params]);
        },

        updateS: function () {
            this.el.style.width = parseInt(this.width) + 'px';
            this.el.style.height = parseInt(this.height) + 'px';
            return this;
        }
    });

    C3D.Cube = C3D.Sprite3D.extend({
        front: null,
        back: null,
        left: null,
        right: null,
        up: null,
        down: null,
        init: function (params) {
            C3D.Cube.__super__.init.apply(this, [params]);

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

        updateS: function () {
            var _w = parseInt(this.width);
            var _h = parseInt(this.height);
            var _d = parseInt(this.depth);

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

            if (this.mat.front)
                this.front.material({
                    image: this.mat.front
                }).updateM();
            else
                this.front.material(this.mat).updateM();

            if (this.mat.back)
                this.back.material({
                    image: this.mat.back
                }).updateM();
            else
                this.back.material(this.mat).updateM();

            if (this.mat.left)
                this.left.material({
                    image: this.mat.left
                }).updateM();
            else
                this.left.material(this.mat).updateM();

            if (this.mat.right)
                this.right.material({
                    image: this.mat.right
                }).updateM();
            else
                this.right.material(this.mat).updateM();

            if (this.mat.up)
                this.up.material({
                    image: this.mat.up
                }).updateM();
            else
                this.up.material(this.mat).updateM();

            if (this.mat.down)
                this.down.material({
                    image: this.mat.down
                }).updateM();
            else
                this.down.material(this.mat).updateM();

            return this;
        }
    });

    return C3D;
}));
