function SurpriseBags() {
    const restaurants = ['Sushi Express'];
  
    return (
      <div>
        <h4>Ristoranti con Surprise Bags</h4>
        <ul>
          {restaurants.map((name, idx) => (
            <li key={idx}>{name}</li>
          ))}
        </ul>
      </div>
    );
  }
  
  export default SurpriseBags;
  