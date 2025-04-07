function RegularBags() {
    const restaurants = ['Frutta Mia', 'Pane e Fantasia'];
  
    return (
      <div>
        <h4>Ristoranti con Regular Bags</h4>
        <ul>
          {restaurants.map((name, idx) => (
            <li key={idx}>{name}</li>
          ))}
        </ul>
      </div>
    );
  }
  
  export default RegularBags;
  