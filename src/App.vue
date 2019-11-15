<template>
  <div class="ctn">
    <ContendEdit ref="contendEdit" :selectDataList="selectDataList" :messageDescStr.sync="messageDescStr"/>
    <br/>
    <button @click="getReal">点我获取real值</button>
  </div>
</template>

<script>
import ContendEdit from "./components/contendEdit"

export default {
  name: "app",
  data () {
    return {
      messageDescStr: "sss" + "[FORM_NAME]", // 来个默认值
      selectDataList: { // 下来框的值
        "FORM_NAME": "表单名称",
        "STAFF_SCOPE": "表单范围",
        "START_TIME": "填报时间"
      }
    }
  },
  components: {
    ContendEdit
  },
  methods: {
    getReal () {
      console.log(this.$refs.contendEdit.getMessageDesc())
    }
  }
}
</script>
