# css3d-engine


css 3d引擎，为方便工作需要制作  
优势:因为是基于div+css3实现,相对canvas webgl拥有更好的平台兼容性。  
劣势:渲染性能相比canvas webgl要弱,只适合创建较小的三维面片场景。  
但是只有14k,相比那些动辄300-400k的大型3d库,这是个非常小巧实用的辅助支持库。  

这个库只是基于原生css transform中除了matrix之外的属性，可以使用比较容易理解的欧拉角来控制旋转，建立简单的3D应用，对于3d开发0基础的开发者是个友善简单的入门类库。对于有更高3d要求的开发者建议使用three.js等类库。但同样对开发者的基础要求会更高，这里我整理了一个更通用的3d基础学习案例  
https://github.com/shrekshrek/css3d-matrix-es6  
抽取出three中3D核心类库，组织了一个简化版的3D引擎，并做了大量的注释，可以帮助了解3D算法基础中的矢量，矩阵及四元数等的相互关系。 

有3d问题欢迎加入研讨。QQ群:572807793（webgl技术交流）  
 


注意1:为了节约计算量,transform部分没有使用matrix,只用了最基本的translate,rotation,scale等属性的排列,默认的旋转顺序是rotationX(),rotationY(),rotationZ(),这样无法解决万向锁等问题,所以在使用时需要了解适应这点。如果需要调整可以使用sort()命令调整旋转顺序。  

注意2:旧版的Cube更新为Box。  


具体使用请看案例
demo:http://shrek.imdevsh.com/demo/css3d/space.html


##类
**C3D.Object**  
三维元素基类，拥有如下方法：  
设置位置,物体坐标原点以旋转中心为准  
```js
obj.position(a,b,c);  
//等价于  
obj.x = a;  
obj.y = b;  
obj.z = c;  

obj.position(a,b);  
//等价于  
obj.x = a;  
obj.y = b;  

obj.position(a);  
//等价于  
obj.x = a;  
obj.y = a;  
obj.z = a;  
```


增量移动,在原来基础值上增加  
```js
obj.move(a,b,c);  
//等价于  
obj.x += a;  
obj.y += b;  
obj.z += c;  

obj.move(a,b);  
//等价于  
obj.x += a;  
obj.y += b;  

obj.move(a);  
//等价于  
obj.x += a;  
obj.y += a;  
obj.z += a;  
```


设置旋转中心,默认旋转中心是在物体中心  
```js
obj.origin(a,b,c);  
//等价于  
obj.originX = a;  
obj.originY = b;  
obj.originZ = c;  

obj.origin(a,b);  
//等价于  
obj.originX = a;  
obj.originY = b;  

obj.origin(a);  
//等价于  
obj.originX = a;  
obj.originY = a;  
obj.originZ = a;  
```


设置旋转角度  
```js
obj.rotation(a,b,c);  
//等价于  
obj.rotationX = a;  
obj.rotationY = b;  
obj.rotationZ = c;  

obj.rotation(a,b);  
//等价于  
obj.rotationX = a;  
obj.rotationY = b;  

obj.rotation(a);  
//等价于  
obj.rotationX = a;  
obj.rotationY = a;  
obj.rotationZ = a;  
```


增量旋转  
```js
obj.rotate(a,b,c);  
//等价于  
obj.rotationX += a;  
obj.rotationY += b;  
obj.rotationZ += c;  

obj.rotate(a,b);  
//等价于  
obj.rotationX += a;  
obj.rotationY += b;  

obj.rotate(a);  
//等价于  
obj.rotationX += a;  
obj.rotationY += a;  
obj.rotationZ += a;  
```


设置缩放比  
```js
obj.scale(a,b,c);  
//等价于  
obj.scaleX = a;  
obj.scaleY = b;  
obj.scaleZ = c;  

obj.scale(a,b);  
//等价于  
obj.scaleX = a;  
obj.scaleY = b;  

obj.scale(a);  
//等价于  
obj.scaleX = a;  
obj.scaleY = a;  
obj.scaleZ = a;  
```


