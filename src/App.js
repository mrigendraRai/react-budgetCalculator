import React, { useState, useEffect } from 'react';
//import useState(), function returns [] with two values
//the actual value of the state and function for update/control , default value

//useEffect --- runs after every render | first parameter - callback function (runs after render)
//second parameter - Array - for letting react know when to run useEffect
//react re-renders when state has changed or props 
import './App.css';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import Alert from './components/Alert';
import uuid from 'uuid/v4';

// const initialExpenses = [
//   { id: uuid(), charge: "rent", amount: 1600 },
//   { id: uuid(), charge: "car payment", amount: 400 },
//   { id: uuid(), charge: "credit card bill", amount: 1200 }
// ];

const initialExpenses = localStorage.getItem('expenses') ? 
JSON.parse(localStorage.getItem("expenses")) : [];


function App() {
  //******* State Values ********
  // all expenses, add expense
  const [expenses, setExpenses] = useState(initialExpenses);
  // Single Expense
  const [charge, setCharge] = useState('');
  // Single Amount
  const [amount, setAmount] = useState('');
  // Alert
  const [alert, setAlert] = useState({ show: false });
  // edit
  const [edit, setEdit] = useState(false);

  // Edit Item
  const [id, setId] = useState(0);

  //******** useEffect ***********
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses)
    );
  });

  //******* Functionality ********
  // handle charge
  const handleCharge = e => {
    setCharge(e.target.value);
  };

  // handle ampount
  const handleAmount = e => {
    setAmount(e.target.value);
  };
  // handle Alert
  const handleAlert = ({ type, text }) => {
    setAlert({ show: true, type, text });
    setTimeout(() => {
      setAlert({ show: false })
    }, 3000)
  }

  // handle Submit
  const handleSubmit = e => {
    e.preventDefault();
    if (charge != '' && amount > 0) {
      if(edit) {
        let tempExpenses = expenses.map(item => {
          return item.id === id ? {...item, charge, amount} : item;
        });
        setExpenses(tempExpenses);
        setEdit(false);
        handleAlert({ type: 'success', text: 'item Edited' });
      }else {
        const singleExpense = { id: uuid(), charge, amount };
        setExpenses([...expenses, singleExpense]);
        handleAlert({ type: 'success', text: 'item added' });
      }
      
      setCharge('');
      setAmount('');
      
    } else {
      // handle alert called
      handleAlert({
        type: 'danger',
        text: `charge can't be empty value has to be bigger than zero`
      });
    }
  };

  // handle clear all items
  const clearItems = () => {
    setExpenses([]);
    handleAlert({type:"danger", text:"All items  Deleted"});
  };

  //handle Delete 
  const handleDelete = (id) => {
    let tempExpenses = expenses.filter(item => item.id != id);
    setExpenses(tempExpenses);
    handleAlert({type:"danger", text:"item Deleted"});
  }

  //handle Edit 
  const handleEdit = (id) => {
    let expense = expenses.find(item => item.id ===id);
    let { charge, amount } = expense;
    setCharge(charge);
    setAmount(amount);
    setEdit(true);
    setId(id);
  }

  return (
    <>
      {alert.show && <Alert type={alert.type} text={alert.text} />}
      <Alert />
      <h1>budget calculator</h1>
      <main className="App">
        <ExpenseForm 
          charge={charge} 
          amount={amount} 
          handleCharge={handleCharge}
          handleAmount={handleAmount} 
          handleSubmit={handleSubmit}
          edit={edit} />
        <ExpenseList 
          expenses={expenses} 
          handleDelete={handleDelete} 
          handleEdit={handleEdit} 
          clearItems={clearItems} />
      </main>
      <h1>
        total spending: {" "}
        <span className="total">
          $ {expenses.reduce((acc, curr) => {
            return (acc += parseInt(curr.amount));
          }, 0)}
        </span>
      </h1>
    </>
  );
}

export default App;
