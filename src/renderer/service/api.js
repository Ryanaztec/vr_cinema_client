import axios from './config'

export const example = params => {
  return axios({
    url: '/example',
    method: 'post',
    params
  })
}

export default {
  example
}
