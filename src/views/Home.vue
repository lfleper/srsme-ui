<template>
    <el-container class="main-container">
        <el-header>
            <el-menu
                mode="horizontal"
                :router="false"
            >
                <el-menu-item index="1">
                    <template #title>
                        <a class="srs-logo">SRSME</a>
                    </template>
                </el-menu-item>

                <el-menu-item index="2" class="dock-right">
                    <el-button @click="signIn">
                        SignIn
                    </el-button>
                    <el-button @click="login" type="primary">
                        Login
                    </el-button>
                </el-menu-item>
            </el-menu>
        </el-header>
        <el-main>
            <el-row>
                <el-col :xs="24" :sm="24" :md="12" :lg="12">
                    <div class="slogan-container">
                        <p class="login-slogan">Software Requirements Specification Made Easy</p>
                        <p class="login-sub-slogan">Specify all the requirements for your new product</p>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12">
                    <img class="login-bg" src="@/assets/illustrations/bg-15.svg"/>
                </el-col>
            </el-row>

            <el-row>
                <el-divider/>
            </el-row>

            <el-row>
                <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
                    <el-result title="CREATE" sub-title="create new documents to specify your requirements">
                        <template #icon>
                            <img style="width: 200px" src="@/assets/illustrations/undraw_add_post_re_174w.svg"/>
                        </template>
                    </el-result>
                </el-col>
                <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
                    <el-result title="COLLAB" sub-title="work together on your documents">
                        <template #icon>
                            <img style="width: 200px" src="@/assets/illustrations/undraw_notebook_re_id0r.svg"/>
                        </template>
                    </el-result>
                </el-col>
                <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
                    <el-result title="CHANGE" sub-title="edit their specifications at any time ">
                        <template #icon>
                            <img style="width: 200px" src="@/assets/illustrations/undraw_publish_article_re_3x8h.svg"/>
                        </template>
                    </el-result>
                </el-col>
            </el-row>

            <el-row>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="#0099ff" fill-opacity="1" d="M0,192L40,208C80,224,160,256,240,256C320,256,400,224,480,186.7C560,149,640,107,720,106.7C800,107,880,149,960,186.7C1040,224,1120,256,1200,256C1280,256,1360,224,1400,208L1440,192L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path>
                </svg>
            </el-row>

            <el-row class="footer">
                <el-col :span="8" :offset="8">
                    <ul class="footer-list">
                        <li class="footer-list-item"><a>Contact</a></li>
                        <li class="footer-list-item"><a>Contributions</a></li>
                        <li class="footer-list-item"><a>Github</a></li>
                    </ul>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import router from '@/router';
import { 
    ElContainer, 
    ElHeader,
    ElMain,
    ElRow, 
    ElCol, 
    ElDivider,
    ElMenu, 
    ElMenuItem,
    ElButton,
    ElResult
} from 'element-plus'

const login = () => {
    router.push('/login')
}
const signIn = () => {
    router.push('/register')
}

</script>

<style scoped>
.main-container {
    background: white;
}
.login-bg {
    width: 100%;
}
.slogan-container {
    max-width: 550px;
    margin: 0 30px;
}
.login-slogan {
    /* min * (max - min) * (100vw - min-screen-size) / (max-screen-size - mix-screen-size) */
    font-size: calc(25px + (40 - 25) * (100vw - 300px) / (1200 - 300));
    font-family: 'Red Hat Mono', monospace;
    font-weight: 600;
}
.login-sub-slogan {
    /* min * (max - min) * (100vw - min-screen-size) / (max-screen-size - mix-screen-size) */
    font-size: calc(14px + (20 - 14) * (100vw - 300px) / (1200 - 300));
    font-family: 'Red Hat Mono', monospace;
    font-weight: 300;
}
.el-menu--horizontal > .el-menu-item.is-active {
    border-bottom: none;
}
.el-menu--horizontal .el-menu-item:not(.is-disabled):focus, 
.el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
    background-color: transparent;
}
.el-main, .el-footer {
    margin: 0;
    padding: 0;
}
.el-col {
    padding: 0 10px;
}
.footer {
    background-color: #0099ff;
    color: white;
    padding-bottom: 20px;
}
.footer-list {
    list-style: none;
    padding: 0;
    margin: 12px 0 0;
    line-height: 1.2;
}
.footer-list-item {
    margin-top: 10px;
    font-size: 14px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-family: 'Montserrat Alternates', sans-serif;
}
.el-result {
    font-family: 'Montserrat Alternates', sans-serif;
}
</style>