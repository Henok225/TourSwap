

const AdminFooter = () => {
    return (
      <footer className="bg-gray-900 text-white p-6 mt-12 rounded-t-3xl shadow-inner">
        <div className="container mx-auto text-center text-sm opacity-80">
          &copy; {new Date().getFullYear()} Admin Panel. All rights reserved.
        </div>
      </footer>
    );
  };

export default AdminFooter;