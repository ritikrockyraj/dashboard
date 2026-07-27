import React, { useState, useEffect, useRef } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import { Plus, Trash2 } from 'lucide-react';

export default function ReadinessDashboard({ project, onUpdateProject }) {
  const readiness = project.readiness || { verbalPitch: 0, techDepth: 0, architectureTradeoffs: 0, aiMockScore: 0 };

  const [feedbackLog, setFeedbackLog] = useState(project.mockFeedbackLog || '');
  const timerRef = useRef(null);

  useEffect(() => {
    setFeedbackLog(project.mockFeedbackLog || '');
  }, [project.mockFeedbackLog]);

  const handleFeedbackChange = (val) => {
    setFeedbackLog(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onUpdateProject({
        ...project,
        mockFeedbackLog: val
      });
    }, 400);
  };

  const handleSliderChange = (field, val) => {
    onUpdateProject({
      ...project,
      readiness: {
        ...readiness,
        [field]: Number(val)
      }
    });
  };

  const radarData = [
    { subject: 'Verbal Pitch', score: readiness.verbalPitch || 0 },
    { subject: 'Tech Depth', score: readiness.techDepth || 0 },
    { subject: 'Architecture', score: readiness.architectureTradeoffs || 0 },
    { subject: 'AI Mock', score: readiness.aiMockScore || 0 }
  ];

  const [reviewDate, setReviewDate] = useState('');
  const [reviewScore, setReviewScore] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!reviewDate || !reviewScore) return;

    const newLog = {
      id: Date.now().toString(),
      date: reviewDate,
      score: Number(reviewScore),
      notes: reviewNotes
    };

    onUpdateProject({
      ...project,
      reviewLog: [...(project.reviewLog || []), newLog]
    });

    setReviewDate('');
    setReviewScore('');
    setReviewNotes('');
  };

  const handleDeleteReview = (logId) => {
    onUpdateProject({
      ...project,
      reviewLog: (project.reviewLog || []).filter(item => item.id !== logId)
    });
  };

  const sortedReviewLog = [...(project.reviewLog || [])].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sliders */}
        <div className="space-y-4 bg-[#131927]/60 backdrop-blur-md border border-[#1E293B] p-6 rounded-2xl text-left">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Metrics</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-300 font-medium">Verbal Pitch & Explanation</span>
                <span className="text-[#6366F1] font-bold">{readiness.verbalPitch}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={readiness.verbalPitch}
                onChange={(e) => handleSliderChange('verbalPitch', e.target.value)}
                className="w-full accent-[#6366F1]"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-300 font-medium">Tech Stack & Code Depth</span>
                <span className="text-[#6366F1] font-bold">{readiness.techDepth}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={readiness.techDepth}
                onChange={(e) => handleSliderChange('techDepth', e.target.value)}
                className="w-full accent-[#6366F1]"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-300 font-medium">System Architecture & Trade-offs</span>
                <span className="text-[#6366F1] font-bold">{readiness.architectureTradeoffs}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={readiness.architectureTradeoffs}
                onChange={(e) => handleSliderChange('architectureTradeoffs', e.target.value)}
                className="w-full accent-[#6366F1]"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-300 font-medium">AI Mock Performance Score</span>
                <span className="text-[#6366F1] font-bold">{readiness.aiMockScore}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={readiness.aiMockScore}
                onChange={(e) => handleSliderChange('aiMockScore', e.target.value)}
                className="w-full accent-[#6366F1]"
              />
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-[#131927]/60 backdrop-blur-md border border-[#1E293B] p-6 rounded-2xl flex flex-col items-center justify-center text-left">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 self-start">Readiness Radar</h3>
          <div className="w-full h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#1E293B" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <Radar name={project.title} dataKey="score" stroke="#6366F1" fill="#6366F1" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Mock Feedback Log */}
      <div className="bg-[#131927]/60 backdrop-blur-md border border-[#1E293B] p-6 rounded-2xl text-left">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">AI Mock Feedback Log</h3>
        <textarea
          value={feedbackLog}
          onChange={(e) => handleFeedbackChange(e.target.value)}
          placeholder="Paste critique/weak points/action items from AI Mock sessions here..."
          className="w-full h-32 bg-[#0B0F17] border border-[#1E293B] rounded-xl p-4 text-sm text-gray-300 focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] outline-none resize-none font-mono"
        />
        <div className="flex justify-between items-center mt-1">
          <span className="text-[10px] text-gray-500">Auto-saves with a 400ms typing debounce</span>
        </div>
      </div>

      {/* Review Log Table */}
      <div className="bg-[#131927]/60 backdrop-blur-md border border-[#1E293B] p-6 rounded-2xl text-left">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Review & Retest Log</h3>
        
        {/* Add Log Form */}
        <form onSubmit={handleAddReview} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Date</label>
            <input 
              type="date" 
              required
              value={reviewDate}
              onChange={(e) => setReviewDate(e.target.value)}
              className="w-full bg-[#0B0F17] border border-[#1E293B] rounded-xl px-3 py-2 text-sm text-white focus:border-[#6366F1] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Target Score (%)</label>
            <input 
              type="number" 
              min="0" 
              max="100"
              required
              placeholder="e.g. 85"
              value={reviewScore}
              onChange={(e) => setReviewScore(e.target.value)}
              className="w-full bg-[#0B0F17] border border-[#1E293B] rounded-xl px-3 py-2 text-sm text-white focus:border-[#6366F1] outline-none"
            />
          </div>
          <div className="md:col-span-2 flex gap-2">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Notes</label>
              <input 
                type="text" 
                placeholder="e.g. Covered CBAM attention detail"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="w-full bg-[#0B0F17] border border-[#1E293B] rounded-xl px-3 py-2 text-sm text-white focus:border-[#6366F1] outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-[#6366F1] hover:bg-[#4f52c9] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 h-10 mt-5"
            >
              <Plus size={16} />
              <span>Log</span>
            </button>
          </div>
        </form>

        {/* Log Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-[#0B0F17] border-b border-[#1E293B]">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Target Score</th>
                <th className="px-4 py-3">Notes</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedReviewLog.map((log) => (
                <tr key={log.id} className="border-b border-[#1E293B]/50 hover:bg-[#0B0F17]/30 transition-all">
                  <td className="px-4 py-3 font-mono">{log.date}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${
                      log.score >= 75 ? 'bg-green-500/10 text-green-400' :
                      log.score >= 40 ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {log.score}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 truncate max-w-xs">{log.notes || '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDeleteReview(log.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {sortedReviewLog.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500 italic">No reviews logged yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
