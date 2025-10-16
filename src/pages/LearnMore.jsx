const LearnMore = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 pt-20 px-4">
      <div className="max-w-6xl mx-auto py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
            <span className="text-3xl">💡</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Learn More About TrackTally
          </h1>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto">
            Discover how TrackTally can transform the way you manage your finances
          </p>
        </div>

        {/* Feature Sections */}
        <div className="space-y-12">
          {/* Personal Finance Management */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2"></div>
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-5xl">💰</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Personal Finance Management</h2>
                  <p className="text-gray-600 text-lg leading-relaxed mb-4">
                    Take control of your personal finances with our intuitive expense tracking system. 
                    Categorize your spending, set budgets, and monitor your financial health in real-time.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-2">✓</span>
                      Track expenses by category (Food, Transport, Utilities, etc.)
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-2">✓</span>
                      Edit and delete expenses anytime
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-2">✓</span>
                      Filter expenses by category for detailed insights
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-2">✓</span>
                      View total spending at a glance
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Group Expense Management */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-teal-600 h-2"></div>
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-5xl">👥</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Split Smart - Group Expenses</h2>
                  <p className="text-gray-600 text-lg leading-relaxed mb-4">
                    Perfect for roommates, trips, and shared expenses. Split bills fairly and settle up 
                    with ease using our intelligent settlement algorithm.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-2">✓</span>
                      Create unlimited groups for different occasions
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-2">✓</span>
                      Add members and track who paid what
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-2">✓</span>
                      Smart settlement calculation (minimizes transactions)
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-2">✓</span>
                      Mark groups as Active, Completed, or Cancelled
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Smart Analytics */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 h-2"></div>
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-5xl">📊</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Smart Analytics & Insights</h2>
                  <p className="text-gray-600 text-lg leading-relaxed mb-4">
                    Gain valuable insights into your spending patterns with comprehensive analytics 
                    and visual representations of your financial data.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-2">✓</span>
                      Track spending trends over time
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-2">✓</span>
                      Category-wise expense breakdown
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-2">✓</span>
                      Identify areas for potential savings
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-2">✓</span>
                      Real-time expense summaries
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Privacy */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-rose-600 h-2"></div>
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-5xl">🔒</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Security & Privacy</h2>
                  <p className="text-gray-600 text-lg leading-relaxed mb-4">
                    Your financial data is precious. We use industry-standard security measures to 
                    keep your information safe and private.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-2">✓</span>
                      Secure authentication with email verification
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-2">✓</span>
                      Encrypted data storage with Supabase
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-2">✓</span>
                      Row-level security for data protection
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-2">✓</span>
                      Your data is yours - we never share it
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white shadow-2xl">
            <h3 className="text-4xl font-bold mb-6">Ready to Get Started?</h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already managing their finances smarter with TrackTally
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="/login"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Get Started Free
              </a>
              <a
                href="/contact-us"
                className="bg-white/20 text-white border-2 border-white px-8 py-4 rounded-xl font-semibold hover:bg-white/30 transform hover:scale-105 transition-all duration-200"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnMore;