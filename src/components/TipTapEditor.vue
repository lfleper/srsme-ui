<template>
  <editor-content :editor="editor"></editor-content>
</template>

<script setup lang="ts">
import { EditorContent, useEditor, EditorEvents, Editor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { onMounted, onUnmounted, ShallowRef } from 'vue'

let socket: WebSocket
let editor: ShallowRef<Editor | undefined> = useEditor({
  content: "",
  extensions: [StarterKit],
  autofocus: true,
  onUpdate: (e: EditorEvents['update']) => {
    socket.send(JSON.stringify(e.transaction.steps))
  },
  onSelectionUpdate(e: EditorEvents["selectionUpdate"]) {
    console.log(e)
    //console.log(JSON.stringify(e.transaction.steps))
  }
})

onMounted(() => {
  socket = new WebSocket('ws://localhost:8080/steps')
  socket.onopen = () => console.log('socket connected')
  socket.onmessage = (data) => console.log('message:', data)
})
onUnmounted(() => {
  editor.value?.destroy()
  socket.close()
})
</script>