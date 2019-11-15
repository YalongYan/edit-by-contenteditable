<template>
   <ul class="contendEditSelectList" :style="{left: left}">
    <li v-for="(item, i) in list" :key="i" class="selectItem" :class="{on: (i + 1) === selectItemIndex}" code=item @click="itemClick(item)">
      {{ selectDataList[item] }}
    </li>
   </ul>
</template>
<script>
export default {
  props: {
    left: {
      type: String,
      default: "0px"
    },
    selectItemIndex: {
      type: Number,
      default: 0
    },
    selectDataList: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      // list: ['FORM_NAME', 'STAFF_SCOPE', 'START_TIME']
    }
  },
  methods: {
    itemClick (str) {
      this.$emit("itemClick", str)
    }
  },
  computed: {
    list: function () {
      // 返回key的数组
      return Object.keys(this.selectDataList)
    }
  }
}
</script>
<style lang="scss">
    .contendEditSelectList{
        width:160px;
        height:92px;
        background:rgba(255,255,255,1);
        box-shadow:0px 3px 6px 0px rgba(74,81,93,0.25);
        border-radius:2px;
        border:1px solid rgba(217,217,217,1);
        position: absolute;
        bottom: -92px;
        z-index: 99;
        padding: 0;
        margin: 0;
        overflow: hidden;

        .selectItem{
            cursor: pointer;
            width: 100%;
            height: 30px;
            padding: 0 10px;
            line-height: 30px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 12px;
            color: #333333;

            &:hover{
                background:rgba(240,243,249,1);
            }
            &.on{
              background: #f0f3f9;
            }
        }
    }
</style>
