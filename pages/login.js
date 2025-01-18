import { useEffect } from 'react'
import { useRouter } from 'next/router'
import AuthModal from '../components/AuthModal'

export default function Login() {
  const router = useRouter()
  const { redirect } = router.query

  const handleClose = () => {
    if (redirect) {
      router.push(redirect)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <AuthModal isOpen={true} onClose={handleClose} />
    </div>
  )
} 