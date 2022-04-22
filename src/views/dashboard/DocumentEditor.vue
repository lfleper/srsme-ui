<template>
    <el-container>
        <el-aside class="editor-toolbar editor-item">
            <h4 class="el-drawer__header">Chapters</h4>
            <el-menu
                class="el-menu-vertical-demo"
                mode="vertical"
                theme="dark"
            >
                <el-menu-item
                    v-for="chapter in doc.chapters"
                    :key="chapter.chapterNo"
                >
                    <template #title>{{chapter.title}}</template>
                </el-menu-item>
            </el-menu>
        </el-aside>
    </el-container>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import {
    ElContainer,
    ElAside,
    ElMenu,
    ElMenuItem
} from 'element-plus'
import { onMounted, reactive } from 'vue'
import { test_doc } from '@/test_data/Document'

const route = useRoute()
const doc = reactive(test_doc)

onMounted(() => {
    const docId = route.params.id
    console.log(docId)
})

</script>

<style scoped>
</style>