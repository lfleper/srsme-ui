<template>
  <div class="editor">
    <el-row class="editor-toolbar editor-item">
      <el-col :span="24">
        <el-button-group>
          <el-button @click="editor?.chain().focus().toggleBold().run()">
            B
          </el-button>
          <el-button @click="editor?.chain().focus().toggleItalic().run()">
            I
          </el-button>
          <el-button @click="editor?.chain().focus().toggleHeading({level: 1}).run()">
            H1
          </el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-row class="editor-wrapper editor-item" @click="editor?.chain().focus()"> 
      <editor-content :editor="editor"></editor-content>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { EditorContent, useEditor, EditorEvents, Editor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { onMounted, onUnmounted, ShallowRef } from 'vue'
import { ElRow, ElCol, ElButtonGroup, ElButton } from 'element-plus'

let socket: WebSocket
let editor: ShallowRef<Editor | undefined> = useEditor({
  content: "bla",
  extensions: [StarterKit],
  autofocus: 'start',
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

<style scoped>
.editor {
  margin: 0 auto;
  max-width: 80%;
}
.editor-toolbar {
  text-align: center;
}
.editor-wrapper {
  padding: 0 10px;
  border: 2px solid gray;
  border-radius: 10px;
}
.editor-item {
  margin: 10px 0;
}
</style>