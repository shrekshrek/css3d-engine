css3d-engine
============

css 3d引擎，为方便工作需要制作  
优势:因为是基于div+css3实现,相对canvas webgl拥有更好的平台兼容性  
劣势:渲染性能相比canvas webgl要弱,只适合创建较小的三维面片场景。  
但是只有14k,相比那些动辄300-400k的大型3d库,这是个非常小巧实用的辅助支持库。  


注意1:为了节约计算量,transform部分没有使用matrix,只用了最基本的translate,rotation,scale等属性的排列,默认的旋转顺序是rotationX(),rotationY(),rotationZ(),这样无法解决万象锁等问题,所以在使用时需要了解适应这点。如果需要调整可以使用sort()命令调整旋转顺序。  

注意2:旧版的Cube更新为Box  


具体使用请看案例
demo:http://shrek.imdevsh.com/demo/css3d/space.html


##类
**C3D.Object**  
三维元素基类，拥有如下方法：  
设置位置  
.x;  
.y;  
.z;  
.position(x,y,z);  
增量移动  
.move(x,y,z);  

设置旋转中心  
.originX;  
.originY;  
.originZ;  
.origin(x,y,z);  

设置旋转角度  
.rotationX;  
.rotationY;  
.rotationZ;  
.rotation(x,y,z);  
增量旋转  
.rotate(x,y,z);  

设置缩放比  
.scaleX;  
.scaleY;  
.scaleZ;  
.scale(x,y,z);  

设置尺寸  
.width;  
.height;  
.depth;  
.size(x,y,z);  

设置材质(div的background相关的几种属性)  
.material({image:'',color:'',position:'',size:'',repeat:'',origin:''});  

设置可见性  
.alpha;  
.visible;  
.visibility({visible:true,alpha:1});  

设置滤镜(css3滤镜:grayscale,blur,saturate,sepia,hue-rotate,invert,brightness,contrast,opacity)  
.filter({filter-type:params});  

设置旋转顺序,默认是.sort('X','Y','Z'),可以根据需要调整,必须是这三个参数,顺序自理  
.sort()  

设置名称(当该元素有名称的话,被addChild添加进入到别的元素时,可以直接用元素的属性方式访问,比如名称为'b1'的元素被加入到名称为'a1'的元素,之后就可以直接用a1.b1获得该元素.反之,被removeChild移除时也会删除绑定的属性.)  
.name(string);  

添加删除子节点  
.addChild(object3D);  
.removeChild(object3D);  

刷新相应的dom内容，位置，角度，尺寸，材质等信息只有在执行此命令后才会被作用到dom节点，以正常显示。  
.update();  

刷新尺寸  
.updateS();  

刷新旋转中心  
.updateO();  

刷新位置，角度  
.updateT();  

刷新材质  
.updateM();  

刷新可见性  
.updateV();  

刷新滤镜  
.updateF();  

移除自身，从场景中移除  
.remove();  

拥有如下属性  
parent  父节点  
children  子节点数组  


**C3D.Sprite**  
三维显示元素基类，继承自Object3D,是其他所有显示元素的基类。
一般用于作为容器使用，自身只会刷新位置，角度，缩放信息。没有高宽深的体积信息。拥有如下方法：  
绑定事件  
.on();  

解除绑定事件  
.off();  

设置材质信息，在Sprite3D中，因为没有体积，所以color，images都是无效的，只有alpha会起作用。  
.material({color:'#ff0000',images:"",alpha:1});  

设置鼠标状态，设置为true就是按钮状态。  
.buttonMode(bool);  


**C3D.Stage**  
三维场景，需要首先创建，其他所有内容都通过addchild方法放入场景即可。  


**C3D.Camera**  
摄像机，最基本的3D摄像机，场景创建时自动创建，通过stage.camera属性获取。  


**C3D.Plane**  
平面，顾名思义。  


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
http://drose6.adidasevent.com/  
http://show.im20.com.cn/bbcny/  
http://crazylight.adidasevent.com/  
http://zwj360.im20.com.cn/  




欢迎研讨。QQ:274924021  



 * VERSION: 0.6.0 DATE: 2015-12-2

 * VERSION: 0.5.0 DATE: 2015-11-21

 * VERSION: 0.4.0 DATE: 2015-09-15

 * VERSION: 0.2.0 DATE: 2015-01-03

 * VERSION: 0.1.0 DATE: 2014-11-20
