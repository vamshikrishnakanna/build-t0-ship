/**
 * client/src/pages/AdvisoryRequestPage.jsx
 * The core AI generation interface.
 * Users select a farm profile, target season, and budget tier,
 * then trigger Gemini AI to generate a structured advisory.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Loader2,
  ChevronDown,
  Tractor,
  Check,
} from 'lucide-react';
import { farmsApi, advisoryApi } from '../services/api';
import { getSoilEmoji } from '../utils/formatters';

const SEASONS = ['Spring', 'Summer', 'Fall', 'Winter', 'Kharif', 'Rabi', 'Zaid'];
const BUDGET_TIERS = ['Low', 'Medium', 'High'];

const LOADING_MESSAGES = [
  '🌱 Analyzing soil composition...',
  '🌤️ Evaluating climate patterns...',
  '🔬 Cross-referencing crop databases...',
  '📊 Calculating suitability scores...',
  '🤖 Generating AI recommendations...',
  '✅ Finalizing your advisory...',
];

export default function AdvisoryRequestPage() {
  const navigate = useNavigate();
  const [farms, setFarms] = useState([]);
  const [isLoadingFarms, setIsLoadingFarms] = useState(true);

  const [formData, setFormData] = useState({
    farm_id: '',
    season: '',
    budget_tier: '',
  });
  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [serverError, setServerError] = useState('');
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);

  useEffect(() => {
    async function loadFarms() {
      try {
        const res = await farmsApi.getAll();
        setFarms(res.data.farms);
      } catch {
        setServerError('Could not load your farms. Please try again.');
      } finally {
        setIsLoadingFarms(false);
      }
    }
    loadFarms();
  }, []);

  // Cycle loading messages during AI generation
  useEffect(() => {
    if (!isGenerating) return;
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % LOADING_MESSAGES.length;
      setLoadingMessage(LOADING_MESSAGES[idx]);
    }, 3500);
    return () => clearInterval(interval);
  }, [isGenerating]);

  function validate() {
    const newErrors = {};
    if (!formData.farm_id) newErrors.farm_id = 'Please select a farm profile.';
    if (!formData.season) newErrors.season = 'Please select a target season.';
    if (!formData.budget_tier) newErrors.budget_tier = 'Please select a budget tier.';
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsGenerating(true);
    setServerError('');
    setLoadingMessage(LOADING_MESSAGES[0]);

    try {
      const response = await advisoryApi.generate(formData);
      const advisoryId = response.data.advisory.id;
      navigate(`/advisory/${advisoryId}`);
    } catch (err) {
      setServerError(
        err.response?.data?.error ||
          'Failed to generate advisory. The AI may be temporarily unavailable. Please try again.'
      );
      setIsGenerating(false);
    }
  }

  const selectedFarm = farms.find((f) => f.id === formData.farm_id);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header card */}
      <div className="glass-card-green p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-brand-600/30 border border-brand-500/30 flex items-center justify-center shrink-0">
            <Sparkles size={20} className="text-brand-400" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-white">AI Crop Advisory Generator</h2>
            <p className="text-gray-400 text-sm mt-1 leading-relaxed">
              Select your farm profile and growing context. Our Gemini AI will analyze your soil
              conditions and generate a comprehensive advisory with top crop picks, fertilizer
              schedules, and pest management strategies.
            </p>
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {isGenerating && (
        <div className="glass-card p-10 text-center mb-6 animate-fade-in">
          <div className="relative inline-flex mb-6">
            <div className="w-20 h-20 rounded-full bg-brand-600/20 flex items-center justify-center">
              <Sparkles size={32} className="text-brand-400 animate-pulse" />
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-brand-500/30 border-t-brand-500 animate-spin" />
          </div>
          <h3 className="font-display font-semibold text-white text-lg mb-2">
            Generating Your Advisory
          </h3>
          <p className="text-sm text-brand-300 transition-all duration-500 mb-4">
            {loadingMessage}
          </p>
          <p className="text-xs text-gray-600">
            This typically takes 15–30 seconds. Please don't close this page.
          </p>
        </div>
      )}

      {/* Form */}
      {!isGenerating && (
        <div className="glass-card p-6 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Farm Selection */}
            <div>
              <label className="input-label">Select Farm Profile</label>
              {isLoadingFarms ? (
                <div className="skeleton h-12 rounded-xl" />
              ) : farms.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 p-4 text-center">
                  <p className="text-sm text-gray-500">No farm profiles found.</p>
                  <a href="/farms" className="text-xs text-brand-400 hover:underline mt-1 block">
                    Create a farm profile first →
                  </a>
                </div>
              ) : (
                <div className="space-y-2">
                  {farms.map((farm) => (
                    <button
                      key={farm.id}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, farm_id: farm.id }));
                        if (errors.farm_id) setErrors((prev) => ({ ...prev, farm_id: '' }));
                      }}
                      className={`w-full flex items-center gap-4 rounded-xl border p-4 transition-all duration-200 text-left ${
                        formData.farm_id === farm.id
                          ? 'border-brand-500/50 bg-brand-950/40'
                          : 'border-white/8 bg-white/[0.03] hover:border-white/15'
                      }`}
                    >
                      <span className="text-2xl">{getSoilEmoji(farm.soil_type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-200">{farm.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {farm.location} · {farm.soil_type} · pH {farm.ph_level}
                        </p>
                      </div>
                      {formData.farm_id === farm.id && (
                        <div className="w-5 h-5 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
                          <Check size={11} className="text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
              {errors.farm_id && <p className="text-xs text-red-400 mt-1">{errors.farm_id}</p>}
            </div>

            {/* Season & Budget in a row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="advisory-season" className="input-label">Target Season</label>
                <select
                  id="advisory-season"
                  value={formData.season}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, season: e.target.value }));
                    if (errors.season) setErrors((prev) => ({ ...prev, season: '' }));
                  }}
                  className="input-field"
                >
                  <option value="">Select season</option>
                  {SEASONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.season && <p className="text-xs text-red-400 mt-1">{errors.season}</p>}
              </div>

              <div>
                <label htmlFor="advisory-budget" className="input-label">Budget per Acre</label>
                <select
                  id="advisory-budget"
                  value={formData.budget_tier}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, budget_tier: e.target.value }));
                    if (errors.budget_tier) setErrors((prev) => ({ ...prev, budget_tier: '' }));
                  }}
                  className="input-field"
                >
                  <option value="">Select budget</option>
                  {BUDGET_TIERS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                {errors.budget_tier && <p className="text-xs text-red-400 mt-1">{errors.budget_tier}</p>}
              </div>
            </div>

            {/* Preview of selected farm */}
            {selectedFarm && formData.season && formData.budget_tier && (
              <div className="rounded-xl border border-brand-500/20 bg-brand-950/30 p-4 animate-slide-up">
                <p className="text-xs font-medium text-brand-300 mb-2">Advisory Preview</p>
                <p className="text-sm text-gray-300">
                  AI will analyze{' '}
                  <span className="text-white font-medium">{selectedFarm.name}</span>'s{' '}
                  <span className="text-white font-medium">{selectedFarm.soil_type}</span> soil
                  (pH {selectedFarm.ph_level}) with{' '}
                  <span className="text-white font-medium">{selectedFarm.irrigation_type}</span>{' '}
                  irrigation for the{' '}
                  <span className="text-white font-medium">{formData.season}</span> season on a{' '}
                  <span className="text-white font-medium">{formData.budget_tier}</span> budget.
                </p>
              </div>
            )}

            {/* Server error */}
            {serverError && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
                <p className="text-sm text-red-400">{serverError}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isGenerating || farms.length === 0}
              className="btn-primary w-full py-3.5 text-base"
              id="generate-advisory-btn"
            >
              <Sparkles size={17} />
              Generate AI Advisory
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
