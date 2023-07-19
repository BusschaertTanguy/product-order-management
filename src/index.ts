import express from 'express';
import 'dotenv/config';
import bodyParser from 'body-parser';
import productRoutes from './features/products/routes';
import orderRoutes from './features/orders/routes';
import errorMiddleware from './infrastructure/errors/error-middleware';

const app = express();

app.use(bodyParser.json());

app.use('/api/product', productRoutes);
app.use('/api/order', orderRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
