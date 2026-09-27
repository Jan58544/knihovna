/**
 * Fetches book details by ISBN from Google Books API with fallback to Open Library API.
 * If not found, returns fallback title and default placeholder image.
 *
 * @param {string} rawIsbn - Clean or raw ISBN barcode string
 * @returns {Promise<Object>} Book details object
 */
export async function fetchBookByISBN(rawIsbn) {
  const isbn = rawIsbn.replace(/[^0-9X]/gi, '');
  const timestamp = new Date().toISOString();

  // Default fallback data if no details are found
  const fallbackBook = {
    id: `${isbn}-${Date.now()}`,
    isbn: isbn || rawIsbn,
    title: `Kniha (${isbn || rawIsbn})`,
    author: 'Neznámý autor',
    coverUrl: 'https://via.placeholder.com/400x500/1e1e1e/a8a8a8?text=Kniha+nenalezena',
    timestamp,
  };

  if (!isbn) {
    return fallbackBook;
  }

  // 1. Try Google Books API
  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
    if (response.ok) {
      const data = await response.json();
      if (data.totalItems > 0 && data.items && data.items[0]) {
        const volumeInfo = data.items[0].volumeInfo;
        const title = volumeInfo.title || fallbackBook.title;
        const author = volumeInfo.authors ? volumeInfo.authors.join(', ') : fallbackBook.author;

        // Handle cover image
        let coverUrl = fallbackBook.coverUrl;
        if (volumeInfo.imageLinks) {
          coverUrl = volumeInfo.imageLinks.thumbnail || volumeInfo.imageLinks.smallThumbnail || coverUrl;
          // Force https
          if (coverUrl.startsWith('http://')) {
            coverUrl = coverUrl.replace('http://', 'https://');
          }
        } else {
          coverUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`;
        }

        return {
          id: `${isbn}-${Date.now()}`,
          isbn,
          title,
          author,
          coverUrl,
          timestamp,
        };
      }
    }
  } catch (err) {
    console.warn('Google Books API error, trying Open Library:', err);
  }

  // 2. Fallback to Open Library API
  try {
    const response = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
    if (response.ok) {
      const data = await response.json();
      const bookData = data[`ISBN:${isbn}`];
      if (bookData) {
        const title = bookData.title || fallbackBook.title;
        const author = bookData.authors ? bookData.authors.map(a => a.name).join(', ') : fallbackBook.author;
        let coverUrl = bookData.cover ? (bookData.cover.large || bookData.cover.medium || bookData.cover.small) : fallbackBook.coverUrl;
        if (coverUrl && coverUrl.startsWith('http://')) {
          coverUrl = coverUrl.replace('http://', 'https://');
        }

        return {
          id: `${isbn}-${Date.now()}`,
          isbn,
          title,
          author,
          coverUrl: coverUrl || fallbackBook.coverUrl,
          timestamp,
        };
      }
    }
  } catch (err) {
    console.warn('Open Library API error:', err);
  }

  return fallbackBook;
}
