<template>
    <div class="mywork-container content-container">
        <a-row type="flex" justify="space-between" align="middle">
            <h2>我的作品和模版</h2>
        </a-row>
        <a-tabs @change="changeCategory">
            <a-tab-pane key="0" tab="我的作品">
            </a-tab-pane>
            <a-tab-pane key="1" tab="我的模版">
            </a-tab-pane>
        </a-tabs>
        <works-list :list="works" @on-delete="onDelete" @on-copy="onCopy" :loading="isLoading">
        </works-list>
    </div>
</template>


<script lang="ts">
import { defineComponent, computed, onMounted, ref, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { GlobalDataProps } from '../store/index'
import WorksList from '../components/WorksList.vue'
export default defineComponent({
    components: {
        WorksList
    },
    setup() {
        const store = useStore<GlobalDataProps>()
        const router = useRouter()
        const works = computed(() => store.state.templates.works)
        const total = computed(() => store.state.templates.totalWorks)
        const isLoading = computed(() => store.getters.isOpLoading('fetchWorks'))
        const isTemplate = ref(0)
        const searchParams = computed(() => ({ pageIndex: 0, pageSize: 12, isTemplate: isTemplate.value }))
        onMounted(() => {
            store.dispatch('fetchWorks', { searchParams: searchParams.value })
        })
        const changeCategory = (key: any) => {
            isTemplate.value = key
            nextTick(() => {
                store.dispatch('fetchWorks', { searchParams: searchParams.value })
            })
        }
        const onDelete = async (id: number) => {
            await store.dispatch('deleteWork', { urlParams: { id: id } })
            await store.dispatch('fetchWorks', { searchParams: searchParams.value })
        }
        const onCopy = (id: number) => {
            store.dispatch('copyWork', id).then(({ data }) => {
                router.push(`/editor/${data.id}`)
            })
        }
        return {
            changeCategory,
            isLoading,
            onDelete,
            onCopy,
            works
        }
    }
})

</script>

<style>
.mywork-container .ant-input-search {
    width: 30%;
}

.searchResult {
    display: flex;
    align-items: center;
}

#main-chart {
    position: relative
}

.chart-loading {
    position: absolute;
    left: 50%;
    top: 50%;
}
</style>