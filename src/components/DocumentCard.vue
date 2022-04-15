<template>
    <el-card class="document-card">
        <el-skeleton :rows="5" animated/>
        <div class="bottom">
            <el-dropdown>
                <span class="el-dropdown-link">
                    {{doc.name}}
                    <el-icon>
                        <ArrowDown/>
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>
                            Settings
                        </el-dropdown-item>
                        <el-dropdown-item>
                            Export
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <span class="delete-item">Delete</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </el-card>
</template>

<script setup lang="ts">
import { 
    ElCard, 
    ElSkeleton, 
    ElDropdown, 
    ElDropdownMenu, 
    ElDropdownItem,
    ElIcon
} from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { FlatDocument } from '@/types'
import { toRefs, defineProps, defineEmits } from 'vue'

const props = defineProps({
    doc: Object
})
const emits = defineEmits([
    'delete',
    'open'
])

const { doc } = toRefs(props)

</script>

<style scoped>
.el-dropdown-link {
    display: flex;
    align-items: center;
    font-family: 'Montserrat Alternates', sans-serif;
    font-weight: 300;
    color: var(--srs-text-primary);
}
.document-card {
    width: 200px;
    cursor: pointer;
}
.bottom {
    margin-top: 13px;
    line-height: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.delete-item {
    color: var(--el-color-danger);
}
</style>