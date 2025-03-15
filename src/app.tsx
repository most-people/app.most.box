import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import '@/app.css'
import routes from '~react-pages'
import MainLayout from './layouts/MainLayout'

// 打印路由信息，帮助调试
console.log('Generated routes:', routes)

// 重新组织路由结构
const mainRoutes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: routes.find(r => r.path === '/')?.element,
      },
      {
        path: 'discover',
        element: routes.find(r => r.path === 'discover')?.element,
      },
      {
        path: 'message',
        element: routes.find(r => r.path === 'message')?.element,
      },
      {
        path: 'profile',
        element: routes.find(r => r.path === 'profile')?.element,
      },
    ],
  },
  // 其他非主要页面路由可以放在这里
  ...routes.filter(r => !['/', 'discover', 'message', 'profile'].includes(r.path || '')),
]

const router = createBrowserRouter(mainRoutes)

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
