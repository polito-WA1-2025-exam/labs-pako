import { useState } from 'react';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Bags from './components/Bags';
import Restaurants from './components/Restaurant';

function App() {
  const [currentSection, setCurrentSection] = useState('home');

  return (
    <div>
      <Navigation onNavigate={setCurrentSection} />
      {currentSection === 'home' && <Home />}
      {currentSection === 'bags' && <Bags />}
      {currentSection === 'restaurants' && <Restaurants />}
    </div>
  );
}

export default App;

