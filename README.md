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


实现案例:

http://shrek.imdevsh.com/show/drose/

http://show.im20.com.cn/bbcny/

http://shrek.imdevsh.com/show/crazylight/

http://show.im20.com.cn/zwj/


这种Interactive 3d motion graphic类型的网站开发，以前都是程序来做动画，需要书写大量的tween代码，开发效率难以提高。从2018年初开始已经改用更先进高效的内部工具套装AEP开发，demo地址如下：  
https://github.com/shrekshrek/aep  




 * VERSION: 0.1.0 DATE: 2014-11-20



# License
This content is released under the [MIT](http://opensource.org/licenses/MIT) License.