import { http } from "~/plugins/axios"

const state = () => ({
    token: '',
    id: '',
    email: '',
    nickname: ''
})

const mutations = {
    SET_TOKEN(state, token){
        state.token = token
    },
    SET_USER(state, user){
        state.id = user._id
        state.email = user.email
        state.nickname = user.nickname
    }
}

const actions = {
    detail: async ({state, commit}, data) => {
        // let ret = await http.get('/user/info')
        let  ret = 0;
        if(ret==0) {
            commit('SET_USER', {
                _id: '111',
                email: '237390045@qq.com',
                nickname: '牛牛'
            })
            return ret
        }
    }
}

export default {
    namespace: true,
    state,
    mutations,
    actions
}