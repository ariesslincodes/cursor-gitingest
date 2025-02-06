'use client';

export function CurrentPlan() {
  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-lg p-6 relative overflow-visible">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-sm text-gray-400 uppercase mb-1">CURRENT PLAN</h2>
          <h3 className="text-2xl font-bold text-white mb-2">Researcher</h3>
          <div className="space-y-2">
            <div className="text-gray-300">
              <span className="font-medium">2/1,000</span> Credits
            </div>
            <div className="text-gray-400">Pay as you go</div>
          </div>
        </div>

        <div className="w-full sm:w-auto">
          <button className="w-full sm:w-auto px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
            Manage Plan
          </button>
        </div>
      </div>
    </div>
  );
}
