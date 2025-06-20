import React from 'react';

const Footer = () => {
  return (
    <footer className="relative bottom-0 w-full bg-indigo-600 text-white p-4 mt-auto"> {/* Use mt-auto if footer is inside a flex container like App.jsx */}
      <div className="container mx-auto text-center text-sm">
        <div className="mb-2"> {/* Added margin-bottom to separate from links */}
          &copy; {new Date().getFullYear()} Sampark AI. All rights reserved.
        </div>
        <div className="mb-2"> {/* Added margin-bottom */}
          {/* Uncommented and potentially adjusted links */}
          <a href="/privacy" className="hover:text-gray-300 mx-2">Privacy Policy</a>
          <span className="text-gray-400">|</span>
          <a href="/terms" className="hover:text-gray-300 mx-2">Terms of Service</a>
        </div>
        <div>
          {/* Added "Created by" link */}
          Created by <a href="https://github.com/adityasriv2317" target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-gray-300 underline">Aditya Srivastava</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;