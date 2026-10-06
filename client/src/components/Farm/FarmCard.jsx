/**
 * client/src/components/Farm/FarmCard.jsx
 * Card component displaying a single farm profile's details.
 */

import { MapPin, Droplets, FlaskConical, Trash2 } from 'lucide-react';
import { formatDate, getSoilEmoji } from '../../utils/formatters';

export default function FarmCard({ farm, onDelete }) {
  const phColor =
    farm.ph_level < 6 ? 'text-red-400' : farm.ph_level > 7.5 ? 'text-blue-400' : 'text-brand-400';

  return (
    <div className="glass-card p-5 group hover:border-brand-500/20 transition-all duration-300 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getSoilEmoji(farm.soil_type)}</span>
          <div>
            <h3 className="font-semibold text-gray-100 text-sm">{farm.name}</h3>
            <div className="flex items-center gap-1 mt-0.5 text-gray-500">
              <MapPin size={11} />
              <span className="text-xs">{farm.location}</span>
            </div>
          </div>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(farm.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10"
            title="Delete farm"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="rounded-lg bg-white/[0.03] border border-white/5 p-2.5 text-center">
          <span className={`block text-sm font-bold ${phColor}`}>{farm.ph_level}</span>
          <span className="text-[10px] text-gray-500 mt-0.5">pH Level</span>
        </div>
        <div className="rounded-lg bg-white/[0.03] border border-white/5 p-2.5 text-center">
          <span className="block text-xs font-semibold text-gray-300 truncate">{farm.soil_type}</span>
          <span className="text-[10px] text-gray-500 mt-0.5">Soil Type</span>
        </div>
        <div className="rounded-lg bg-white/[0.03] border border-white/5 p-2.5 text-center">
          <span className="block text-xs font-semibold text-gray-300 truncate">{farm.irrigation_type}</span>
          <span className="text-[10px] text-gray-500 mt-0.5">Irrigation</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {farm.acreage && (
          <span className="text-xs text-gray-500">{farm.acreage} acres</span>
        )}
        <span className="text-xs text-gray-600 ml-auto">
          Added {formatDate(farm.created_at)}
        </span>
      </div>
    </div>
  );
}
