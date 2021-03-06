<template>
    <el-container>
        <el-main v-if="editor">
            <el-row class="editor-toolbar" :span="24">
                <el-button-group>
                    <el-button 
                        type="primary" 
                        @click="saveDocument"
                        :disabled="userHasPermission()"
                    >
                        Save
                    </el-button>
                    <el-button 
                        @click="editor?.chain().focus().toggleBold().run()" 
                        :disabled="userHasPermission()"
                        :type="editor?.isActive('bold') ? 'primary' : ''"
                    >
                        B
                    </el-button>
                    <el-button 
                        @click="editor?.chain().focus().toggleItalic().run()" 
                        :disabled="userHasPermission()"
                        :type="editor?.isActive('italic') ? 'primary' : ''"
                    >
                        I
                    </el-button>
                    <el-button 
                        :icon="SemiSelect" 
                        :disabled="userHasPermission()"
                        @click="editor?.chain().focus().toggleStrike().run()" 
                        :type="editor?.isActive('strike') ? 'primary' : ''" 
                    />
                    <el-select 
                        v-model="headerOption"
                        :disabled="userHasPermission()"
                        @change="changeHeading"
                        clearable
                    >
                        <el-option
                            v-for="type in header_options"
                            :key="type.value"
                            :label="type.label"
                            :value="type.value"
                        />
                    </el-select>
                    <el-button 
                        @click="editor?.chain().focus().toggleBulletList().run()" 
                        :disabled="userHasPermission()"
                        :type="editor?.isActive('bulletList') ? 'primary' : ''"
                    >
                        UL
                    </el-button>
                    <el-button 
                        @click="editor?.chain().focus().toggleOrderedList().run()" 
                        :disabled="userHasPermission()"
                        :type="editor?.isActive('orderedList') ? 'primary' : ''"
                    >
                        OL
                    </el-button>
                    <el-button 
                        @click="editor?.chain().focus().toggleCode().run()" 
                        :disabled="userHasPermission()"
                        :type="editor?.isActive('code') ? 'primary' : ''"
                    >
                        &#060;&#062;
                    </el-button>
                    <el-button 
                        @click="editor?.chain().focus().toggleCodeBlock().run()" 
                        :disabled="userHasPermission()"
                        :type="editor?.isActive('codeBlock') ? 'primary' : ''"
                    >
                        &#060;B&#062;
                    </el-button>
                    <el-button 
                        :icon="ArrowLeft" 
                        :disabled="userHasPermission()"
                        @click="editor?.chain().focus().undo().run()"
                    />
                    <el-button 
                        :icon="ArrowRight" 
                        :disabled="userHasPermission()"
                        @click="editor?.chain().focus().redo().run()"
                    />
                    <el-button
                        :icon="Picture"
                        :disabled="userHasPermission()"
                        @click="openUploadImageDialog"
                    />
                </el-button-group>
            </el-row>

            <el-divider />

            <el-row class="editor-content" :span="24" @click="editor?.chain().focus()" justify="center">
                <editor-content :editor="editor"></editor-content>
            </el-row>

            <el-dialog
                v-model="uploadImageDialogVisible"
                title="Upload Image"
            >
                <el-row :span="24" justify="center">
                    <el-upload
                        :action="uploadImageBaseUrl"
                        :headers="uploadImageHeader"
                        :on-success="handleUploadImageSuccess"
                        :on-error="handleUploadImageError"
                        drag
                        ref="elUploadInstance"
                    >
                        <el-icon class="el-icon--upload"><UploadFilled/></el-icon>
                        <div class="el-upload__text">
                            Drop file here or <em>click to upload</em>
                        </div>
                    </el-upload>
                </el-row>
            </el-dialog>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { EditorContent, Editor } from '@tiptap/vue-3'
import { Collaboration } from "@tiptap/extension-collaboration"
import { Image } from "@tiptap/extension-image"
import StarterKit from "@tiptap/starter-kit"
import * as Y from "yjs"
import {
    ElContainer,
    ElMain,
    ElRow,
    ElButtonGroup,
    ElButton,
    ElSelect,
    ElOption,
    ElDivider,
    ElNotification,
    ElDialog,
    ElUpload,
    ElIcon,
} from 'element-plus'
import type { UploadInstance, UploadFile } from 'element-plus'
import { ArrowLeft, ArrowRight, SemiSelect, Picture, UploadFilled } from '@element-plus/icons-vue'
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { header_options } from '@/util/EditorUtil'
import { useRoute } from 'vue-router'
import { Chapter, FlatDocument } from '@/types'
import { ChapterService } from '@/services/ChapterService'
import { DocumentService } from '@/services/DocumentService'
import store from '@/store'
import { baseUrl, getTokenHeader } from '@/api/Api'
import { Level } from '@tiptap/extension-heading'

const documentService = new DocumentService()
const chapterService = new ChapterService()
let uploadImageBaseUrl = ref('')
let uploadImageHeader = reactive<Headers>(new Headers())
const elUploadInstance = ref<UploadInstance>()
const route = useRoute()
let chapterId = ''
let docId = ''

const uploadImageDialogVisible = ref(false)
let headerOption = ref(0)
let chapter = reactive<Chapter>({
    id: '',
    name: '',
    content: '',
    description: '',
    nr: 0
})
let flatDocument = reactive<FlatDocument>({
    id: '',
    name: '',
    owner: {
        id: '',
        username: '',
        firstName: '',
        lastName: '',
        documentPermission: ''
    },
    description: '',
    dateOfCreation: new Date(),
    lastModified: new Date(),
    users: []
})

