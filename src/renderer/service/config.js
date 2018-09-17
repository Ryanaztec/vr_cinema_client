import axios from 'axios'
import store from '.././store'

export default function $axios (options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      method: 'POST',
      baseURL: process.env.NODE_ENV === 'production' ? 'http://vrcinema.osvlabs.com/api' : 'http://dev.vrcinema.com/api',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: {},
      timeout: 10000,
      withCredentials: false,
      responseType: 'json'
    })

    // request 拦截器
    instance.interceptors.request.use(
      config => {
        // Tip: 1
        // 请求开始的时候可以结合 vuex 开启全屏的 loading 动画

        const noLoadingList = ['get-new-movies-count', 'get-seat-by-mac', 'refresh', 'get-playing-seat']
        var index = config.url.lastIndexOf('/')
        var route = config.url.substring(index + 1, config.url.length)
        if (noLoadingList.indexOf(route) < 0) {
          store.dispatch('StartLoading')
        }

        if (localStorage.token) {
          config.headers.Authorization = 'bearer ' + localStorage.token
        }
        return config
      },
      error => {
        // 请求错误时做些事(接口错误、超时等)
        // Tip: 4
        // 关闭loadding
        store.dispatch('StopLoading')
        console.log('request:', error)

        //  1.判断请求超时
        if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
          console.log('根据你设置的timeout/真的请求超时 判断请求现在超时了，你可以在这里加入超时的处理方案')
          // TODO 显示登陆框
        }
        //  2.需要重定向到错误页面
        const errorInfo = error.response
        console.log(errorInfo)
        if (errorInfo) {
          // error =errorInfo.data//页面那边catch的时候就能拿到详细的错误信息,看最下边的Promise.reject
          console.log(errorInfo.status)
        }
        return Promise.reject(error) // 在调用的那边可以拿到(catch)你想返回的错误信息
      }
    )

    // response 拦截器
    instance.interceptors.response.use(
      response => {
        store.dispatch('StopLoading')
        let data
        // IE9时response.data是undefined，因此需要使用response.request.responseText(Stringify后的字符串)
        if (response.data === 'undefined') {
          data = response.request.responseText
        } else {
          data = response.data
        }
        // 根据返回的code值来做不同的处理（和后端约定）
        switch (data.code) {
          case '':
            break
          default:
        }
        // 若不是正确的返回code，且已经登录，就抛出错误
        // const err = new Error(data.description)

        // err.data = data
        // err.response = response

        // throw err
        return data
      },
      err => {
        store.dispatch('StopLoading')
        if (err && err.response) {
          switch (err.response.status) {
            case 400:
              err.message = '请求错误'
              break

            case 401:
              err.message = '未授权，请登录'
              break

            case 403:
              err.message = '拒绝访问'
              break

            case 404:
              err.message = `请求地址出错: ${err.response.config.url}`
              break

            case 408:
              err.message = '请求超时'
              break

            case 500:
              err.message = '服务器内部错误'
              break

            case 501:
              err.message = '服务未实现'
              break

            case 502:
              err.message = '网关错误'
              break

            case 503:
              err.message = '服务不可用'
              break

            case 504:
              err.message = '网关超时'
              break

            case 505:
              err.message = 'HTTP版本不受支持'
              break

            default:
          }
        }
        // 可在此处添加消息提示
        return Promise.reject(err)
      }
    )

    // 请求处理
    instance(options)
      .then((res) => {
        resolve(res)
        return false
      })
      .catch((error) => {
        reject(error)
      })
  })
}
