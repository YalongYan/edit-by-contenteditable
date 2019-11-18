#### 演示效果如下： 

![演示图片](https://raw.githubusercontent.com/YalongYan/edit-by-contenteditable/master/src/assets/demo.gif)

具体代码可以看这里 [这里](https://github.com/YalongYan/edit-by-contenteditable), 下面分析实现的大概过程
#### 代码实现过程
1.把div容器变成可编辑的，用 `contenteditable="true"`

2.div容器里面的内容都用 `v-html` 渲染

3.输入 `#` 出现下拉选择，监听 `keyup` 事件即可

4.下拉框的位置，即 `left` 值 通过查询容器里面的内容计算出来（要区分汉字，字母的宽度）

5.按上下按钮，下拉框数据也移动，通过给document 添加keydown事件，但是记得在组件销毁的时候，把事件去掉，代码如下:
```
 created () { // 全局监听键盘事件
    document.addEventListener("keydown", this.documentKeyMethod)
  },
  beforeDestroy () { // 组件销毁之前 把全局的事件解除了
    document.removeEventListener("keydown", this.documentKeyMethod)
  }
```

6.每次在容器里点击，或者按左右键的时候，记录下光标位置(`lastSelection` 是全局变量)
```
     let selection = window.getSelection ? window.getSelection() : document.selection
     let range = selection.createRange ? selection.createRange() : selection.getRangeAt(0)
     lastSelection = selection
```

7.把选中的数据回显到容器里面，只需给光标处插入节点即可

8.插入节点后，光标自动插入到新数据的后面
```
lastSelection.collapse(childNode, index)
```

9. 在蓝色数据里面输入内容的时候，需要把这个数据直接删除，但是如果用户就是想在后面输入内容的话就需要特殊处理了，第十条为解决办法
![image.png](https://upload-images.jianshu.io/upload_images/8551758-c50f23feb7625f9a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

10.在蓝色数据的直接后面（没有空格）输入内容的时候，需要让光标自动往后移动一位，监听`kedDown` 事件即可，移动光标的时候需要判断后面是否有空格，没有的话还的插入一个空格

#### 遇到的问题
1.必须加上这个 `user-select: none` ，不加的话，点击下拉框的时候，会导selection变化，无法记录在`contenteditable="true"`div里面的位置， 兼容写法如下:
```
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Chrome/Safari/Opera */
  -khtml-user-select: none; /* Konqueror */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
```
2.需要设置字体，不然有些浏览器（比如uc浏览器）空格宽度不一致,我设置的字体css如下：
```
.editContentCtn{
  // 不设置字体的话 空格的宽度会很宽
  font-family: 'Avenir', 'Helvetica', 'Arial', 'sans-serif';
}
```

#### 代码地址:
 [https://github.com/YalongYan/edit-by-contenteditable](https://github.com/YalongYan/edit-by-contenteditable)
参考链接:
 [https://segmentfault.com/a/1190000005869372](https://segmentfault.com/a/1190000005869372)
[http://cn.voidcc.com/question/p-dchxjkvr-ye.html](http://cn.voidcc.com/question/p-dchxjkvr-ye.html)
