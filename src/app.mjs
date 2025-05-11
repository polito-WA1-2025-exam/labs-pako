import express from 'express';
import morgan from 'morgan';
import foodItemRouter from './routes/foodItemRoute.mjs';
import establishmentRoute from './routes/establishmentRoute.mjs';
import bagRoute from './routes/bagRoute.mjs';
import reservationRoute from './routes/reservationRoute.mjs';
import shoppingCartRoute from './routes/shoppingCartRoute.mjs';
import userRouter from './routes/userRoutes.mjs';
import cors from 'cors'; // npm install cors

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

// Here you would add your routes
// app.use('/api/users', userRouter);
// app.use('/api/products', productRouter);
app.use('/api/food-items', foodItemRouter);
app.use('/api/establishments', establishmentRoute);
app.use('/api/bags', bagRoute);
app.use('/api/reservations', reservationRoute);
app.use('/api/shopping-carts', shoppingCartRoute);
app.use('/api/users', userRouter);
export default app;
