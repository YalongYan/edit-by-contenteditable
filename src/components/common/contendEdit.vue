<template>
<div class="editContentCtn">
  <div id="messageDesc" contenteditable="true" v-html="parseContendMsg"
    @keyup="contenteditableKeyUp"
    @blur="contendEditBlur"
    @click="contendEditClick"
  >
    <!-- 撒打算 <span class="keyWord" contenteditable="false" node="1">我的表单</span> &nbsp; -->
  </div>
  <div v-if="showContentEdit" class="selectCtnBgCover" @click="selectCtnBgCoverClick"></div>
  <ContendEditSelectList
    v-if="showContentEdit"
    :left="left"
    :selectItemIndex="selectItemIndex"
    @itemClick="itemClick"/>
</div>
</template>

<script>
import ContendEditSelectList from './contendEditSelectList'

let lastEditRange = '' // 光标最后位置

export default {
  props: {
    messageDescStr: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      left: '0',
      showContentEdit: false,
      selectItemIndex: 0, // # 所在的index
      selectList: ['FORM_NAME', 'STAFF_SCOPE', 'START_TIME'],
      insertChildIndex: 0 // 光标插入位置
    }
  },
  methods: {
    // 点击空白的背景
    selectCtnBgCoverClick () {
      this.showContentEdit = false
      this.insertChildIndex = 0
      this.selectItemIndex = 0
      // let result = this.getMessageDesc()
      this.$nextTick(() => {
        let obj = document.getElementById('messageDesc')
        for (let i = 0; i < obj.childNodes.length; i++) {
          let str = obj.childNodes[i].textContent
          if (str.indexOf('#') >= 0) {
            obj.childNodes[i].textContent = str.replace('#', '')
          }
        }
        // this.$emit('update:messageDescStr', result)
      })
    },
    contendEditClick () {
      let selection = window.getSelection ? window.getSelection() : document.selection
      let range = selection.createRange ? selection.createRange() : selection.getRangeAt(0)
      lastEditRange = range
    },
    itemClick (str) {
      // 创建节点
      let node = document.createElement('span')
      node.setAttribute('node', str)
      node.className = 'keyWord'
      node.textContent = str
      // 开始插入节点
      let sel = null
      if (document.selection) { // IE9以下
        sel = document.selection
        sel.createRange().pasteHTML(node)
      } else {
        sel = window.getSelection()
      }
      if (sel.rangeCount > 0) {
        let range = sel.getRangeAt(0) // 获取选择范围
        range.deleteContents() // 删除选中的内容
        range.insertNode(node) // 设置选择范围的内容为插入的内容
        sel.removeAllRanges() // 移出所有选区
      }
      this.showContentEdit = false
      let result = this.getMessageDesc()
      this.selectItemIndex = 0
      this.$nextTick(() => {
        this.$emit('update:messageDescStr', result)
        if (lastEditRange) {
          setTimeout(() => {
            let obj = document.getElementById('messageDesc')
            obj.focus() // 解决ff不获取焦点无法定位问题
            // let range = window.getSelection() // 创建range
            // range.selectAllChildren(obj) // range 选择obj下所有子内容
            // range.collapseToEnd() // 光标移至最后
            let innerDivText = obj.childNodes[this.insertChildIndex + 2] // 1 是移动到插入节点的最后  2是移动到插入节点的下一个节点后面，相当于在插入节点后面的空格插入光标
            if (innerDivText.length > 0) {
              sel.collapse(innerDivText, 1)
            } else {
              sel.collapse(innerDivText, 0)
            }
          }, 0)
        }
      })
    },
    contendEditBlur () {
      // this.showContentEdit = false
      // console.log(lastEditRange)
    },
    insertNodeAtCursor (node) {
      let range, html
      if (window.getSelection && window.getSelection().getRangeAt) {
        range = window.getSelection().getRangeAt(0)
        window.getSelection().removeAllRanges()
        range.insertNode(node)
      } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange()
        html = (node.nodeType === 3) ? node.data : node.outerHTML
        range.pasteHTML(html)
      }
    },
    contenteditableKeyUp (e) {
      let parentNode = getSelection().anchorNode.parentElement
      let classKeyWord = parentNode.className
      if (classKeyWord === 'keyWord') {
        // 在span内输入# 要把#替换掉，输入删除，回删 要把整个span去掉
        // this.$t(parentNode.getAttribute('node')) !== parentNode.textContent 为了解决 span标签 末尾删除 bug
        // span 标签内部禁止输入  输入就删除节点
        if ((e.keyCode !== 37 && e.keyCode !== 38 && e.keyCode !== 39 && e.keyCode !== 40) && (parentNode.getAttribute('node') !== parentNode.textContent)) {
          parentNode.parentNode.removeChild(parentNode)
        }
      } else {
        if (e.keyCode === 51) { // 输入#
          let obj = document.querySelector('#messageDesc')
          let contentStr = obj.textContent
          let index = contentStr.indexOf('#')
          let subStr = contentStr.substring(0, index + 1)
          let positionLeft = 0
          for (let i = 0; i < subStr.length; i++) {
            let ii = subStr.charAt(i)
            if (ii.trim().length === 0 || /[0-9a-zA-Z]/.test(ii)) {
              positionLeft += 4
            } else {
              positionLeft += 14
            }
          }
          let realWidth = obj.getBoundingClientRect().width
          positionLeft = positionLeft % realWidth // 换行的情况下
          positionLeft += 'px'
          // let positionLeft = index * 14 + 'px'
          this.left = positionLeft
          this.showContentEdit = true
          // 获取 # 的childNode
          for (let i = 0; i < obj.childNodes.length; i++) {
            if (obj.childNodes[i].textContent.indexOf('#') >= 0) {
              this.insertChildIndex = i
              break
            }
          }
        }
      }
    },
    // 获取消息内容的字符串
    getMessageDesc () {
      let str = ''
      let nodes = document.querySelector('#messageDesc').childNodes
      for (let node of nodes) {
        if (node.nodeType === 3) {
          str += node.nodeValue.trim().replace('#', '')
        } else {
          str += '[' + node.attributes.node.value.trim() + ']'
        }
      }
      return str
    },
    // 解析消息内容的字符串
    parseMessageDesc () {
      let str = this.messageDescStr
      let result = ''
      if (str.length > 0 && str.indexOf('[') < 0) { // 纯文本
        result = str
        return result
      }
      let subStr = ''
      while (str.indexOf('[') >= 0) {
        let startIndex = str.indexOf('[')
        let endIndex = str.indexOf(']')
        if (str.indexOf('[') === 0) {
          let code = str.substring(startIndex + 1, endIndex)
          // result += '<span class="keyWord" node="' + code + '">' + this.$t(code) + '</span>'
          result += '&nbsp;<span class="keyWord" node="' + code + '">' + code + '</span>&nbsp;'
          str = str.substring(endIndex + 1)
        } else {
          subStr = str.substring(0, startIndex)
          result += subStr
          str = str.substring(startIndex)
        }
      }
      return result + str
    },
    documentKeyMethod (e) {
      // keyCode 38上 40 下
      if (this.showContentEdit) {
        if (e.keyCode === 38 || e.keyCode === 40) {
          let index = this.selectItemIndex
          if (e.keyCode === 38) { // 上键
            this.selectItemIndex = (index - 1) <= 0 ? 1 : index - 1
          } else if (e.keyCode === 40) { // 到底之后 重新开始
            this.selectItemIndex = (index + 1) > 3 ? (index + 1) % 3 : index + 1
          }
        } else if (e.keyCode === 13) { // 回车
          this.itemClick(this.selectList[this.selectItemIndex - 1])
        }
      }
    }
  },
  components: {
    ContendEditSelectList
  },
  computed: {
    parseContendMsg: function () {
      let str = this.parseMessageDesc()
      return str
    }
  },
  watch: {
    selectItemIndex (n, o) {
      if (n !== 0) {
        document.getElementById('messageDesc').blur()
      }
    }
  },
  created () { // 全局监听键盘事件
    document.addEventListener('keydown', this.documentKeyMethod)
  },
  beforeDestroy () { // 组件销毁之前 把全局的事件解除了
    document.removeEventListener('keydown', this.documentKeyMethod)
  }
}
</script>
<style lang="scss">
.editContentCtn{
  font-family: 'PingFang SC', 'Helvetica', 'NotoSans', 'Roboto', 'Tahoma', 'Hiragino Sans GB', 'Arial', 'Microsoft YaHei', 'Sans-serif';
  position: relative;
  padding: 0 8px;
  border: 1px solid black;
  border-radius: 3px;
  line-height: 32px;
  font-size: 14px;
  outline: none;;

  .selectCtnBgCover{
    position: fixed;
    width: 100%;
    height: 100%;
    opacity: 0;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 2
  }
  #messageDesc {
    border: none;
    outline: none;

    .keyWord{
      color: #6790DA;
    }
  }
}
</style>
