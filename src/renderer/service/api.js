import axios from './config'

export const getAllTags = params => {
  return axios({
    url: '/allTags',
    method: 'get',
    params
  })
}

export default {
  getAllTags
}
