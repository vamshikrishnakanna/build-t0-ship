/**
 * client/src/pages/FarmsPage.jsx
 * Full farm management page with grid of farm cards and add/delete functionality.
 */

import { useEffect, useState } from 'react';
import { Plus, Tractor } from 'lucide-react';
import { farmsApi } from '../services/api';
import FarmCard from '../components/Farm/FarmCard';
import CreateFarmModal from '../components/Farm/CreateFarmModal';
import { SkeletonCard } from '../components/UI/LoadingSkeleton';
import ErrorMessage from '../components/UI/ErrorMessage';

export default function FarmsPage() {
  const [farms, setFarms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  async function loadFarms() {
    setIsLoading(true);
    setError('');
    try {
      const res = await farmsApi.getAll();
      setFarms(res.data.farms);
    } catch {
      setError('Failed to load farm profiles. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadFarms();
  }, []);

  async function handleDelete(farmId) {
    if (!confirm('Are you sure you want to delete this farm? This will also remove all associated advisories.')) {
      return;
    }
    setDeletingId(farmId);
    try {
      await farmsApi.delete(farmId);
      setFarms((prev) => prev.filter((f) => f.id !== farmId));
    } catch {
      alert('Failed to delete farm. Please try again.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-500 text-sm">
            {farms.length} farm profile{farms.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={15} />
          Add Farm Profile
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <ErrorMessage message={error} onRetry={loadFarms} />
      ) : farms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-4">
            <Tractor size={28} className="text-brand-400" />
          </div>
          <h3 className="font-display font-semibold text-white text-lg mb-2">No farms yet</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-xs">
            Create your first farm profile to start receiving AI-powered crop recommendations.
          </p>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus size={15} />
            Create First Farm
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {farms.map((farm) => (
            <div key={farm.id} className={deletingId === farm.id ? 'opacity-50 pointer-events-none' : ''}>
              <FarmCard farm={farm} onDelete={handleDelete} />
            </div>
          ))}

          {/* Add more card */}
          <button
            onClick={() => setShowModal(true)}
            className="glass-card p-5 flex flex-col items-center justify-center gap-3 border-dashed border-2 border-white/5 hover:border-brand-500/20 transition-all min-h-[200px] group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center group-hover:bg-brand-500/20 transition-colors">
              <Plus size={18} className="text-brand-400" />
            </div>
            <p className="text-sm text-gray-500 group-hover:text-gray-300 transition-colors">
              Add another farm
            </p>
          </button>
        </div>
      )}

      <CreateFarmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={(newFarm) => {
          setFarms((prev) => [newFarm, ...prev]);
          setShowModal(false);
        }}
      />
    </div>
  );
}
