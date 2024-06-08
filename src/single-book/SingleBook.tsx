import React, { useEffect, useState } from "react";
import "./SingleBook.css";
import { Link, useParams } from "react-router-dom";
import { useApi } from "../api/dto/ApiProvider";

function SingleBook() {
  const { id } = useParams<{ id: string }>();
  const [bookData, setBookData] = useState<any | null>(null);
  const apiClient = useApi();

  useEffect(() => {
    if (!id) return;

    apiClient.getBookById(id).then((response) => {
      if (response.success) {
        setBookData(response.data);
      } else {
        console.error("Failed to fetch book:", response.statusCode);
      }
    });
  }, [apiClient, id]);

  if (!bookData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="single-book">
      <nav className="navbar">
        <div className="nav-links">
          <Link to={`/book-details/${bookData.id}`}>Szczegóły książki</Link>
          <Link to={`/reviews/${bookData.id}`}>Recenzje książki</Link>
          <Link to="/books">Lista książek</Link>
          <Link to="/main">Strona główna</Link>
          <Link to="/">Wyloguj</Link>
        </div>
      </nav>
      <header className="header">Informacje o książce</header>
      <table className="book-table">
        <tbody>
          {Object.entries(bookData).map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{String(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SingleBook;
