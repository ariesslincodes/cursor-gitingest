'use client';

export function CurrentPlan() {
  return (
    <div className="mb-8 rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-blue-500/20 p-8 backdrop-blur-xl">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm font-medium mb-2 text-gray-300">CURRENT PLAN</div>
            <h2 className="text-4xl font-bold mb-6 text-white">Researcher</h2>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-1 text-gray-300">API Usage</div>
                <div className="w-96 h-2 bg-white/10 rounded-full">
                  <div className="w-[2%] h-full bg-white rounded-full"></div>
                </div>
                <div className="text-sm mt-1 text-gray-300">2/1,000 Credits</div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-4 bg-white/10 rounded-full">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
                <span className="text-sm text-gray-300">Pay as you go</span>
              </div>
            </div>
          </div>

          <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
            Manage Plan
          </button>
        </div>
      </div>
    </div>
  );
} 