import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
      
      <div className="relative z-10 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand Section */}
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent mb-4">
                TrackTally
              </h3>
              <p className="text-purple-200 leading-relaxed">
                Your smart companion for managing personal finances and tracking expenses with ease.
              </p>
            </div>
            
            {/* Quick Links */}
            <div className="text-center">
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <div className="space-y-3">
                <Link 
                  to="/learn-more" 
                  className="block text-purple-200 hover:text-white transition-colors duration-200 hover:bg-white/10 px-3 py-1 rounded-lg"
                >
                  Learn More
                </Link>
                <Link 
                  to="/about-us" 
                  className="block text-purple-200 hover:text-white transition-colors duration-200 hover:bg-white/10 px-3 py-1 rounded-lg"
                >
                  About Us
                </Link>
                <Link 
                  to="/contact-us" 
                  className="block text-purple-200 hover:text-white transition-colors duration-200 hover:bg-white/10 px-3 py-1 rounded-lg"
                >
                  Contact Us
                </Link>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="text-center md:text-right">
              <h4 className="text-lg font-semibold text-white mb-4">Connect With Us</h4>
              <div className="flex justify-center md:justify-end space-x-4">
                <a 
                  href="#" 
                  className="group flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-blue-600 rounded-xl transition-all duration-300 transform hover:scale-110"
                >
                  <span className="text-xl group-hover:text-white">📘</span>
                </a>
                <a 
                  href="#" 
                  className="group flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-pink-600 rounded-xl transition-all duration-300 transform hover:scale-110"
                >
                  <span className="text-xl group-hover:text-white">📷</span>
                </a>
                <a 
                  href="#" 
                  className="group flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-blue-400 rounded-xl transition-all duration-300 transform hover:scale-110"
                >
                  <span className="text-xl group-hover:text-white">🐦</span>
                </a>
              </div>
            </div>
          </div>
          
          {/* Features Highlight */}
          {/* <div className="border-t border-white/10 pt-8 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
                <div className="text-2xl mb-2">💰</div>
                <div className="text-sm text-purple-200">Smart Tracking</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
                <div className="text-2xl mb-2">👥</div>
                <div className="text-sm text-purple-200">Group Expenses</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-sm text-purple-200">Analytics</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
                <div className="text-2xl mb-2">🔒</div>
                <div className="text-sm text-purple-200">Secure</div>
              </div>
            </div>
          </div> */}
          
          {/* Bottom Section */}
          <div className="border-t border-white/10 pt-6 text-center">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <p className="text-purple-300 text-sm mb-4 md:mb-0">
                © 2025 TrackTally. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 text-sm text-purple-300">
                <a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors duration-200">Support</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;