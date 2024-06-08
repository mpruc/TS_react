import React, { useEffect, useState } from "react";
import "./Loans.css";
import { Button } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useApi } from "../api/dto/ApiProvider";
import { GetLoanResponseDto } from "../api/dto/loan.dto";

function Loans() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loansPerPage] = useState<number>(10);

  const [loanData, setLoanData] = useState<GetLoanResponseDto[]>([]);
  const apiClient = useApi();

  useEffect(() => {
    apiClient.getLoans().then((response) => {
      if (response.success) {
        const formattedLoanData = response.data.map(
          (loan: GetLoanResponseDto) => ({
            ...loan,
            loanDate: new Date(loan.loanDate).toISOString().split("T")[0],
            dueDate: new Date(loan.dueDate).toISOString().split("T")[0],
            returnDate: loan.returnDate
              ? new Date(loan.returnDate).toISOString().split("T")[0]
              : null,
          }),
        );
        setLoanData(formattedLoanData);
      } else {
        console.error("Failed to fetch loans:", response.statusCode);
      }
    });
  }, [apiClient]);

  const indexOfLastLoan = currentPage * loansPerPage;
  const indexOfFirstLoan = indexOfLastLoan - loansPerPage;
  const currentLoans = loanData.slice(indexOfFirstLoan, indexOfLastLoan);

  return (
    <div className="loans">
      <nav className="navbar">
        <div className="nav-links">
          <Link to="/main_librarian">Strona główna</Link>
          <Link to="/"> Wyloguj</Link>
        </div>
      </nav>
      <header className="header">Wypożyczenia książek</header>
      <table className="loan-table">
        <thead>
          <tr>
            <th>ID wypożyczenia</th>
            <th>Książka</th>
            <th>Użytkownik</th>
            <th>Data wypożyczenia</th>
            <th>Wymagany termin oddania</th>
            <th>Data zwrotu</th>
          </tr>
        </thead>
        <tbody>
          {currentLoans.map((loan) => (
            <tr key={loan.loanId}>
              <td>{loan.loanId}</td>
              <td>{loan.bookId.id}</td>
              <td>{loan.user.id}</td>
              <td>{new Date(loan.loanDate).toISOString().split("T")[0]}</td>
              <td>{new Date(loan.dueDate).toISOString().split("T")[0]}</td>
              <td>
                {loan.returnDate
                  ? new Date(loan.returnDate).toISOString().split("T")[0]
                  : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          onClick={() =>
            setCurrentPage((prevPage) =>
              prevPage > 1 ? prevPage - 1 : prevPage,
            )
          }
        >
          &lt;
        </button>
        <button
          onClick={() =>
            setCurrentPage((prevPage) =>
              prevPage < Math.ceil(loanData.length / loansPerPage)
                ? prevPage + 1
                : prevPage,
            )
          }
        >
          &gt;
        </button>
      </div>
      <div className="add-loan-button">
        <Link to="/add_loan">
          <Button variant="contained" style={{ backgroundColor: "purple" }}>
            Dodaj wypożyczenie
          </Button>
        </Link>
        &nbsp;&nbsp;&nbsp;
        <Link to="/delete_loan">
          <Button variant="contained" style={{ backgroundColor: "purple" }}>
            Usuń wypożyczenie
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Loans;
