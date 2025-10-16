// src/utils/emailService.js
import { supabase } from '../lib/supabase';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

/**
 * Send OTP to user's email
 * @param {string} email - User's email address
 * @param {string} fullName - User's full name
 * @returns {Promise<{success: boolean, otp?: string, error?: string}>}
 */
export const sendOTPEmail = async (email, fullName) => {
  try {
    const response = await fetch(`${API_BASE}/api/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email, 
        fullName 
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send OTP');
    }

    return { 
      success: true, 
      otp: data.otp // Only in development mode
    };
  } catch (error) {
    console.error('Error sending OTP:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

/**
 * Verify OTP code
 * @param {string} email - User's email address
 * @param {string} otp - OTP code to verify
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const verifyOTP = async (email, otp) => {
  try {
    const response = await fetch(`${API_BASE}/api/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email, 
        otp 
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Invalid OTP');
    }

    return { success: true };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

/**
 * Store OTP in Supabase (alternative method without backend)
 * @param {string} email - User's email address
 * @param {string} otp - Generated OTP
 * @returns {Promise<boolean>}
 */
export const storeOTPInDatabase = async (email, otp) => {
  try {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const { error } = await supabase
      .from('email_verifications')
      .insert([
        {
          email,
          otp,
          expires_at: expiresAt.toISOString(),
          verified: false,
        }
      ]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error storing OTP:', error);
    return false;
  }
};

/**
 * Verify OTP from database (alternative method without backend)
 * @param {string} email - User's email address
 * @param {string} otp - OTP to verify
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const verifyOTPFromDatabase = async (email, otp) => {
  try {
    // Get the most recent OTP for this email
    const { data, error } = await supabase
      .from('email_verifications')
      .select('*')
      .eq('email', email)
      .eq('otp', otp)
      .eq('verified', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return { 
        success: false, 
        error: 'Invalid or expired OTP' 
      };
    }

    // Check if OTP is expired
    const expiresAt = new Date(data.expires_at);
    if (expiresAt < new Date()) {
      return { 
        success: false, 
        error: 'OTP has expired. Please request a new one.' 
      };
    }

    // Mark OTP as verified
    const { error: updateError } = await supabase
      .from('email_verifications')
      .update({ verified: true })
      .eq('id', data.id);

    if (updateError) throw updateError;

    return { success: true };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { 
      success: false, 
      error: 'Verification failed' 
    };
  }
};

/**
 * Generate a 6-digit OTP
 * @returns {string}
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP using your email service (provide your credentials)
 * This is a template - you need to implement with your email service
 */
export const sendEmailWithService = async (email, otp, fullName) => {
  // OPTION 1: Using EmailJS (Free tier available)
  // https://www.emailjs.com/
  
  // OPTION 2: Using SendGrid
  // https://sendgrid.com/
  
  // OPTION 3: Using your own SMTP server
  
  // For now, we'll use the backend API
  // You need to provide your email credentials in the backend
  
  return await sendOTPEmail(email, fullName);
};