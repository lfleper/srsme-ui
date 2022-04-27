<template>
    <el-container>
        <el-aside class="editor-toolbar editor-item">
            <h4 class="el-drawer__header">Chapters</h4>
            <el-menu
                class="el-menu-vertical-demo"
                mode="vertical"
            >
                <el-menu-item
                    v-for="chapter in doc.chapters"
                    :key="chapter.chapterNo"
                    :index="chapter.chapterNo.toString()"
                    @click="openChapter(chapter.chapterNo)"
                >
                    <template #title>
                        {{chapter.title}}
                        <div class="menu-btn-grp">
                            <el-icon @click="editChapter(chapter.chapterNo)"><EditPen/></el-icon>
                            <el-popconfirm
                                confirm-button-text="OK"
                                cancel-button-text="Cancel"
                                icon-color="red"
                                :icon="Delete"
                                title="Are you sure to delete this chapter?"
                                @confirm="deleteChapter(chapter.chapterNo)"
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

const route = useRoute()
const docId = route.params.id
const doc = reactive(test_doc)
const renameChapterDialogVisible = ref(false)
let editChapterForm = reactive({
    title: ''
})

const editChapter = (chapterNo: number) => {
    renameChapterDialogVisible.value = true
    const chapter = doc.chapters.find(c => c.chapterNo === chapterNo)
    editChapterForm.title = chapter?.title ?? ''
    console.log('edit chapter', chapter)
}
const renameChapter = () => {
    console.log('rename chapter', editChapterForm)
    renameChapterDialogVisible.value = false
}
const deleteChapter = (chapterNo: number) => {
    console.log('delete chapter', chapterNo)
    doc.chapters = doc.chapters.filter(c => c.chapterNo !== chapterNo)
}
const openChapter = (chapterNo: number) => {
    router.push({
        name: 'Chapter',
        params: {
            chapterNo: chapterNo
        }
    })
}

onMounted(() => {
    console.log(docId)
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