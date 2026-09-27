import React, { useState, useEffect } from 'react';
import { Header, ScanSection, BookCard, BottomNav } from './components/InstagramUI';
import { ScannerModal } from './components/ScannerModal';
import { getSavedBooks, saveBook } from './utils/storage';
import { fetchBookByISBN } from './utils/bookApi';
import { BookOpen, Loader } from 'lucide-react';

export default function App() {
  const [books, setBooks] = useState([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isFetchingBook, setIsFetchingBook] = useState(false);

  useEffect(() => {
    // Load initial saved books from localStorage
    const saved = getSavedBooks();
    setBooks(saved);
  }, []);

  const handleOpenScanner = () => {
    setIsScannerOpen(true);
  };

  const handleCloseScanner = () => {
    setIsScannerOpen(false);
  };

  const handleScanSuccess = async (rawIsbn) => {
    setIsScannerOpen(false);
    setIsFetchingBook(true);

    try {
      const bookData = await fetchBookByISBN(rawIsbn);
      const updatedBooks = saveBook(bookData);
      setBooks(updatedBooks);
    } catch (err) {
      console.error('Error processing scanned ISBN:', err);
    } finally {
      setIsFetchingBook(false);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Top Instagram Header */}
      <Header />

      {/* Main Scan Button directly below Header */}
      <ScanSection onScanClick={handleOpenScanner} />

      {/* Loading Overlay when fetching ISBN details */}
      {isFetchingBook && (
        <div
          style={{
            padding: '20px',
            textAlign: 'center',
            color: '#a8a8a8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            backgroundColor: '#121212',
            borderBottom: '1px solid #262626',
          }}
        >
          <Loader size={20} className="spin" />
          <span>Vyhledávání knihy v databázi...</span>
        </div>
      )}

      {/* Feed list of all scanned books */}
      <main className="feed-container">
        {books.length === 0 ? (
          <div className="empty-feed">
            <BookOpen size={48} strokeWidth={1.5} style={{ marginBottom: '16px', opacity: 0.6 }} />
            <h3>Zatím žádné naskenované knihy</h3>
            <p>Klikněte na tlačítko "Scan a book" nahoře a naskenujte čárový kód knihy.</p>
          </div>
        ) : (
          books.map((book) => <BookCard key={book.id} book={book} />)
        )}
      </main>

      {/* Camera Scanner Modal */}
      {isScannerOpen && (
        <ScannerModal onClose={handleCloseScanner} onScanSuccess={handleScanSuccess} />
      )}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
