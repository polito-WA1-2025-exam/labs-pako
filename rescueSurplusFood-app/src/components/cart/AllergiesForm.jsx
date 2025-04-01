import React from 'react';

const AllergiesForm = ({ allergies, setAllergies }) => {
  const handleChange = (e) => {
    setAllergies(e.target.value);
  };

  return (
    <div className="allergies-form">
      <h3>Allergies or Special Requests</h3>
      <textarea
        value={allergies}
        onChange={handleChange}
        placeholder="Please mention any allergies or special requests here..."
        rows={3}
      />
    </div>
  );
};

export default AllergiesForm;