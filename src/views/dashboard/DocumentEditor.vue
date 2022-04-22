<template>
    <el-container>
        <el-aside class="editor-toolbar editor-item">
            <el-menu
                class="el-menu-vertical-demo"
                mode="vertical"
                theme="dark"
            >
                <!--<el-menu-item
                    v-for="chapter in doc.chapters"
                    :key="chapter.chapterNo"
                >
                </el-menu-item>-->
                <el-menu-item index="1">
                    <template #title>Navigator One</template>
                </el-menu-item>
                <el-menu-item-group>
                    <template #title>
                        <span>Group One</span>
                    </template>
                    <el-menu-item index="1-1">item one</el-menu-item>
                    <el-menu-item index="1-2">item two</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="Group Two">
                    <el-menu-item index="1-3">item three</el-menu-item>
                </el-menu-item-group>
                <el-sub-menu index="1-4">
                    <template #title>
                        <span>item four</span>
                    </template>
                    <el-menu-item index="1-4-1">item one</el-menu-item>
                </el-sub-menu>
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
    ElMenuItem,
    ElSubMenu,
    ElMenuItemGroup
} from 'element-plus'
import { onMounted } from 'vue';

const route = useRoute()

onMounted(() => {
    const docId = route.params.id
    console.log(docId)
})

</script>

<style scoped>
</style>