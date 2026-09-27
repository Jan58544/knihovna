const STORAGE_KEY = 'knihovna_scanned_books';

/**
 * Get all saved scanned books from localStorage.
 * @returns {Array} Array of book objects
 */
export function getSavedBooks() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error reading books from localStorage:', err);
    return [];
  }
}

/**
 * Save a new scanned book entry to localStorage (prepends to list).
 * @param {Object} book Book object containing title, author, coverUrl, isbn, timestamp
 * @returns {Array} Updated array of books
 */
export function saveBook(book) {
  try {
    const books = getSavedBooks();
    const updatedBooks = [book, ...books];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBooks));
    return updatedBooks;
  } catch (err) {
    console.error('Error saving book to localStorage:', err);
    return [];
  }
}

/**
 * Clear all books (helper function if needed).
 */
export function clearSavedBooks() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing localStorage:', err);
  }
}
