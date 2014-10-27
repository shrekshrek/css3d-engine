css3d-engine
============

css 3d引擎，为方便工作需要制作

具体使用请看案例
demo:http://shrekwang.duapp.com/demo/c3d/

使用：
强依赖underscore.js。请先引入underscore,再引入css3d就可以。
<script src="../underscore.js"></script>
<script src="../css3d.js"></script>

类
Css3D.Object3D  三维元素基类，拥有如下方法  
设置获取实例位置  
.x(n);  
.y(n);  
.z(n);  
.position(x,y,z);  
增量移动  
.move(x,y,z);  

设置获取实例旋转中心  
.originX(n);  
.originY(n);  
.originZ(n);  
.origin(x,y,z);  

设置获取实例旋转角度  
.rotationX(n);  
.rotationY(n);  
.rotationZ(n);  
.rotation(x,y,z);  
增量旋转  
.rotate(x,y,z);  

设置获取实例缩放比  
.scaleX(n);  
.scaleY(n);  
.scaleZ(n);  
.scale(x,y,z);  

设置获取实例  
.width(n);  
.height(n);  
.depth(n);  
.size(x,y,z);  

添加删除子节点  
.addChild(object3D);  
.removeChild(object3D);  

刷新相应的dom内容，位置，角度，尺寸，材质等信息只有在执行此命令后才会被作用到dom节点，以正常显示。  
.update();  

销毁自身，从场景中移除  
.destroy();  

拥有如下属性  
parent  父节点  
children  子节点数组  


Css3D.Sprite3D  三维显示元素基类，一般用于作为容器使用，自身只会刷新位置，角度信息。拥有如下方法  
绑定事件  
.on();  

解除绑定事件  
.off();  

设置材质信息  
.material({color:'#ff0000',images:"",alpha:1});  


Css3D.Stage  三维场景，需要首先创建，其他所有内容都通过addchild方法放入场景即可  


Css3D.Camera  摄像机，最基本的3D摄像机，场景创建时自动创建，通过stage.camera属性获取  


Css3D.Plane  平面，顾名思义  


Css3D.Cube  立方体，顾名思义，指定材质时可以添加6面的图片定义{front:"",back:"",left:"",right:"",up:"",down:""}  



