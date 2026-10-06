/**
 * client/src/components/Farm/CreateFarmModal.jsx
 * Modal form for creating a new farm profile.
 * Includes Zod validation mirroring the backend schema.
 */

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { farmsApi } from '../../services/api';

const SOIL_TYPES = ['Clay', 'Sandy', 'Loamy', 'Silt'];
const IRRIGATION_TYPES = ['Rainfed', 'Drip', 'Sprinkler'];

const FarmSchema = z.object({
  name: z.string().min(2, 'Farm name must be at least 2 characters').max(100),
  location: z.string().min(3, 'Location must be at least 3 characters').max(255),
  soil_type: z.enum(SOIL_TYPES, { errorMap: () => ({ message: 'Please select a soil type' }) }),
  ph_level: z.number({ invalid_type_error: 'pH must be a number' }).min(1).max(14),
  irrigation_type: z.enum(IRRIGATION_TYPES, { errorMap: () => ({ message: 'Please select an irrigation type' }) }),
  acreage: z.number().positive().optional().or(z.literal('')),
});

export default function CreateFarmModal({ isOpen, onClose, onSuccess }) {
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

  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');

    // Parse and validate
    const parsed = FarmSchema.safeParse({
      ...formData,
      ph_level: formData.ph_level ? parseFloat(formData.ph_level) : undefined,
      acreage: formData.acreage ? parseFloat(formData.acreage) : undefined,
    });

    if (!parsed.success) {
      const fieldErrors = {};
      parsed.error.errors.forEach((e) => {
        fieldErrors[e.path[0]] = e.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const payload = { ...parsed.data };
      if (!payload.acreage) delete payload.acreage;

      const response = await farmsApi.create(payload);
      onSuccess(response.data.farm);
      onClose();
      setFormData({ name: '', location: '', soil_type: '', ph_level: '', irrigation_type: '', acreage: '' });
    } catch (err) {
      setServerError(err.response?.data?.error || 'Failed to create farm. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative glass-card w-full max-w-lg p-6 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-display font-semibold text-white">Add Farm Profile</h2>
            <p className="text-xs text-gray-500 mt-0.5">Enter your farm's soil and location details</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Farm Name */}
          <div>
            <label htmlFor="farm-name" className="input-label">Farm Name</label>
            <input
              id="farm-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Sunrise Valley Farm"
              className="input-field"
            />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
          </div>

          {/* Location */}
          <div>
            <label htmlFor="farm-location" className="input-label">Location</label>
            <input
              id="farm-location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Punjab, India"
              className="input-field"
            />
            {errors.location && <p className="text-xs text-red-400 mt-1">{errors.location}</p>}
          </div>

          {/* Soil Type & Irrigation in a row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="soil-type" className="input-label">Soil Type</label>
              <select
                id="soil-type"
                name="soil_type"
                value={formData.soil_type}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select soil type</option>
                {SOIL_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.soil_type && <p className="text-xs text-red-400 mt-1">{errors.soil_type}</p>}
            </div>

            <div>
              <label htmlFor="irrigation-type" className="input-label">Irrigation</label>
              <select
                id="irrigation-type"
                name="irrigation_type"
                value={formData.irrigation_type}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select irrigation</option>
                {IRRIGATION_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.irrigation_type && <p className="text-xs text-red-400 mt-1">{errors.irrigation_type}</p>}
            </div>
          </div>

          {/* pH & Acreage in a row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="ph-level" className="input-label">pH Level (1–14)</label>
              <input
                id="ph-level"
                name="ph_level"
                type="number"
                step="0.1"
                min="1"
                max="14"
                value={formData.ph_level}
                onChange={handleChange}
                placeholder="e.g., 6.5"
                className="input-field"
              />
              {errors.ph_level && <p className="text-xs text-red-400 mt-1">{errors.ph_level}</p>}
            </div>

            <div>
              <label htmlFor="acreage" className="input-label">Acreage (optional)</label>
              <input
                id="acreage"
                name="acreage"
                type="number"
                step="0.1"
                min="0"
                value={formData.acreage}
                onChange={handleChange}
                placeholder="e.g., 12.5"
                className="input-field"
              />
            </div>
          </div>

          {/* Server error */}
          {serverError && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3">
              <p className="text-xs text-red-400">{serverError}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="btn-primary flex-1">
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Farm'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
