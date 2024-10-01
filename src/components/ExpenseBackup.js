import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TextField } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';

const ExpenseBackup = () => {
    const [amount, setAmount] = useState(0);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedDate, setSelectedDate] = useState(dayjs()); // Initialize with current date
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/categories');
                console.log(response)
                setCategories(response.data); // Assuming response.data is an array of category objects
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleAmountChange = event => {
        setAmount(event.target.value);
    };

    const handleCategoryChange = event => {
        setSelectedCategory(event.target.value);
    };

    const handleDateChange = date => {
        setSelectedDate(date);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const formattedDate = selectedDate.format('MM/DD/YYYY');

        const newExpense = {
            amount: parseFloat(amount),
            category: selectedCategory,
            expenseDate: formattedDate
        };

        try {
            const response = await axios.post('http://localhost:3001/expenses', newExpense);
            console.log('Expense saved:', response.data);

            // Set success message
            setSuccessMessage('Expense added successfully!');

            setAmount(0); // Optionally reset form fields
            setSelectedCategory(1);
            setSelectedDate(dayjs()); // Reset date to current date
        } catch (error) {
            console.error('Error saving expense:', error);
        }
    };

    const saveExpense = async (expenseData) => {
        try {
            const response = await axios.post('http://localhost/ExpenseTrackerBackend/save_expense_test.php', expenseData);
            console.log(response.data);
            // Optionally, reset form fields or perform other actions upon successful submission
        } catch (error) {
            console.error('Error saving expense:', error);
            throw error; // Rethrow the error to handle it in the handleSubmit function
        }
    };

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-4'>
                    <h3 className='bg-light text-left'>経費を追加</h3>

                    {/* Success Message Alert */}
                    {successMessage && (
                        <div className="alert alert-success" role="alert">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3 row">
                            <label htmlFor="amount" className="col-sm-2 col-form-label">金額:</label>
                            <div className="col-sm-9">
                                <input 
                                    type='number' 
                                    step={0.01}
                                    id='amount' 
                                    name='amount' 
                                    min={0}
                                    className='form-control'
                                    value={amount}
                                    onFocus={e => e.target.select()}
                                    onChange={handleAmountChange}
                                />
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <label htmlFor="category" className="col-sm-2 col-form-label">種類:</label>
                            <div className="col-sm-9">
                                <select id="category" className="form-select" value={selectedCategory} onChange={handleCategoryChange}>
                                    {categories.map(category => (
                                        <option key={category.category_id} value={category.category_name}>{category.category_name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <label htmlFor="staticEmail" className="col-sm-2 col-form-label">日付:</label>
                            <div className="col-sm-6">
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ja'>
                                    <MobileDatePicker
                                        label="日付"
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        renderInput={(params) => <TextField {...params} />}
                                        format='MM/DD/YYYY'
                                    />
                                </LocalizationProvider>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ExpenseBackup;
