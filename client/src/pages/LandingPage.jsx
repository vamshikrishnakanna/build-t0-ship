/**
 * client/src/pages/LandingPage.jsx
 * Public landing page with hero section, features, and CTA.
 */

import { Link } from 'react-router-dom';
import { Leaf, Sparkles, Shield, BarChart3, ArrowRight, Check } from 'lucide-react';

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI-Powered Recommendations',
    desc: 'Gemini AI analyzes your soil pH, type, and climate to recommend the optimal 3 crops for maximum yield.',
    color: 'text-brand-400 bg-brand-500/10 border-brand-500/20',
  },
  {
    icon: BarChart3,
    title: 'Structured Crop Intelligence',
    desc: 'Get suitability scores, expected yields per acre, fertilizer schedules, and pest risk assessments — all in one place.',
    color: 'text-earth-400 bg-earth-500/10 border-earth-500/20',
  },
  {
    icon: Shield,
    title: 'Secure Farm Profiles',
    desc: 'Your data is encrypted and isolated. Only you can see your farm profiles and AI advisory history.',
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  },
];

const STATS = [
  { value: '95%', label: 'Recommendation accuracy' },
  { value: '3x', label: 'Average yield improvement' },
  { value: '50+', label: 'Crop varieties covered' },
  { value: '<30s', label: 'Advisory generation time' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080d08]">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-600/30">
            <Leaf size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-white">CropAdvisor AI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-secondary text-sm">
            Log In
          </Link>
          <Link to="/register" className="btn-primary text-sm">
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 mb-8">
          <Sparkles size={13} className="text-brand-400" />
          <span className="text-xs font-medium text-brand-300">Powered by Google Gemini 2.5 Flash</span>
        </div>

        <h1 className="font-display font-extrabold text-5xl md:text-7xl text-white leading-tight mb-6">
          Farm Smarter with
          <span className="block bg-gradient-to-r from-brand-400 to-earth-400 bg-clip-text text-transparent">
            AI-Driven Insights
          </span>
        </h1>

        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          CropAdvisor AI analyzes your soil conditions, irrigation type, and target season to deliver
          hyper-personalized crop recommendations, fertilizer schedules, and pest management strategies.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link to="/register" className="btn-primary text-base px-8 py-3.5 w-full sm:w-auto">
            Start Growing Smarter
            <ArrowRight size={16} />
          </Link>
          <Link to="/login" className="btn-secondary text-base px-8 py-3.5 w-full sm:w-auto">
            Sign In to Dashboard
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {STATS.map((stat) => (
            <div key={stat.label} className="glass-card p-4 text-center">
              <p className="font-display font-bold text-2xl text-brand-400">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="font-display font-bold text-3xl text-white text-center mb-3">
          Everything You Need to Maximize Yield
        </h2>
        <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
          From soil analysis to harvest scheduling — get the full picture in one platform.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((feat) => (
            <div key={feat.title} className="glass-card p-6 group hover:border-brand-500/15 transition-all duration-300">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${feat.color}`}>
                <feat.icon size={18} />
              </div>
              <h3 className="font-display font-semibold text-white mb-2">{feat.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-white/5">
        <h2 className="font-display font-bold text-3xl text-white text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: '01', title: 'Create Account', desc: 'Register securely and set up your farmer profile.' },
            { step: '02', title: 'Add Farm Profile', desc: 'Input your soil type, pH level, and irrigation method.' },
            { step: '03', title: 'Request Advisory', desc: 'Select your farm, target season, and budget tier.' },
            { step: '04', title: 'Get AI Insights', desc: 'Receive structured crop recommendations and schedules.' },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-600/20 border border-brand-500/30 text-brand-400 font-display font-bold text-sm mb-4">
                {item.step}
              </div>
              <h4 className="font-semibold text-white mb-2">{item.title}</h4>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="glass-card-green p-10 text-center">
          <h2 className="font-display font-bold text-3xl text-white mb-4">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Join farmers using AI-driven precision agriculture to reduce costs and boost yields.
          </p>
          <Link to="/register" className="btn-primary text-base px-10 py-3.5">
            Create Free Account
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8 text-center">
        <p className="text-xs text-gray-600">
          © 2026 CropAdvisor AI. Built with Google Gemini 2.5 Flash · Precision Agriculture Platform.
        </p>
      </footer>
    </div>
  );
}
