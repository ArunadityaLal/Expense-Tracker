
const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 pt-20 px-4 mt-5">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
            <span className="text-3xl">📊</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            About TrackTally
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
        </div>

        {/* Content Cards */}
        <div className="space-y-8">
          {/* First Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2"></div>
            <div className="p-8">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-xl group-hover:bg-blue-200 transition-colors duration-300">
                  <span className="text-2xl">💡</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Smart Financial Insights</h2>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    An expense tracker not only helps users keep a record of their daily expenses but also provides insights into their financial habits. By tracking spending over time, users can identify unnecessary expenditures, prioritize savings, and set realistic financial goals. Many modern expense trackers offer features like data visualization, where users can see their spending trends through graphs and charts. Some apps even offer predictive analytics, suggesting potential savings or areas for improvement.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Second Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 h-2"></div>
            <div className="p-8">
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-3 rounded-xl group-hover:bg-purple-200 transition-colors duration-300">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">For Everyone</h2>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Expense trackers can be used by individuals, families, and businesses alike. For individuals, they may aid in managing personal finances and reducing debt, while businesses use them to keep track of operational costs, monitor cash flow, and optimize their budgets. Many apps are designed to sync across multiple devices, making it easier for users to stay up-to-date on their financial situation at all times.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Third Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-green-500 to-teal-600 h-2"></div>
            <div className="p-8">
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-xl group-hover:bg-green-200 transition-colors duration-300">
                  <span className="text-2xl">🚀</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Advanced Features</h2>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Advanced expense tracking tools may also allow users to set budgets for specific categories, send notifications when a spending limit is approached, and even generate monthly or annual reports for tax or investment purposes. Whether simple or feature-rich, an expense tracker is an invaluable tool for anyone looking to take control of their finances.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
            <h3 className="text-3xl font-bold mb-4">Ready to Take Control?</h3>
            <p className="text-xl text-blue-100 mb-6">
              Start your financial journey with TrackTally today and experience the difference.
            </p>
            <div className="flex justify-center space-x-4">
              <div className="bg-white/20 px-6 py-3 rounded-xl">
                <span className="text-2xl">💰</span>
                <div className="text-sm mt-1">Save Money</div>
              </div>
              <div className="bg-white/20 px-6 py-3 rounded-xl">
                <span className="text-2xl">📈</span>
                <div className="text-sm mt-1">Track Growth</div>
              </div>
              <div className="bg-white/20 px-6 py-3 rounded-xl">
                <span className="text-2xl">🎯</span>
                <div className="text-sm mt-1">Reach Goals</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;