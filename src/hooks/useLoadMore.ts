import { ref, computed, ComputedRef, reactive, toRef } from 'vue';
import { useStore } from 'vuex'
interface LoadParams {
    pageIndex: number;
    pageSize: number;
    [key: string]: any;
}
const useLoadMore = (actionName: string, total: ComputedRef<number>, params: LoadParams = {pageIndex:0,pageSize:8}) => {
    const store = useStore()
    // 变化的参数
    // const pageIndex = ref(params.pageIndex)
    const requestParams = reactive(params)
    const loadMorePage =() =>{
        requestParams.pageIndex++
        store.dispatch(actionName, { searchParams: requestParams })
    }
    const loadPrePage =() => {
        requestParams.pageIndex--
        store.dispatch(actionName, { searchParams: requestParams })
    }
    const goToPage =(index: number)=>{
        requestParams.pageIndex = index
        store.dispatch(actionName, { searchParams: requestParams })
    }
    const totalPage =computed(() => Math.ceil(total.value / params.pageSize))
    const isFirstPage = computed(()=> requestParams.pageIndex === 0)
    const isLastPage = computed(()=> {
        return totalPage.value === requestParams.pageIndex + 1
    })
    const pageIndex = toRef(requestParams, 'pageIndex')
    return {
        loadMorePage,
        isLastPage,
        pageIndex,
        totalPage,
        loadPrePage,
        isFirstPage,
        requestParams,
        goToPage
    }
}

export default useLoadMore