import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import keycloak from './keycloak';
import GameDetailsPage from './pages/GameDetailsPage';
import LandingPage from './pages/LandingPage';

function App() {
  const isLoggedIn = keycloak.authenticated;
  return (
    <BrowserRouter>

    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='game' element={<LandingPage />} />
      {isLoggedIn &&
      <Route path='game/:id' element={<GameDetailsPage/>} />
      }
      <Route path='*' element={<LandingPage />}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
