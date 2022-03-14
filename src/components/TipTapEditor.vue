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
  private socket: WebSocket = new WebSocket('ws://localhost:8080/steps')
  private editor = useEditor({
    content: "",
    extensions: [StarterKit],
    autofocus: true,
    onUpdate: this.onInputChanged,
    onSelectionUpdate(e: EditorEvents["selectionUpdate"]) {
      //console.log(JSON.stringify(e.transaction.steps))
    }
  }) 

  mounted(): void {
    this.socket.onmessage = this.onMessageSocket
    this.socket.onclose = this.onCloseSocket
  }

  beforeUnmount(): void {
    this.editor.value?.destroy()
  }

  onNewInputReceived(data: string): void {
    console.log(data)
  }

  onMessageSocket(this: WebSocket, ev: MessageEvent<string>): void {
    console.log(ev.data)
  }

  onCloseSocket(): void {
    this.socket.close
  }

  onInputChanged(e: EditorEvents["selectionUpdate"]): void {
    this.socket.send(JSON.stringify(e.transaction.steps))
  }
}
</script>