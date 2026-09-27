import React from 'react';
import { Camera, Heart, MessageCircle, Send, Bookmark, MoreHorizontal, BookOpen } from 'lucide-react';

export function Header() {
  return (
    <header className="app-header">
      <div className="logo-text">Knihovna</div>
      <div className="header-icons">
        <Heart size={24} color="#f5f5f5" />
        <MessageCircle size={24} color="#f5f5f5" />
      </div>
    </header>
  );
}

export function ScanSection({ onScanClick }) {
  return (
    <div className="scan-container">
      <button className="btn-scan" onClick={onScanClick}>
        <Camera size={22} />
        <span>Scan a book</span>
      </button>
    </div>
  );
}

export function BookCard({ book }) {
  const formattedDate = new Date(book.timestamp).toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <article className="post-card">
      {/* Header */}
      <div className="post-header">
        <div className="post-user">
          <div className="avatar">
            <div className="avatar-inner">
              <BookOpen size={16} />
            </div>
          </div>
          <div className="user-info">
            <span className="username">moje_knihovna</span>
            <span className="post-time">{formattedDate}</span>
          </div>
        </div>
        <MoreHorizontal size={20} color="#a8a8a8" />
      </div>

      {/* Book Cover Image */}
      <div className="post-image-container">
        <img
          src={book.coverUrl}
          alt={book.title}
          className="post-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/400x500/1e1e1e/a8a8a8?text=Kniha';
          }}
        />
      </div>

      {/* Action icons */}
      <div className="post-actions">
        <div className="action-buttons">
          <Heart size={24} color="#f5f5f5" />
          <MessageCircle size={24} color="#f5f5f5" />
          <Send size={24} color="#f5f5f5" />
        </div>
        <Bookmark size={24} color="#f5f5f5" />
      </div>

      {/* Book details */}
      <div className="post-details">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{book.author}</p>
        <span className="book-isbn">ISBN: {book.isbn}</span>
      </div>
    </article>
  );
}

export function BottomNav() {
  return (
    <nav className="bottom-nav">
      <div className="nav-item">
        <BookOpen size={24} />
      </div>
      <div className="nav-item">
        <Heart size={24} />
      </div>
    </nav>
  );
}
