<template>
    <el-drawer 
        direction="rtl"
        v-model="documentSettingsDrawerVisible"
        size="50%"
    >
        <template #title>
            <h4>Settings</h4>
        </template>
        <template #default>
            <el-row>
                <el-form 
                    label-position="top"
                >
                    <el-form-item label="Document name">
                        <el-input v-model="documentName" placeholder="name" size="large"/>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-row>
                <el-button @click="save" type="primary">
                    Save
                </el-button>
            </el-row>

            <el-divider/>

            <el-row>
                <el-descriptions
                    title="Owner"
                    :column="3"
                    border
                    style="margin-top: 20px;"
                >
                    <el-descriptions-item label="Username">
                        {{ doc.owner.username }}
                    </el-descriptions-item>
                    <el-descriptions-item label="First name">
                        {{ doc.owner.firstName }}
                    </el-descriptions-item>
                    <el-descriptions-item label="Last name">
                        {{ doc.owner.lastName }}
                    </el-descriptions-item>
                </el-descriptions>
            </el-row>

            <el-row>
                <h4 class="el-drawer__header">User</h4>
                <el-table :data="doc.users" style="width: 100%;">
                    <el-table-column prop="username" label="Username"/>
                    <el-table-column prop="firstName" label="First name"/>
                    <el-table-column prop="lastName" label="Last name"/>
                    <el-table-column label="Permission">
                        <template #default="scope">
                            <el-select
                                size="small"
                                v-model="scope.row.documentPermission"
                                @change="updateDocumentPermission(scope.row)"
                            >
                                <el-option
                                    v-for="permission in ['READ_ONLY', 'READ_WRITE']"
                                    :key="permission"
                                    :label="permission"
                                    :value="permission"
                                />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="Operations">
                        <template #default="scope">
                            <el-popconfirm
                                confirm-button-text="OK"
                                cancel-button-text="Cancel"
                                icon-color="red"
                                title="Are you sure to delete this user?"
                                @confirm="deleteUser(scope.$index, scope.row)"
                            >
                                <template #reference>
                                    <el-button type="danger" :icon="Delete" size="small"/>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button style="width: 100%;" @click="addUserDialog">
                    Add User
                </el-button>
            </el-row>
        </template>
        <template #footer>
            <el-button @click="documentSettingsDrawerVisible = false">
                Cancel
            </el-button>
        </template>
    </el-drawer>

    <el-dialog
        v-model="addUserDialogVisible"
        title="Add User"
    >
        <el-form
            :model="newDocumentUser"
        >
            <el-form-item
                label="Username"
            >
                <el-input @keyup.enter="addUserToDocument" v-model="newDocumentUser.username" autocomplete="off" />
            </el-form-item>
            <el-form-item
                label="Permission"
            >
                <el-select
                    v-model="newDocumentUser.documentPermission"
                    @keyup.enter="addUserToDocument"
                    size="small"
                >
                    <el-option
                        v-for="permission in ['READ_ONLY', 'READ_WRITE']"
                        :key="permission"
                        :label="permission"
                        :value="permission"
                    />
                </el-select>
            </el-form-item>
        </el-form>  

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="addUserDialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="addUserToDocument">
                    Confirm
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { AddUserToDocumentDto, DocumentUser, FlatDocument } from '@/types'
import { defineProps, ref, toRefs, defineExpose, reactive } from 'vue'
import { DocumentService } from '@/services/DocumentService'
import {
    ElDrawer,
    ElButton,
    ElRow,
    ElTable,
    ElTableColumn,
    ElForm,
    ElFormItem,
    ElInput,
    ElDivider,
    ElSelect,
    ElOption,
    ElNotification,
    ElDialog,
    ElPopconfirm,
    ElDescriptions,
    ElDescriptionsItem
} from 'element-plus'
import { Delete } from '@element-plus/icons-vue'

const documentService = new DocumentService()

const props = defineProps<{
    doc: FlatDocument
}>()
const { doc } = toRefs(props)
const documentSettingsDrawerVisible = ref(false)
const documentName = ref(doc.value.name)
const addUserDialogVisible = ref(false)
let newDocumentUser = reactive<AddUserToDocumentDto>({
    username: '',
    documentPermission: ''
})

const open = () => documentSettingsDrawerVisible.value = true
const save = () => {
    if (documentName.value === doc.value.name) {
        return
    }
    if (documentName.value === '') {
        ElNotification.error({
            title: 'Error',
            message: 'Document name cannot be empty'
        })
        return
    }
    documentService.updateDocumentName(doc.value.id, documentName.value)
        .then(() => {
            ElNotification.success({
                title: 'Success',
                message: 'Document name updated'
            })
            doc.value.name = documentName.value
        })
        .catch(() => {
            ElNotification.error({
                title: 'Error',
                message: 'Failed to update document name'
            })
        })
}
const deleteUser = (index: number, row: DocumentUser) => {
    console.log(index, row)
    documentService.deleteUserFromDocument(doc.value.id, row)
        .then(() => {
            doc.value.users.splice(index, 1)
        })
        .catch(resp => {
            if (resp.status === 403) {
                ElNotification.error({
                    title: 'Error deleting user',
                    message: 'You are not allowed to delete this user'
                })
            } else {
                ElNotification.error({
                    title: 'Error deleting user',
                    message: 'Something went wrong'
                })
            }
        })
}
const updateDocumentPermission = (row: DocumentUser) => {
    // ToDo: Disable select if user is not owner
    documentService.updateDocumentUserPermission(doc.value.id, row)
        .catch(err => {
            console.log(err)
            ElNotification({
                title: 'Cannot set user permission',
                message: 'Something went wrong',
            })
        })
}
const addUserDialog = () => {
    addUserDialogVisible.value = true
}
const addUserToDocument = () => {
    if (newDocumentUser.username.length === 0) {
        ElNotification.error({
            title: 'Cannot add user',
            message: 'Username is required'
        })
        return
    }
    if (newDocumentUser.documentPermission.length === 0) {
        ElNotification.error({
            title: 'Cannot add user',
            message: 'Permission is required'
        })
        return
    }
    if (doc.value.users.find(user => user.username === newDocumentUser.username) ||
        doc.value.owner.username === newDocumentUser.username) {
        ElNotification.error({
            title: 'Cannot add user',
            message: 'User already exists'
        })
        return
    }
    documentService.addUserToDocument(doc.value.id, newDocumentUser)
        .then(resp => {
            if (!resp) {
                ElNotification.error({
                    title: 'Cannot add user',
                    message: 'User does not exist'
                })
                return
            }
            console.log(resp.users)
            let user = resp.users.find(user => user.username === newDocumentUser.username)
            if (user) {
                doc.value.users.push(user)
            }
            newDocumentUser.username = ''
            newDocumentUser.documentPermission = ''
            addUserDialogVisible.value = false
        })
        .catch(err => {
            console.log(err)
            ElNotification.error({
                title: 'Cannot add user',
                message: 'Something went wrong'
            })
        })
}

defineExpose({
    open
})

</script>

<style>
.cell-item {
    display: flex;
    align-items: center;
}
.el-descriptions__cell {
    font-family: 'Montserrat Alternates', sans-serif;
}
.el-descriptions__cell el-descriptions__label is-bordered-label {
    font-weight: bold;
}
</style>