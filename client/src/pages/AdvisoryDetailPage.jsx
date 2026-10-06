/**
 * client/src/pages/AdvisoryDetailPage.jsx
 * Displays a full AI advisory result fetched by ID.
 */

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { advisoryApi } from '../services/api';
import AdvisoryResultCard from '../components/Advisory/AdvisoryResultCard';
import { SkeletonAdvisoryCard } from '../components/UI/LoadingSkeleton';
import ErrorMessage from '../components/UI/ErrorMessage';

export default function AdvisoryDetailPage() {
  const { id } = useParams();
  const [advisory, setAdvisory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadAdvisory() {
    setIsLoading(true);
    setError('');
    try {
      const res = await advisoryApi.getById(id);
      setAdvisory(res.data.advisory);
    } catch (err) {
      setError(
        err.response?.status === 404
          ? 'Advisory not found or you do not have permission to view it.'
          : 'Failed to load this advisory. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadAdvisory();
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back nav */}
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={15} />
        Back to Dashboard
      </Link>

      {isLoading ? (
        <SkeletonAdvisoryCard />
      ) : error ? (
        <ErrorMessage message={error} onRetry={loadAdvisory} />
      ) : advisory ? (
        <AdvisoryResultCard advisory={advisory} />
      ) : null}

      {/* Generate another */}
      {!isLoading && !error && (
        <div className="mt-8 text-center">
          <Link to="/advisory/request" className="btn-secondary">
            <Sparkles size={15} />
            Generate Another Advisory
          </Link>
        </div>
      )}
    </div>
  );
}
