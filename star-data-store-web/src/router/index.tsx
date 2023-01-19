import { lazy, Suspense, ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { Provider, KeepAlive } from 'react-keep-alive'
import { Assignment, Mood } from '@mui/icons-material'
import SvgIcon from '@/components/SvgIcon'
// 组件
import Layout from '@/pages/layout'
import Main from '@/pages/main'
const Error = lazy(() => import('../pages/error/404'))

// 组件懒加载
const lazyload = (children: ReactNode): ReactNode => {
  return <Suspense>{children}</Suspense>
}

// 免登录名单
export const whiteList = ['/login']

export interface Router {
  show?: boolean
  path: string
  element: JSX.Element
  name: string
  open?: boolean
  icon?: JSX.Element | string
  children?: Array<{
    index?: boolean
    path: string
    element: ReactNode
    name: string
    icon?: JSX.Element | string
    show?: boolean
  }>
}

// 菜单
export const menuRouter: Router[] = []

// 一般路由
const router = [
  {
    path: '/',
    element: (
      <Layout>
        {/* <Provider>
          <KeepAlive name="Main"> */}
        <Main />
        {/* </KeepAlive>
        </Provider> */}
      </Layout>
    ),
  },

  {
    path: '*',
    element: lazyload(<Error />),
  },
]

export default router.concat(menuRouter)
