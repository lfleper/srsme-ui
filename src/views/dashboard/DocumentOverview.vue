<template>
    <el-container>
        <el-main>
            <el-row>
                <h2 class="header">My Documents</h2>
            </el-row>

            <el-row>
                <el-form :inline="true" :model="form">
                    <el-form-item label="">
                        <el-input v-model="form.searchString" placeholder="search" />
                    </el-form-item>
                    <el-form-item label="Sort by">
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

            <el-row>
                <document-card 
                    class="document-card"
                    v-for="doc in test_docs" 
                    :key="doc.id" 
                    :doc="doc"
                />
            </el-row>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { DocumentFilter, FlatDocument } from '@/types'
import DocumentCard from '@/components/DocumentCard.vue'
import { reactive } from 'vue'
import { 
    ElContainer, 
    ElMain, 
    ElRow, 
    ElForm,
    ElFormItem,
    ElInput,
    ElSelect,
    ElOption
} from 'element-plus'

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

const test_docs: FlatDocument[] = reactive([
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
    }
])

let form: DocumentFilter = reactive({
    searchString: '',
    sortBy: '1',
})

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
</style>