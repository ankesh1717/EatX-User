import React from "react";
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer text-center border border-4">
      <div className="container">
        <p className="mb-1">
          &copy; 2025 <strong>EatX</strong>. All rights reserved.
        </p>
        <p className="mb-1">
          Crafted with 🍴 & ❤️ by <strong>Ankesh Kr Pandey</strong>
        </p>
        <p>
          <a
            href="https://www.instagram.com/kr_ankesh_"
            target="_blank"
            rel="noopener noreferrer"
            className="text-decoration-none"
          >
            📬 For any query, contact me on Instagram
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
