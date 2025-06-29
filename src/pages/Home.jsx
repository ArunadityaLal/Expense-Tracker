import expenses from "../assets/expenses.png"; 

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 flex items-center justify-center max-w-6xl mx-auto px-8">
        {/* Logo Section */}
        <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 rounded-full p-12 shadow-2xl transform hover:scale-105 transition-all duration-300 mr-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-6">
            <img src={expenses} alt="TrackTally-logo" className="w-48 h-48 drop-shadow-lg" /> 
          </div>
        </div>
        
        {/* Content Section */}
        <div className="text-white text-left max-w-2xl">
          <div className="space-y-6">
            <div>
              <h1 className="text-7xl font-bold bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent leading-tight">
                TrackTally
              </h1>
              <h2 className="text-3xl font-light text-purple-200 mt-2">
                Expense Manager
              </h2>
            </div>
            
            <p className="text-xl text-gray-200 leading-relaxed max-w-lg">
              Manage your personal finances and easily track your money, expenses and budget with our intelligent expense tracking system.
            </p>
            
            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300">
                <div className="text-2xl mb-2">📊</div>
                <h3 className="font-semibold text-purple-100">Smart Analytics</h3>
                <p className="text-sm text-gray-300">Track spending patterns</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300">
                <div className="text-2xl mb-2">👥</div>
                <h3 className="font-semibold text-purple-100">Group Expenses</h3>
                <p className="text-sm text-gray-300">Split bills easily</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300">
                <div className="text-2xl mb-2">💰</div>
                <h3 className="font-semibold text-purple-100">Budget Control</h3>
                <p className="text-sm text-gray-300">Stay on track</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300">
                <div className="text-2xl mb-2">📱</div>
                <h3 className="font-semibold text-purple-100">Easy to Use</h3>
                <p className="text-sm text-gray-300">Intuitive interface</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-20 right-20 animate-bounce">
        <div className="w-8 h-8 bg-yellow-400 rounded-full opacity-60"></div>
      </div>
      <div className="absolute bottom-32 left-20 animate-pulse">
        <div className="w-6 h-6 bg-pink-400 rounded-full opacity-40"></div>
      </div>
    </div>
  );
};

export default Home;