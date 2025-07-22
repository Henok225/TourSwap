import { useState, useEffect } from 'react';
import { XCircle, CheckCircle, Info, X } from 'lucide-react'; // Icons for different alert types and close button

const CustomAlert = ({
  isOpen,
  message,
  title = "Notification",
  type = "info", // Can be 'info', 'success', 'error', 'warning'
  onClose,
  duration = 0 // Auto-close duration in ms, 0 means no auto-close
}) => {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose(); // Call onClose when duration ends
      }, duration);
      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [isOpen, duration, onClose]);

  if (!isVisible) return null;

  // Determine styling based on type
  let bgColor, borderColor, textColor, IconComponent;
  switch (type) {
    case 'success':
      bgColor = 'bg-green-50';
      borderColor = 'border-green-300';
      textColor = 'text-green-800';
      IconComponent = CheckCircle;
      break;
    case 'error':
      bgColor = 'bg-red-50';
      borderColor = 'border-red-300';
      textColor = 'text-red-800';
      IconComponent = XCircle;
      break;
    case 'warning':
      bgColor = 'bg-yellow-50';
      borderColor = 'border-yellow-300';
      textColor = 'text-yellow-800';
      IconComponent = Info; // Using Info for warning
      break;
    case 'info':
    default:
      bgColor = 'bg-blue-50';
      borderColor = 'border-blue-300';
      textColor = 'text-blue-800';
      IconComponent = Info;
      break;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4 animate-fade-in">
    <div className={`relative ${bgColor} ${borderColor} border rounded-xl shadow-2xl p-6 w-full max-w-sm transform scale-95 animate-scale-in`}>
        <button
          onClick={() => { setIsVisible(false); onClose(); }}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition duration-200"
          aria-label="Close alert"
        >
          <X size={20} />
        </button>

        <div className="flex items-start space-x-4">
          {IconComponent && <IconComponent size={28} className={`${textColor} flex-shrink-0 mt-1`} />}
          <div>
            <h3 className={`text-xl font-bold ${textColor} mb-2`}>{title}</h3>
            <p className={`${textColor} text-base`}>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
