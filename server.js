// Backend: Node.js + Express
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let accounts = [];
let transactions = [];

// Create Account
app.post("/accounts", (req, res) => {
  const { name, initialDeposit } = req.body;
  const account = { id: accounts.length + 1, name, balance: initialDeposit };
  accounts.push(account);
  res.json(account);
});

// Get All Accounts
app.get("/accounts", (req, res) => {
  res.json(accounts);
});

// Update Account
app.put("/accounts/:id", (req, res) => {
  const id = parseInt(req.params.id); // Ensure id is a number
  const { name } = req.body;
  const account = accounts.find((acc) => acc.id === id);
  if (!account) return res.status(404).json({ message: "Account not found" });
  account.name = name;
  res.json(account);
});

app.delete("/accounts/:id", (req, res) => {
  const id = parseInt(req.params.id); // Ensure id is a number
  const index = accounts.findIndex((acc) => acc.id === id);
  if (index === -1)
    return res.status(404).json({ message: "Account not found" });
  accounts.splice(index, 1);
  res.json({ message: "Account deleted" });
});

// Deposit Money
app.post("/deposit", (req, res) => {
  const { id, amount } = req.body;
  const account = accounts.find((acc) => acc.id === id);
  if (!account) return res.status(404).send("Account not found");
  account.balance += amount;
  transactions.push({
    id: transactions.length + 1,
    accountId: id,
    type: "Deposit",
    amount,
  });
  res.json(account);
});

// Withdraw Money
app.post("/withdraw", (req, res) => {
  const { id, amount } = req.body;
  const account = accounts.find((acc) => acc.id === id);
  if (!account) return res.status(404).send("Account not found");
  if (account.balance < amount)
    return res.status(400).send("Insufficient funds");
  account.balance -= amount;
  transactions.push({
    id: transactions.length + 1,
    accountId: id,
    type: "Withdraw",
    amount,
  });
  res.json(account);
});

// Get Transactions
app.get("/transactions", (req, res) => {
  res.json(transactions);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
