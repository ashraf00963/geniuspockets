import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function Logout() {
  const history = useHistory();

  useEffect(() => {
    localStorage.removeItem('token');
    history.push('/login');
  }, [history]);

  return null;
}

export default Logout;
