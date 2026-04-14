const mongoose = require('mongoose');
const Product = require('./server/models/product');

async function checkDB() {
    try {
        await mongoose.connect('mongodb://localhost:27017/flowershop');
        console.log('Connected to DB');
        const p = await Product.findOne({ name: 'Auto Code Test' });
        if (p) {
            console.log('Product Found:');
            console.log(JSON.stringify(p, null, 2));
        } else {
            console.log('Product not found');
        }
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

checkDB();
