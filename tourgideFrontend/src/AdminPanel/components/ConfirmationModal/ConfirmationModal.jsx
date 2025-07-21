
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
          <p className="text-gray-700 mb-6">{message}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={onConfirm}
              className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition duration-300 font-medium"
            >
              Confirm
            </button>
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-400 transition duration-300 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

export default ConfirmationModal;