css3d-engine
============

css 3d引擎，为方便工作需要制作

具体使用请看案例
demo:http://shrekwang.duapp.com/demo/c3d/


##类
**C3D.Object3D**  
三维元素基类，拥有如下方法：  
设置位置  
.x;  
.y;  
.z;  
.position(x,y,z);  
增量移动  
.move(x,y,z);  

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

添加删除子节点  
.addChild(object3D);  
.removeChild(object3D);  

刷新相应的dom内容，位置，角度，尺寸，材质等信息只有在执行此命令后才会被作用到dom节点，以正常显示。  
.update();  

刷新尺寸  
.updateS();  

刷新位置，角度  
.updateT();  

刷新材质  
.updateM();  

刷新可见性  
.updateV();  

销毁自身，从场景中移除  
.destroy();  

拥有如下属性  
parent  父节点  
children  子节点数组  


**C3D.Sprite3D**  
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


**C3D.Cube**  
立方体，顾名思义，指定材质时可以添加6面的图片定义。  
*eg.{front:"",back:"",left:"",right:"",up:"",down:""}*  


欢迎研讨。QQ:274924021  



 * VERSION: 0.4.0
 * DATE: 2015-09-15

 * VERSION: 0.2.0
 * DATE: 2015-01-03

 * VERSION: 0.1.0
 * DATE: 2014-11-20
