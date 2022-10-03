import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import GameDetailsPage from './pages/GameDetailsPage';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <BrowserRouter>

    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='game' element={<LandingPage />} />
      <Route path='game/:id' element={<GameDetailsPage/>} />
      <Route path='*' element={<p>not found</p>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
