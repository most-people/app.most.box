import { useLocation, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import './TabBar.css'

interface TabItem {
  key: string
  path: string
  label: string
  icon: string
}

const tabs: TabItem[] = [
  {
    key: 'home',
    path: '/',
    label: '首页',
    icon: '🏠',
  },
  {
    key: 'discover',
    path: '/discover',
    label: '发现',
    icon: '🔍',
  },
  {
    key: 'message',
    path: '/message',
    label: '消息',
    icon: '💬',
  },
  {
    key: 'profile',
    path: '/profile',
    label: '我的',
    icon: '👤',
  },
]

const TabBar = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const activeTab = useMemo(() => {
    const path = location.pathname
    return tabs.find(tab => tab.path === path)?.key || 'home'
  }, [location.pathname])

  const handleTabClick = (path: string) => {
    navigate(path)
  }

  return (
    <div className="tab-bar">
      {tabs.map(tab => (
        <div
          key={tab.key}
          className={`tab-item ${activeTab === tab.key ? 'active' : ''}`}
          onClick={() => handleTabClick(tab.path)}
        >
          <div className="tab-icon">{tab.icon}</div>
          <div className="tab-label">{tab.label}</div>
        </div>
      ))}
    </div>
  )
}

export default TabBar
