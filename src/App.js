import React, { useState } from 'react';
import './App.css';
import PatientsPage from './Patients';
import logo from './assets/logo.png'; 


const HomePage = () => (
  <div className="page-content">
    <h2>Welcome to Jarurat Care</h2>
    <p>Your centralized hub for patient management. </p>
    <p>Use the navigation above to view the patient list.</p>
  </div>
);

const AboutPage = () => (
  <div className="page-content">
    <h2>About Us</h2>
    <p>Jarurat Care </p>
    
  </div>
);

function App() {
  const [activePage, setActivePage] = useState('Home');

  const renderPage = () => {
    switch (activePage) {
      case 'Home':
        return <HomePage />;
      case 'Patients':
        return <PatientsPage />;
      case 'About':
        return <AboutPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="logo-container">
          
          <img src={logo} alt="Jarurat Care Logo" />
          <h1>Jarurat Care</h1>
        </div>
        <nav className="nav-links">
          <a onClick={() => setActivePage('Home')} className={activePage === 'Home' ? 'active' : ''}>Home</a>
          <a onClick={() => setActivePage('Patients')} className={activePage === 'Patients' ? 'active' : ''}>Patients</a>
          <a onClick={() => setActivePage('About')} className={activePage === 'About' ? 'active' : ''}>About</a>
        </nav>
      </header>
      <main>
        {renderPage()}
      </main>
    </div>
  );
}

export default App;