<template>
    <el-container>
        <el-header>
            <el-menu
                mode="horizontal"
                :router="true"
            >
                <el-menu-item index="1" route="/dashboard">
                    <template #title>
                        <a class="srs-logo">SRSME</a>
                    </template>
                </el-menu-item>

                <el-sub-menu class="dock-right" index="2">
                    <template #title>
                        <el-icon>
                            <User/>
                        </el-icon>
                        <span>{{store.state.user?.username}}</span>
                    </template>
                    <el-menu-item index="2-1">
                        Account Settings
                    </el-menu-item>
                    <el-menu-item index="2-2" route="/dashboard/logout">
                        Log Out
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-header>
        <el-main>
            <router-view/>
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
import { onMounted } from 'vue'
import store from '@/store'

onMounted(() => {
    store.dispatch('getUser')
})

</script>
