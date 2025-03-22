import express from 'express';
import morgan from 'morgan';
import foodItemRouter from './routes/foodItemRoute.mjs';
import establishmentRoute from './routes/establishmentRoute.mjs';
import bagRoute from './routes/bagRoute.mjs';
import reservationRoute from './routes/reservationRoute.mjs';
const app = express();

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
export default app;
