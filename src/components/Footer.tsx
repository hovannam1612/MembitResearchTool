import React from 'react';
import { BookOpen } from 'lucide-react';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-left">
          <p>&copy; {currentYear} Membit Research Tool | Created by <span className="author-name">hvn_bit</span></p>
        </div>
        <div className="footer-right">
          <a
            href="https://docs.membit.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            <BookOpen size={14} />
            Membit AI Documentation
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
