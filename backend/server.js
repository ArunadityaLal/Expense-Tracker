// backend/server.js
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory OTP storage (use Redis in production)
const otpStore = new Map();

// Email configuration - Using your SMTP settings
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Verify email configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
    console.log(`📧 Sending from: ${process.env.FROM_EMAIL || process.env.SMTP_USER}`);
  }
});

/**
 * Generate a 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Store OTP with expiration (10 minutes)
 */
const storeOTP = (email, otp) => {
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  otpStore.set(email, { otp, expiresAt });
  
  // Clean up expired OTPs
  setTimeout(() => {
    const stored = otpStore.get(email);
    if (stored && stored.otp === otp) {
      otpStore.delete(email);
    }
  }, 10 * 60 * 1000);
};

/**
 * Verify OTP
 */
const verifyStoredOTP = (email, otp) => {
  const stored = otpStore.get(email);
  
  if (!stored) {
    return { valid: false, error: 'OTP not found or expired' };
  }
  
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email);
    return { valid: false, error: 'OTP has expired' };
  }
  
  if (stored.otp !== otp) {
    return { valid: false, error: 'Invalid OTP' };
  }
  
  // OTP is valid, remove it
  otpStore.delete(email);
  return { valid: true };
};

/**
 * Send OTP email
 */
const sendOTPEmail = async (email, fullName, otp) => {
  const mailOptions = {
    from: {
      name: 'TrackTally',
      address: process.env.FROM_EMAIL || process.env.SMTP_USER,
    },
    to: email,
    subject: 'Verify Your Email - TrackTally',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">TrackTally</h1>
                    <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 14px;">Expense Manager</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px;">Verify Your Email</h2>
                    <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.5;">
                      Hi ${fullName},
                    </p>
                    <p style="margin: 0 0 30px 0; color: #666666; font-size: 16px; line-height: 1.5;">
                      Thank you for signing up with TrackTally! To complete your registration, please use the verification code below:
                    </p>
                    
                    <!-- OTP Box -->
                    <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                      <tr>
                        <td align="center" style="padding: 20px; background-color: #f7fafc; border-radius: 8px; border: 2px dashed #cbd5e0;">
                          <div style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                            ${otp}
                          </div>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 30px 0 20px 0; color: #666666; font-size: 14px; line-height: 1.5;">
                      This code will expire in <strong>10 minutes</strong>.
                    </p>
                    <p style="margin: 0 0 20px 0; color: #666666; font-size: 14px; line-height: 1.5;">
                      If you didn't request this code, please ignore this email.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0 0 10px 0; color: #718096; font-size: 14px;">
                      Need help? Contact us at support@tracktally.com
                    </p>
                    <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                      © 2025 TrackTally. All rights reserved.
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    text: `
      Hi ${fullName},
      
      Thank you for signing up with TrackTally!
      
      Your verification code is: ${otp}
      
      This code will expire in 10 minutes.
      
      If you didn't request this code, please ignore this email.
      
      Best regards,
      TrackTally Team
    `,
  };

  return await transporter.sendMail(mailOptions);
};

// ============================================
// API ROUTES
// ============================================

/**
 * POST /api/send-otp
 * Send OTP to user's email
 */
app.post('/api/send-otp', async (req, res) => {
  try {
    const { email, fullName } = req.body;

    if (!email || !fullName) {
      return res.status(400).json({ 
        error: 'Email and full name are required' 
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP
    storeOTP(email, otp);

    // Send email
    await sendOTPEmail(email, fullName, otp);

    console.log(`✅ OTP sent to ${email}: ${otp}`);

    // In development, send OTP in response
    const response = { 
      success: true,
      message: 'OTP sent successfully' 
    };

    if (process.env.NODE_ENV === 'development') {
      response.otp = otp; // Only for development/testing
    }

    res.json(response);
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ 
      error: 'Failed to send OTP. Please try again.' 
    });
  }
});

/**
 * POST /api/verify-otp
 * Verify OTP code
 */
app.post('/api/verify-otp', (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ 
        error: 'Email and OTP are required' 
      });
    }

    const result = verifyStoredOTP(email, otp);

    if (!result.valid) {
      return res.status(400).json({ 
        error: result.error 
      });
    }

    console.log(`✅ OTP verified for ${email}`);

    res.json({ 
      success: true,
      message: 'OTP verified successfully' 
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ 
      error: 'Failed to verify OTP. Please try again.' 
    });
  }
});

/**
 * GET /health
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    email_configured: !!process.env.SMTP_USER
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📧 Email service: ${process.env.SMTP_USER || 'Not configured'}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
});