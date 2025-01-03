import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 text-center">
      <div className="mb-4">
        <a href="#" className="mx-4 hover:underline">Learn More</a>
        <a href="#" className="mx-4 hover:underline">About Us</a>
        <a href="#" className="mx-4 hover:underline">Contact Us</a>
      </div>
      <div>
        <a href="#" className="mx-3 hover:underline">Facebook</a>
        <a href="#" className="mx-3 hover:underline">Instagram</a>
        <a href="#" className="mx-3 hover:underline">Twitter</a>
      </div>
    </footer>
  );
};

export default Footer;