设置尺寸  
```js
obj.size(a,b,c);  
//等价于  
obj.width = a;  
obj.height = b;  
obj.depth = c;  

obj.size(a,b);  
//等价于  
obj.width = a;  
obj.height = b;  

obj.size(a);  
//等价于  
obj.width = a;  
obj.height = a;  
obj.depth = a;  
```


设置旋转顺序,默认是.sort('X','Y','Z'),可以根据需要调整,必须是这三个参数,顺序自理  
```js
obj.sort('Y','X','Z');  
```

设置名称(当该元素有名称的话,被addChild添加进入到别的元素时,可以直接用元素的属性方式访问,比如名称为'b1'的元素被加入到名称为'a1'的元素,之后就可以直接用a1.b1获得该元素.反之,被removeChild移除时也会删除绑定的属性.)  
```js
obj.name(string);  
```

添加删除子节点  
```js
obj.addChild(object3D);  
obj.removeChild(object3D);  
```

移除自身，从场景中移除  
```js
obj.remove();  
```

拥有如下属性  
```js
obj.parent  //父节点  
obj.children  //子节点数组  
```


**C3D.Sprite**  
三维显示元素基类，继承自Object3D,是其他所有显示元素的基类。
一般用于作为容器使用，自身只会刷新位置，角度，缩放信息。没有高宽深的体积信息。拥有如下方法：  
绑定事件  
```js
obj.on();  
```

解除绑定事件  
```js
obj.off();  
```

设置可见性  
```js
obj.visibility({visible:true,alpha:1});  
//等价于  
obj.alpha = 1;  
obj.visible = true;  
```

设置滤镜(css3滤镜:grayscale,blur,saturate,sepia,hue-rotate,invert,brightness,contrast,opacity)  
```js
obj.filter({filter-type:params});  
```

设置材质(div的background相关的几种属性),在Sprite3D中，因为没有体积，  
image即background-image,color即background-color,其他属性以此类推,具体属性值也直接设置css的属性即可。比如size:'100% 100%'。  
```js
obj.material({image:'', color:'', position:'', size:'', repeat:'', origin:'', bothsides:true});  
```

设置鼠标状态，设置为true就是按钮状态。  
```js
obj.buttonMode(bool);  
```

刷新相应的dom内容，位置，角度，尺寸，材质等信息只有在执行此命令后才会被作用到dom节点，以正常显示。一般只需要根据进行中的属性变化调用相应的update即可,比如只改变了x,y,z坐标就只要调用updateT()即可,不用调用update()这样很重的操作。  
```js
obj.update();  //一般只在创建元件时调用,会刷新所有信息。
//等价于
obj.updateS();  //刷新尺寸  
obj.updateO();  //刷新旋转中心  
obj.updateT();  //刷新位置，角度  
obj.updateM();  //刷新材质  
obj.updateV();  //刷新可见性  
obj.updateF();  //刷新滤镜  
```


**C3D.Plane**  
平面，顾名思义。  


**C3D.Stage**  
三维场景，需要首先创建，其他所有内容都通过addchild方法放入场景即可。  


**C3D.Camera**  
摄像机，最基本的3D摄像机，场景创建时自动创建，通过stage.camera属性获取。  


**C3D.Box**  
一个立方体，指定材质时可以添加6面的图片定义。  
*eg.{front:"",back:"",left:"",right:"",up:"",down:""}*  


**C3D.Skybox**  
天空盒子，适合用来制作全景背景，指定材质时可以添加6面的图片定义。  
*eg.{front:"",back:"",left:"",right:"",up:"",down:""}*  




其他全局方法:  
**C3D.getRandomColor();**  
**C3D.rgb2hex();**  
**C3D.hex2rgb();**  

**C3D.create(obj);**  
此方法非常有用,可以帮助快速创建场景.  



实现案例:

http://shrek.imdevsh.com/show/drose/

http://show.im20.com.cn/bbcny/

http://shrek.imdevsh.com/show/crazylight/

http://show.im20.com.cn/zwj/






 * VERSION: 0.1.0 DATE: 2014-11-20



# License
This content is released under the [MIT](http://opensource.org/licenses/MIT) License.