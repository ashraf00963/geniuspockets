import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import './pockets.css';

function Pockets() {
  const [pockets, setPockets] = useState([]);
  const [newPocket, setNewPocket] = useState({ name: '', description: '', goal_amount: '', deadline: '' });
  const [editingPocket, setEditingPocket] = useState(null);
  const [deletingPocket, setDeletingPocket] = useState(null);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [selectedPocket, setSelectedPocket] = useState('');
  const [addAmount, setAddAmount] = useState('');
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [showAddPocketModal, setShowAddPocketModal] = useState(false);
  const [showEditPocketModal, setShowEditPocketModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
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
          setShowAddPocketModal(false);
        } else {
          console.error('Error adding pocket:', response.message);
        }
      },
      error: (xhr, status, error) => {
        console.error('Error adding pocket:', error);
      }
    });
  };

  const handleDeletePocket = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    $.ajax({
      url: 'https://geniuspockets.com/delete_pocket.php',
      method: 'POST',
      data: { id: deletingPocket.id, token },
      dataType: 'json',
      success: (response) => {
        if (response.success) {
          fetchPockets(token);
          setShowDeleteConfirmModal(false);
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
    setShowEditPocketModal(true);
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
          setShowEditPocketModal(false);
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
          setShowAddMoneyModal(false);
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
    <div className="pockets__page container">
      <h2>My Pockets</h2>
      <div className='pockets__page-info'>
        <div className='pockets__balance'>
          <p>Available Balance</p>
          <p>€{availableBalance}</p>
        </div>
        <div className='pockets__add-btns'>
          <button className='new__pocket-btn' onClick={() => setShowAddPocketModal(true)}>New Pocket</button>
          <button className='save__money-btn' onClick={() => setShowAddMoneyModal(true)}>Save</button>
        </div>
      </div>

      <div className="pockets__list">
        {pockets.map((pocket) => (
          <div key={pocket.id} className="pocket">
            <h3>{pocket.name}</h3>
            {pocket.description && 
              <p>Description: {pocket.description}</p>
            }
            <div className='pocket__list-info'>
              <div className='list__goal'>
                <p>Goal</p>
                <p>€{pocket.goal_amount}</p>
              </div>
              <div className='list__deadline'>
                <p>Deadline</p>
                <p>{pocket.deadline}</p>
              </div>
              <div className='list__saved'>
                <p>Saved</p>
                <p>€{pocket.saved_amount}</p>
              </div>
            </div>
            <div className='pocket__list-btns'>
              <button className='edit-button' onClick={() => handleEditPocket(pocket)}>Edit</button>
              <button className="delete-button" onClick={() => { setDeletingPocket(pocket); setShowDeleteConfirmModal(true); }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddPocketModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowAddPocketModal(false)}>X</span>
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
                className='pocket__date-input'
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
          </div>
        </div>
      )}

      {showEditPocketModal && editingPocket && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowEditPocketModal(false)}>X</span>
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
                className='pocket__date-input'
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
          </div>
        </div>
      )}

      {showAddMoneyModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowAddMoneyModal(false)}>X</span>
            <form className="add-money-form" onSubmit={handleAddMoney}>
              <h3>Add Money to Pocket</h3>
              <select
                className='pocket__date-input'
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
              <button className='pockets__add-money' type="submit">Add Money</button>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirmModal && deletingPocket && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowDeleteConfirmModal(false)}>X</span>
            <h3>Are you sure you want to delete {deletingPocket.name}?</h3>
            <div className='sure--cancel__btns'>
              <button onClick={handleDeletePocket}>Delete</button>
              <button onClick={() => setShowDeleteConfirmModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pockets;
