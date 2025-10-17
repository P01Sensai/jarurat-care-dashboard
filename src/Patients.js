import React, { useState, useEffect, useMemo } from 'react';



const PatientCard = ({ patient, onViewDetails }) => (
  <div className="patient-card">
    <h3>{patient.name}</h3>
    <p><strong>Age:</strong> {patient.age}</p>
    <p><strong>Contact:</strong> {patient.phone}</p>
    <button className="view-details-btn" onClick={() => onViewDetails(patient)}>
      View Details
    </button>
  </div>
);

const PatientModal = ({ patient, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <button className="modal-close-btn" onClick={onClose}>&times;</button>
      <h2>{patient.name}</h2>
      <p><strong>Email:</strong> {patient.email}</p>
      <p><strong>Contact:</strong> {patient.phone}</p>
      <p><strong>Age:</strong> {patient.age}</p>
      <p><strong>Address:</strong> {`${patient.address.street}, ${patient.address.suite}, ${patient.address.city}, ${patient.address.zipcode}`}</p>
      <p><strong>Website:</strong> {patient.website}</p>
      <p><strong>Company:</strong> {patient.company.name}</p>
    </div>
  </div>
);

const AddPatientModal = ({ onClose, onAddPatient }) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !age || !contact || !email) {
            alert("Please fill all fields.");
            return;
        }
        
        
        const newPatient = {
            id: Date.now(), 
            name,
            age: parseInt(age, 10),
            phone: contact,
            email,
            address: { street: 'N/A', suite: '', city: '', zipcode: '' },
            website: 'N/A',
            company: { name: 'N/A' }
        };

        onAddPatient(newPatient);
        onClose();
    };

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
          <h2>Add New Patient</h2>
          <form onSubmit={handleSubmit} className="add-patient-form">
            <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
            <input type="number" placeholder="Age" value={age} onChange={e => setAge(e.target.value)} required />
            <input type="tel" placeholder="Contact Number" value={contact} onChange={e => setContact(e.target.value)} required />
            <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
            <div className="form-actions">
                <button type="button" className="form-cancel-btn" onClick={onClose}>Cancel</button>
                <button type="submit" className="form-submit-btn">Add Patient</button>
            </div>
          </form>
        </div>
      </div>
    );
};




const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
       
        const patientsWithAge = data.map(patient => ({
          ...patient,
          age: Math.floor(Math.random() * (70 - 20 + 1)) + 20, 
        }));
        setPatients(patientsWithAge);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleAddPatient = (newPatient) => {
    setPatients(prevPatients => [newPatient, ...prevPatients]);
  };

  const filteredPatients = useMemo(() => {
    return patients.filter(patient =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [patients, searchQuery]);


  return (
    <div className="page-content">
      <div className="controls-container">
        <input
          type="text"
          placeholder="Search patients by name..."
          className="search-bar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="add-patient-btn" onClick={() => setAddModalOpen(true)}>
          + Add New Patient
        </button>
      </div>
      
      {isLoading && <p className="status-message">Loading patient records...</p>}
      {error && <p className="status-message">Error: {error}. Please try again later.</p>}

      {!isLoading && !error && (
        <div className="patient-grid">
          {filteredPatients.length > 0 ? (
            filteredPatients.map(patient => (
              <PatientCard
                key={patient.id}
                patient={patient}
                onViewDetails={setSelectedPatient}
              />
            ))
          ) : (
            <p className="status-message">No patients found.</p>
          )}
        </div>
      )}

      {selectedPatient && (
        <PatientModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} />
      )}
      
      {isAddModalOpen && (
        <AddPatientModal 
            onClose={() => setAddModalOpen(false)}
            onAddPatient={handleAddPatient}
        />
      )}
    </div>
  );
};

export default PatientsPage;