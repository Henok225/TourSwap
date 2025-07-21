const SmallLoadingSpinner = () => {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
        {/* Container for the spinner and text, with shadow and rounded corners */}
        <div className="flex flex-col items-center p-8 rounded-lg shadow-xl bg-white">
          {/* Modern Spinner animation with distinct colors */}
          <div
            className="w-20 h-20 border-4 border-solid border-transparent border-t-green-500 border-b-blue-500 rounded-full animate-spin"
            role="status" // Role for accessibility
          >
            {/* Visually hidden text for screen readers */}
            <span className="sr-only">Loading...</span>
          </div>
          {/* Pulsating "Loading..." text */}
          <p className="mt-6 text-xl font-semibold text-gray-700 animate-pulse">Loading...</p>
        </div>
      </div>
    );
  };

  export default SmallLoadingSpinner;