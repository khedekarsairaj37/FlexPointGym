import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Billing, Notification } from '../../types';
import { 
  Receipt, 
  Bell, 
  Calendar, 
  CreditCard, 
  Package,
  LogOut,
  Activity,
  Award,
  TrendingUp
} from 'lucide-react';
import { PACKAGE_PRICES } from '../../utils/constants';

export const MemberDashboard: React.FC = () => {
  const { logout, userProfile, currentUser } = useAuth();
  const [receipts, setReceipts] = useState<Billing[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'receipts' | 'notifications'>('overview');

  useEffect(() => {
    loadMemberData();
  }, [currentUser]);

  const loadMemberData = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      // Load receipts/billing history
      const billingsQuery = query(
        collection(db, 'billings'),
        where('memberId', '==', currentUser.email)
      );
      const billingsSnapshot = await getDocs(billingsQuery);
      const billingsData = billingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate(),
      })) as Billing[];
      setReceipts(billingsData);

      // Load notifications
      const notificationsQuery = query(
        collection(db, 'notifications'),
        where('userId', '==', currentUser.uid)
      );
      const notificationsSnapshot = await getDocs(notificationsQuery);
      const notificationsData = notificationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Notification[];
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error loading member data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPaid = receipts.filter(r => r.status === 'paid').reduce((sum, r) => sum + r.amount, 0);
  const pendingAmount = receipts.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-2 rounded-lg">
              <Activity className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Flex Point Gym - Member Portal</h1>
              <p className="text-sm text-slate-400">Welcome back, {userProfile?.name}!</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <CreditCard className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold text-white">₹{totalPaid.toLocaleString()}</span>
            </div>
            <p className="text-slate-400">Total Paid</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-yellow-500" />
              <span className="text-2xl font-bold text-white">₹{pendingAmount.toLocaleString()}</span>
            </div>
            <p className="text-slate-400">Pending Payments</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Receipt className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold text-white">{receipts.length}</span>
            </div>
            <p className="text-slate-400">Total Receipts</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Bell className="w-8 h-8 text-purple-500" />
              <span className="text-2xl font-bold text-white">{unreadNotifications}</span>
            </div>
            <p className="text-slate-400">Unread Notifications</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-2 mb-6 flex space-x-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'overview' ? 'bg-yellow-500 text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-5 h-5" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('receipts')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'receipts' ? 'bg-yellow-500 text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Receipt className="w-5 h-5" />
            <span>Payment History</span>
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'notifications' ? 'bg-yellow-500 text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
            {unreadNotifications > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {unreadNotifications}
              </span>
            )}
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Membership Status */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Membership Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Package className="w-8 h-8 text-yellow-500" />
                    <div>
                      <p className="text-slate-400 text-sm">Current Package</p>
                      <p className="text-white text-xl font-bold">Premium Member</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                    <span className="text-slate-400">Monthly Fee</span>
                    <span className="text-white font-semibold">₹2,500</span>
                  </div>
                </div>

                <div className="bg-slate-800 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Calendar className="w-8 h-8 text-green-500" />
                    <div>
                      <p className="text-slate-400 text-sm">Membership Validity</p>
                      <p className="text-white text-xl font-bold">Active</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                    <span className="text-slate-400">Valid Until</span>
                    <span className="text-white font-semibold">
                      {new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {receipts.slice(0, 3).map((receipt) => (
                  <div key={receipt.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-yellow-500/20 p-3 rounded-lg">
                        <Receipt className="w-6 h-6 text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">{receipt.description}</p>
                        <p className="text-slate-400 text-sm">
                          {new Date(receipt.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">₹{receipt.amount.toLocaleString()}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        receipt.status === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {receipt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Receipts Tab */}
        {activeTab === 'receipts' && (
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Payment History</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Description</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Amount</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {receipts.map((receipt) => (
                    <tr key={receipt.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                      <td className="py-3 px-4 text-slate-300">
                        {new Date(receipt.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-white">{receipt.description}</td>
                      <td className="py-3 px-4 text-white font-semibold">
                        ₹{receipt.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          receipt.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                          receipt.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {receipt.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-yellow-500 hover:text-yellow-400 text-sm font-semibold">
                          Download Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {receipts.length === 0 && (
                <div className="text-center py-12">
                  <Receipt className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-400">No payment history found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Notifications</h2>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${
                    notification.read
                      ? 'bg-slate-800/50 border-slate-700'
                      : 'bg-yellow-500/10 border-yellow-500/30'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <Bell className={`w-5 h-5 mt-0.5 ${
                      notification.type === 'success' ? 'text-green-500' :
                      notification.type === 'warning' ? 'text-yellow-500' :
                      notification.type === 'error' ? 'text-red-500' :
                      'text-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-white">{notification.message}</p>
                      <p className="text-slate-400 text-sm mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <span className="bg-yellow-500 text-slate-900 text-xs px-2 py-1 rounded-full font-semibold">
                        New
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {notifications.length === 0 && (
                <div className="text-center py-12">
                  <Bell className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-400">No notifications</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
