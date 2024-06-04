import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import './pockets.css';

function Pockets() {
  const [pockets, setPockets] = useState([]);
  const [newPocket, setNewPocket] = useState({
    name: '',
    description: '',
    goal_amount: '',
    deadline: '',
    saved_amount: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    $.ajax({
      url: 'https://geniuspockets.com/check_auth.php',
      method: 'POST',
      data: { token },
      dataType: 'json',
      success: (response) => {
        if (!response.authenticated) {
          navigate('/login');
        } else {
          fetchPockets(token);
        }
      },
      error: (xhr, status, error) => {
        console.error('Authentication check failed:', error);
        navigate('/login');
      }
    });
  };

  const fetchPockets = (token) => {
    $.ajax({
      url: 'https://geniuspockets.com/get_pockets.php',
      method: 'POST',
      data: { token },
      dataType: 'json',
      success: (response) => {
        setPockets(response.pockets);
      },
      error: (xhr, status, error) => {
        console.error('Error fetching pockets:', error);
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPocket(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCreatePocket = () => {
    const token = localStorage.getItem('token');
    $.ajax({
      url: 'https://geniuspockets.com/add_savings_pocket.php',
      method: 'POST',
      data: { token, ...newPocket },
      dataType: 'json',
      success: (response) => {
        if (response.success) {
          fetchPockets(token);
          setNewPocket({
            name: '',
            description: '',
            goal_amount: '',
            deadline: '',
            saved_amount: ''
          });
        } else {
          console.error(response.message);
        }
      },
      error: (xhr, status, error) => {
        console.error('Error creating pocket:', error);
      }
    });
  };

  const handleDeletePocket = (id) => {
    const token = localStorage.getItem('token');
    $.ajax({
      url: 'https://geniuspockets.com/delete_pocket.php',
      method: 'POST',
      data: { token, id },
      dataType: 'json',
      success: (response) => {
        if (response.success) {
          fetchPockets(token);
        } else {
          console.error(response.message);
        }
      },
      error: (xhr, status, error) => {
        console.error('Error deleting pocket:', error);
      }
    });
  };

  return (
    <div className="pockets">
      <h1>Savings Pockets</h1>
      <div className="pockets__list">
        {pockets.map((pocket) => (
          <div key={pocket.id} className="pocket">
            <h3>{pocket.name}</h3>
            <p>Description: {pocket.description}</p>
            <p>Goal: ${pocket.goal_amount}</p>
            <p>Saved: ${pocket.saved_amount}</p>
            <p>Deadline: {pocket.deadline}</p>
            <button onClick={() => handleDeletePocket(pocket.id)}>Delete</button>
          </div>
        ))}
      </div>
      <div className="pockets__create">
        <h2>Create New Pocket</h2>
        <input type="text" name="name" placeholder="Name" value={newPocket.name} onChange={handleInputChange} />
        <textarea name="description" placeholder="Description" value={newPocket.description} onChange={handleInputChange}></textarea>
        <input type="number" name="goal_amount" placeholder="Goal Amount" value={newPocket.goal_amount} onChange={handleInputChange} />
        <input type="date" name="deadline" placeholder="Deadline" value={newPocket.deadline} onChange={handleInputChange} />
        <input type="number" name="saved_amount" placeholder="Saved Amount" value={newPocket.saved_amount} onChange={handleInputChange} />
        <button onClick={handleCreatePocket}>Create Pocket</button>
      </div>
    </div>
  );
}

export default Pockets;
