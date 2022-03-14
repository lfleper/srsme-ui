<template>
    <editor-content :editor="editor"></editor-content>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { EditorContent, useEditor, EditorEvents } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

@Options({
  components: {
    EditorContent
  },
})
export default class Home extends Vue {
  private editor = useEditor({
    content: "",
    extensions: [StarterKit],
    autofocus: true,
    onUpdate(e: EditorEvents["update"]) {
      //console.log("update")
      //console.log(JSON.stringify(e.editor.getJSON()))
      //console.log(JSON.stringify(e.transaction.steps))

    },
    onSelectionUpdate(e: EditorEvents["selectionUpdate"]) {
      //console.log("selection update")
      console.log(JSON.stringify(e.transaction.steps))
    }
  }) 


  beforeUnmount(): void {
    this.editor.value?.destroy()
  }
}
</script>