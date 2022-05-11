<template>
    <el-container>
        <el-aside class="editor-toolbar editor-item">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h4 class="el-drawer__header">Chapters</h4>
                <el-button :icon="Plus" @click="addChapterDialogVisible = true"></el-button>
            </div>
            <el-menu
                class="el-menu-vertical-demo"
                mode="vertical"
                @dragover="dragover"
                @drop="drop"
            >
                <el-menu-item
                    v-for="chapter in flatChaperts"
                    :key="chapter.nr"
                    :index="chapter.nr.toString()"
                    :data-id="chapter.id"
                    draggable="true"
                    @dragstart="dragStart($event)"
                    @dragend="dragEnd"
                >
                    <template #title>
                        <span 
                            class="chapter-name" 
                            @click="openChapter(chapter.id)"
                        >
                            {{chapter.nr}}.  {{chapter.name}}
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

        <el-dialog v-model="addChapterDialogVisible" title="Add Chapter">
            <el-form :model="addChapterForm">
                <el-form-item label="Chapter Name:">
                    <el-input v-model="addChapterForm.title" autocomplete="off" clearable/>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addChapterDialogVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="addChapter">Add</el-button>
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
    ElNotification,
    ElButton,
} from 'element-plus'
import { EditPen, Delete, Plus } from '@element-plus/icons-vue'
import { onMounted, reactive, ref } from 'vue'
import router from '@/router'
import { ChapterService } from '@/services/ChapterService'
import { FlatChapter } from '@/types'

const chapterService = new ChapterService()
const route = useRoute()
const docId = route.params.id.toString()
let flatChaperts = ref<FlatChapter[]>([])
const renameChapterDialogVisible = ref(false)
const addChapterDialogVisible = ref(false)
let editChapterForm = reactive({
    title: '',
    chapterId: ''
})
let addChapterForm = reactive({
    title: ''
})

const editChapter = (chapterId: string, chapterName: string) => {
    editChapterForm.chapterId = chapterId
    editChapterForm.title = chapterName
    renameChapterDialogVisible.value = true
}
const renameChapter = () => {
    console.log('rename chapter', editChapterForm)
    chapterService.updateChaperName(docId, editChapterForm.chapterId, editChapterForm.title)
        .then(() => {
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
const addChapter = () => {
    chapterService.createChapter(docId, addChapterForm.title, flatChaperts.value.length + 1)
        .then(resp => {
            if (resp)
                flatChaperts.value.push(resp)
        })
        .catch(err => {
            console.error(err)
            ElNotification.error({
                title: 'Error',
                message: 'Something went wrong while creating the chapter'   
            })
        })

    addChapterDialogVisible.value = false
}
const dragStart = (event: DragEvent) => {
    if (event.dataTransfer && event.target && event.currentTarget) {
        event.dataTransfer.dropEffect = 'move'
        event.dataTransfer.setData('text/plain', (event.target as HTMLElement).dataset.id ?? '');
        (event.currentTarget as HTMLElement).classList.add('dragging')
    }

}
const dragEnd = (event: DragEvent) => {
    if (event.currentTarget && event.dataTransfer) {
        (event.currentTarget as HTMLElement).classList.remove('dragging')
    }
}
const dragover = (event: DragEvent) => {
    if (event.dataTransfer) {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
    }
}
const sortChapters = (sourceChapterId: string, targetChapterId: string) => {
    flatChaperts.value.map(chapter => {
        if (chapter.id === sourceChapterId) {
            chapter.nr = flatChaperts.value.find(c => c.id === targetChapterId)?.nr ?? 0
        } 
    })
    flatChaperts.value.sort((a, b) => {
        if (a.nr == b.nr) {
            if (a.id === sourceChapterId) {
                return 1
            } else if (b.id === sourceChapterId) {
                return 1
            }
        }
        if (a.nr < b.nr) {
            return -1
        } else if (a.nr > b.nr) {
            return 1
        } else {
            return 0
        }
    })
    for (let i = 0; i < flatChaperts.value.length; i++) {
        flatChaperts.value[i].nr = i + 1
    }
}
const drop = (event: DragEvent) => {
    event.preventDefault()
    const chapterId = event.dataTransfer?.getData('text/plain') ?? '';
    if ((event.target as HTMLElement).offsetParent) {
        const target = (event.target as HTMLElement).offsetParent ?? '';
        if (target) {
            const targetId = (target as HTMLElement).dataset.id ?? '';
            sortChapters(chapterId, targetId)
            // update chapters
            chapterService.updateChapterNr(docId, flatChaperts.value)
                .catch(err => {
                    ElNotification.error({
                        title: 'Error',
                        message: 'Something went wrong while updating the chapter'
                    })
                })
        }
    }
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
    width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
}
.dragging {
    opacity: 0.5;
}
</style>