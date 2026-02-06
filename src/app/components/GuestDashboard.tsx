import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Member } from '../../types';
import { 
  Search, 
  Users, 
  LogOut,
  Eye,
  Package,
  Calendar,
  Phone,
  Mail,
  Filter
} from 'lucide-react';

export const GuestDashboard: React.FC = () => {
  const { logout, userProfile } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPackage, setFilterPackage] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const membersSnapshot = await getDocs(collection(db, 'members'));
      const membersData = membersSnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data(),
        joinDate: doc.data().joinDate?.toDate(),
        expiryDate: doc.data().expiryDate?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Member[];
      setMembers(membersData);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPackage = filterPackage === 'all' || member.package === filterPackage;

    return matchesSearch && matchesPackage;
  });

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
              <h1 className="text-xl font-bold text-white">Flex Point Gym - Guest Access</h1>
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold text-white">{members.length}</span>
            </div>
            <p className="text-slate-400">Total Members</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold text-white">
                {members.filter(m => m.status === 'active').length}
              </span>
            </div>
            <p className="text-slate-400">Active Members</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Eye className="w-8 h-8 text-purple-500" />
              <span className="text-2xl font-bold text-white">
                {members.filter(m => m.package === 'Elite' || m.package === 'Pro').length}
              </span>
            </div>
            <p className="text-slate-400">Premium Members</p>
          </div>
        </div>

        {/* Member Directory */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Member Directory</h2>
            <div className="flex items-center space-x-2 text-slate-400">
              <Eye className="w-5 h-5" />
              <span className="text-sm">Limited Access</span>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={filterPackage}
                onChange={(e) => setFilterPackage(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="all">All Packages</option>
                <option value="Elite">Elite</option>
                <option value="Pro">Pro</option>
                <option value="Basic">Basic</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <div
                key={member.uid}
                className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-yellow-500/50 transition-colors"
              >
                {/* Member Avatar */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-slate-900">
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{member.name}</h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      member.package === 'Elite' ? 'bg-purple-500/20 text-purple-400' :
                      member.package === 'Pro' ? 'bg-blue-500/20 text-blue-400' :
                      member.package === 'Basic' ? 'bg-green-500/20 text-green-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {member.package}
                    </span>
                  </div>
                </div>

                {/* Member Details */}
                <div className="space-y-2 border-t border-slate-700 pt-4">
                  <div className="flex items-center space-x-2 text-slate-400 text-sm">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center space-x-2 text-slate-400 text-sm">
                      <Phone className="w-4 h-4" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-slate-400 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>Joined: {new Date(member.joinDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      member.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {member.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400">No members found</p>
            </div>
          )}
        </div>

        {/* Access Notice */}
        <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <Eye className="w-6 h-6 text-yellow-500 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Limited Guest Access</h3>
              <p className="text-slate-400 text-sm">
                As a guest user, you have read-only access to the member directory. 
                Some sensitive information like personal contact details and payment information are restricted.
                To access full features, please contact the administrator for a membership upgrade.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
