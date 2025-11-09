import { useState, useEffect } from "react";
import "./BookDetailsPage.css";

function BookDetailsPage({ book, onBack }) {
    const [similarBooks, setSimilarBooks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!book) return;

        const fetchSimilarBooks = async () => {
            setLoading(true);
            try {
                // Try searching by title first, then author, then publisher, or use a default search
                const searchQueries = [
                    book.title,
                    book.author,
                    book.publisher,
                    "programming", // Default fallback search term
                    "javascript"   // Another fallback
                ].filter(Boolean);

                // Use the first available query
                const query = encodeURIComponent(searchQueries[0]);
                const response = await fetch(`https://api.itbook.store/1.0/search/${query}`);
                const data = await response.json();

                if (data.books && Array.isArray(data.books)) {
                    // Limit to 4 similar books and exclude the current book if it matches
                    const filtered = data.books
                        .filter(b => b.title !== book.title)
                        .slice(0, 4);
                    setSimilarBooks(filtered);
                } else {
                    // If no results, try a generic search
                    const fallbackResponse = await fetch(`https://api.itbook.store/1.0/search/programming`);
                    const fallbackData = await fallbackResponse.json();
                    if (fallbackData.books && Array.isArray(fallbackData.books)) {
                        setSimilarBooks(fallbackData.books.slice(0, 4));
                    }
                }
            } catch (error) {
                console.error("Error fetching similar books:", error);
                // Try a fallback search even on error
                try {
                    const fallbackResponse = await fetch(`https://api.itbook.store/1.0/search/programming`);
                    const fallbackData = await fallbackResponse.json();
                    if (fallbackData.books && Array.isArray(fallbackData.books)) {
                        setSimilarBooks(fallbackData.books.slice(0, 4));
                    }
                } catch (fallbackError) {
                    console.error("Error fetching fallback books:", fallbackError);
                    setSimilarBooks([]);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchSimilarBooks();
    }, [book]);

    if (!book) return null;

    const imgSrc = book.image || book.img || "";
    const title = book.title || "Untitled";

    return (
        <div className="book-details-page">
            <div className="details-header">
                <div className="breadcrumb">Book / {title}</div>
                <button className="back-button" onClick={onBack}>
                    BACK
                </button>
            </div>
            
            <div className="details-content">
                <div className="cover-section">
                    {imgSrc ? (
                        <img src={imgSrc} alt={title} className="cover-image" />
                    ) : (
                        <div className="cover-placeholder">{title}</div>
                    )}
                </div>
                
                <div className="info-section">
                    <h1 className="book-title">{title}</h1>
                    
                    <div className="details-list">
                        <div className="detail-row">
                            <span className="detail-label">Author:</span>
                            <span className="detail-value">{book.author || ""}</span>
                        </div>
                        
                        <div className="detail-row">
                            <span className="detail-label">Publisher:</span>
                            <span className="detail-value">{book.publisher || ""}</span>
                        </div>
                        
                        <div className="detail-row">
                            <span className="detail-label">Published:</span>
                            <span className="detail-value">{book.publicationYear || ""}</span>
                        </div>
                        
                        <div className="detail-row">
                            <span className="detail-label">Language:</span>
                            <span className="detail-value">{book.language || ""}</span>
                        </div>
                        
                        <div className="detail-row">
                            <span className="detail-label">Pages:</span>
                            <span className="detail-value">{book.pages || ""}</span>
                        </div>
                        
                        {book.price !== undefined && (
                            <div className="detail-row">
                                <span className="detail-label">Price:</span>
                                <span className="detail-value">${book.price}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="similar-books-section">
                <h2 className="similar-books-title">Similar Books</h2>
                {loading ? (
                    <div className="loading-message">Loading similar books...</div>
                ) : similarBooks.length > 0 ? (
                    <div className="similar-books-grid">
                        {similarBooks.map((similarBook, index) => (
                            <div key={index} className="similar-book-card">
                                {similarBook.image && (
                                    <img 
                                        src={similarBook.image} 
                                        alt={similarBook.title} 
                                        className="similar-book-image"
                                    />
                                )}
                                <div className="similar-book-info">
                                    <h3 className="similar-book-title">{similarBook.title}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="loading-message">No similar books found.</div>
                )}
            </div>
        </div>
    );
}

export default BookDetailsPage;

