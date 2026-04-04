import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/landing'
import LoginPage from './pages/login/LoginPage'
import RegisterPage from './pages/register/RegisterPage'
import ViewPostPage from './pages/posts/ViewPostPage'
import CreatePostPage from './pages/posts/CreatePostPage'
import EditPostPage from './pages/posts/EditPostPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/posts/create" element={<CreatePostPage />} />
      <Route path="/posts/:postId/edit" element={<EditPostPage />} />
      <Route path="/posts/:postId?" element={<ViewPostPage />} />
    </Routes>
  )
}

export default App
