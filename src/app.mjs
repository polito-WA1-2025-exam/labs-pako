import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());

// Here you would add your routes
// app.use('/api/users', userRouter);
// app.use('/api/products', productRouter);

export default app;
