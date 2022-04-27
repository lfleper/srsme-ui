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
                    @click="openChapter(chapter.nr)"
                >
                    <template #title>
                        {{chapter.name}}
                        <div class="menu-btn-grp">
                            <el-icon @click="editChapter(chapter.nr)"><EditPen/></el-icon>
                            <el-popconfirm
                                confirm-button-text="OK"
                                cancel-button-text="Cancel"
                                icon-color="red"
                                :icon="Delete"
                                title="Are you sure to delete this chapter?"
                                @confirm="deleteChapter(chapter.nr)"
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
            <router-view />
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
    ElFormItem
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
    title: ''
})

const editChapter = (chapterNo: number) => {
    renameChapterDialogVisible.value = true
    console.log(chapterNo)
    // const chapter = doc.chapters.find(c => c.nr === chapterNo)
    // editChapterForm.title = chapter?.title ?? ''
    // console.log('edit chapter', chapter)
}
const renameChapter = () => {
    console.log('rename chapter', editChapterForm)
    renameChapterDialogVisible.value = false
}
const deleteChapter = (chapterNo: number) => {
    console.log('delete chapter', chapterNo)
    //doc.chapters = doc.chapters.filter(c => c.nr !== chapterNo)
}
const openChapter = (chapterNo: number) => {
    router.push({
        name: 'Chapter',
        params: {
            chapterNo: chapterNo
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
    console.log('load chapters for document', docId)
}

onMounted(() => {
    console.log(docId)
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
</style>