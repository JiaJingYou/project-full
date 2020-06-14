import Vue from 'vue';
import Axios from 'axios';

const service  = Axios.create({
    baseUrl: '/api'
})

Vue.prototype.$http = service;
export const http = service