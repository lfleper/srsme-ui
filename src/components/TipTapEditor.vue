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
import { Collaboration } from '@tiptap/extension-collaboration'
import { Step } from 'prosemirror-transform'
import StarterKit from '@tiptap/starter-kit'
import SockJS from 'sockjs-client'
import Stomp, { Client, Message } from 'webstomp-client'
import * as Y from 'yjs'
import { onMounted, onUnmounted, provide } from 'vue'
import { ElRow, ElCol, ElButtonGroup, ElButton } from 'element-plus'

const ydoc: Y.Doc = new Y.Doc()
let socket: WebSocket 
let stompClient: Client 
let editor: Editor | undefined = new Editor({
  content: "bla",
  extensions: [
    StarterKit.configure({
      history: false
    }),
    Collaboration.configure({
      document: ydoc,
    })
  ],
  autofocus: 'start',
  onUpdate: (e: EditorEvents['update']) => {
    stompClient.send('/srs/collab', JSON.stringify(e.transaction.steps))
  },
  onSelectionUpdate(e: EditorEvents["selectionUpdate"]) {
    console.log(e)
    //console.log(JSON.stringify(e.transaction.steps))
  }
})

onMounted(() => {
  socket = new SockJS('http://localhost:8080/srs')
  stompClient = Stomp.over(socket)
  stompClient.connect(
    {},
    frame => {
      console.log('frame:', frame)
      stompClient.subscribe('/collab/reply', (message: Message) => {
        const editorInput: Array<Step<any>> = JSON.parse(message.body)

        //editor?.chain().insertContent("hallo").run()

        console.log(editorInput)
      })
    }
  )
})

onUnmounted(() => {
  editor?.destroy()
  if (stompClient) {
    stompClient.disconnect()
  }
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