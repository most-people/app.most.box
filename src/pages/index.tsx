import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div>
      Home
      <Link to="/404">404</Link>
    </div>
  )
}

export default HomePage
