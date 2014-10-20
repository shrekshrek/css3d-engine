/*
 * Css3D.js - v0.1.0
 * (c) 2014 shrek.wang
 * https://github.com/shrekshrek/css3d-engine
 */

(function() {

    var root = this;

    var previousCss3D = root.Css3D;

    var Css3D;
    if ( typeof exports !== 'undefined') {
        Css3D = exports;
    } else {
        Css3D = root.Css3D = {};
    }

    Css3D.VERSION = '0.1.0';

    // Require Underscore, if we're on the server, and it's not already present.
    var _ = root._;
    if (!_ && ( typeof require !== 'undefined'))
        _ = require('underscore');

    Css3D.noConflict = function() {
        root.Css3D = previousCss3D;
        return this;
    };

    // --------------------------------------------------------------------extend.from.backbone
    var extend = function(protoProps, staticProps) {
        var parent = this;
        var child;

        if (protoProps && _.has(protoProps, 'constructor')) {
            child = protoProps.constructor;
        } else {
            child = function() {
                return parent.apply(this, arguments);
            };
        }

        _.extend(child, parent, staticProps);

        var Surrogate = function() {
            this.constructor = child;
        };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate;

        if (protoProps)
            _.extend(child.prototype, protoProps);

        child.__super__ = parent.prototype;

        return child;
    };

    // --------------------------------------------------------------------全局属性
    Css3D._isSupported = false;
    Css3D._browserPrefix = "webkit";
    Css3D._transformProperty = "webkitTransform";

    Css3D.checkSupport = function() {
        var _d = document.createElement("div"), _prefixes = ["", "webkit", "Moz", "O", "ms"], _len = _prefixes.length, i;

        for ( i = 0; i < _len; i++) {
            if ((_prefixes[i] + "Perspective") in _d.style) {
                Css3D._transformProperty = _prefixes[i] + "Transform";
                Css3D._isSupported = true;
                Css3D._browserPrefix = _prefixes[i];
                return true;
            }
        }
        return false;
    };

    Css3D.browserPrefix = function(str) {
        if (arguments.length) {
            return Css3D._browserPrefix + str;
        } else {
            return Css3D._browserPrefix;
        }
    };

    // --------------------------------------------------------------------辅助方法
    Css3D.getRandomColor = function() {
        return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
    };

    Css3D.calcDistance = function(pos1, pos2) {
        return Math.pow(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2) + Math.pow(pos2.z - pos1.z, 2), 0.5);
    };

    Css3D.calcRadian = function(pos1, pos2) {
        return {
            x : Math.atan2(pos2.y - pos1.y, pos2.z - pos1.z),
            y : Math.atan2(pos2.x - pos1.x, pos2.z - pos1.z),
            z : Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x)
        };
    };

    Css3D.calcDegree = function(pos1, pos2) {
        return {
            x : Math.atan2(pos2.y - pos1.y, pos2.z - pos1.z) / Math.PI * 180,
            y : Math.atan2(pos2.x - pos1.x, pos2.z - pos1.z) / Math.PI * 180,
            z : Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x) / Math.PI * 180
        };
    };

    // --------------------------------------------------------------------3d元素基类
    Css3D.Object3D = function() {
        this.initialize.apply(this, arguments);
    };

    _.extend(Css3D.Object3D.prototype, {
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
            _.each(this.children, function(obj) {
                obj.destroy();
            });
            this.children = [];
        },

        parent : null,
        children : null,
        addChild : function(view) {
            if (view.parent)
                view.parent.removeChild(view);

            _.each(this.children, function(obj) {
                if (obj === view)
                    return this;
            });
            view.parent = this;
            this.children.push(view);
            return this;
        },
        removeChild : function(view) {
            var _self = this;
            _.each(this.children, function(index, obj) {
                if (obj === view) {
                    _self.children.splice(index, 1);
                    view.parent = null;
                    return this;
                }
            });
            return this;
        },
        update : function() {
            return this;
        }
    });
    Css3D.Object3D.extend = extend;

    Css3D.Sprite3D = Css3D.Object3D.extend({
        el : null,
        initialize : function(params) {
            Css3D.Sprite3D.__super__.initialize.apply(this, [params]);

            this.__isMaterialUpdate = true;

            if (!(Css3D._isSupported || Css3D.checkSupport())) {
                throw "this browser does not support css3d!!!";
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
            _dom.style[Css3D._browserPrefix + "Transform"] = "translateZ(0px)";
            _dom.style[Css3D._browserPrefix + "TransformStyle"] = "preserve-3d";
            _dom.style[Css3D._browserPrefix + "TransformOrigin"] = "50% 50%";
            this.el = _dom;
            _dom.le = this;
        },
        destroy : function() {
            Css3D.Sprite3D.__super__.destroy.apply(this);
            if (this.el && this.el.parentNode) {
                this.el.parentNode.removeChild(this.el);
            }
        },
        update : function() {
            Css3D.Sprite3D.__super__.update.apply(this);

            if (this.__isPositionUpdate || this.__isRotationUpdate || this.__isScaleUpdate) {
                this.__isPositionUpdate = false;
                this.__isRotationUpdate = false;
                this.__isScaleUpdate = false;
                this.el.style[Css3D._transformProperty] = "translate3d(" + this.__position.x + "px," + this.__position.y + "px," + this.__position.z + "px) " + "rotateX(" + this.__rotation.x + "deg) " + "rotateY(" + this.__rotation.y + "deg) " + "rotateZ(" + this.__rotation.z + "deg) " + "scale3d(" + this.__scale.x + ", " + this.__scale.y + ", " + this.__scale.z + ") ";
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
            return this;
        },

        addChild : function(view) {
            Css3D.Sprite3D.__super__.addChild.apply(this, [view]);
            if (this.el && view.el) {
                this.el.appendChild(view.el);
            }
            return this;
        },
        removeChild : function(view) {
            Css3D.Sprite3D.__super__.removeChild.apply(this, [view]);
            if (this.el && this.el.parentNode) {
                this.el.parentNode.removeChild(this.el);
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

        __material : null,
        __isMaterialUpdate : false,
        material : function(params) {
            this.__material = params;
            this.__isMaterialUpdate = true;
            return this;
        }
    });

    // --------------------------------------------------------------------3d核心元件
    Css3D.Stage = Css3D.Sprite3D.extend({
        camera : null,
        __fix1 : null,
        __fix2 : null,
        initialize : function(params) {
            Css3D.Stage.__super__.initialize.apply(this, [params]);

            if (!(params && params.el)) {
                this.el.style.top = "0px";
                this.el.style.left = "0px";
                this.el.style.width = "100%";
                this.el.style.height = "100%";
            }
            this.el.style[Css3D._browserPrefix + "Perspective"] = "800px";
            this.el.style[Css3D._browserPrefix + "TransformStyle"] = "flat";
            this.el.style.overflow = "hidden";

            this.__fix1 = new Css3D.Sprite3D();
            this.__fix1.el.style.top = "50%";
            this.__fix1.el.style.left = "50%";
            this.el.appendChild(this.__fix1.el);

            this.__fix2 = new Css3D.Sprite3D();
            this.__fix1.el.appendChild(this.__fix2.el);

            this.camera = new Css3D.Camera();
        },
        update : function() {
            Css3D.Stage.__super__.update.apply(this);

            if (this.__isSizeUpdate || this.camera.__isFovUpdate) {
                this.__isSizeUpdate = false;
                var _w = this.__size.x;
                var _h = this.__size.y;
                this.el.style.width = Number(_w) ? _w + "px" : _w;
                this.el.style.height = Number(_h) ? _h + "px" : _h;

                this.camera.__isFovUpdate = false;
                var _fov = 0.5 / Math.tan((this.camera.fov() * 0.5) / 180 * Math.PI) * this.height();
                this.el.style[Css3D._browserPrefix + "Perspective"] = _fov + "px";
                this.__fix1.position(0, 0, _fov).update();
            }

            if (this.camera.__isPositionUpdate || this.camera.__isRotationUpdate) {
                this.camera.__isPositionUpdate = false;
                this.camera.__isRotationUpdate = false;
                this.__fix1.rotation(-this.camera.rotationX(), -this.camera.rotationY(), -this.camera.rotationZ()).update();
                this.__fix2.position(-this.camera.x(), -this.camera.y(), -this.camera.z()).update();
            }

        },
        addChild : function(view) {
            this.__fix2.addChild(view);
        },
        removeChild : function(view) {
            this.__fix2.removeChild(view);
        }
    });

    Css3D.Camera = Css3D.Object3D.extend({
        __fov : null,
        __target : null,
        __isFovUpdate : null,
        initialize : function(params) {
            Css3D.Camera.__super__.initialize.apply(this, [params]);
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
        },
        target : function(obj) {
            if (arguments.length) {
                this.__target = obj;
                this.__isFovUpdate = true;
                return this;
            } else {
                return this.__target;
            }
        }
    });

    // --------------------------------------------------------------------3d显示元件
    Css3D.Plane = Css3D.Sprite3D.extend({
        initialize : function() {
            Css3D.Plane.__super__.initialize.apply(this);
        },
        update : function() {
            Css3D.Plane.__super__.update.apply(this);

            if (this.__isSizeUpdate) {
                this.__isSizeUpdate = false;
                var _w = parseInt(this.__size.x);
                var _h = parseInt(this.__size.y);
                this.el.style.width = _w + "px";
                this.el.style.height = _h + "px";
                this.el.style.marginLeft = -_w / 2 + "px";
                this.el.style.marginTop = -_h / 2 + "px";
            }
        }
    });

    Css3D.Cube = Css3D.Sprite3D.extend({
        front : null,
        back : null,
        left : null,
        right : null,
        top : null,
        bottom : null,
        initialize : function() {
            Css3D.Cube.__super__.initialize.apply(this);

            this.front = new Css3D.Plane();
            this.addChild(this.front);

            this.back = new Css3D.Plane();
            this.addChild(this.back);

            this.left = new Css3D.Plane();
            this.addChild(this.left);

            this.right = new Css3D.Plane();
            this.addChild(this.right);

            this.top = new Css3D.Plane();
            this.addChild(this.top);

            this.bottom = new Css3D.Plane();
            this.addChild(this.bottom);

        },
        update : function() {
            Css3D.Cube.__super__.update.apply(this);

            if (this.__isSizeUpdate) {
                this.__isSizeUpdate = false;
                var _w = this.__size.x;
                var _h = this.__size.y;
                var _d = this.__size.z;

                this.front.size(_w, _h, 0).position(0, 0, -_d / 2).rotation(0, 0, 180).material(this.__material).update();
                this.back.size(_w, _h, 0).position(0, 0, _d / 2).rotation(0, 0, 0).material(this.__material).update();
                this.left.size(_d, _h, 0).position(-_w / 2, 0, 0).rotation(0, -90, 0).material(this.__material).update();
                this.right.size(_d, _h, 0).position(_w / 2, 0, 0).rotation(0, 90, 0).material(this.__material).update();
                this.top.size(_w, _d, 0).position(0, -_h / 2, 0).rotation(-90, 0, 0).material(this.__material).update();
                this.bottom.size(_w, _d, 0).position(0, _h / 2, 0).rotation(90, 0, 0).material(this.__material).update();
            }
        }
    });

}).call(this);
