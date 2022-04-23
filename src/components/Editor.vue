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
                    <el-select 
                        v-model="headerOption"
                        @change="changeHeading"
                        clearable
                    >
                        <el-option
                            v-if="headerOption"
                            :key="0"
                            label="Normal"
                            :value="0"
                        />
                        <el-option
                            v-for="type in header_options"
                            :key="type.value"
                            :label="type.label"
                            :value="type.value"
                        />
                    </el-select>
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
import StarterKit from "@tiptap/starter-kit"
import * as Y from "yjs"
import {
    ElContainer,
    ElMain,
    ElRow,
    ElButtonGroup,
    ElButton,
    ElSelect,
    ElOption
} from 'element-plus'
import { onUnmounted, ref } from 'vue'
import { header_options } from '@/util/EditorUtil'

let headerOption = ref()
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

const changeHeading = () => {
    if (headerOption.value === 0) {
        editor?.chain().focus().toggleHeading({ level: editor?.getAttributes('heading')?.level }).run()
    }
    editor?.chain().focus().toggleHeading({ level: headerOption.value }).run()
}

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