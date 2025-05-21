import express from 'express';
import morgan from 'morgan';
import foodItemRouter from './routes/foodItemRoute.mjs';
import establishmentRoute from './routes/establishmentRoute.mjs';
import bagRoute from './routes/bagRoute.mjs';
import reservationRoute from './routes/reservationRoute.mjs';
import shoppingCartRoute from './routes/shoppingCartRoute.mjs';
import userRouter from './routes/userRoutes.mjs';
import cors from 'cors'; // npm install cors
import bodyParser from 'body-parser';

const app = express();


//Enable All CORS Requests (for this server)
app.use(cors());
//Use ONLY for development, otherwise restrict domain
/*
In production mode, use different domains for React and API servers, NEVER
allow CORS requests from any origin, always specify origin
– See also https://github.blog/security/application-security/localhost-dangers-cors-and-dnsrebinding/
*/

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());

// JSON parsing with proper error handling
app.use(bodyParser.json({
  limit: '10mb', // Increase the limit if needed
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      res.status(400).send({ error: 'Invalid JSON' });
      throw new Error('Invalid JSON');
    }
  }
}));

// Global error handler for JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('JSON parsing error:', err.message);
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }
  next(err);
});

// Here you would add your routes
// app.use('/api/users', userRouter);
// app.use('/api/products', productRouter);
app.use('/api/food-items', foodItemRouter);
app.use('/api/establishments', establishmentRoute);
app.use('/api/bags', bagRoute);
app.use('/api/reservations', reservationRoute);
app.use('/api/shopping-carts', shoppingCartRoute);
app.use('/api/users', userRouter);

// Catch-all route handler for invalid routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
