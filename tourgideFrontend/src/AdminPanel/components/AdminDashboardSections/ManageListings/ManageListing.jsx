import { useContext, useEffect, useState } from "react";
import { Shield, User, List, Flag, Edit, Trash2, Home, LogIn, Search, BarChart2, CheckCircle, XCircle, Briefcase } from 'lucide-react';
import ConfirmationModal from "../../ConfirmationModal/ConfirmationModal";
import axios from "axios";
import { StoreContext } from "../../../../context/StoreContext";



const ManageListings = ({adminToken}) => {

    const {url} = useContext(StoreContext)
    const [listings, setListings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedListing, setSelectedListing] = useState(null);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false); // New state for status change modal
    const [statusChangeDetails, setStatusChangeDetails] = useState({ id: null, newStatus: '' });
  
    useEffect(() => {

      const fetchListings = async () => {
        try {
          const response = await axios.get(url+'/api/tours/admin',{
            headers:{
              'Authorization': "Bearer "+adminToken
            }
          }); 
          if (response.data.success) {
            setListings(response.data.tours); 
            // console.log(response.data.tours)
          }
          
        } catch (error) {
          console.error("Error fetching listings:", error);
          
        }
      }
      fetchListings();

    }, []);


    const filteredListings = listings.filter(listing =>
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.providerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const handleDeleteClick = (listing) => {
      setSelectedListing(listing);
      setIsModalOpen(true);
    };
  
    const confirmDelete = async () => {
      setListings(listings.filter(listing => listing._id !== selectedListing._id));
      setIsModalOpen(false);
      setSelectedListing(null);
     
      try {
        const response = await axios.delete(url+'/api/tours/remove/'+selectedListing._id, {
          headers:{
            'Authorization': "Bearer "+adminToken
          }
        }); 
        if (response.data.success) {
          console.log(`Deleted listing: ${selectedListing.name}`);

        }
      } catch (error) {
        console.log("Error dele")
      }

    };

    // Handler for when status select changes
  const handleStatusChange = (listingId, newStatus) => {
    setStatusChangeDetails({ id: listingId, newStatus: newStatus });
    setIsStatusModalOpen(true);
  };

  // Confirm status change after modal interaction
  const confirmStatusChange = async () => {
    const { id, newStatus } = statusChangeDetails;
    setListings(prevListings =>
      prevListings.map(listing =>
        listing.id === id ? { ...listing, status: newStatus } : listing
      )
    );
    setIsStatusModalOpen(false);
    setStatusChangeDetails({ id: null, newStatus: '' });
    //  API call to backend
    try {

     const response = await axios.put(`${url}/api/tours/update/${id}`, { status: newStatus },{
      headers:{
        'Authorization': "Bearer "+adminToken
      }
     });
     if(response.data.success){
      setStatusChangeDetails({ id:id, newStatus: newStatus });
      console.log(`Successfully updated status for listing ${id} to ${newStatus}`);
    
     }
      
    } catch (error) {
      console.error(`Error updating status for listing ${id}:`, error);
      // Revert status in UI or show error message if API call fails
      setListings(prevListings =>
        prevListings.map(listing =>
          listing.id === id ? { ...listing, status: listings.find(l => l.id === id).status } : listing
        )
      );
    }
  };
  
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h3 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center"><List size={28} className="mr-3 text-green-600" /> Manage Listings</h3>
  
        <div className="mb-6 flex items-center space-x-3">
          <Search size={20} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search listings by name or agency..."
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
  
        <ul className="space-y-4">
          {filteredListings.length > 0 ? (
            filteredListings.map(listing => (
              <li key={listing._id} className="bg-gray-50 p-5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm hover:shadow-md transition duration-200">
                <div>
                  <p className="font-medium text-lg text-gray-900">{listing.title}</p>
                  <p className="text-sm text-gray-600">Agency: {listing.providerName}</p>
                </div>
                <div className="flex space-x-3 mt-3 sm:mt-0">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    listing.status === 'Active' ? 'bg-green-100 text-green-800' :
                    listing.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>


                    {/* Status Select Dropdown */}
                <select
                  value={listing.status}
                  onChange={(e) => handleStatusChange(listing._id, e.target.value)}
                  className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                    listing.status === 'Active' ? 'bg-green-100 text-green-800 border-green-200' :
                    listing.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                    'bg-red-100 text-red-800 border-red-200'
                  } appearance-none pr-8 bg-white`}
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.2em 1.2em' }}
                >
                  <option value="Active">Active</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Draft">Draft</option>
                </select>



                  </span>
                  <button className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition duration-200" title="Edit Listing"><Edit size={20} /></button>
                  <button
                    onClick={() => handleDeleteClick(listing)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition duration-200"
                    title="Delete Listing"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-600 text-lg text-center py-4">No listings found matching your search.</p>
          )}
        </ul>
  
        {/* Conceptual Pagination */}
        <div className="flex justify-center mt-8 space-x-4">
          <button className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 transition duration-300 font-medium">Previous</button>
          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-300 font-medium">Next</button>
        </div>
  
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmDelete}
          title="Confirm Deletion"
          message={`Are you sure you want to delete listing "${selectedListing?.name}"? This action cannot be undone.`}
        />
        <ConfirmationModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onConfirm={confirmStatusChange}
        title="Confirm Status Change"
        message={`Are you sure you want to change the status of "${listings.find(l => l.id === statusChangeDetails.id)?.name}" to "${statusChangeDetails.newStatus}"?`}
        confirmText="Change Status"
        confirmColor="bg-blue-600"
      />
      </div>
    );
  };

  export default ManageListings;