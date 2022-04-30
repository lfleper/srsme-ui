<template>
    <el-container>
        <el-aside class="editor-toolbar editor-item">
            <h4 class="el-drawer__header">Chapters</h4>
            <el-menu
                class="el-menu-vertical-demo"
                mode="vertical"
            >
                <el-menu-item
                    v-for="chapter in flatChaperts"
                    :key="chapter.nr"
                    :index="chapter.nr.toString()"
                >
                    <template #title>
                        <span 
                            class="chapter-name" 
                            @click="openChapter(chapter.id)"
                        >
                            {{chapter.name}}
                        </span>
                        <div class="menu-btn-grp">
                            <el-icon @click="editChapter(chapter.id, chapter.name)"><EditPen/></el-icon>
                            <el-popconfirm
                                confirm-button-text="OK"
                                cancel-button-text="Cancel"
                                icon-color="red"
                                :icon="Delete"
                                title="Are you sure to delete this chapter?"
                                @confirm="deleteChapter(chapter.id)"
                            >
                                <template #reference>
                                    <el-icon><Delete/></el-icon>
                                </template>
                            </el-popconfirm>
                        </div>
                    </template>
                </el-menu-item>
            </el-menu>
        </el-aside>

        <el-main>
            <router-view :key="route.path" />
        </el-main>

        <el-dialog v-model="renameChapterDialogVisible" title="Rename the chapter">
            <el-form :model="editChapterForm">
                <el-form-item label="Chapter Name:">
                    <el-input v-model="editChapterForm.title" autocomplete="off" clearable/>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="renameChapterDialogVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="renameChapter">Rename</el-button>
                </span>
            </template>
        </el-dialog>

    </el-container>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import {
    ElContainer,
    ElAside,
    ElMain,
    ElMenu,
    ElMenuItem,
    ElIcon,
    ElPopconfirm,
    ElDialog,
    ElForm,
    ElInput,
    ElFormItem,
    ElNotification
} from 'element-plus'
import { EditPen, Delete } from '@element-plus/icons-vue'
import { onMounted, reactive, ref } from 'vue'
import { test_doc } from '@/test_data/Document'
import router from '@/router'
import { ChapterService } from '@/services/ChapterService'
import { FlatChapter } from '@/types'

const chapterService = new ChapterService()
const route = useRoute()
const docId = route.params.id.toString()
//const doc = reactive(test_doc)
let flatChaperts = ref<FlatChapter[]>([])
const renameChapterDialogVisible = ref(false)
let editChapterForm = reactive({
    title: '',
    chapterId: ''
})

const editChapter = (chapterId: string, chapterName: string) => {
    editChapterForm.chapterId = chapterId
    editChapterForm.title = chapterName
    renameChapterDialogVisible.value = true
}
const renameChapter = () => {
    console.log('rename chapter', editChapterForm)
    chapterService.updateChaperName(docId, editChapterForm.chapterId, editChapterForm.title)
        .then(resp => {
            ElNotification.success({
                title: 'Success',
                message: 'Chapter name updated successfully'
            })
            flatChaperts.value.map(chapter => {
                if (chapter.id === editChapterForm.chapterId) {
                    chapter.name = editChapterForm.title
                }
            })
            editChapterForm.title = ''
            editChapterForm.chapterId = ''
        })
        .catch(() => {
            ElNotification.error({
                title: 'Error',
                message: 'Chapter name update failed'
            })
        })
    renameChapterDialogVisible.value = false
}
const deleteChapter = (chapterId: string) => {
    chapterService.deleteChapter(docId, chapterId)
        .then(() => {
            flatChaperts.value = flatChaperts.value.filter(c => c.id !== chapterId)
        })
        .catch(err => {
            console.error(err)
            ElNotification.error({
                title: 'Error deleting chapter',
                message: 'Something went wrong while deleting the chapter'
            })
        })
}
const openChapter = (chapterId: string) => {
    router.push({
        name: 'Chapter',
        params: {
            chapterId: chapterId
        }
    })
}
const loadChaptersForDocument = () => {
    chapterService.getFlatChapters(docId)
        .then(resp => {
            console.log(resp)
            if (!resp)
                return
            flatChaperts.value = resp
        })
        .catch(err => {
            console.error(err)
        })
}

onMounted(() => {
    loadChaptersForDocument()
})

</script>

<style scoped>
.menu-btn-grp {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    justify-content: flex-end;
    margin-left: auto;
}
.chapter-name {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>