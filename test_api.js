const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function testAddProduct() {
    const form = new FormData();
    form.append('name', 'API Test Product');
    form.append('category', 'Bouquet');
    form.append('priceSmall', '111');
    form.append('priceMedium', '222');
    form.append('priceLarge', '333');
    form.append('description', 'API Test Description');
    form.append('productCode', 'TEST-999');
    form.append('productDetails', 'API Test Details');
    
    // We need a dummy file
    fs.writeFileSync('dummy.jpg', 'fake image data');
    form.append('image', fs.createReadStream('dummy.jpg'));

    try {
        const response = await axios.post('http://localhost:5000/api/products', form, {
            headers: form.getHeaders()
        });
        console.log('Product Added Success:', response.data);
        return response.data;
    } catch (error) {
        console.error('API Test Failed:', error.response ? error.response.data : error.message);
    } finally {
        if (fs.existsSync('dummy.jpg')) fs.unlinkSync('dummy.jpg');
    }
}

testAddProduct();
