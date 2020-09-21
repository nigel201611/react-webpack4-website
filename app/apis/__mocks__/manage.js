
import { createApi } from '@ajax'
import { mockURL, path } from '@configs/config'

const prefix = 'usercenter'
const option = { baseURL: mockURL }
// // 模块管理
// export const fetchModuleList = createApi(`${path}/${prefix}/resource/list`, option) // 获取模块列表
// export const fetchModuleDelete = createApi(`${path}/${prefix}/resource/delete`, option) // 删除模块
// export const fetchModuleDetail = createApi(`${path}/${prefix}/resource/detail`, option) // 获取模块详情
// export const fetchChangeModuleStatus = createApi(`${path}/${prefix}/resource/updateStatus`, option) // 修改模块显隐状态
// export const fetchModuleUpdateDetail = createApi(`${path}/${prefix}/resource/update`, option) // 修改模块详情
// export const fetchModuleAdd = createApi(`${path}/${prefix}/resource/save`, option) // 新增模块
// export const fetchButtonList = createApi(`${path}/${prefix}/resource/button/list`, 'fetchButtonList') // 按钮权限列表
