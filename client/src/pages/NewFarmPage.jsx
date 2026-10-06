/**
 * client/src/pages/NewFarmPage.jsx
 * Dedicated page for creating a new farm profile (Route: /farms/new).
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Tractor, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { z } from 'zod';
import { farmsApi } from '../services/api';

const SOIL_TYPES = ['Clay', 'Sandy', 'Loamy', 'Silt'];
const IRRIGATION_TYPES = ['Rainfed', 'Drip', 'Sprinkler'];

const FarmSchema = z.object({
  name: z.string().min(2, 'Farm name must be at least 2 characters').max(100),
  location: z.string().min(3, 'Location must be at least 3 characters').max(255),
  soil_type: z.enum(SOIL_TYPES, { errorMap: () => ({ message: 'Please select a soil type' }) }),
  ph_level: z.number({ invalid_type_error: 'pH must be a number' }).min(1, 'pH must be between 1 and 14').max(14, 'pH must be between 1 and 14'),
  irrigation_type: z.enum(IRRIGATION_TYPES, { errorMap: () => ({ message: 'Please select an irrigation type' }) }),
  acreage: z.number().positive('Acreage must be positive').optional().or(z.literal('')),
});

export default function NewFarmPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    soil_type: '',
    ph_level: '',
    irrigation_type: '',
    acreage: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');

    const parsed = FarmSchema.safeParse({
      ...formData,
      ph_level: formData.ph_level ? parseFloat(formData.ph_level) : undefined,
      acreage: formData.acreage ? parseFloat(formData.acreage) : undefined,
    });

    if (!parsed.success) {
      const fieldErrors = {};
      parsed.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const payload = { ...parsed.data };
      if (!payload.acreage) delete payload.acreage;

      await farmsApi.create(payload);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.error || 'Failed to create farm. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-4">
      {/* Back button */}
      <Link
        to="/farms"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to Farms
      </Link>

      <div className="glass-card p-8 border border-white/10 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
            <Tractor size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-white">Create New Farm Profile</h1>
            <p className="text-sm text-gray-400">
              Provide soil and location parameters to fuel precise Gemini AI recommendations
            </p>
          </div>
        </div>

        {serverError && (
          <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
            <AlertCircle size={18} className="shrink-0" />
            <p>{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Farm Name */}
            <div>
              <label htmlFor="name" className="input-label">Farm Name *</label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Green Valley Homestead"
                className="input-field"
              />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="input-label">Location (State/Region) *</label>
              <input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Salinas Valley, California"
                className="input-field"
              />
              {errors.location && <p className="text-xs text-red-400 mt-1">{errors.location}</p>}
            </div>

            {/* Soil Type */}
            <div>
              <label htmlFor="soil_type" className="input-label">Soil Type *</label>
              <select
                id="soil_type"
                name="soil_type"
                value={formData.soil_type}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select Soil Type</option>
                {SOIL_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.soil_type && <p className="text-xs text-red-400 mt-1">{errors.soil_type}</p>}
            </div>

            {/* Soil pH */}
            <div>
              <label htmlFor="ph_level" className="input-label">Soil pH Level (1 - 14) *</label>
              <input
                id="ph_level"
                name="ph_level"
                type="number"
                step="0.1"
                min="1"
                max="14"
                value={formData.ph_level}
                onChange={handleChange}
                placeholder="e.g. 6.5"
                className="input-field"
              />
              {errors.ph_level && <p className="text-xs text-red-400 mt-1">{errors.ph_level}</p>}
            </div>

            {/* Irrigation Type */}
            <div>
              <label htmlFor="irrigation_type" className="input-label">Irrigation System *</label>
              <select
                id="irrigation_type"
                name="irrigation_type"
                value={formData.irrigation_type}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select Irrigation</option>
                {IRRIGATION_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.irrigation_type && <p className="text-xs text-red-400 mt-1">{errors.irrigation_type}</p>}
            </div>

            {/* Acreage */}
            <div>
              <label htmlFor="acreage" className="input-label">Total Acreage (Optional)</label>
              <input
                id="acreage"
                name="acreage"
                type="number"
                step="0.1"
                min="0"
                value={formData.acreage}
                onChange={handleChange}
                placeholder="e.g. 50"
                className="input-field"
              />
              {errors.acreage && <p className="text-xs text-red-400 mt-1">{errors.acreage}</p>}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-4">
            <Link to="/farms" className="btn-secondary">
              Cancel
            </Link>
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving Profile...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Save Farm Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
