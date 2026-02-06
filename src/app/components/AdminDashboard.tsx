import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Member, Billing, Supplement, DietPlan, PackageType, MemberStatus } from '../../types';
import { 
  Users, 
  DollarSign, 
  Package, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2,
  Search,
  ShoppingCart,
  UtensilsCrossed,
  LogOut,
  BarChart3,
  FileText,
  Database
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { PACKAGE_PRICES, PACKAGE_DURATION } from '../../utils/constants';
import { createDemoData } from '../../utils/demoData';

export const AdminDashboard: React.FC = () => {
  const { logout, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'members' | 'billing' | 'supplements' | 'diet' | 'reports'>('members');
  const [members, setMembers] = useState<Member[]>([]);
  const [billings, setBillings] = useState<Billing[]>([]);
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creatingDemo, setCreatingDemo] = useState(false);

  // Member form state
  const [memberForm, setMemberForm] = useState<Partial<Member>>({
    name: '',
    email: '',
    phone: '',
    package: 'Pending',
    status: 'new',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load members
      const membersSnapshot = await getDocs(collection(db, 'members'));
      const membersData = membersSnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data(),
        joinDate: doc.data().joinDate?.toDate(),
        expiryDate: doc.data().expiryDate?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Member[];
      setMembers(membersData);

      // Load billings
      const billingsSnapshot = await getDocs(collection(db, 'billings'));
      const billingsData = billingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate(),
      })) as Billing[];
      setBillings(billingsData);

      // Load supplements
      const supplementsSnapshot = await getDocs(collection(db, 'supplements'));
      const supplementsData = supplementsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Supplement[];
      setSupplements(supplementsData);

      // Load diet plans
      const dietSnapshot = await getDocs(collection(db, 'dietPlans'));
      const dietData = dietSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as DietPlan[];
      setDietPlans(dietData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    try {
      const newMember = {
        ...memberForm,
        joinDate: new Date(),
        expiryDate: memberForm.package !== 'Pending' && memberForm.package !== 'Free' 
          ? new Date(Date.now() + PACKAGE_DURATION[memberForm.package as PackageType] * 24 * 60 * 60 * 1000)
          : null,
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'members'), newMember);

      // Create initial billing if package is selected
      if (memberForm.package !== 'Pending' && memberForm.package !== 'Free') {
        await addDoc(collection(db, 'billings'), {
          memberId: memberForm.email,
          memberName: memberForm.name,
          amount: PACKAGE_PRICES[memberForm.package as PackageType],
          currency: 'INR',
          status: 'pending',
          date: new Date(),
          packageType: memberForm.package,
          description: `${memberForm.package} Package - Registration Fee`,
        });
      }

      setShowAddModal(false);
      setMemberForm({ name: '', email: '', phone: '', package: 'Pending', status: 'new' });
      loadData();
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleDeleteMember = async (uid: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await deleteDoc(doc(db, 'members', uid));
        loadData();
      } catch (error) {
        console.error('Error deleting member:', error);
      }
    }
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalMembers: members.length,
    activeMembers: members.filter(m => m.status === 'active').length,
    totalRevenue: billings.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.amount, 0),
    pendingPayments: billings.filter(b => b.status === 'pending').length,
  };

  const handleCreateDemoData = async () => {
    if (window.confirm('This will add demo members, billings, supplements, and diet plans to your database. Continue?')) {
      setCreatingDemo(true);
      try {
        const result = await createDemoData();
        if (result.success) {
          alert('Demo data created successfully! Refreshing...');
          loadData();
        } else {
          alert('Failed to create demo data. Check console for details.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error creating demo data');
      } finally {
        setCreatingDemo(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-2 rounded-lg">
              <Users className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Flex Point Gym - Admin</h1>
              <p className="text-sm text-slate-400">Welcome, {userProfile?.name}</p>
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

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold text-white">{stats.totalMembers}</span>
            </div>
            <p className="text-slate-400">Total Members</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold text-white">{stats.activeMembers}</span>
            </div>
            <p className="text-slate-400">Active Members</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-yellow-500" />
              <span className="text-2xl font-bold text-white">₹{stats.totalRevenue.toLocaleString()}</span>
            </div>
            <p className="text-slate-400">Total Revenue</p>
          </div>

          <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-8 h-8 text-red-500" />
              <span className="text-2xl font-bold text-white">{stats.pendingPayments}</span>
            </div>
            <p className="text-slate-400">Pending Payments</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-2 mb-6 flex space-x-2">
          <button
            onClick={() => setActiveTab('members')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'members' ? 'bg-yellow-500 text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Members</span>
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'billing' ? 'bg-yellow-500 text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-5 h-5" />
            <span>Billing</span>
          </button>
          <button
            onClick={() => setActiveTab('supplements')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'supplements' ? 'bg-yellow-500 text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Supplements</span>
          </button>
          <button
            onClick={() => setActiveTab('diet')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'diet' ? 'bg-yellow-500 text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UtensilsCrossed className="w-5 h-5" />
            <span>Diet Plans</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'reports' ? 'bg-yellow-500 text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Reports</span>
          </button>
          <button
            onClick={handleCreateDemoData}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              creatingDemo ? 'bg-gray-500 text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-5 h-5" />
            <span>Create Demo Data</span>
          </button>
        </div>

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Member Management</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-slate-900 rounded-lg font-semibold transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Add Member</span>
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search members by name or email..."
                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            {/* Members Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Package</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Expiry</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.uid} className="border-b border-slate-800 hover:bg-slate-800/50">
                      <td className="py-3 px-4 text-white">{member.name}</td>
                      <td className="py-3 px-4 text-slate-300">{member.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          member.package === 'Elite' ? 'bg-purple-500/20 text-purple-400' :
                          member.package === 'Pro' ? 'bg-blue-500/20 text-blue-400' :
                          member.package === 'Basic' ? 'bg-green-500/20 text-green-400' :
                          'bg-slate-500/20 text-slate-400'
                        }`}>
                          {member.package}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          member.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {member.expiryDate ? new Date(member.expiryDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button className="p-2 hover:bg-slate-700 rounded-lg text-blue-400 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteMember(member.uid)}
                            className="p-2 hover:bg-slate-700 rounded-lg text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && (
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Billing & Payments</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Member</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Description</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Amount</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {billings.map((billing) => (
                    <tr key={billing.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                      <td className="py-3 px-4 text-slate-300">
                        {new Date(billing.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-white">{billing.memberName}</td>
                      <td className="py-3 px-4 text-slate-300">{billing.description}</td>
                      <td className="py-3 px-4 text-white font-semibold">₹{billing.amount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          billing.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                          billing.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {billing.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Analytics & Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Package Distribution</h3>
                {['Elite', 'Pro', 'Basic', 'Pending'].map(pkg => {
                  const count = members.filter(m => m.package === pkg).length;
                  const percentage = members.length > 0 ? (count / members.length * 100).toFixed(1) : 0;
                  return (
                    <div key={pkg} className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300">{pkg}</span>
                        <span className="text-white font-semibold">{count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Revenue Breakdown</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-slate-400 mb-1">Total Paid</p>
                    <p className="text-2xl font-bold text-green-400">
                      ₹{billings.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.amount, 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-1">Pending Collection</p>
                    <p className="text-2xl font-bold text-yellow-400">
                      ₹{billings.filter(b => b.status === 'pending').reduce((sum, b) => sum + b.amount, 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-1">Overdue</p>
                    <p className="text-2xl font-bold text-red-400">
                      ₹{billings.filter(b => b.status === 'overdue').reduce((sum, b) => sum + b.amount, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Supplements Tab */}
        {activeTab === 'supplements' && (
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Supplement Store</h2>
              <button className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-slate-900 rounded-lg font-semibold transition-colors">
                <Plus className="w-5 h-5" />
                <span>Add Supplement</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {supplements.map((supplement) => (
                <div key={supplement.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">{supplement.name}</h3>
                    <div className="flex space-x-1">
                      <button className="p-2 hover:bg-slate-700 rounded-lg text-blue-400 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-slate-700 rounded-lg text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">{supplement.description}</p>
                  <div className="space-y-2 border-t border-slate-700 pt-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Price</span>
                      <span className="text-white font-semibold">₹{supplement.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Stock</span>
                      <span className={`font-semibold ${supplement.stock > 20 ? 'text-green-400' : supplement.stock > 10 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {supplement.stock} units
                      </span>
                    </div>
                    {supplement.category && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Category</span>
                        <span className="text-white">{supplement.category}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {supplements.length === 0 && (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-400">No supplements in store</p>
              </div>
            )}
          </div>
        )}

        {/* Diet Plans Tab */}
        {activeTab === 'diet' && (
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Diet Plan Management</h2>
              <button className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-slate-900 rounded-lg font-semibold transition-colors">
                <Plus className="w-5 h-5" />
                <span>Create Diet Plan</span>
              </button>
            </div>

            <div className="space-y-4">
              {dietPlans.map((plan) => (
                <div key={plan.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{plan.memberName}</h3>
                      <p className="text-slate-400 text-sm">{plan.plan}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 hover:bg-slate-700 rounded-lg text-blue-400 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-slate-700 rounded-lg text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-slate-900 rounded-lg p-3">
                      <p className="text-slate-400 text-xs mb-1">Calories</p>
                      <p className="text-white font-semibold">{plan.calories} kcal</p>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-3">
                      <p className="text-slate-400 text-xs mb-1">Protein</p>
                      <p className="text-white font-semibold">{plan.protein}g</p>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-3">
                      <p className="text-slate-400 text-xs mb-1">Carbs</p>
                      <p className="text-white font-semibold">{plan.carbs}g</p>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-3">
                      <p className="text-slate-400 text-xs mb-1">Fats</p>
                      <p className="text-white font-semibold">{plan.fats}g</p>
                    </div>
                  </div>

                  {plan.notes && (
                    <div className="border-t border-slate-700 pt-4">
                      <p className="text-slate-400 text-sm">{plan.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {dietPlans.length === 0 && (
              <div className="text-center py-12">
                <UtensilsCrossed className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-400">No diet plans created yet</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-6">Add New Member</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                <input
                  type="text"
                  value={memberForm.name}
                  onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  value={memberForm.email}
                  onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
                <input
                  type="tel"
                  value={memberForm.phone}
                  onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Package</label>
                <select
                  value={memberForm.package}
                  onChange={(e) => setMemberForm({ ...memberForm, package: e.target.value as PackageType })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Basic">Basic - ₹1,500/month</option>
                  <option value="Pro">Pro - ₹2,500/3 months</option>
                  <option value="Elite">Elite - ₹4,000/6 months</option>
                </select>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleAddMember}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold py-2 rounded-lg transition-colors"
                >
                  Add Member
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};