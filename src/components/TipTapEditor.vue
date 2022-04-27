<template>
    <el-container>
        <el-main class="editor-toolbar editor-item">
            <el-col :span="24">
                <el-button-group>
                    <el-button @click="editor?.chain().focus().toggleBold().run()">
                        B
                    </el-button>
                    <el-button @click="editor?.chain().focus().toggleItalic().run()">
                        I
                    </el-button>
                    <el-button @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()">
                        H1
                    </el-button>
                </el-button-group>
            </el-col>
            <el-row
                class="editor-wrapper editor-item"
                @click="editor?.chain().focus()"
            >
                <editor-content :editor="editor"></editor-content>
            </el-row>
            <el-button @click="logContent()"> LOG CONTENT </el-button>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { EditorContent, useEditor, EditorEvents, Editor } from "@tiptap/vue-3";
import { Collaboration } from "@tiptap/extension-collaboration";
import { Step } from "prosemirror-transform";
import StarterKit from "@tiptap/starter-kit";
import SockJS from "sockjs-client";
import Stomp, { Client, Message } from "webstomp-client";
import * as Y from "yjs";
import { onMounted, onUnmounted, provide, ref } from "vue";
import { ElRow, ElCol, ElButtonGroup, ElButton } from "element-plus";
import fetcher from "@/api/Api";

const ydoc: Y.Doc = new Y.Doc();
let socket: WebSocket;
let stompClient: Client;
let editor: Editor | undefined = new Editor({
  content: "bla",
  extensions: [
    StarterKit.configure({
      history: false,
    }),
    Collaboration.configure({
      document: ydoc,
    }),
  ],
  autofocus: "start",
  // onUpdate: (e: EditorEvents['update']) => {
  //   stompClient.send('/srs/collab', JSON.stringify(e.transaction.steps))
  // },
  // onSelectionUpdate(e: EditorEvents["selectionUpdate"]) {
  //   console.log(e)
  //   //console.log(JSON.stringify(e.transaction.steps))
  // }
});

let document: Document 
// = {
//   "id": "doc2",
//   "title": "This is a second test document",
//   "description": "This is a second test document",
//   "chapters": [
//     {
//       "title": "Chapter 4",
//       "content": "This is the first chapter",
//       "nr": 1
//     },
//     {
//       "title": "Chapter 5",
//       "content": "This is the second chapter",
//       "nr": 2
//     },
//     {
//       "title": "Chapter 6",
//       "content": "This is the third chapter",
//       "nr": 3
//     }
//   ]
// }

const logContent = () => {
  console.log(editor?.getHTML());
};

onMounted( async () => {
  // socket = new SockJS('http://localhost:8080/srs')
  // stompClient = Stomp.over(socket)
  // stompClient.connect(
  //   {},
  //   frame => {
  //     console.log('frame:', frame)
  //     stompClient.subscribe('/collab/reply', (message: Message) => {
  //       const editorInput: Array<Step<any>> = JSON.parse(message.body)

  //       //editor?.chain().insertContent("hallo").run()

  //       console.log(editorInput)
  //     })
  //   }
  // )
await fetcher<Document>('GET', '/api/document/doc1')
  .then(data => {
      if(!data.data){
        throw new Error('No such document')
      }
      console.log(data.data)
      document = data.data
  })
  console.log(editor?.getText());
});

onUnmounted(() => {
  editor?.destroy();
  if (stompClient) {
    stompClient.disconnect();
  }
  socket.close();
});
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

.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}
</style>