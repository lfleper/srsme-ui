<template>
    <el-container>
        <el-header>
            <el-menu
                mode="horizontal"
                :router="true"
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
                        <span>{{user.username}}</span>
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
import { User as ApiUser } from '@/types'
import { User } from '@element-plus/icons-vue'
import fetcher from '@/api/Api'
import router from '@/router'
import { TokenService } from '@/services/TokenService'
import { onMounted, reactive } from 'vue'

const tokenService = new TokenService()
let user: ApiUser = reactive<ApiUser>({
    id: '',
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    role: {
        id: '',
        role: ''
    },
    enabled: false
})

const loadUserData = () => {
    fetcher<ApiUser>('GET', '/user/self')
        .then(resp => {
            if (!resp.data) {
                throw new Error('User not found')
            }         
            Object.assign(user, resp.data)
        })
        .catch(err => {
            console.log(err)
            tokenService.removeToken()
            router.push('/home')
        })
}

onMounted(() => {
    loadUserData()
})

</script>
