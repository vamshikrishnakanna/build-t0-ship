/**
 * client/src/pages/DashboardPage.jsx
 * Main hub showing farm stats, quick actions, and recent advisories.
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Tractor,
  Sparkles,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import useAuthStore from '../context/authStore';
import { farmsApi, advisoryApi } from '../services/api';
import { timeAgo, getSeasonEmoji, getSoilEmoji } from '../utils/formatters';
import { SkeletonCard, SkeletonList } from '../components/UI/LoadingSkeleton';
import ErrorMessage from '../components/UI/ErrorMessage';
import CreateFarmModal from '../components/Farm/CreateFarmModal';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [farms, setFarms] = useState([]);
  const [advisories, setAdvisories] = useState([]);
  const [isLoadingFarms, setIsLoadingFarms] = useState(true);
  const [isLoadingAdvisories, setIsLoadingAdvisories] = useState(true);
  const [farmsError, setFarmsError] = useState('');
  const [advisoriesError, setAdvisoriesError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  async function loadFarms() {
    setIsLoadingFarms(true);
    setFarmsError('');
    try {
      const res = await farmsApi.getAll();
      setFarms(res.data.farms);
    } catch {
      setFarmsError('Failed to load your farms.');
    } finally {
      setIsLoadingFarms(false);
    }
  }

  async function loadAdvisories() {
    setIsLoadingAdvisories(true);
    setAdvisoriesError('');
    try {
      const res = await advisoryApi.getAll();
      setAdvisories(res.data.advisories.slice(0, 5));
    } catch {
      setAdvisoriesError('Failed to load your advisories.');
    } finally {
      setIsLoadingAdvisories(false);
    }
  }

  useEffect(() => {
    loadFarms();
    loadAdvisories();
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome banner */}
      <div className="glass-card-green p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-brand-300 text-sm font-medium mb-1">{greeting()},</p>
            <h2 className="font-display font-bold text-2xl text-white">
              {user?.full_name || 'Farmer'} 👋
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {farms.length > 0
                ? `You have ${farms.length} farm profile${farms.length !== 1 ? 's' : ''} and ${advisories.length} recent advisor${advisories.length !== 1 ? 'ies' : 'y'}.`
                : "Let's set up your first farm profile to get started."}
            </p>
          </div>
          <Link to="/advisory/request" className="btn-primary">
            <Sparkles size={15} />
            Generate Advisory
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'Farm Profiles',
            value: isLoadingFarms ? '—' : farms.length,
            icon: Tractor,
            color: 'text-brand-400 bg-brand-500/10',
            href: '/farms',
          },
          {
            label: 'Advisories Generated',
            value: isLoadingAdvisories ? '—' : advisories.length,
            icon: Sparkles,
            color: 'text-earth-400 bg-earth-500/10',
            href: '/advisory/request',
          },
          {
            label: 'Latest Activity',
            value: advisories[0] ? timeAgo(advisories[0].created_at) : '—',
            icon: Clock,
            color: 'text-blue-400 bg-blue-500/10',
            href: '#',
          },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Farms section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-white flex items-center gap-2">
              <Tractor size={16} className="text-brand-400" />
              My Farms
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                <Plus size={13} />
                Add Farm
              </button>
              <Link to="/farms" className="btn-secondary text-xs py-1.5 px-3">
                View All
              </Link>
            </div>
          </div>

          {isLoadingFarms ? (
            <SkeletonList count={2} />
          ) : farmsError ? (
            <ErrorMessage message={farmsError} onRetry={loadFarms} />
          ) : farms.length === 0 ? (
            <div
              onClick={() => setShowCreateModal(true)}
              className="glass-card p-8 text-center cursor-pointer hover:border-brand-500/20 transition-all border-dashed border-2 border-white/5"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto mb-3">
                <Plus size={20} className="text-brand-400" />
              </div>
              <p className="text-gray-400 text-sm">No farms yet.</p>
              <p className="text-gray-500 text-xs mt-1">Click to add your first farm profile.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {farms.slice(0, 3).map((farm) => (
                <div key={farm.id} className="glass-card p-4 flex items-center gap-4">
                  <span className="text-2xl">{getSoilEmoji(farm.soil_type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-200 truncate">{farm.name}</p>
                    <p className="text-xs text-gray-500 truncate">{farm.location} · pH {farm.ph_level}</p>
                  </div>
                  <span className="badge-green text-[10px] shrink-0">{farm.soil_type}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Advisories */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-white flex items-center gap-2">
              <TrendingUp size={16} className="text-earth-400" />
              Recent Advisories
            </h3>
            <Link to="/advisory/request" className="btn-secondary text-xs py-1.5 px-3">
              <Sparkles size={13} />
              New
            </Link>
          </div>

          {isLoadingAdvisories ? (
            <SkeletonList count={2} />
          ) : advisoriesError ? (
            <ErrorMessage message={advisoriesError} onRetry={loadAdvisories} />
          ) : advisories.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <div className="w-12 h-12 rounded-2xl bg-earth-500/10 flex items-center justify-center mx-auto mb-3">
                <Sparkles size={20} className="text-earth-400" />
              </div>
              <p className="text-gray-400 text-sm">No advisories yet.</p>
              <p className="text-gray-500 text-xs mt-1">Generate your first AI advisory above.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {advisories.map((advisory) => (
                <Link
                  key={advisory.id}
                  to={`/advisory/${advisory.id}`}
                  className="glass-card p-4 flex items-center gap-4 hover:border-earth-500/20 transition-all group"
                >
                  <span className="text-2xl">{getSeasonEmoji(advisory.season)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-200 truncate">{advisory.farm_name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {advisory.season} · {advisory.farm_location}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 group-hover:text-gray-300 transition-colors shrink-0">
                    <span className="text-xs">{timeAgo(advisory.created_at)}</span>
                    <ArrowRight size={13} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Farm Modal */}
      <CreateFarmModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={(newFarm) => setFarms((prev) => [newFarm, ...prev])}
      />
    </div>
  );
}
