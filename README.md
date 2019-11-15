演示效果如下：
 ![演示图片](https://raw.githubusercontent.com/YalongYan/edit-by-contenteditable/master/src/assets/demo.gif)

#### 遇到的问题
必须加上这个 `user-select: none` ，不加的话，点击下拉框的时候，会导selection变化，无法记录在`contenteditable="true"`div里面的位置， 兼容写法如下:
```
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Chrome/Safari/Opera */
  -khtml-user-select: none; /* Konqueror */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
```