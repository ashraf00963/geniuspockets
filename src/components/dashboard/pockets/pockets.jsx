import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import './pockets.css';

function Pockets() {
  const [pockets, setPockets] = useState([]);
  const [newPocket, setNewPocket] = useState({ name: '', description: '', goal_amount: '', deadline: '' });
  const [editPocket, setEditPocket] = useState(null);
  const [totalBalance, setTotalBalance] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchPockets(token);
    fetchTotalBalance(token);
  }, [navigate]);

  const fetchPockets = (token) => {
    $.ajax({
      url: 'https://geniuspockets.com/get_savings_pockets.php',
      method: 'POST',
      data: { token },
      dataType: 'json',
      success: (response) => {
        setPockets(response.savings_pockets);
        updateAvailableBalance(response.savings_pockets);
      },
      error: (xhr, status, error) => {
        console.error('Error fetching pockets:', error);
      }
    });
  };

  const fetchTotalBalance = (token) => {
    $.ajax({
      url: 'https://geniuspockets.com/get_total_balance.php',
      method: 'POST',
      data: { token },
      dataType: 'json',
      success: (response) => {
        setTotalBalance(response.total_balance);
        setAvailableBalance(response.total_balance);
      },
      error: (xhr, status, error) => {
        console.error('Error fetching total balance:', error);
      }
    });
  };

  const updateAvailableBalance = (pockets) => {
    const totalSaved = pockets.reduce((sum, pocket) => sum + parseFloat(pocket.saved_amount), 0);
    setAvailableBalance(totalBalance - totalSaved);
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
          setShowAddForm(false);
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

  const handleEditPocket = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    $.ajax({
      url: 'https://geniuspockets.com/update_pocket.php',
      method: 'POST',
      data: { ...editPocket, token },
      dataType: 'json',
      success: (response) => {
        if (response.success) {
          setEditPocket(null);
          setShowEditForm(false);
          fetchPockets(token);
        } else {
          console.error('Error editing pocket:', response.message);
        }
      },
      error: (xhr, status, error) => {
        console.error('Error editing pocket:', error);
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
          fetchTotalBalance(token);
        } else {
          console.error('Error deleting pocket:', response.message);
        }
      },
      error: (xhr, status, error) => {
        console.error('Error deleting pocket:', error);
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (showAddForm) {
      setNewPocket((prev) => ({ ...prev, [name]: value }));
    } else if (showEditForm) {
      setEditPocket((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditClick = (pocket) => {
    setEditPocket(pocket);
    setShowEditForm(true);
    setShowAddForm(false);
  };

  return (
    <div className="pockets">
      <h2>My Pockets</h2>
      <div className="total-balance">
        <h3>Total Balance: ${totalBalance}</h3>
        <h3>Available Balance: ${availableBalance}</h3>
      </div>
      <div className="pockets__list">
        {pockets.map((pocket) => (
          <div key={pocket.id} className="pocket">
            <h3>{pocket.name}</h3>
            <p>Description: {pocket.description}</p>
            <p>Goal: ${pocket.goal_amount}</p>
            <p>Deadline: {pocket.deadline}</p>
            <p>Saved: ${pocket.saved_amount}</p>
            <button className="edit-button" onClick={() => handleEditClick(pocket)}>
              Edit
            </button>
            <button className="delete-button" onClick={() => handleDeletePocket(pocket.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
      <div className="pockets__actions">
        <button className="add-pocket-button" onClick={() => setShowAddForm(true)}>
          Add Pocket
        </button>
        <button className="edit-pocket-button" onClick={() => setShowEditForm(true)}>
          Edit Pocket
        </button>
      </div>
      {showAddForm && (
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
      )}
      {showEditForm && editPocket && (
        <form className="edit-pocket-form" onSubmit={handleEditPocket}>
          <h3>Edit Pocket</h3>
          <input
            type="text"
            name="name"
            value={editPocket.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <input
            type="text"
            name="description"
            value={editPocket.description}
            onChange={handleChange}
            placeholder="Description"
            required
          />
          <input
            type="number"
            name="goal_amount"
            value={editPocket.goal_amount}
            onChange={handleChange}
            placeholder="Goal Amount"
            required
          />
          <input
            type="date"
            name="deadline"
            value={editPocket.deadline}
            onChange={handleChange}
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
