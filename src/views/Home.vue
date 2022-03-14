<template>
  <tip-tap-editor></tip-tap-editor>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import TipTapEditor from '@/components/TipTapEditor.vue'

@Options({
  components: {
    TipTapEditor
  },
})
export default class Home extends Vue {
}
</script>
