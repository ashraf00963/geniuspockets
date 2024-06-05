import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import './pockets.css';

function Pockets() {
  const [pockets, setPockets] = useState([]);
  const [newPocket, setNewPocket] = useState({ name: '', description: '', goal_amount: '', deadline: '' });
  const [editingPocket, setEditingPocket] = useState(null);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [selectedPocket, setSelectedPocket] = useState('');
  const [addAmount, setAddAmount] = useState('');
  const [showAddMoneyForm, setShowAddMoneyForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchPockets(token);
    fetchAvailableBalance(token);
  }, [navigate]);

  const fetchPockets = (token) => {
    $.ajax({
      url: 'https://geniuspockets.com/get_savings_pockets.php',
      method: 'POST',
      data: { token },
      dataType: 'json',
      success: (response) => {
        setPockets(response.savings_pockets);
      },
      error: (xhr, status, error) => {
        console.error('Error fetching pockets:', error);
      }
    });
  };

  const fetchAvailableBalance = (token) => {
    $.ajax({
      url: 'https://geniuspockets.com/get_total_balance.php',
      method: 'POST',
      data: { token },
      dataType: 'json',
      success: (response) => {
        setAvailableBalance(response.total_balance);
      },
      error: (xhr, status, error) => {
        console.error('Error fetching available balance:', error);
      }
    });
  };

  const handleAddPocket = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    $.ajax({
      url: 'https://geniuspockets.com/add_savings_pocket.php',
      method: 'POST',
      data: { ...newPocket, token },
      dataType: 'json',
      success: (response) => {
        if (response.success) {
          setNewPocket({ name: '', description: '', goal_amount: '', deadline: '' });
          fetchPockets(token);
        } else {
          console.error('Error adding pocket:', response.message);
        }
      },
      error: (xhr, status, error) => {
        console.error('Error adding pocket:', error);
      }
    });
  };

  const handleDeletePocket = (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    $.ajax({
      url: 'https://geniuspockets.com/delete_pocket.php',
      method: 'POST',
      data: { id, token },
      dataType: 'json',
      success: (response) => {
        if (response.success) {
          fetchPockets(token);
        } else {
          console.error('Error deleting pocket:', response.message);
        }
      },
      error: (xhr, status, error) => {
        console.error('Error deleting pocket:', error);
      }
    });
  };

  const handleEditPocket = (pocket) => {
    setEditingPocket(pocket);
  };

  const handleUpdatePocket = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    $.ajax({
      url: 'https://geniuspockets.com/update_pocket.php',
      method: 'POST',
      data: { ...editingPocket, token },
      dataType: 'json',
      success: (response) => {
        if (response.success) {
          setEditingPocket(null);
          fetchPockets(token);
        } else {
          console.error('Error updating pocket:', response.message);
        }
      },
      error: (xhr, status, error) => {
        console.error('Error updating pocket:', error);
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPocket((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingPocket((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMoney = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (parseFloat(addAmount) > parseFloat(availableBalance)) {
      alert("Insufficient balance to add this amount.");
      return;
    }

    $.ajax({
      url: 'https://geniuspockets.com/add_money_to_pocket.php',
      method: 'POST',
      data: { pocket_id: selectedPocket, amount: addAmount, token },
      dataType: 'json',
      success: (response) => {
        if (response.success) {
          setShowAddMoneyForm(false);
          setAddAmount('');
          fetchPockets(token);
          fetchAvailableBalance(token);
        } else {
          console.error('Error adding money to pocket:', response.message);
        }
      },
      error: (xhr, status, error) => {
        console.error('Error adding money to pocket:', error);
      }
    });
  };

  return (
    <div className="pockets">
      <h2>My Pockets</h2>
      <p>Available Balance: ${availableBalance}</p>
      <button onClick={() => setEditingPocket(null)}>Add Pocket</button>
      <button onClick={() => setShowAddMoneyForm(!showAddMoneyForm)}>Add Money</button>
      {showAddMoneyForm && (
        <form className="add-money-form" onSubmit={handleAddMoney}>
          <h3>Add Money to Pocket</h3>
          <select
            value={selectedPocket}
            onChange={(e) => setSelectedPocket(e.target.value)}
            required
          >
            <option value="">Select Pocket</option>
            {pockets.map((pocket) => (
              <option key={pocket.id} value={pocket.id}>
                {pocket.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={addAmount}
            onChange={(e) => setAddAmount(e.target.value)}
            placeholder="Amount"
            required
          />
          <button type="submit">Add Money</button>
        </form>
      )}
      <div className="pockets__list">
        {pockets.map((pocket) => (
          <div key={pocket.id} className="pocket">
            <h3>{pocket.name}</h3>
            <p>Description: {pocket.description}</p>
            <p>Goal: ${pocket.goal_amount}</p>
            <p>Deadline: {pocket.deadline}</p>
            <p>Saved: ${pocket.saved_amount}</p>
            <button onClick={() => handleEditPocket(pocket)}>Edit</button>
            <button className="delete-button" onClick={() => handleDeletePocket(pocket.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      {!editingPocket ? (
        <form className="add-pocket-form" onSubmit={handleAddPocket}>
          <h3>Add New Pocket</h3>
          <input
            type="text"
            name="name"
            value={newPocket.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <input
            type="text"
            name="description"
            value={newPocket.description}
            onChange={handleChange}
            placeholder="Description"
            required
          />
          <input
            type="number"
            name="goal_amount"
            value={newPocket.goal_amount}
            onChange={handleChange}
            placeholder="Goal Amount"
            required
          />
          <input
            type="date"
            name="deadline"
            value={newPocket.deadline}
            onChange={handleChange}
            required
          />
          <button type="submit" className="add-pocket-button">
            Add Pocket
          </button>
        </form>
      ) : (
        <form className="edit-pocket-form" onSubmit={handleUpdatePocket}>
          <h3>Edit Pocket</h3>
          <input
            type="text"
            name="name"
            value={editingPocket.name}
            onChange={handleEditChange}
            placeholder="Name"
            required
          />
          <input
            type="text"
            name="description"
            value={editingPocket.description}
            onChange={handleEditChange}
            placeholder="Description"
            required
          />
          <input
            type="number"
            name="goal_amount"
            value={editingPocket.goal_amount}
            onChange={handleEditChange}
            placeholder="Goal Amount"
            required
          />
          <input
            type="date"
            name="deadline"
            value={editingPocket.deadline}
            onChange={handleEditChange}
            required
          />
          <button type="submit" className="edit-pocket-button">
            Update Pocket
          </button>
        </form>
      )}
    </div>
  );
}

export default Pockets;
