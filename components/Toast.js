import { useEffect, useState } from 'react'

export default function Toast({ message, type = 'success', onClose, isVisible = true }) {
  const [show, setShow] = useState(isVisible)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
      if (onClose) onClose()
    }, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  if (!show) return null

  return (
    <div 
      className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white z-50 ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      }`}
    >
      {message}
    </div>
  )
} 