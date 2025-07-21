import  { useEffect } from 'react'
import './Loader.css'

const LoaderSpin = ({isOpen}) => {

    useEffect(() => {
        if (isOpen) {
          document.body.style.overflow = 'hidden'; // Stop scrolling
        } else {
          document.body.style.overflow = 'unset'; // Restore scrolling
        }
        return () => {
            document.body.style.overflow = 'unset'; //cleanup on unmount, or if isOpen changes.
        }
      }, [isOpen]);
    
      if (!isOpen) {
        return null;
      }

  return (
    <div className='loader'>
      <div className="loader-box">
        <div className="loader-block"></div>
      </div>
    </div>
  )
}

export default LoaderSpin
