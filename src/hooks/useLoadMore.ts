import { ref, computed, ComputedRef } from 'vue'
import { useStore } from 'vuex'
interface LoadParams {
    pageIndex: number;
    pageSize: number;
    [key: string]: any;
}
const useLoadMore = (actionName: string, total: ComputedRef<number>, params: LoadParams = {pageIndex:0,pageSize:8}) => {
    const store = useStore()
    // 变化的参数
    const pageIndex = ref(params.pageIndex)
    const requestParams = computed(()=> {
        return {
            ...params,
            pageIndex: pageIndex.value
        }
    })
    const loadMorePage =() =>{
        pageIndex.value++
        store.dispatch(actionName, {searchParams: requestParams.value})
    }
    const loadPrePage =() => {
        pageIndex.value--
        store.dispatch(actionName, {searchParams: requestParams.value})
    }
    const totalPage =computed(() => Math.ceil(total.value / params.pageSize))
    const isFirstPage = computed(()=> pageIndex.value === 0)
    const isLastPage = computed(()=> {
        return Math.ceil(total.value / params.pageSize) === pageIndex.value+1
    })
    return {
        loadMorePage,
        isLastPage,
        pageIndex,
        totalPage,
        loadPrePage,
        isFirstPage
    }
}

export default useLoadMore