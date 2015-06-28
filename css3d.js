/*!
 * VERSION: 0.3.0
 * DATE: 2015-04-22
 * GIT:https://github.com/shrekshrek/C3D-engine
 *
 * @author: Shrek.wang, shrekshrek@gmail.com
 **/

(function(factory) {
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global);

    if (typeof define === 'function' && define.amd) {
        define(['exports'], function(exports) {
            root.C3D = factory(root, exports);
        });
    } else if (typeof exports !== 'undefined') {
        factory(root, exports);
    } else {
        root.C3D = factory(root, {});
    }

}(function(root, C3D) {
    var previousCss3D = root.C3D;

    C3D.VERSION = '0.2.0';

    C3D.noConflict = function() {
        root.C3D = previousCss3D;
        return this;
    };

    // --------------------------------------------------------------------extend
    var keys = function(obj){
        var keys = [];
        for(var key in obj){
            keys.push(key);
        }
        return keys;
    };

    var extend = function(obj){
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

    var extend2 = function(protoProps, staticProps) {
        var parent = this;
        var child;

        if (protoProps && Object.prototype.hasOwnProperty.call(protoProps, 'constructor')) {
            child = protoProps.constructor;
        } else {
            child = function(){ return parent.apply(this, arguments); };
        }

        extend(child, parent, staticProps);

        var Surrogate = function(){
            this.constructor = child;
        };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate;

        if (protoProps) extend(child.prototype, protoProps);

        child.__super__ = parent.prototype;

        return child;
    };

    // --------------------------------------------------------------------全局属性
    C3D._isSupported = false;
    C3D._browserPrefix = "webkit";
    C3D._transformProperty = "webkitTransform";

    C3D.checkSupport = function() {
        var _d = document.createElement("div"), _prefixes = ["", "webkit", "Moz", "O", "ms"], _len = _prefixes.length, i;

        for ( i = 0; i < _len; i++) {
            if ((_prefixes[i] + "Perspective") in _d.style) {
                C3D._transformProperty = _prefixes[i] + "Transform";
                C3D._isSupported = true;
                C3D._browserPrefix = _prefixes[i];
                return true;
            }
        }
        return false;
    };

    C3D.browserPrefix = function(str) {
        if (arguments.length) {
            return C3D._browserPrefix + str;
        } else {
            return C3D._browserPrefix;
        }
    };

    // --------------------------------------------------------------------辅助方法
    C3D.getRandomColor = function() {
        return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
    };

    C3D.rgb2hex = function(r, g, b) {
        return ((r << 16) | (g << 8) | b).toString(16);
    };

    C3D.hex2rgb = function(s) {
        var _n = Math.floor('0x' + s);
        var _r = _n >> 16 & 255;
        var _g = _n >> 8 & 255;
        var _b = _n & 255;
        return [_r, _g, _b];
    };

    C3D.getDistance = function(o1, o2) {
        switch (arguments.length) {
        case 1 :
            return Math.pow(Math.pow(o1.x(), 2) + Math.pow(o1.y(), 2) + Math.pow(o1.z(), 2), 0.5);
        case 2 :
            return Math.pow(Math.pow(o2.x() - o1.x(), 2) + Math.pow(o2.y() - o1.y(), 2) + Math.pow(o2.z() - o1.z(), 2), 0.5);
        }
    };

    //三维变换，css的rotation属性作用顺序依次是x,y,z.所以推倒计算时需要反过来，计算顺序是z,y,x
    C3D.positionRotate3D = function(o, r) {
        var _sinz = Math.sin(r[2] / 180 * Math.PI);
        var _cosz = Math.cos(r[2] / 180 * Math.PI);
        var _x1 = o.x() * _cosz - o.y() * _sinz;
        var _y1 = o.y() * _cosz + o.x() * _sinz;
        var _z1 = o.z();

        var _siny = Math.sin(r[1] / 180 * Math.PI);
        var _cosy = Math.cos(r[1] / 180 * Math.PI);
        var _x2 = _x1 * _cosy + _z1 * _siny;
        var _y2 = _y1;
        var _z2 = _z1 * _cosy - _x1 * _siny;

        var _sinx = Math.sin(r[0] / 180 * Math.PI);
        var _cosx = Math.cos(r[0] / 180 * Math.PI);
        var _x3 = _x2;
        var _y3 = _y2 * _cosx - _z2 * _sinx;
        var _z3 = _z2 * _cosx + _y2 * _sinx;

        return {
            x : _x3,
            y : _y3,
            z : _z3
        };
    };

    // --------------------------------------------------------------------3d元素基类
    C3D.Object3D = function() {
        this.initialize.apply(this, arguments);
    };

    extend(C3D.Object3D.prototype, {
        __position : {
            x : 0,
            y : 0,
            z : 0
        },
        __isPositionUpdate : false,
        x : function(n) {
            if (arguments.length) {
                this.__position.x = n;
                this.__isPositionUpdate = true;
                return this;
            } else {
                return this.__position.x;
            }
        },
        y : function(n) {
            if (arguments.length) {
                this.__position.y = n;
                this.__isPositionUpdate = true;
                return this;
            } else {
                return this.__position.y;
            }
        },
        z : function(n) {
            if (arguments.length) {
                this.__position.z = n;
                this.__isPositionUpdate = true;
                return this;
            } else {
                return this.__position.z;
            }
        },
        position : function(x, y, z) {
            switch (arguments.length) {
            case 0 :
                return this.__position;
            case 1 :
                this.__position.x = x;
                this.__position.y = x;
                this.__position.z = x;
                this.__isPositionUpdate = true;
                return this;
            case 2 :
                this.__position.x = x;
                this.__position.y = y;
                this.__isPositionUpdate = true;
                return this;
            case 3 :
                this.__position.x = x;
                this.__position.y = y;
                this.__position.z = z;
                this.__isPositionUpdate = true;
                return this;
            }
        },
        move : function(x, y, z) {
            switch (arguments.length) {
            case 0 :
                return this.__position;
            case 1 :
                this.__position.x += x;
                this.__position.y += x;
                this.__position.z += x;
                this.__isPositionUpdate = true;
                return this;
            case 2 :
                this.__position.x += x;
                this.__position.y += y;
                this.__isPositionUpdate = true;
                return this;
            case 3 :
                this.__position.x += x;
                this.__position.y += y;
                this.__position.z += z;
                this.__isPositionUpdate = true;
                return this;
            }
        },

        __rotation : {
            x : 0,
            y : 0,
            z : 0
        },
        __isRotationUpdate : false,
        rotationX : function(n) {
            if (arguments.length) {
                this.__rotation.x = n;
                this.__isRotationUpdate = true;
                return this;
            } else {
                return this.__rotation.x;
            }
        },
        rotationY : function(n) {
            if (arguments.length) {
                this.__rotation.y = n;
                this.__isRotationUpdate = true;
                return this;
            } else {
                return this.__rotation.y;
            }
        },
        rotationZ : function(n) {
            if (arguments.length) {
                this.__rotation.z = n;
                this.__isRotationUpdate = true;
                return this;
            } else {
                return this.__rotation.z;
            }
        },
        rotation : function(x, y, z) {
            switch (arguments.length) {
            case 0 :
                return this.__rotation;
            case 1 :
                this.__rotation.x = x;
                this.__rotation.y = x;
                this.__rotation.z = x;
                this.__isRotationUpdate = true;
                return this;
            case 2 :
                this.__rotation.x = x;
                this.__rotation.y = y;
                this.__isRotationUpdate = true;
                return this;
            case 3 :
                this.__rotation.x = x;
                this.__rotation.y = y;
                this.__rotation.z = z;
                this.__isRotationUpdate = true;
                return this;
            }
        },
        rotate : function(x, y, z) {
            switch (arguments.length) {
            case 0 :
                return this.__rotation;
            case 1 :
                this.__rotation.x += x;
                this.__rotation.y += x;
                this.__rotation.z += x;
                this.__isRotationUpdate = true;
                return this;
            case 2 :
                this.__rotation.x += x;
                this.__rotation.y += y;
                this.__isRotationUpdate = true;
                return this;
            case 3 :
                this.__rotation.x += x;
                this.__rotation.y += y;
                this.__rotation.z += z;
                this.__isRotationUpdate = true;
                return this;
            }
        },

        __scale : {
            x : 0,
            y : 0,
            z : 0
        },
        __isScaleUpdate : false,
        scaleX : function(n) {
            if (arguments.length) {
                this.__scale.x = n;
                this.__isScaleUpdate = true;
                return this;
            } else {
                return this.__scale.x;
            }
        },
        scaleY : function(n) {
            if (arguments.length) {
                this.__scale.y = n;
                this.__isScaleUpdate = true;
                return this;
            } else {
                return this.__scale.y;
            }
        },
        scaleZ : function(n) {
            if (arguments.length) {
                this.__scale.z = n;
                this.__isScaleUpdate = true;
                return this;
            } else {
                return this.__scale.z;
            }
        },
        scale : function(x, y, z) {
            switch (arguments.length) {
            case 0 :
                return this.__scale;
            case 1 :
                this.__scale.x = x;
                this.__scale.y = x;
                this.__scale.z = x;
                this.__isScaleUpdate = true;
                return this;
            case 2 :
                this.__scale.x = x;
                this.__scale.y = y;
                this.__isScaleUpdate = true;
                return this;
            case 3 :
                this.__scale.x = x;
                this.__scale.y = y;
                this.__scale.z = z;
                this.__isScaleUpdate = true;
                return this;
            }
        },

        __size : {
            x : 0,
            y : 0,
            z : 0
        },
        __isSizeUpdate : false,
        width : function(n) {
            if (arguments.length) {
                this.__size.x = n;
                this.__isSizeUpdate = true;
                return this;
            } else {
                return this.__size.x;
            }
        },
        height : function(n) {
            if (arguments.length) {
                this.__size.y = n;
                this.__isSizeUpdate = true;
                return this;
            } else {
                return this.__size.y;
            }
        },
        depth : function(n) {
            if (arguments.length) {
                this.__size.z = n;
                this.__isSizeUpdate = true;
                return this;
            } else {
                return this.__size.z;
            }
        },
        size : function(x, y, z) {
            switch (arguments.length) {
            case 0 :
                return this.__size;
            case 1 :
                this.__size.x = x;
                this.__size.y = x;
                this.__size.z = x;
                this.__isSizeUpdate = true;
                return this;
            case 2 :
                this.__size.x = x;
                this.__size.y = y;
                this.__isSizeUpdate = true;
                return this;
            case 3 :
                this.__size.x = x;
                this.__size.y = y;
                this.__size.z = z;
                this.__isSizeUpdate = true;
                return this;
            }
        },

        initialize : function() {
            this.__position = {
                x : 0,
                y : 0,
                z : 0
            };
            this.__isPositionUpdate = true;

            this.__rotation = {
                x : 0,
                y : 0,
                z : 0
            };
            this.__isRotationUpdate = true;

            this.__scale = {
                x : 1,
                y : 1,
                z : 1
            };
            this.__isScaleUpdate = true;

            this.__size = {
                x : 0,
                y : 0,
                z : 0
            };
            this.__isSizeUpdate = true;

            this.children = [];
        },
        destroy : function() {
            for(var i in this.children){
                this.children[i].destroy();
            }
            this.children = [];
        },

        parent : null,
        children : null,
        addChild : function(view) {
            if (view.parent)
                view.parent.removeChild(view);

            for(var i in this.children){
                if (this.children[i] === view)
                    return this;
            }
            view.parent = this;
            this.children.push(view);
            return this;
        },
        removeChild : function(view) {
            var _self = this;
            for(var i = this.children.length-1; i>=0; i--){
                if (this.children[i] === view) {
                    _self.children.splice(i, 1);
                    view.parent = null;
                    return this;
                }
            }
            return this;
        },
        update : function() {
            return this;
        }
    });
    C3D.Object3D.extend = extend2;

    C3D.Sprite3D = C3D.Object3D.extend({
        el : null,
        initialize : function(params) {
            C3D.Sprite3D.__super__.initialize.apply(this, [params]);

            //this.__isMaterialUpdate = true;

            if (!(C3D._isSupported || C3D.checkSupport())) {
                throw "this browser does not support C3D!!!";
                return;
            }

            var _dom;
            var _style;
            if (params && params.el) {
                _dom = params.el;
                _style = _dom.style;
                if (_style.position === "static")
                    _style.position = "relative";
            } else {
                _dom = document.createElement("div");
                _style = _dom.style;
                _style.position = "absolute";
                _style.margin = "0px";
                _style.padding = "0px";
            }
            _dom.style[C3D._browserPrefix + "Transform"] = "translateZ(0px)";
            _dom.style[C3D._browserPrefix + "TransformStyle"] = "preserve-3d";
            this.el = _dom;
            _dom.le = this;
        },
        destroy : function() {
            C3D.Sprite3D.__super__.destroy.apply(this);
            if (this.el && this.el.parentNode) {
                this.el.parentNode.removeChild(this.el);
            }
        },
        update : function() {
            C3D.Sprite3D.__super__.update.apply(this);

            if (this.__isPositionUpdate || this.__isRotationUpdate || this.__isScaleUpdate || this.__isSizeUpdate) {
                this.__isPositionUpdate = false;
                this.__isRotationUpdate = false;
                this.__isScaleUpdate = false;
                this.__isSizeUpdate = false;
                var _w = Number(this.__size.x) ? this.__size.x : 0;
                var _h = Number(this.__size.y) ? this.__size.y : 0;
                var _d = Number(this.__size.z) ? this.__size.z : 0;
                //this.el.style.margin = '-50% 0 0 -50%';
                this.el.style[C3D._browserPrefix + "Transform"] = "translate3d(" + (this.__position.x - _w/2) + "px," + (this.__position.y - _h/2) + "px," + (this.__position.z - _d/2) + "px) " + "rotateX(" + this.__rotation.x + "deg) " + "rotateY(" + this.__rotation.y + "deg) " + "rotateZ(" + this.__rotation.z + "deg) " + "scale3d(" + this.__scale.x + ", " + this.__scale.y + ", " + this.__scale.z + ") ";
            }

            return this;
        },

        addChild : function(view) {
            C3D.Sprite3D.__super__.addChild.apply(this, [view]);
            if (this.el && view.el) {
                this.el.appendChild(view.el);
            }
            return this;
        },
        removeChild : function(view) {
            C3D.Sprite3D.__super__.removeChild.apply(this, [view]);
            if (view.el && view.el.parentNode) {
                view.el.parentNode.removeChild(view.el);
            }
            return this;
        },
        on : function(events) {
            if ( typeof (events) === "object") {
                for (var i in events ) {
                    this.el.addEventListener(i, events[i], false);
                }
            } else if (arguments.length === 2) {
                this.el.addEventListener(arguments[0], arguments[1], false);
            } else if (arguments.length === 3) {
                this.el.addEventListener(arguments[0], arguments[1], arguments[2]);
            }
            return this;
        },
        off : function(events) {
            if ( typeof (events) === "object") {
                for (var i in events ) {
                    this.el.removeEventListener(i, events[i], false);
                }
            } else if (arguments.length === 2) {
                this.el.removeEventListener(arguments[0], arguments[1], false);
            }
            return this;
        },
        buttonMode : function(bool) {
            if (bool) {
                this.el.style.cursor = "pointer";
            } else {
                this.el.style.cursor = "auto";
            }
            return this;
        },

        __material : null,
        __isMaterialUpdate : false,
        material : function(params) {
            this.__material = params;
            this.__isMaterialUpdate = true;
            return this;
        }
    });

    // --------------------------------------------------------------------3d核心元件
    C3D.Stage = C3D.Sprite3D.extend({
        camera : null,
        __fix1 : null,
        __fix2 : null,
        initialize : function(params) {
            C3D.Stage.__super__.initialize.apply(this, [params]);

            if (!(params && params.el)) {
                this.el.style.top = "0px";
                this.el.style.left = "0px";
                this.el.style.width = "0px";
                this.el.style.height = "0px";
            }
            this.el.style[C3D._browserPrefix + "Perspective"] = "800px";
            this.el.style[C3D._browserPrefix + "TransformStyle"] = "flat";
            this.el.style[C3D._browserPrefix + "Transform"] = "";
            this.el.style.overflow = "hidden";

            this.__fix1 = new C3D.Sprite3D();
            this.__fix1.el.style.top = "50%";
            this.__fix1.el.style.left = "50%";
            this.el.appendChild(this.__fix1.el);

            this.__fix2 = new C3D.Sprite3D();
            this.__fix1.el.appendChild(this.__fix2.el);

            this.camera = new C3D.Camera();
        },
        update : function() {
            if (this.__isSizeUpdate || this.camera.__isFovUpdate) {
                this.__isSizeUpdate = false;
                var _w = this.__size.x;
                var _h = this.__size.y;
                this.el.style.width = parseInt(_w) + "px";
                this.el.style.height = parseInt(_h) + "px";

                this.camera.__isFovUpdate = false;
                var _fov = 0.5 / Math.tan((this.camera.fov() * 0.5) / 180 * Math.PI) * this.height();
                this.el.style[C3D._browserPrefix + "Perspective"] = _fov + "px";
                this.__fix1.position(0, 0, _fov).update();
            }

            if (this.camera.__isPositionUpdate || this.camera.__isRotationUpdate) {
                this.camera.__isPositionUpdate = false;
                this.camera.__isRotationUpdate = false;
                this.__fix1.rotation(-this.camera.rotationX(), -this.camera.rotationY(), -this.camera.rotationZ()).update();
                this.__fix2.position(-this.camera.x(), -this.camera.y(), -this.camera.z()).update();
            }

            if (this.__isMaterialUpdate) {
                this.__isMaterialUpdate = false;
                if (this.__material) {
                    if (this.__material.image) {
                        this.el.style.background = "url(" + this.__material.image + ")";
                        this.el.style.backgroundSize = "100% 100%";
                    } else if (this.__material.color) {
                        this.el.style.backgroundColor = this.__material.color;
                    }
                    if (this.__material.alpha) {
                        this.el.style.opacity = this.__material.alpha;
                    }
                }
            }
        },
        addChild : function(view) {
            this.__fix2.addChild(view);
        },
        removeChild : function(view) {
            this.__fix2.removeChild(view);
        }
    });

    C3D.Camera = C3D.Object3D.extend({
        __fov : null,
        __target : null,
        __isFovUpdate : null,
        initialize : function(params) {
            C3D.Camera.__super__.initialize.apply(this, [params]);
            this.__fov = 75;
            this.__isFovUpdate = true;
            this.__target = {
                x : 0,
                y : 0,
                z : 0
            };
        },
        fov : function(n) {
            if (arguments.length) {
                this.__fov = n;
                this.__isFovUpdate = true;
                return this;
            } else {
                return this.__fov;
            }
        }
    });

    // --------------------------------------------------------------------3d显示元件
    C3D.Plane = C3D.Sprite3D.extend({
        initialize : function() {
            C3D.Plane.__super__.initialize.apply(this);
        },
        update : function() {
            if (this.__isSizeUpdate) {
                var _w = Number(this.__size.x) ? this.__size.x : 0;
                var _h = Number(this.__size.y) ? this.__size.y : 0;
                this.el.style.width = _w + "px";
                this.el.style.height = _h + "px";
                this.__size.z = 0;
            }

            C3D.Plane.__super__.update.apply(this);

            if (this.__isMaterialUpdate) {
                this.__isMaterialUpdate = false;
                if (this.__material) {
                    if (this.__material.image) {
                        this.el.style.background = "url(" + this.__material.image + ")";
                        this.el.style.backgroundSize = "100% 100%";
                    } else if (this.__material.color) {
                        this.el.style.backgroundColor = this.__material.color;
                    }
                    if (this.__material.alpha) {
                        this.el.style.opacity = this.__material.alpha;
                    }
                }
            }
        }
    });

    C3D.Cube = C3D.Sprite3D.extend({
        front : null,
        back : null,
        left : null,
        right : null,
        up : null,
        down : null,
        initialize : function() {
            C3D.Cube.__super__.initialize.apply(this);

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
        update : function() {
            if (this.__isSizeUpdate) {
                var _w = this.__size.x;
                var _h = this.__size.y;
                var _d = this.__size.z;

                this.front.size(_w, _h, 0).position(0, 0, -_d/2).rotation(0, 0, 0).update();
                this.back.size(_w, _h, 0).position(0, 0, _d/2).rotation(0, 180, 0).update();
                this.left.size(_d, _h, 0).position(-_w/2, 0, 0).rotation(0, 90, 0).update();
                this.right.size(_d, _h, 0).position(_w/2, 0, 0).rotation(0, -90, 0).update();
                this.up.size(_w, _d, 0).position(0, -_h/2, 0).rotation(-90, 0, 0).update();
                this.down.size(_w, _d, 0).position(0, _h/2, 0).rotation(90, 0, 0).update();
            }

            this.__size.x = 0;
            this.__size.y = 0;
            this.__size.z = 0;
            this.__isSizeUpdate = false;
            C3D.Cube.__super__.update.apply(this);

            if (this.__isMaterialUpdate) {
                this.__isMaterialUpdate = false;
                if (this.__material) {
                    if (this.__material.front)
                        this.front.material({
                            image : this.__material.front
                        }).update();
                    else
                        this.front.material(this.__material).update();
                    if (this.__material.back)
                        this.back.material({
                            image : this.__material.back
                        }).update();
                    else
                        this.back.material(this.__material).update();
                    if (this.__material.left)
                        this.left.material({
                            image : this.__material.left
                        }).update();
                    else
                        this.left.material(this.__material).update();
                    if (this.__material.right)
                        this.right.material({
                            image : this.__material.right
                        }).update();
                    else
                        this.right.material(this.__material).update();
                    if (this.__material.up)
                        this.up.material({
                            image : this.__material.up
                        }).update();
                    else
                        this.up.material(this.__material).update();
                    if (this.__material.down)
                        this.down.material({
                            image : this.__material.down
                        }).update();
                    else
                        this.down.material(this.__material).update();
                }
            }
        }
    });

    return C3D;
}));
