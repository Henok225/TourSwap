import { useState } from "react";
import { Shield, User, List, Flag, Edit, Trash2, Home, LogIn, Search, BarChart2, CheckCircle, XCircle, Briefcase } from 'lucide-react';
import ConfirmationModal from "../../ConfirmationModal/ConfirmationModal";



const ReviewFlaggedContent = () => {
    const [flaggedContent, setFlaggedContent] = useState([
      { id: 201, type: 'Review', content: 'This tour was terrible, the guide was rude and unhelpful!', reportedBy: 'User X', status: 'Pending' },
      { id: 202, type: 'Listing', content: 'Tour description contains false claims about wildlife sightings and guarantees impossible experiences.', reportedBy: 'User Y', status: 'Pending' },
      { id: 203, type: 'User Profile', content: 'User "SpamBot" is posting irrelevant links.', reportedBy: 'User Z', status: 'Pending' },
      { id: 204, type: 'Review', content: 'The food was inedible and the accommodation was filthy.', reportedBy: 'User A', status: 'Pending' },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFlag, setSelectedFlag] = useState(null);
    const [modalAction, setModalAction] = useState(''); // 'resolve' or 'dismiss'
  
    const handleActionClick = (flag, action) => {
      setSelectedFlag(flag);
      setModalAction(action);
      setIsModalOpen(true);
    };
  
    const confirmAction = () => {
      if (modalAction === 'resolve') {
        setFlaggedContent(flaggedContent.filter(item => item.id !== selectedFlag.id));
        console.log(`Resolved flagged content: ${selectedFlag.id}`);
      } else if (modalAction === 'dismiss') {
        setFlaggedContent(flaggedContent.filter(item => item.id !== selectedFlag.id)); // For MVP, just remove it
        console.log(`Dismissed flagged content: ${selectedFlag.id}`);
      }
      setIsModalOpen(false);
      setSelectedFlag(null);
      setModalAction('');
    };
  
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h3 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center"><Flag size={28} className="mr-3 text-red-600" /> Review Flagged Content</h3>
        {flaggedContent.length > 0 ? (
          <ul className="space-y-4">
            {flaggedContent.map(content => (
              <li key={content.id} className="bg-gray-50 p-5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm hover:shadow-md transition duration-200">
                <div>
                  <p className="font-medium text-lg text-gray-900">{content.type} (Reported by: {content.reportedBy})</p>
                  <p className="text-sm text-gray-600 italic">"{content.content}"</p>
                </div>
                <div className="flex space-x-3 mt-3 sm:mt-0">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    content.status === 'Pending' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {content.status}
                  </span>
                  <button
                    onClick={() => handleActionClick(content, 'resolve')}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 font-medium shadow-sm flex items-center"
                  >
                    <CheckCircle size={18} className="mr-1" /> Resolve
                  </button>
                  <button
                    onClick={() => handleActionClick(content, 'dismiss')}
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition duration-300 font-medium shadow-sm flex items-center"
                  >
                    <XCircle size={18} className="mr-1" /> Dismiss
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-lg text-center py-4">No flagged content to review.</p>
        )}
  
        {/* Conceptual Pagination */}
        <div className="flex justify-center mt-8 space-x-4">
          <button className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 transition duration-300 font-medium">Previous</button>
          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-300 font-medium">Next</button>
        </div>
  
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmAction}
          title={`${modalAction === 'resolve' ? 'Resolve' : 'Dismiss'} Flagged Content`}
          message={`Are you sure you want to ${modalAction} this flagged content (ID: ${selectedFlag?.id})?`}
        />
      </div>
    );
  };

export default ReviewFlaggedContent;