import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import '@/app.css'
import routes from '~react-pages'
import MainLayout from './layouts/MainLayout'

const tabs = ['/', 'discover', 'message', 'profile']

// 重新组织路由结构
const mainRoutes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      ...tabs.map(tab => ({
        path: tab,
        index: tab === '/',
        element: routes.find(r => r.path === tab)?.element,
      })),
    ],
  },
  // 非标签页路由
  ...routes.filter(r => !tabs.includes(r.path || '')),
]

const router = createBrowserRouter(mainRoutes)

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
