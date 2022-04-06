<template>
    <el-container>
        <el-header>
            <el-menu
                mode="horizontal"
            >
                <el-menu-item index="1">
                    <template #title>
                        <a class="srs-logo">SRSME</a>
                    </template>
                </el-menu-item>

                <el-sub-menu class="dock-right" index="2">
                    <template #title>
                        <el-icon>
                            <User/>
                        </el-icon>
                        <a>username</a>
                    </template>
                    <el-menu-item index="2-1">
                        Account Settings
                    </el-menu-item>
                    <el-menu-item index="2-2">
                        Log Out
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-header>
        <el-main>

        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { 
    ElContainer, 
    ElHeader,
    ElMain,
    ElMenu,
    ElSubMenu,
    ElMenuItem,
    ElIcon
} from 'element-plus'
import { User } from '@element-plus/icons-vue'
</script>

<style>
:root {
    --srs-background: white;
}
</style>

<style scoped>

</style>