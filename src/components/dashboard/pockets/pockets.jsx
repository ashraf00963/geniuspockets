import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import './pockets.css';

function Pockets() {
  const [pockets, setPockets] = useState([]);
  const [newPocket, setNewPocket] = useState({ name: '', description: '', goal_amount: '', deadline: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchPockets(token);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPocket((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="pockets">
      <h2>My Pockets</h2>
      <div className="pockets__list">
        {pockets.map((pocket) => (
          <div key={pocket.id} className="pocket">
            <h3>{pocket.name}</h3>
            <p>Description: {pocket.description}</p>
            <p>Goal: ${pocket.goal_amount}</p>
            <p>Deadline: {pocket.deadline}</p>
            <p>Saved: ${pocket.saved_amount}</p>
            <button className="delete-button" onClick={() => handleDeletePocket(pocket.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
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
    </div>
  );
}

export default Pockets;
