import React from 'react'

function Footer() {
  const footerYear = new Date().getFullYear()

  return (
    <footer className='footer p-5 text-base bg-base-200 text-neutral-content footer-center'>
      <div>
        <p>&copy; {footerYear} Gamers Up, by <strong><a href="https://github.com/ariayingdeng">Aria Deng</a></strong> & <strong><a href="https://github.com/TungYuChen">James Chen</a></strong></p> 
        
      </div>
    </footer>
  )
}

export default Footer
