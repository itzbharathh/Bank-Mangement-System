// Frontend: React.js
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [accounts, setAccounts] = useState([]);
  const [name, setName] = useState("");
  const [initialDeposit, setInitialDeposit] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/accounts")
      .then((response) => setAccounts(response.data));
  }, []);

  const createAccount = () => {
    axios
      .post("http://localhost:5000/accounts", {
        name,
        initialDeposit: parseFloat(initialDeposit),
      })
      .then((response) => setAccounts([...accounts, response.data]));
  };

  const updateAccount = (id, newName) => {
    axios
      .put(`http://localhost:5000/accounts/${id}`, { name: newName })
      .then((response) =>
        setAccounts(
          accounts.map((acc) => (acc.id === id ? response.data : acc))
        )
      );
  };

  const deleteAccount = (id) => {
    axios
      .delete(`http://localhost:5000/accounts/${id}`)
      .then(() => setAccounts(accounts.filter((acc) => acc.id !== id)))
      .catch((error) =>
        console.error("Error deleting account:", error.response?.data || error)
      );
  };

  return (
    <div>
      <h1>Bank Management System</h1>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Initial Deposit"
        value={initialDeposit}
        onChange={(e) => setInitialDeposit(e.target.value)}
      />
      <button onClick={createAccount}>Create Account</button>
      <h2>Accounts</h2>
      <ul>
        {accounts.map((account) => (
          <li key={account.id}>
            {account.name} - Balance: ${account.balance}
            <button
              onClick={() =>
                updateAccount(
                  account.id,
                  prompt("Enter new name:", account.name)
                )
              }
            >
              Update
            </button>
            <button onClick={() => deleteAccount(account.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
