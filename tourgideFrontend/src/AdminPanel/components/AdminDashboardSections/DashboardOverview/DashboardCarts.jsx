import { Shield, User, List, Flag, Edit, Trash2, Home, LogIn, Search, BarChart2, CheckCircle, XCircle, Briefcase } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';


const DashboardCharts = ({listingsByStatus,usersByRole}) => {
    // Dummy data for charts
    const usersByRoleData = usersByRole;

  
    const listingsByStatusData = listingsByStatus;
  
    const PIE_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300']; // Colors for pie chart segments
  
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center"><BarChart2 size={28} className="mr-3 text-gray-700" /> Platform Statistics</h3>
  
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Users by Role Bar Chart */}
          <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Users by Role</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={usersByRoleData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Number of Users" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
  
          {/* Listings by Status Pie Chart */}
          <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Listings by Status</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={listingsByStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {listingsByStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  export default DashboardCharts