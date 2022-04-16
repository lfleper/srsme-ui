<template>
    <el-container>
        <el-main>
            <el-row>
                <h2 class="header">My Documents</h2>
            </el-row>

            <el-row>
                <el-form :inline="true" :model="form">
                    <el-form-item label="">
                        <el-input v-model="form.searchString" placeholder="search" clearable/>
                    </el-form-item>
                    <el-form-item label="Sort by:">
                        <el-select v-model="form.sortBy" clearable>
                            <el-option
                                v-for="option in sortOptions"
                                :key="option.value"
                                :label="option.label"
                                :value="option.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-row>

            <el-divider/>

            <el-row>
                <el-card class="create-document-card" @click="createDocumentDialogVisible = true">
                    <img class="create-document-image" src="@/assets/illustrations/undraw_add.svg">
                </el-card>
                <document-card 
                    class="document-card"
                    v-for="doc in filteredDocuments" 
                    :key="doc.id" 
                    :doc="doc"
                    @open="openDocument"
                    @delete="deleteDocument"
                />
            </el-row>
        </el-main>

        <el-dialog 
            v-model="createDocumentDialogVisible" 
            title="Create Document"
            destroy-on-close
        >
            <el-form label-position="top">
                <el-form-item label="Document Name:">
                    <el-input v-model="newDocumentName" placeholder="Enter name" autocomplete="off" clearable/> 
                </el-form-item>

                <!-- Unnecessary input field! Needed to work around a Vue bug. A single input field leads to reload of the page on enter. -->
                <!-- Just leave it as long as a better workaround is found. -->
                <el-form-item style="display: none;">
                    <el-input placeholder="placeholder" autocomplete="off" clearable/>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="createDocumentDialogVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="createNewDocument">Create</el-button>
                </span>
            </template>
        </el-dialog>
    </el-container>
</template>

<script setup lang="ts">
import { DocumentFilter, FlatDocument } from '@/types'
import DocumentCard from '@/components/DocumentCard.vue'
import { reactive, ref } from 'vue'
import { 
    ElContainer, 
    ElMain, 
    ElRow, 
    ElForm,
    ElFormItem,
    ElInput,
    ElSelect,
    ElOption,
    ElCard,
    ElDivider,
    ElDialog,
    ElButton
} from 'element-plus'
import { computed, Ref } from '@vue/reactivity'
import store from '@/store'

const createDocumentDialogVisible = ref(false)
const sortOptions = [
    {
        value: '1',
        label: 'Date ASC'
    },
    {
        value: '2',
        label: 'Date DESC'
    },
    {
        value: '3',
        label: 'Name'
    }
]

let form: DocumentFilter = reactive({
    searchString: '',
    sortBy: '1',
})
let newDocumentName: Ref<string> = ref('')

let test_docs: FlatDocument[] = reactive([
    {
        id: '1',
        name: 'Document 1',
        dateOfCreation: new Date(),
        lastModified: new Date(),
        user: [
            {
                id: '1',
                username: 'lfleper',
                firstName: 'Lukas',
                lastName: 'Fleper',
                privilges: 'R/W'
            }
        ]
    },
    {
        id: '2',
        name: 'Document 2',
        dateOfCreation: new Date(2021, 10, 12, 5, 20, 20, 10),
        lastModified: new Date(2021, 11, 14, 6, 21, 21, 11),
        user: [
            {
                id: '1',
                username: 'lfleper',
                firstName: 'Lukas',
                lastName: 'Fleper',
                privilges: 'R/W'
            }
        ]
    }
])

const filterByString = () => {
    return test_docs.filter(doc => {
        return doc.name.toLowerCase().includes(form.searchString.toLowerCase())
    })
}

const filterByOption = (docs: FlatDocument[]) => {
    switch (form.sortBy) {
        case '1':
            return docs.sort((a, b) => {
                return a.dateOfCreation.getTime() - b.dateOfCreation.getTime()
            })
        case '2':
            return docs.sort((a, b) => {
                return b.dateOfCreation.getTime() - a.dateOfCreation.getTime()
            })
        case '3':
            return docs.sort((a, b) => {
                return a.name.localeCompare(b.name)
            })
        default:
            return docs
    }
}

const filteredDocuments = computed(() => {
    return filterByOption(filterByString(test_docs))
})

const createNewDocument = () => {
    if (newDocumentName.value === '' || !store.state.user)
        return
    
    test_docs.push({
        id: '',
        name: newDocumentName.value,
        dateOfCreation: new Date(),
        lastModified: new Date(),
        user: [
            {...store.state.user, privilges: 'R/W'}
        ]
    })
    newDocumentName.value = ''
    createDocumentDialogVisible.value = false
}

const openDocument = (d: FlatDocument) => {
    console.log(d)
}

const deleteDocument = (d: FlatDocument) => {
    test_docs.splice(test_docs.indexOf(d), 1)
}

</script>

<style scoped>
.header {
    font-family: 'Red Hat Mono', monospace;
    font-weight: 300;
    color: var(--srs-text-primary);
}
.document-card {
    margin: 0.5rem;
}
.create-document-card {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    cursor: pointer;
}
.create-document-image {
    width: 100%;
}
.dialog-footer button:first-child {
    margin-right: 10px;
}
</style>