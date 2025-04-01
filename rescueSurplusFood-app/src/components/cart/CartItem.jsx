import React from 'react';

const CartItem = ({ item, onRemove }) => {
  return (
    <div className="cart-item">
      <h3>{item.name}</h3>
      <p>€{item.price.toFixed(2)}</p>
      
      {item.type === 'regular' && item.items && Array.isArray(item.items) && (
        <div className="item-details">
            <h4>Contents:</h4>
            <ul>
            {item.items.map(foodItem => (
                <li key={foodItem.id}>
                {foodItem.name} x{foodItem.quantity}
                {item.removedItems && item.removedItems.length < 2 && (
                    <button className="btn btn-sm btn-outline-danger ms-2">
                    <i className="bi bi-trash"></i>
                    </button>
                )}
                </li>
            ))}
            </ul>
            <p className="removed-note">
            {item.removedItems && item.removedItems.length > 0 
                ? `Items removed: ${item.removedItems.length}/2` 
                : 'You can remove up to 2 items'}
            </p>
        </div>
        )}
      {item.type === 'surprise' && (
        <div className="surprise-note">
          <i className="bi bi-gift"></i>
          <p>This is a surprise bag. Contents will be revealed upon pickup.</p>
        </div>
      )}

      <button className="btn btn-danger" onClick={onRemove}>
        <i className="bi bi-trash"></i> Remove from Cart
      </button>
    </div>
  );
};

export default CartItem;