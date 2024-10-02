const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const path = require('path')

const app = express()

app.use(express.static(path.join(__dirname, "public")))
app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "expense_tracker_db"
})

app.post('/signup', (req, res) => {
    const sql = "INSERT INTO users (user_id, email) VALUES (?, ?)";

    const values = [
        req.body.user_id,
        req.body.email
    ]

    db.query(sql, values, (err, result) => {
        if (err)
            return res.json({message: "Something happened" + err})

        return res.json({success: "Successful"})
    });
});

app.get('/category', (req, res) => {
    const sql = "SELECT * FROM expense_category";

    db.query(sql, (err, rows) => {
        res.json(rows);
    });
});

app.delete('/expenses', (req, res) => {
    const expenseId = req.query.expenseId;

    const sql = "DELETE FROM expense WHERE expense_id = ?";

    db.query(sql, [expenseId], (err, result) => {
        if (err)
            return res.json({message: "Something happened" + err})

        return res.json({success: "Successful"})
    });
});

// GET endpoint for /expenses with pagination
app.get('/expenses', (req, res) => {
    const userId = req.query.userId;

    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const size = parseInt(req.query.size) || 10; // Default to 10 records per page if not specified

    // Calculate offset for pagination
    const offset = (page - 1) * size;

    // SQL query to fetch total count of records
    const countQuery = "SELECT COUNT(*) AS totalCount FROM expense WHERE user_id = ?";
    db.query(countQuery, [userId], (err, countResult) => {
        if (err) {
            console.error('Error counting expenses:', err);
            res.status(500).json({ error: 'Failed to fetch expenses' });
            return;
        }

        const totalCount = countResult[0].totalCount;

        // SQL query with pagination
        const sql = "SELECT expense_id, amount, category_name, expense_note, expense_date FROM expense_summary WHERE user_id = ? ORDER BY expense_date DESC, expense_id DESC LIMIT ?, ?";
        db.query(sql, [userId, offset, size], (err, rows) => {
            if (err) {
                console.error('Error fetching expenses:', err);
                res.status(500).json({ error: 'Failed to fetch expenses' });
                return;
            }

            const totalPages = Math.ceil(totalCount / size);
            res.json({
                data: rows,
                totalPages: totalPages
            });
        });
    });
});


app.get('/expense/:expenseId', (req,res) => {
    const expenseId = req.params.expenseId;
    const sql = "SELECT amount, category_id, expense_note, expense_date FROM expense WHERE expense_id = ?";

    db.query(sql, [expenseId], (err, rows) => {
        res.json(rows);
    });
});

app.put('/expense/:expenseId', (req, res) => {
    const expenseId = req.params.expenseId;
    const sql = "UPDATE expense SET amount = ?, category_id = ?, expense_note = ?, expense_date = ? WHERE expense_id = ?";

    const values = [
        req.body.amount,
        req.body.category,
        req.body.expenseNote,
        req.body.expenseDate,
        expenseId
    ]

    db.query(sql, values, (err, result) => {
        if (err)
            return res.json({message: "Something happened" + err})

        return res.json({success: "Successful"})
    });
});

// GET /expenses/this-week-total route to fetch this week's total expense
app.get('/expenses/this-week-total', (req, res) => {
    const userId = req.query.userId;

    const sql = "SELECT round(SUM(amount), 0) AS week_expense FROM expense_summary WHERE YEARWEEK(`expense_date`, 1) = YEARWEEK(CURDATE(), 1) AND user_id = ?";

    db.query(sql, [userId], (err, rows) => {
        res.json(rows);
    });
});

app.get('/expenses/this-month-total', (req, res) => {
    const userId = req.query.userId;

    const sql = "SELECT round(SUM(amount), 0) AS month_expense FROM expense_summary WHERE YEAR(expense_date) = YEAR(CURDATE()) AND MONTH(expense_date) = MONTH(CURDATE()) AND user_id = ?";

    db.query(sql, [userId], (err, rows) => {
        res.json(rows);
    });
});

app.get('/expenses/total', (req, res) => {
    const userId = req.query.userId;

    const sql = "SELECT round(SUM(amount), 0) AS total_expense FROM expense_summary WHERE user_id = ?";

    db.query(sql, [userId], (err, rows) => {
        res.json(rows);
    });
});

app.get('/get_overall_expenses', (req, res) => {
    const userId = req.query.userId;

    const sql = "SELECT category_name, ROUND(SUM(amount), 0) AS total_amount FROM expense_summary WHERE user_id = ? GROUP BY category_id ORDER BY category_id";

    db.query(sql, [userId], (err, rows) => {
        res.json(rows);
    });
});

app.post('/add_expense', (req, res) => {
    const sql = "INSERT INTO expense (amount, user_id, category_id, expense_note, expense_date) VALUES (?, ?, ?, ?, ?)";

    const values = [
        req.body.amount,
        req.body.user_id,
        req.body.category,
        req.body.expenseNote,
        req.body.expenseDate
    ]

    db.query(sql, values, (err, result) => {
        if (err)
            return res.json({message: "Something happened" + err})

        return res.json({success: "Successful"})
    });
});

app.get('/get-report-by-month', (req, res) => {
    const userId = req.query.userId;
    const month = req.query.month;

    const year = new Date().getFullYear();

    const sql = "SELECT SUM(amount) as amount, DAY(expense_date) as day FROM expense_summary WHERE user_id = ? AND MONTH(expense_date) = ? AND YEAR(expense_date) = ? GROUP BY day(expense_date) ORDER BY expense_date ASC";

    db.query(sql, [userId, month, year], (err, rows) => {
        if (err)
            return err;

        res.json(rows);
    });
});

app.get('/get-report-by-year', (req, res) => {
    const userId = req.query.userId;
    const year = req.query.year;

    const sql = "SELECT SUM(amount) as amount, MONTH(expense_date) as month FROM expense_summary WHERE user_id = ? AND YEAR(expense_date) = ? GROUP BY MONTH(expense_date) ORDER BY expense_date ASC";

    db.query(sql, [userId, year], (err, rows) => {
        if (err)
            return err;

        res.json(rows);
    });
});

app.listen(3001, () => {
    console.log("server running on port 3001");
});