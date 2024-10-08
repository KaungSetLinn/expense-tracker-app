import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useUser } from "./UserContext";
import DeleteModal from "./DeleteModal";
import BootstrapModal from "./BootstrapModal";

const Transaction = () => {
    const [expenses, setExpenses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(true); // Loading state

    const { userId } = useUser();
    const imgRef = useRef(null);

    const handleShowDeleteModal = (expenseId) => {
        setExpenseToDelete(expenseId);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setExpenseToDelete(null);
    };

    const handleCloseSuccessModal = () => setShowSuccessModal(false);

    const handleDeleteExpense = async () => {
        if (expenseToDelete) {
            try {
                await axios.delete(`http://localhost:3001/expenses?expenseId=${expenseToDelete}`);
                fetchData();
                handleCloseDeleteModal();
                setSuccessMessage('支出が正常に削除されました！');
                setShowSuccessModal(true);
            } catch (error) {
                console.error('Error deleting expense:', error);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize]);

    const fetchData = async () => {
        setLoading(true); // Start loading
        try {
            const response = await axios.get(`http://localhost:3001/expenses?page=${currentPage}&size=${pageSize}&userId=${userId}`);
            setExpenses(response.data.data);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false); // End loading
        }
    };

    const onPageChange = (page) => {
        setCurrentPage(page);
        document.activeElement.blur();
    };

    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    };

    const handleImageClick = (imageData) => {
        const blob = new Blob([new Uint8Array(imageData)], { type: 'image/png' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    };

    const renderExpenses = () => {
        if (expenses.length === 0) {
            return (
                <tr>
                    <td colSpan="6" className="text-center">
                        データなし
                    </td>
                </tr>
            );
        }

        return expenses.map((expense, index) => {
            const actualIndex = (currentPage - 1) * pageSize + index + 1;
            const date = new Date(expense.expense_date);
            const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;

            return (
                <tr key={expense.expense_id}>
                    <td className="text-end">{actualIndex}</td>
                    <td className="text-end">￥{expense.amount.toLocaleString()}</td>
                    <td className="text-end">{expense.category_name}</td>
                    <td className="text-end">
                        {expense.receipt && (
                            <img 
                                ref={imgRef}
                                src={`data:image/png;base64,${arrayBufferToBase64(expense.receipt.data)}`} 
                                alt="Receipt" 
                                style={{ width: '50px', height: 'auto', cursor: 'pointer' }} 
                                onClick={() => handleImageClick(expense.receipt.data)}
                            />
                        )}
                    </td>
                    <td className="text-end">{formattedDate}</td>
                    <td className="text-end">
                        <Link to={`/expense/${expense.expense_id}`} style={{ textDecoration: 'none' }}>
                            <button className="btn btn-warning mx-2">
                                <FontAwesomeIcon icon={faPen} />
                            </button>
                        </Link>
                        <button className="btn btn-danger" onClick={() => handleShowDeleteModal(expense.expense_id)}>
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </td>
                </tr>
            );
        });
    };

    return (
        <div className="container">
            <table className="table table-striped mt-3">
                <thead>
                    <tr>
                        <th scope="col" className="text-end">#</th>
                        <th scope="col" className="text-end">金額</th>
                        <th scope="col" className="text-end">カテゴリ</th>
                        <th scope="col" className="text-end">領収書</th>
                        <th scope="col" className="text-end">日付</th>
                        <th scope="col" className="text-end">操作</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="6" className="text-center">
                                読み込み中...
                            </td>
                        </tr>
                    ) : (
                        renderExpenses()
                    )}
                </tbody>
            </table>
            <div className="row">
                <div className="col">
                    {totalPages > 1 && (
                        <nav aria-label="Page navigation example">
                            <ul className="pagination justify-content-end">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>前へ</button>
                                </li>
                                <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>次へ</button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </div>
            </div>
            <DeleteModal
                showModal={showDeleteModal}
                closeModal={handleCloseDeleteModal}
                handleDelete={handleDeleteExpense}
            />
            <BootstrapModal successMessage={successMessage} showModal={showSuccessModal} closeModal={handleCloseSuccessModal} />
        </div>
    );
};

export default Transaction;
