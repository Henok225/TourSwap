import { useContext, useState } from 'react';
import axios from 'axios';
import LoaderSpin from '../loaderSpin/Loader';
import { StoreContext } from '../../context/StoreContext';

const MakeTours = ({setMakeTour}) => {
  const { url, userData, token } = useContext(StoreContext);
  const [newTour, setNewTour] = useState({
    title: '',
    location: '',
    date: '',
    availability: 1,
    price: 0,
    imageUrl: '',
    includes: '',
    excludes:'',
    description: '',
    providerId:userData.userId || '',
    providerName: userData.username || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const submitTour = async (tourData) => {
    setLoading(true);
    setError(null);
    setMessage('');
    try {
     
      const response = await axios.post(url+'/api/tours/submit', tourData, {
        headers: {

          Authorization: `Bearer ${token}`,
        }
      });

      setMessage(response.data.message || 'Tour submitted successfully!');
    } catch (err) {
      const errorMessage = (err as any)?.message || 'Unknown error';
      setError(`Failed to submit tour: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setNewTour(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTour.title || !newTour.location || !newTour.date || !newTour.imageUrl || newTour.availability < 0 || newTour.price < 0) {
      setError('Please fill in all required fields.');
      return;
    }
    await submitTour(newTour);
    setNewTour({ // Reset form
      title: '',
      location: '',
      date: '',
      availability: 1,
      price: 0,
      imageUrl: '',
      includes: '',
      excludes: '',
      description: '',
      providerId: userData.userId || '',
      providerName: userData.username || '',
    });
    setMakeTour(false); // Close the form after submission
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-4 font-sans antialiased flex items-center justify-center">
     <LoaderSpin isOpen={loading} />
      <div className="max-w-2xl w-full bg-white shadow-xl rounded-2xl p-8 space-y-8">

        {loading && (
          <div className="flex items-center justify-center p-4 bg-blue-100 text-blue-700 rounded-lg shadow-md">
            <svg className="animate-spin h-5 w-5 mr-3 text-blue-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg shadow-md border border-red-200">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}
        {message && (
          <div className="p-4 bg-green-100 text-green-700 rounded-lg shadow-md border border-green-200">
            <p className="font-semibold">Success:</p>
            <p>{message}</p>
          </div>
        )}

        <section className="bg-green-50 p-6 rounded-xl shadow-inner">
          <h2 className="text-3xl font-bold text-gray-700 mb-6 text-center">Submit a New Tour</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-gray-700 text-sm font-medium mb-2">Title:</label>
              <input type="text" id="title" name="title" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" value={newTour.title} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="location" className="block text-gray-700 text-sm font-medium mb-2">Location:</label>
              <input type="text" id="location" name="location" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" value={newTour.location} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="date" className="block text-gray-700 text-sm font-medium mb-2">Date:</label>
              <input type="date" id="date" name="date" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" value={newTour.date} onChange={handleChange} min={new Date().toISOString().split('T')[0]} required />
            </div>
            <div>
              <label htmlFor="image-url" className="block text-gray-700 text-sm font-medium mb-2">Image URL:</label>
              <input type="text" id="image-url" name="imageUrl" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" value={newTour.imageUrl} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="includes" className="block text-gray-700 text-sm font-medium mb-2">What's included: </label>
              <input type="text" id="includes" name="includes" placeholder='hotel, transport, ...' className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" value={newTour.includes} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="excludes" className="block text-gray-700 text-sm font-medium mb-2">What's excluded: </label>
              <input type="text" id="excludes" name="excludes" placeholder='dining, shopping, ... ' className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" value={newTour.excludes} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="availability" className="block text-gray-700 text-sm font-medium mb-2">Availability:</label>
              <input type="number" id="availability" name="availability" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" value={newTour.availability} onChange={handleChange} min="0" required />
            </div>

            <div>
              <label htmlFor="price" className="block text-gray-700 text-sm font-medium mb-2">Price ($):</label>
              <input type="number" id="price" name="price" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" value={newTour.price} onChange={handleChange} min="0" step="0.01" required />
            </div>
            <div>
              <label htmlFor="description" className="block text-gray-700 text-sm font-medium mb-2">Description:</label>
              <textarea id="description" name="description" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" value={newTour.description} onChange={handleChange} rows={4} required></textarea>
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold text-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Tour'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default MakeTours;
