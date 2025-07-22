import { useContext, useState } from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
// import { Home, List, User, Briefcase, LogIn, UserPlus, BookOpen, Repeat, Star, PlusCircle, Edit, Trash2, Eye, MapPin, DollarSign, Award } from 'lucide-react';
import Header from './components/shared/Header';
// import NavLink from './components/shared/NavLink';
import Footer from './components/shared/Footer';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import HomePage from './components/public/HomePage';
import TourListingPage from './components/public/TourListingPage';
import TourDetailsPage from './components/public/TourDetailsPage';
import TravelerDashboard from './components/dashboard/TravelerDashboard';
import AgencyDashboard from './components/dashboard/AgencyDashboard';
import { StoreContext } from './context/StoreContext';
import DashboardApp from './AdminPanel/MainPage/MainAdminPage';


// --- Main App Component ---

const App = () => {
  // const [currentPage, setCurrentPage] = useState(useParams().page); // Default to 'home' if no page is specified
  const [currentTourId, setCurrentTourId] = useState(null);
  const {token} = useContext(StoreContext);

  const handleNavigate = (page, params = {}) => {
    // setCurrentPage(page);
    if (page === 'tour-details' && params.tourId) {
      setCurrentTourId(params.tourId);
    } else {
      setCurrentTourId(null);
    }
  };

  // const renderPage = () => {
  //   switch (currentPage) {
  //     case 'home':
  //       return <HomePage onNavigate={handleNavigate} />;
  //     case 'tour-listing':
  //       return <TourListingPage onNavigate={handleNavigate} />;
  //     case 'tour-details':
  //       return <TourDetailsPage tourId={currentTourId} onNavigate={handleNavigate} />;
  //     case 'login':
  //       return <LoginPage onNavigate={handleNavigate} />;
  //     case 'register':
  //       return <RegisterPage onNavigate={handleNavigate} />;
  //     case 'traveler-dashboard':
  //       return <TravelerDashboard onNavigate={handleNavigate} />;
  //     case 'agency-dashboard':
  //       return <AgencyDashboard onNavigate={handleNavigate} />;
  //     default:
  //       return <HomePage onNavigate={handleNavigate} />;
  //   }
  // };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-800">
      
      {/* <script src="https://cdn.tailwindcss.com"></script> */}
      {/* <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="flex-grow py-8">
        {renderPage()}
      </main>
      <Footer /> */}

<BrowserRouter> {/* Wrap your entire app with BrowserRouter */}
        <Header  onNavigate={handleNavigate}/> {/* Header can use Link components or useNavigate */}
        <main className="flex-grow py-0">
          <Routes> {/* Define your routes here */}
            <Route path="/" element={<HomePage onNavigate={handleNavigate} />} />
            <Route path="/tours" element={<TourListingPage onNavigate={handleNavigate}/>} />
            <Route path="/tours/:tourId" element={<TourDetailsPage onNavigate={handleNavigate} tourId={currentTourId}/>} /> {/* Dynamic route for tour details */}
            {!token ? <Route path="/login" element={<LoginPage onNavigate={handleNavigate} />} /> : null}
            {!token ? <Route path="/register" element={<RegisterPage  onNavigate={handleNavigate}/>} /> : null}
            <Route path="/traveler-dashboard" element={<TravelerDashboard onNavigate={handleNavigate} />} />
            <Route path="/agency-dashboard" element={<AgencyDashboard onNavigate={handleNavigate} />} />
            <Route path='/admin' element={<DashboardApp onNavigate={handleNavigate} />} /> {/* Admin dashboard route */}
            {/* Fallback route for 404 */}
            <Route path="*" element={<HomePage onNavigate={handleNavigate} />} /> {/* Or a dedicated 404 page */}
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
