import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TextField } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import BootstrapModal from './BootstrapModal';
import { useParams } from 'react-router-dom';
import { useUser } from './UserContext';
import Select from 'react-select';
import { NumericFormat } from 'react-number-format';

const Expense = () => {
    const [amount, setAmount] = useState(0);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedDate, setSelectedDate] = useState(dayjs()); // Initialize with current date
    const [expenseNote, setExpenseNote] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [showModal, setShowModal] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const { expenseId } = useParams();  // If an expense record is in editing mode
    const [editMode, setEditMode] = useState(false);    // If an expense record is in editing mode

    const { userId } = useUser();

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3001/category');
            const formattedCategories = response.data.map(category => ({
                value: category.category_id, // Change 'id' to the appropriate key from your category object
                label: category.category_name // Change 'name' to the appropriate key from your category object
            }));
            setCategories(formattedCategories);

            if (expenseId) {
                setEditMode(true);

                const expenseData = await axios.get(`http://localhost:3001/expense/${expenseId}`);
                console.log(expenseData.data)

                const amount = expenseData.data[0].amount;
                const categoryId = expenseData.data[0].category_id;
                const expenseNote = expenseData.data[0].expense_note;
                const expenseDate = expenseData.data[0].expense_date;
                
                setAmount(amount);
                setSelectedCategory(categoryId);
                setSelectedDate(dayjs(expenseDate));
                
                if (expenseNote !== null)
                    setExpenseNote(expenseNote);
            };
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();

        // console.log(userId)
    }, []);

    const handleAmountChange = values => {
        const { value } = values;
        setAmount(value);
    };

    const handleCategoryChange = selectedCategory => {
        setSelectedCategory(selectedCategory.value);
    };

    const handleDateChange = date => {
        setSelectedDate(date);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const formattedDate = selectedDate.format('YYYY/MM/DD');
    
        const newExpense = {
            amount: parseInt(amount),
            user_id: userId,
            category: parseInt(selectedCategory),
            expenseNote: expenseNote ? expenseNote : null,
            expenseDate: formattedDate
        };
    
        try {
            if (editMode) {
                await axios.put(`http://localhost:3001/expense/${expenseId}`, newExpense);
                setSuccessMessage('支出が正常に更新されました！');
            } else {
                await axios.post('http://localhost:3001/add_expense', newExpense);
                setSuccessMessage('支出が正常に保存されました！');
            }
    
            // Reset form fields
            setAmount(''); // Set to empty string for NumericFormat
            setSelectedCategory(null);
            setSelectedDate(dayjs()); // Reset date to current date
            setExpenseNote('');
            setShowModal(true);
    
        } catch (error) {
            console.error('Error saving expense:', error);
        }
    };
    

    return (
        <div className='container d-flex'>
            <div className='row mx-2 mt-3'>
                <div className='col card text-bg-light'>
                    <div className='card-body'>
                        <h3 className='bg-light mb-4'>{editMode ? "支出を編集" : "支出を追加"}</h3>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3" style={{ display: 'flex', alignItems: 'center' }}>
                                <label htmlFor="amount" style={{ marginRight: '1rem' }}>金額(￥):</label>
                                <NumericFormat
                                    id='amount'
                                    name='amount'
                                    className='form-control'
                                    thousandSeparator={true}
                                    decimalScale={0} // Adjust decimal scale as needed
                                    allowNegative={false}
                                    onValueChange={handleAmountChange}
                                    onFocus={e => e.target.select()}
                                    placeholder="例：1,000"
                                    value={amount}
                                    style={{ flex : 1 }}
                                />
                            </div>

                            <div className="mb-3" style={{ display: 'flex', alignItems: 'center' }}>
                                <label htmlFor="category" style={{ marginRight: '2rem' }}>カテゴリ:</label>
                                <Select
                                    options={categories}
                                    onChange={handleCategoryChange}
                                    value={categories.find(cat => cat.value === selectedCategory) || null}
                                    isSearchable={true}
                                    placeholder="カテゴリを選択してください"
                                    styles={{ container: (provided) => ({ ...provided, flex: 1 }) }}
                                />
                            </div>

                            <div className="mb-3" style={{ display: 'flex', alignItems: 'center' }}>
                                <label htmlFor="expenseNote" style={{ marginRight: '1rem' }}>追加ノート:</label>
                                <input 
                                    type='text' 
                                    className='form-control' 
                                    id='expenseNote' 
                                    onChange={e => setExpenseNote(e.target.value)}
                                    value={expenseNote}
                                    style={{ flex: 1 }}
                                />
                            </div>

                            <div className="mb-3" style={{ display: 'flex', alignItems: 'center' }}>
                                <label htmlFor="staticEmail" style={{ marginRight: '1rem' }}>日付:</label>
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ja'>
                                    <MobileDatePicker
                                        className='form-control'
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        renderInput={(params) => <TextField {...params} style={{ flex: 1 }} />}
                                        format='DD/MM/YYYY'
                                    />
                                </LocalizationProvider>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <button type="submit" className="btn btn-primary">保存</button>
                            </div>

                            <BootstrapModal successMessage={successMessage} showModal={showModal} closeModal={handleClose} />
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Expense;
