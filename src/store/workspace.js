import router from '~/routes'

export default {
    namespaced : true,
    state(){
        return {
            // assignState로 받은 이 데이터를 이용해 LNB의 목록 출력
            workspaces : [],
            currentWorkspace : {},
            currentWorkspacePath : []
        }
    }, 
    getters : {},
    mutations : {
        // assignState가 실행될 때 받아줄 매개변수 : payload
        assignState(state, payload){
            // payload 객체가 가지고 있는 속성을 배열 데이터로 받아서 키, 값 할당
            Object.keys(payload).forEach(key => {
                state[key] = payload[key]
            })
        }
    },
    actions : {
        // 목록 생성
        async createWorkspace({ dispatch }, payload = {}){
            const { parentId } = payload
            const workspace = await _request({
                method : 'POST',
                body : JSON.stringify({
                    title : '',
                    parent : parentId
                })
            })
            // 생성 후 다시 목록 가져오기 
            await dispatch('readWorkspaces')
            router.push({
                name : 'Workspace',
                params : {
                    id : workspace.id
                }
            })
        },
        // 목록 가져오기
        async readWorkspaces({ commit, dispatch }){
            const workspaces = await _request({
                method : 'GET',
            })
            // console.log(workspaces)
            commit('assignState', {
                workspaces
            })
            dispatch('findWorkspacePath')
            // 가지고 있는 문서가 하나도 없을 때 자동 생성
            if(!workspaces.length) {
                await dispatch('createWorkspace')
            }
        },
        // 목록이 아닌 개별 항목 가져오기
        async readWorkspace({ commit }, payload){
            const { id } = payload
            try{
                const workspace = await _request({
                id,
                method : 'GET',
            })
            commit('assignState', {
                currentWorkspace : workspace
            })
            } catch(error) {
                router.push('/error')
            }
        },
        async updateWorkspace({dispatch}, payload){
            const { id, title, content } = payload
            await _request({
                id,
                method : 'PUT',
                body : JSON.stringify({
                    title,
                    content
                })
            })
            dispatch('readWorkspaces')
        },
        async deleteWorkspace({ dispatch, state }, payload){
            const { id } = payload
            await _request({
                id,
                method : 'DELETE',
            })
             // 생성 후 다시 목록 가져오기 
             await dispatch('readWorkspaces')
             // 삭제된 이후 항목의 젤 위 document로 이동 
             // 현재 페이지의 id와 삭제하려는 id가 같은 경우 
             // state의 제일 첫번째 요소의 id를 router에 push
             if(id === parseInt(router.currentRoute.value.params.id, 10)){
                 router.push({
                     name : 'Workspace',
                     params : {
                         id : state.workspaces[0].id
                     }
                 })

             }
        },
        findWorkspacePath({ state, commit }){
            const currentWorkspaceId = parseInt(router.currentRoute.value.params.id, 10)
            function _find(workspace, parents) {
                if(currentWorkspaceId === workspace.id){
                    commit('assignState', {
                        currentWorkspacePath : [...parents, workspace]
                    })
                }
                if(workspace.documents){
                    //Recursive
                    workspace.documents.forEach(ws => _find(ws, [...parents, workspace]))
                }
            }
            state.workspaces.forEach(workspace => _find(workspace, []))
        }

    }
}

async function _request(options){
    const { id = '' } = options
    return await fetch(`https://kdt.roto.codes/documents/${id}`, {
            ...options,
            headers : {
                'Content-Type' : 'application/json',
                'x-username' : 'daseul'
            },
        }).then(res => res.json())
}