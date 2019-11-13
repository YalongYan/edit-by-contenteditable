<template>
  <div>
    <ContendEdit ref="contendEdit" :messageDescStr.sync="messageDescStr"/>
    <!-- <ContendEdit ref="contendEdit"/> -->
  </div>
</template>

<script>
import ContendEdit from './components/common/contendEdit'

export default {
  name: 'app',
  data () {
    return {
      messageDescStr: 'sss' + '[FORM_NAME]'
    }
  },
  components: {
    ContendEdit
  }
}
</script>