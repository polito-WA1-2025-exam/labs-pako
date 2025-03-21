import express from 'express';
import morgan from 'morgan';
import foodItemRouter from './routes/foodItemRoute.mjs';
import establishmentRoute from './routes/establishmentRoute.mjs';
const app = express();

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());

// Here you would add your routes
// app.use('/api/users', userRouter);
// app.use('/api/products', productRouter);
app.use('/api/food-items', foodItemRouter);
app.use('/api/establishments', establishmentRoute);

export default app;
