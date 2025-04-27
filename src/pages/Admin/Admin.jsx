import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Calendar, Clock, Users, Car, CreditCard, FileText, 
  AlertTriangle, RefreshCw, Award, User, BookOpen, Clipboard 
} from 'lucide-react';
import { API_ENDPOINTS } from '../../API_ENDPOINTS';

// API service to fetch data from backend
const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.ADMIN}/${endpoint}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState({
    bookings: [],
    cars: [],
    carReviews: [],
    carVerifications: [],
    coupons: [],
    payments: [],
    penalties: [],
    refunds: [],
    systemReviews: [],
    users: [],
    userVerifications: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const bookings = await fetchData('bookings');
      const cars = await fetchData('cars');
      const carReviews = await fetchData('car-reviews');
      const carVerifications = await fetchData('car-verifications');
      const coupons = await fetchData('coupons');
      const payments = await fetchData('payments');
      const penalties = await fetchData('penalties');
      const refunds = await fetchData('refunds');
      const systemReviews = await fetchData('system-reviews');
      const users = await fetchData('users');
      const userVerifications = await fetchData('user-verifications');

      setData({
        bookings,
        cars,
        carReviews,
        carVerifications,
        coupons,
        payments,
        penalties,
        refunds,
        systemReviews,
        users,
        userVerifications
      });
      setLoading(false);
    };

    loadData();
  }, []);

  // Calculate dashboard metrics
  const metrics = {
    totalBookings: data.bookings.length,
    activeBookings: data.bookings.filter(b => b.status === 'booked').length,
    completedBookings: data.bookings.filter(b => b.status === 'completed').length,
    cancelledBookings: data.bookings.filter(b => ['cancelled', 'cancelled_by_owner'].includes(b.status)).length,
    totalRevenue: data.payments.reduce((sum, payment) => sum + (payment.total_amount || 0), 0),
    averageBookingValue: data.bookings.length ? data.payments.reduce((sum, payment) => sum + (payment.total_amount || 0), 0) / data.bookings.length : 0,
    totalCars: data.cars.length,
    verifiedCars: data.cars.filter(car => car.verification_status === 'approved').length,
    totalUsers: data.users.length,
    verifiedUsers: data.users.filter(user => user.verification_status === 'approved').length,
    owners: data.users.filter(user => user.user_type === 'owner').length,
    averageCarRating: data.carReviews.length ? data.carReviews.reduce((sum, review) => sum + review.rating, 0) / data.carReviews.length : 0,
  };

  // Prepare chart data
  const prepareBookingsByStatusData = () => {
    const statusCounts = {
      'booked': 0,
      'cancelled': 0,
      'completed': 0,
      'picked': 0,
      'cancelled_by_owner': 0
    };
    
    data.bookings.forEach(booking => {
      if (statusCounts.hasOwnProperty(booking.status)) {
        statusCounts[booking.status]++;
      }
    });
    
    return Object.keys(statusCounts).map(status => ({
      name: status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: statusCounts[status]
    }));
  };

  const prepareRevenueData = () => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyRevenue = Array(12).fill(0);
    
    data.payments.forEach(payment => {
      if (payment.status === 'paid' && payment.created_at) {
        const month = new Date(payment.created_at).getMonth();
        monthlyRevenue[month] += payment.total_amount || 0;
      }
    });
    
    return monthlyRevenue.map((amount, idx) => ({
      name: monthNames[idx],
      revenue: parseFloat(amount.toFixed(2))
    }));
  };

  const prepareCarTypeData = () => {
    const typeCounts = {};
    
    data.cars.forEach(car => {
      typeCounts[car.car_type] = (typeCounts[car.car_type] || 0) + 1;
    });
    
    return Object.keys(typeCounts).map(type => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      count: typeCounts[type]
    }));
  };

  const prepareUserGrowthData = () => {
    const monthlyUsers = Array(12).fill(0);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    data.users.forEach(user => {
      if (user.created_at) {
        const month = new Date(user.created_at).getMonth();
        monthlyUsers[month]++;
      }
    });
    
    return monthlyUsers.map((count, idx) => ({
      name: monthNames[idx],
      users: count
    }));
  };

  // COLORS for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <div className="flex space-x-4">
            <select 
              className="bg-white bg-opacity-20 text-white rounded-md px-3 py-1 border border-white border-opacity-30"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
              <option value="all">All Time</option>
            </select>
            <button className="bg-white text-blue-800 rounded-md px-4 py-1 font-medium hover:bg-opacity-90 transition-colors">
              Refresh Data
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <BookOpen size={24} />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">Total Bookings</h2>
                <p className="text-2xl font-semibold text-gray-900">{metrics.totalBookings}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-green-500 font-medium">{Math.round((metrics.completedBookings / metrics.totalBookings) * 100)}% completed</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <CreditCard size={24} />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">Total Revenue</h2>
                <p className="text-2xl font-semibold text-gray-900">₹{metrics.totalRevenue.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-gray-600">Avg. ₹{metrics.averageBookingValue.toLocaleString(undefined, {maximumFractionDigits: 0})} per booking</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <Car size={24} />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">Total Cars</h2>
                <p className="text-2xl font-semibold text-gray-900">{metrics.totalCars}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-purple-500 font-medium">{Math.round((metrics.verifiedCars / metrics.totalCars) * 100)}% verified</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                <Users size={24} />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">Total Users</h2>
                <p className="text-2xl font-semibold text-gray-900">{metrics.totalUsers}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-amber-500 font-medium">{metrics.owners} car owners</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'bookings', 'cars', 'users', 'financial'].map((tab) => (
              <button
                key={tab}
                className={`
                  ${activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                `}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Dashboard Overview</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Bookings by Status */}
                <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                  <h3 className="text-md font-medium text-gray-700 mb-4">Bookings by Status</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={prepareBookingsByStatusData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {prepareBookingsByStatusData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Monthly Revenue */}
                <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                  <h3 className="text-md font-medium text-gray-700 mb-4">Monthly Revenue</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={prepareRevenueData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#0088FE" activeDot={{ r: 8 }} strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Car Distribution by Type */}
                <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                  <h3 className="text-md font-medium text-gray-700 mb-4">Car Distribution by Type</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={prepareCarTypeData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" name="Number of Cars" fill="#00C49F" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* User Growth */}
                <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                  <h3 className="text-md font-medium text-gray-700 mb-4">User Growth</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={prepareUserGrowthData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Car Verification Status</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white p-2 rounded">
                      <span className="text-xs text-gray-500">Pending</span>
                      <p className="text-lg font-medium">{data.cars.filter(car => car.verification_status === 'pending').length}</p>
                    </div>
                    <div className="bg-white p-2 rounded">
                      <span className="text-xs text-gray-500">In Process</span>
                      <p className="text-lg font-medium">{data.cars.filter(car => car.verification_status === 'in_process').length}</p>
                    </div>
                    <div className="bg-white p-2 rounded">
                      <span className="text-xs text-gray-500">Approved</span>
                      <p className="text-lg font-medium">{data.cars.filter(car => car.verification_status === 'approved').length}</p>
                    </div>
                    <div className="bg-white p-2 rounded">
                      <span className="text-xs text-gray-500">Rejected</span>
                      <p className="text-lg font-medium">{data.cars.filter(car => car.verification_status === 'rejected').length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">User Verification Status</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white p-2 rounded">
                      <span className="text-xs text-gray-500">Pending</span>
                      <p className="text-lg font-medium">{data.users.filter(user => user.verification_status === 'pending').length}</p>
                    </div>
                    <div className="bg-white p-2 rounded">
                      <span className="text-xs text-gray-500">In Process</span>
                      <p className="text-lg font-medium">{data.users.filter(user => user.verification_status === 'in_process').length}</p>
                    </div>
                    <div className="bg-white p-2 rounded">
                      <span className="text-xs text-gray-500">Approved</span>
                      <p className="text-lg font-medium">{data.users.filter(user => user.verification_status === 'approved').length}</p>
                    </div>
                    <div className="bg-white p-2 rounded">
                      <span className="text-xs text-gray-500">Rejected</span>
                      <p className="text-lg font-medium">{data.users.filter(user => user.verification_status === 'rejected').length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Analysis</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white p-2 rounded">
                      <span className="text-xs text-gray-500">Paid</span>
                      <p className="text-lg font-medium">{data.payments.filter(payment => payment.status === 'paid').length}</p>
                    </div>
                    <div className="bg-white p-2 rounded">
                      <span className="text-xs text-gray-500">Pending</span>
                      <p className="text-lg font-medium">{data.payments.filter(payment => payment.status === 'pending').length}</p>
                    </div>
                    <div className="bg-white p-2 rounded">
                      <span className="text-xs text-gray-500">Failed</span>
                      <p className="text-lg font-medium">{data.payments.filter(payment => payment.status === 'failed').length}</p>
                    </div>
                    <div className="bg-white p-2 rounded">
                      <span className="text-xs text-gray-500">Refunded</span>
                      <p className="text-lg font-medium">{data.payments.filter(payment => payment.status === 'refunded').length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600">
                      <Calendar size={20} />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-sm font-medium text-gray-500">Active Bookings</h2>
                      <p className="text-xl font-semibold text-gray-900">{metrics.activeBookings}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                      <Clock size={20} />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-sm font-medium text-gray-500">Avg. Booking Duration</h2>
                      <p className="text-xl font-semibold text-gray-900">
                        {data.bookings.length ? 
                          (data.bookings.reduce((sum, booking) => sum + (booking.total_hours || 0), 0) / data.bookings.length).toFixed(1) : 0} hrs
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-red-100 text-red-600">
                      <AlertTriangle size={20} />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-sm font-medium text-gray-500">Cancellation Rate</h2>
                      <p className="text-xl font-semibold text-gray-900">
                        {data.bookings.length ? 
                          ((metrics.cancelledBookings / metrics.totalBookings) * 100).toFixed(1) : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Booking status over time chart */}
              <div className="bg-white rounded-lg shadow p-4 border border-gray-100 mb-6">
                <h3 className="text-md font-medium text-gray-700 mb-4">Booking Status Over Time</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="completed" stroke="#00C49F" strokeWidth={2} />
                      <Line type="monotone" dataKey="cancelled" stroke="#FF8042" strokeWidth={2} />
                      <Line type="monotone" dataKey="booked" stroke="#0088FE" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Recent bookings table */}
              <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md font-medium text-gray-700">Recent Bookings</h3>
                  <button className="text-blue-500 text-sm hover:text-blue-700">View all</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.bookings.slice(0, 5).map((booking) => (
                        <tr key={booking.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{booking.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.user_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.car_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${booking.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                booking.status === 'booked' ? 'bg-blue-100 text-blue-800' : 
                                booking.status === 'picked' ? 'bg-purple-100 text-purple-800' : 
                                'bg-red-100 text-red-800'}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{booking.total_amount}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(booking.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cars' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Car Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600">
                      <Car size={20} />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-sm font-medium text-gray-500">Total Active Cars</h2>
                      <p className="text-xl font-semibold text-gray-900">
                        {data.cars.filter(car => car.is_visible).length}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                      <Award size={20} />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-sm font-medium text-gray-500">Avg. Car Rating</h2>
                      <p className="text-xl font-semibold text-gray-900">{metrics.averageCarRating.toFixed(1)}/5</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                      <FileText size={20} />
                    </div>
                    <div className="ml-4">
                        <h2 className="text-sm font-medium text-gray-500">Verification Rate</h2>
                      < p className="text-xl font-semibold text-gray-900">
                        {metrics.totalCars ? ((metrics.verifiedCars / metrics.totalCars) * 100).toFixed(1) : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Car analysis charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                  <h3 className="text-md font-medium text-gray-700 mb-4">Cars by Fuel Type</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={
                            ['petrol', 'cng', 'diesel', 'electric'].map(fuelType => ({
                              name: fuelType.charAt(0).toUpperCase() + fuelType.slice(1),
                              value: data.cars.filter(car => car.fuel_type === fuelType).length
                            }))
                          }
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {
                            ['petrol', 'cng', 'diesel', 'electric'].map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))
                          }
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                  <h3 className="text-md font-medium text-gray-700 mb-4">Cars by Transmission</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'Manual', count: data.cars.filter(car => car.transmission_type === 'manual').length },
                          { name: 'Automatic', count: data.cars.filter(car => car.transmission_type === 'automatic').length }
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" name="Number of Cars" fill="#00C49F" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Popular car models */}
              <div className="bg-white rounded-lg shadow p-4 border border-gray-100 mb-6">
                <h3 className="text-md font-medium text-gray-700 mb-4">Most Popular Car Models</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={
                        // Group cars by model and count them
                        Object.entries(
                          data.cars.reduce((acc, car) => {
                            const key = `${car.company_name} ${car.model_name}`;
                            acc[key] = (acc[key] || 0) + 1;
                            return acc;
                          }, {})
                        )
                          .map(([model, count]) => ({ model, count }))
                          .sort((a, b) => b.count - a.count)
                          .slice(0, 10)
                      }
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="model" type="category" tick={{ fontSize: 12 }} width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Number of Cars" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Car verification status */}
              <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md font-medium text-gray-700">Cars Pending Verification</h3>
                  <button className="text-blue-500 text-sm hover:text-blue-700">View all</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.cars
                        .filter(car => car.verification_status === 'pending' || car.verification_status === 'in_process')
                        .slice(0, 5)
                        .map((car) => (
                          <tr key={car.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{car.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{car.company_name} {car.model_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{car.owner_id}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${car.verification_status === 'in_process' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                                {car.verification_status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(car.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-900 mr-3">Review</button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">User Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600">
                      <User size={20} />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-sm font-medium text-gray-500">Regular Users</h2>
                      <p className="text-xl font-semibold text-gray-900">
                        {data.users.filter(user => user.user_type === 'user').length}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                      <Users size={20} />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-sm font-medium text-gray-500">Car Owners</h2>
                      <p className="text-xl font-semibold text-gray-900">{metrics.owners}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                      <Award size={20} />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-sm font-medium text-gray-500">Verified Users</h2>
                      <p className="text-xl font-semibold text-gray-900">{metrics.verifiedUsers}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* User growth chart */}
              <div className="bg-white rounded-lg shadow p-4 border border-gray-100 mb-6">
                <h3 className="text-md font-medium text-gray-700 mb-4">User Growth Over Time</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={prepareUserGrowthData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="users" name="New Users" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* User verification status */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                  <h3 className="text-md font-medium text-gray-700 mb-4">User Verification Status</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={
                            ['pending', 'in_process', 'approved', 'rejected'].map(status => ({
                              name: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
                              value: data.users.filter(user => user.verification_status === status).length
                            }))
                          }
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {
                            ['pending', 'in_process', 'approved', 'rejected'].map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))
                          }
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                  <h3 className="text-md font-medium text-gray-700 mb-4">User Types Distribution</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={
                          ['user', 'owner', 'admin', 'employee'].map(type => ({
                            name: type.charAt(0).toUpperCase() + type.slice(1),
                            count: data.users.filter(user => user.user_type === type).length
                          }))
                        }
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" name="Number of Users" fill="#00C49F" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              {/* Recent users */}
              <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md font-medium text-gray-700">Recent Users</h3>
                  <button className="text-blue-500 text-sm hover:text-blue-700">View all</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.users.slice(0, 5).map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{user.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.full_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.mobile_number}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${user.user_type === 'owner' ? 'bg-purple-100 text-purple-800' : 
                                user.user_type === 'admin' ? 'bg-red-100 text-red-800' : 
                                user.user_type === 'employee' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-green-100 text-green-800'}`}>
                              {user.user_type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${user.verification_status === 'approved' ? 'bg-green-100 text-green-800' : 
                                user.verification_status === 'pending' ? 'bg-blue-100 text-blue-800' : 
                                user.verification_status === 'in_process' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'}`}>
                              {user.verification_status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'financial' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600">
                      <CreditCard size={20} />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-sm font-medium text-gray-500">Total Revenue</h2>
                      <p className="text-xl font-semibold text-gray-900">₹{metrics.totalRevenue.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                      <RefreshCw size={20} />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-sm font-medium text-gray-500">Security Deposit</h2>
                      <p className="text-xl font-semibold text-gray-900">
                        ₹{data.payments.reduce((sum, payment) => sum + payment.security_deposit, 0).toLocaleString(undefined, {maximumFractionDigits: 0})}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-red-100 text-red-600">
                      <FileText size={20} />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-sm font-medium text-gray-500">Total Refunds</h2>
                      <p className="text-xl font-semibold text-gray-900">
                        ₹{data.refunds.reduce((sum, refund) => sum + (refund.refund_amount || 0), 0).toLocaleString(undefined, {maximumFractionDigits: 0})}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Monthly revenue chart */}
              <div className="bg-white rounded-lg shadow p-4 border border-gray-100 mb-6">
                <h3 className="text-md font-medium text-gray-700 mb-4">Revenue Trend</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={prepareRevenueData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#0088FE" activeDot={{ r: 8 }} strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Payment distribution and refund reason */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                  <h3 className="text-md font-medium text-gray-700 mb-4">Payment Status Distribution</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={
                            ['pending', 'paid', 'failed', 'refunded'].map(status => ({
                              name: status.charAt(0).toUpperCase() + status.slice(1),
                              value: data.payments.filter(payment => payment.status === status).length
                            }))
                          }
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {
                            ['pending', 'paid', 'failed', 'refunded'].map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))
                          }
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                  <h3 className="text-md font-medium text-gray-700 mb-4">Refund Reasons</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={
                          ['cancellation', 'refundable', 'cancelled_by_owner'].map(reason => ({
                            name: reason.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                            count: data.refunds.filter(refund => refund.reason === reason).length,
                            amount: data.refunds
                              .filter(refund => refund.reason === reason)
                              .reduce((sum, refund) => sum + (refund.refund_amount || 0), 0)
                          }))
                        }
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="count" name="Number of Refunds" fill="#8884d8" />
                        <Bar yAxisId="right" dataKey="amount" name="Refund Amount" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              {/* Recent transactions */}
              <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md font-medium text-gray-700">Recent Transactions</h3>
                  <button className="text-blue-500 text-sm hover:text-blue-700">View all</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[...data.payments]
                        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                        .slice(0, 5)
                        .map((payment) => (
                          <tr key={payment.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{payment.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.user_id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {payment.booking_id ? `#${payment.booking_id}` : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              Payment
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₹{payment.total_amount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${payment.status === 'paid' ? 'bg-green-100 text-green-800' : 
                                  payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                  payment.status === 'refunded' ? 'bg-blue-100 text-blue-800' : 
                                  'bg-red-100 text-red-800'}`}>
                                {payment.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(payment.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;