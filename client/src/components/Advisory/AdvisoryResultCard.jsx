/**
 * client/src/components/Advisory/AdvisoryResultCard.jsx
 * Renders the structured AI advisory JSON as a rich, beautiful UI.
 * Displays crop cards with suitability scores, fertilizer timeline,
 * and pest risk badges.
 */

import { useState, useEffect } from 'react';
import {
  Sprout,
  Calendar,
  Bug,
  TrendingUp,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { getScoreColor, getSeasonEmoji, formatDate } from '../../utils/formatters';

/**
 * Animated progress bar for suitability scores.
 */
function SuitabilityBar({ score }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(score), 200);
    return () => clearTimeout(timer);
  }, [score]);

  const color =
    score >= 80
      ? 'from-brand-600 to-brand-400'
      : score >= 60
      ? 'from-earth-600 to-earth-400'
      : 'from-red-700 to-red-500';

  return (
    <div className="progress-bar-track">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-1000 ease-out`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

/**
 * Individual crop recommendation card.
 */
function CropCard({ crop, rank }) {
  const [expanded, setExpanded] = useState(rank === 1);

  const rankColors = {
    1: 'border-brand-500/40 bg-brand-950/40',
    2: 'border-earth-500/30 bg-earth-950/20',
    3: 'border-white/10 bg-white/[0.03]',
  };

  const rankBadge = {
    1: { label: '#1 Best Match', class: 'badge-green' },
    2: { label: '#2 Good Match', class: 'badge-yellow' },
    3: { label: '#3 Viable', class: 'badge-red' },
  };

  return (
    <div className={`rounded-xl border p-4 transition-all duration-300 ${rankColors[rank] || 'border-white/10'}`}>
      {/* Crop header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`badge ${rankBadge[rank]?.class}`}>
              <Award size={10} />
              {rankBadge[rank]?.label}
            </span>
          </div>
          <h4 className="font-display font-semibold text-white text-base">
            🌾 {crop.crop_name}
          </h4>
        </div>
        <div className="text-right shrink-0 ml-4">
          <span className={`text-2xl font-bold font-display ${getScoreColor(crop.suitability_score)}`}>
            {crop.suitability_score}
          </span>
          <span className="text-xs text-gray-500 block">/ 100</span>
        </div>
      </div>

      {/* Score bar */}
      <SuitabilityBar score={crop.suitability_score} />

      {/* Yield */}
      <div className="flex items-center gap-1.5 mt-3 mb-2">
        <TrendingUp size={12} className="text-brand-400" />
        <span className="text-xs text-gray-400">
          Expected yield: <span className="text-gray-200 font-medium">{crop.expected_yield_per_acre}</span>
        </span>
      </div>

      {/* Reasoning — expandable */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors mt-1"
      >
        {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        {expanded ? 'Hide' : 'View'} reasoning
      </button>
      {expanded && (
        <p className="text-xs text-gray-400 mt-2 leading-relaxed border-t border-white/5 pt-2">
          {crop.reasoning}
        </p>
      )}
    </div>
  );
}

/**
 * Main advisory result card component.
 * @param {{ advisory: object }} props
 */
export default function AdvisoryResultCard({ advisory }) {
  const { season, budget_tier, farm_name, farm_location, created_at } = advisory;
  const rec = typeof advisory.ai_recommendation === 'string'
    ? JSON.parse(advisory.ai_recommendation)
    : (advisory.ai_recommendation || {});

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="glass-card p-5">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-green">{getSeasonEmoji(season)} {season} Season</span>
              <span className="badge-yellow">💰 {budget_tier} Budget</span>
            </div>
            <h2 className="font-display font-bold text-xl text-white">{farm_name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">📍 {farm_location}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Generated</p>
            <p className="text-sm text-gray-300 font-medium">{formatDate(created_at)}</p>
          </div>
        </div>
      </div>

      {/* Crop Recommendations */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sprout size={16} className="text-brand-400" />
          <h3 className="font-display font-semibold text-white">Recommended Crops</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rec.recommended_crops.map((crop, idx) => (
            <CropCard key={crop.crop_name} crop={crop} rank={idx + 1} />
          ))}
        </div>
      </div>

      {/* Fertilizer Schedule */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={16} className="text-earth-400" />
          <h3 className="font-display font-semibold text-white">Fertilizer Schedule</h3>
        </div>
        <div className="glass-card p-5">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-500/50 via-earth-500/30 to-transparent" />

            <div className="space-y-5">
              {rec.fertilizer_schedule.map((item, idx) => (
                <div key={idx} className="flex gap-5 pl-10 relative">
                  {/* Timeline dot */}
                  <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-brand-600 border-2 border-brand-400 flex items-center justify-center shrink-0">
                    <span className="text-[8px] font-bold text-white">{idx + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-earth-300">{item.phase}</p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{item.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pest Risks */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Bug size={16} className="text-red-400" />
          <h3 className="font-display font-semibold text-white">Pest Risk Factors</h3>
        </div>
        <div className="glass-card p-5">
          <div className="flex flex-wrap gap-2">
            {rec.pest_risks.map((pest, idx) => (
              <span
                key={idx}
                className="badge-red py-1.5 px-3 text-sm"
              >
                🐛 {pest}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4 border-t border-white/5 pt-3">
            ⚠️ Monitor these risks closely during the growing season. Consult a local agronomist for specific pesticide recommendations.
          </p>
        </div>
      </div>
    </div>
  );
}
