import { Outlet } from 'react-router-dom'
import TabBar from '../components/TabBar'
import './MainLayout.css'

const MainLayout = () => {
  return (
    <div className="main-layout">
      <div className="page-content">
        <Outlet />
      </div>
      <TabBar />
    </div>
  )
}

export default MainLayout
