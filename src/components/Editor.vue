<template>
    <el-container>
        <el-main>
            <el-row class="editor-toolbar" :span="24">
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
            </el-row>
            <el-row class="editor-content" :span="24" @click="editor?.chain().focus()">
                <editor-content :editor="editor"></editor-content>
            </el-row>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { EditorContent, Editor } from '@tiptap/vue-3'
import { Collaboration } from "@tiptap/extension-collaboration"
import { Step } from "prosemirror-transform"
import StarterKit from "@tiptap/starter-kit"
import * as Y from "yjs"
import {
    ElContainer,
    ElMain,
    ElRow,
    ElButtonGroup,
    ElButton
} from 'element-plus'
import { onUnmounted } from 'vue'

const ydoc: Y.Doc = new Y.Doc()
let editor: Editor | undefined = new Editor({
    content: 'bla',
    extensions: [
        StarterKit.configure({
        history: false,
        }),
        Collaboration.configure({
        document: ydoc,
        }),
    ],
    autofocus: "start"
})

onUnmounted(() => {
    editor?.destroy()
})

</script>

<style scoped>
.editor-toolbar {
    margin-bottom: 20px;
}
.editor-content {
    padding: 20px;
}
</style>