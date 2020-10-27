<!--
 * @Author: nigel
 * @Date: 2020-09-03 15:54:51
 * @LastEditTime: 2020-10-27 11:13:52
-->

## 项目技术栈

node10.15.3 + react@16.12.0 + redux@3.7.2 + react-router@3.2.0 + webpack@4.41.2 + axios@0.19.0 + less@2.7.1 + antd@3.25.2

## 项目运行

```
git clone --depth 1 https://github.com/duxianwei520/react.git

cd react (进入项目)

npm install (安装依赖包)

npm start (启动服务)

```

最后的构建命令

```
npm run build (正式环境的打包部署)
npm run testing (测试环境的打包部署命令，可以根据具体需求自行配置修改)

```

服务端返回的数据格式也是标准的 json，如下所示

```
{
  data: {
    totalCount: 100,
    currentPage: 1,
    pageSize: 10,
    'list': [
    ],
  },
  msg: '',
  status: 1,
}

```

所有异步请求返回都会经过 configs 里面的 ajax.js 做处理，如果请求没有任何问题，那 status 返回值是 1；
如果请求错误，比如说参数错误或者其他报错之类的，那 status 返回值就是 0；
如果 status 值是-1，表示登录超时，那么就会跳出登录。
这些参数都可以根据实际情况进行调整，报错或者成功的提示信息放在 msg 里面返回。

```


### 取消http请求示例：
```

import axios from 'axios'
const axiosHandle = axios.CancelToken.source()

login(){
this.props.dispatch(fetchLogin(values, (res) => {},(error)=>{},axiosHandle)
取消请求的操作
setTimeout(() => {
axiosHandle.cancel('手动取消。')
}, 3000)
}

```

```
