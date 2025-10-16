import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

const ContactUs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("feedback"); // feedback, support, business
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    phone: "",
    company: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is logged in for feedback
    if (activeTab === "feedback" && !user) {
      toast.error("Please login to submit feedback");
      navigate("/login");
      return;
    }

    // Validate form
    if (!formData.subject || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (activeTab !== "feedback" && !formData.email) {
      toast.error("Email is required");
      return;
    }

    setLoading(true);

    try {
      const submissionData = {
        user_id: user?.id || null,
        name: formData.name || user?.user_metadata?.full_name || formData.email.split('@')[0],
        email: formData.email || user?.email,
        subject: formData.subject,
        message: formData.message,
        contact_type: activeTab, // feedback, support, or business
        phone: formData.phone || null,
        company: formData.company || null,
      };

      const { error } = await supabase
        .from('contact_requests')
        .insert([submissionData]);

      if (error) throw error;

      let successMessage = "Message sent successfully!";
      if (activeTab === "feedback") {
        successMessage = "Feedback submitted successfully! We'll review it soon.";
      } else if (activeTab === "support") {
        successMessage = "Support request received! We'll get back to you within 24 hours.";
      } else if (activeTab === "business") {
        successMessage = "Business inquiry received! Our team will contact you shortly.";
      }

      toast.success(successMessage);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        phone: "",
        company: "",
      });
    } catch (error) {
      console.error('Error submitting:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 pt-20 px-4">
      <div className="max-w-6xl mx-auto py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-teal-600 rounded-full mb-6 shadow-lg">
            <span className="text-3xl">📧</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Get in Touch
          </h1>
          <p className="text-gray-600 text-xl">
            Whether you need help, have feedback, or want to partner with us - we're here for you!
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📧</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Email</h3>
            <p className="text-gray-600 text-sm">support@tracktally.com</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Live Chat</h3>
            <p className="text-gray-600 text-sm">Available 24/7</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Phone</h3>
            <p className="text-gray-600 text-sm">+1 (555) 123-4567</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌐</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Social Media</h3>
            <p className="text-gray-600 text-sm">@tracktally</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("feedback")}
              className={`flex-1 py-4 px-6 font-semibold transition-all duration-200 ${
                activeTab === "feedback"
                  ? "bg-gradient-to-r from-green-500 to-teal-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="text-xl mr-2">💭</span>
              Share Feedback
            </button>
            <button
              onClick={() => setActiveTab("support")}
              className={`flex-1 py-4 px-6 font-semibold transition-all duration-200 ${
                activeTab === "support"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="text-xl mr-2">🆘</span>
              Get Support
            </button>
            <button
              onClick={() => setActiveTab("business")}
              className={`flex-1 py-4 px-6 font-semibold transition-all duration-200 ${
                activeTab === "business"
                  ? "bg-gradient-to-r from-orange-500 to-red-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="text-xl mr-2">💼</span>
              Business Inquiry
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Feedback Tab */}
            {activeTab === "feedback" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Share Your Feedback</h2>
                <p className="text-gray-600 mb-6">
                  We value your input! Tell us what you love or what we can improve.
                </p>
                
                {/* Login Notice for Feedback */}
                {!user && (
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 mb-6">
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">⚠️</span>
                      <div>
                        <h3 className="text-lg font-bold text-yellow-800 mb-2">Login Required</h3>
                        <p className="text-yellow-700 mb-4">
                          You need to be logged in to submit feedback. This helps us respond to you directly.
                        </p>
                        <button
                          onClick={() => navigate("/login")}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-200"
                        >
                          Login Now
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Support Tab */}
            {activeTab === "support" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Need Help?</h2>
                <p className="text-gray-600 mb-6">
                  Having trouble? Our support team is here to help you resolve any issues.
                </p>
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
                  <h3 className="font-bold text-blue-800 mb-2">💡 Quick Tips:</h3>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Include detailed steps to reproduce the issue</li>
                    <li>• Attach screenshots if possible</li>
                    <li>• Mention your browser and device</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Business Tab */}
            {activeTab === "business" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Let's Work Together</h2>
                <p className="text-gray-600 mb-6">
                  Interested in partnerships, enterprise solutions, or API access? Let's talk!
                </p>
                <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6 mb-6">
                  <h3 className="font-bold text-orange-800 mb-2">💼 Business Services:</h3>
                  <ul className="text-orange-700 text-sm space-y-1">
                    <li>• Enterprise licensing</li>
                    <li>• White-label solutions</li>
                    <li>• API integration support</li>
                    <li>• Custom feature development</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-6 mt-8">
              {/* Name Field */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || (user?.user_metadata?.full_name || "")}
                    onChange={handleChange}
                    placeholder="Your name"
                    disabled={activeTab === "feedback" && !!user}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
                    required={activeTab !== "feedback"}
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || (user?.email || "")}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    disabled={activeTab === "feedback" && !!user}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
                    required
                  />
                </div>
              </div>

              {/* Business-specific fields */}
              {activeTab === "business" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your company"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              )}

              {/* Subject Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={activeTab === "feedback" && !user}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                >
                  <option value="">Select a subject</option>
                  {activeTab === "feedback" && (
                    <>
                      <option value="Feature Request">Feature Request</option>
                      <option value="General Feedback">General Feedback</option>
                      <option value="User Experience">User Experience</option>
                      <option value="Suggestion">Suggestion</option>
                    </>
                  )}
                  {activeTab === "support" && (
                    <>
                      <option value="Bug Report">Bug Report</option>
                      <option value="Account Issue">Account Issue</option>
                      <option value="Payment Issue">Payment Issue</option>
                      <option value="Technical Help">Technical Help</option>
                      <option value="Other">Other</option>
                    </>
                  )}
                  {activeTab === "business" && (
                    <>
                      <option value="Partnership">Partnership Opportunity</option>
                      <option value="Enterprise License">Enterprise License</option>
                      <option value="API Access">API Access</option>
                      <option value="Custom Development">Custom Development</option>
                      <option value="White Label">White Label Solution</option>
                    </>
                  )}
                </select>
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={
                    activeTab === "feedback"
                      ? "Tell us what you think or what you'd like to see..."
                      : activeTab === "support"
                      ? "Describe your issue in detail..."
                      : "Tell us about your business needs..."
                  }
                  rows="6"
                  disabled={activeTab === "feedback" && !user}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={(activeTab === "feedback" && !user) || loading}
                  className={`flex-1 py-3 px-6 rounded-xl font-medium transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-white ${
                    activeTab === "feedback"
                      ? "bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
                      : activeTab === "support"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      : "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  }`}
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-gray-800 mb-2">⏰ Response Time</h3>
              <p className="text-gray-600 text-sm">Feedback: 2-3 days | Support: 24 hours | Business: 48 hours</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">💡 Best Contact Method</h3>
              <p className="text-gray-600 text-sm">For urgent issues, use live chat. For detailed inquiries, use this form.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">📱 Mobile Support</h3>
              <p className="text-gray-600 text-sm">Yes! All our contact methods work on mobile devices.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">🌍 International</h3>
              <p className="text-gray-600 text-sm">We support users worldwide in English.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;