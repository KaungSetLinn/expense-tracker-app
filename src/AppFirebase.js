import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from './firebase';

function AppFirebase() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return (
      <div className='loading-container'>
        <div>処理中です。<br/>
          しばらくお待ちください。
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="App">
      {user ? <Navbar /> : <LoginForm />}
    </div>
  );
}

export default AppFirebase;