const ydoc: Y.Doc = new Y.Doc()
let editor: Editor | undefined = new Editor({
    content: '',
    editable: false,
    extensions: [
        StarterKit.configure({
            history: false,
        }),
        Collaboration.configure({
            document: ydoc,
        }),
        Image.configure({
            inline: true,
            allowBase64: true
        })
    ],
    autofocus: "start"
})

watch(() => editor?.getAttributes('heading')?.level, (selection, prevSelection) => {
    let isActive = editor?.isActive('heading')
    if (selection !== prevSelection && isActive) {
        headerOption.value = editor?.getAttributes('heading')?.level
    } else {
        headerOption.value = 0
    }
}) 

const changeHeading = () => {
    if (headerOption.value === 0) {
        editor?.chain().focus().toggleHeading({ level: editor?.getAttributes('heading')?.level }).run()
    } else {
        editor?.chain().focus().toggleHeading({ level: headerOption.value as Level }).run()
    }
}
const openUploadImageDialog = () => {
    uploadImageDialogVisible.value = true
}

const handleUploadImageSuccess = (response: unknown, uploadFile: UploadFile): void => {
    editor?.commands.setImage({
        src: `${baseUrl}/images/${docId}/${response}`,
        alt: uploadFile.name
    })
    ElNotification.success({
        title: 'Upload Image',
        message: `Image ${uploadFile.name} uploaded successfully`
    })
    elUploadInstance.value!.clearFiles()
    uploadImageDialogVisible.value = false
}
const handleUploadImageError = () => {
    ElNotification.error({
        title: 'Error',
        message: 'Error while uploading image'
    })
}
const loadChapter = () => {
    chapterService.getChapter(docId, chapterId)
        .then(resp => {
            if (!resp) {
                throw new Error('Chapter not found')
            }
            chapter.id = resp.id
            chapter.name = resp.name
            chapter.content = resp.content
            chapter.description = resp.description
            chapter.nr = resp.nr
            editor?.commands.setContent(chapter.content)
        })
        .catch(err => {
            console.error(err)
            ElNotification.error({
                title: 'Error',
                message: 'Could not load chapter'
            })
        })
}
const userHasPermission = (): boolean => {
    const user = store.state.user
    if (!user) {
        return true
    }
    if (flatDocument.owner.id === user.id) {
        return false
    }
    if (flatDocument.users.find(u => u.id === user.id && u.documentPermission === 'READ_WRITE')) {
        return false
    } else {
        return true
    }
}
const loadDocument = () => {
    const user = store.state.user
    documentService.getFlatDocument(docId)
        .then(resp => {
            if (!resp) {
                throw new Error('Document not found')
            }
            Object.assign(flatDocument, resp)
            if (user && (resp.users.find(u => u.id === user.id && u.documentPermission === 'READ_WRITE') ||
                resp.owner.id === user.id)) {
                editor?.setOptions({ editable: true })
            } else {
                editor?.setOptions({ editable: false })
            }
        })
        .catch(err => {
            console.error(err)
            ElNotification.error({
                title: 'Error',
                message: 'Could not load document'
            })
        })
}
const initParams = () => {
    chapterId = route.params.chapterId.toString()
    docId = route.params.id.toString()
}
const initEditor = () => {
    initParams()
    loadChapter()
    loadDocument()
    uploadImageBaseUrl.value = baseUrl + '/images/' + docId
    uploadImageHeader.set('Authorization', getTokenHeader())
    editor?.chain().focus()
}
const saveDocument = () => {
    chapterService.saveChapterContent(docId, chapterId, editor?.getHTML())
        .then(() => {
            ElNotification.success({
                title: 'Save Chapter',
                message: 'Chapter saved successfully'
            })
        })
        .catch(err => {
            console.error(err)
            ElNotification.error({
                title: 'Error',
                message: 'Could not save chapter'
            })
        })
}

onMounted(() => {
    initEditor()
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

<style>
.ProseMirror > * + * {
    margin-top: 0.75em;
}
.ProseMirror ul, .ProseMirror ol {
    padding: 0 1rem;
}
.ProseMirror h1, .ProseMirror h2, .ProseMirror h3, .ProseMirror h4, .ProseMirror h5, .ProseMirror h6 {
    line-height: 1.1;
}
.ProseMirror code {
    background-color: rgba(97, 97, 97, 0.1);
    color: #616161;
}
.ProseMirror pre {
    background: #0D0D0D;
    color: #FFF;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
}
.ProseMirror pre code {
    color: inherit;
    padding: 0;
    background: none;
    font-size: 0.8rem;
}
.ProseMirror img {
    max-width: 100%;
    height: auto;
}
.ProseMirror blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(13, 13, 13, 0.1);
}
.ProseMirror hr {
    border: none;
    border-top: 2px solid rgba(13, 13, 13, 0.1);
    margin: 2rem 0;
}
.ProseMirror:focus {
    outline: none;
}
.ProseMirror-focused {
    outline: none;
    min-width: 700px !important;
}
.ProseMirror {
    font-size: 1rem;
    line-height: 1.0;
    color: #000;
    background-color: #FFF;
    border: 1px solid rgba(13, 13, 13, 0.1);
    border-radius: 0.5rem;
    box-shadow: 0 0 0 1px rgba(13, 13, 13, 0.1);
    padding: 1rem;
    min-width: 790px !important;
    width: 900px !important;
}
</style>