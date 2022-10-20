import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import keycloak from './keycloak';
import AdminPage from './pages/AdminPage';
import GameDetailsPage from './pages/GameDetailsPage';
import LandingPage from './pages/LandingPage';

function App() {
  const isLoggedIn = keycloak.authenticated;
  const isAdmin = keycloak.realmAccess?.roles.includes("ADMIN")
  return (
    <BrowserRouter>

    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='game' element={<LandingPage />} />
      {isLoggedIn &&
      <Route path='game/:id' element={<GameDetailsPage/>} />
      }
      {isLoggedIn && isAdmin && 
        <Route path='admin/:id' element={<AdminPage />}/>
      }
      <Route path='*' element={<LandingPage />}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
