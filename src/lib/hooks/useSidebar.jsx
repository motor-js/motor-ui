import { useState } from 'react'

const useSidebar = () => {
  const [isOpen, setIsOpen] = useState(false)

  function toggle() {
    setIsOpen(!isOpen)
  }

  return {
    isOpen,
    toggle,
  }
}

export default useSidebar
