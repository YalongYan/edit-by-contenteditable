<template>
  <div>
    <ContendEdit ref="contendEdit" :selectDataList="selectDataList" :messageDescStr.sync="messageDescStr"/>
    <br/>
    <button @click="getReal">点我获取real值</button>
  </div>
</template>

<script>
import ContendEdit from './components/common/contendEdit'

export default {
  name: 'app',
  data () {
    return {
      messageDescStr: 'sss' + '[FORM_NAME]',
      selectDataList: {
        'FORM_NAME': '表单名称',
        'STAFF_SCOPE': '表单范围',
        'START_TIME': '填报时间'
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
