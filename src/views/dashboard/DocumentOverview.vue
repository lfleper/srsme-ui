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
                    v-for="doc in filteredDocuments" 
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
import { computed } from '@vue/reactivity';

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

const filterByString = (docs: FlatDocument[]) => {
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

let form: DocumentFilter = reactive({
    searchString: '',
    sortBy: '1',
})

const filteredDocuments = computed(() => {
    return filterByOption(filterByString(test_docs))
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