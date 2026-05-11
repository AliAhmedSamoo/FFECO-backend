const express = require('express');
const Vendor = require('../../modulesDB/Vendor');
const router = express.Router();

// POST route to add a vendor
router.post('/add-vendor', (req, res) => {
    const { vendorName, vendorPhone } = req.body;

    try {
        // Add your logic here to save the vendor to the database
        // For example, using Mongoose or another ORM

        console.log(req.body); // Log the request body to see the received data

        const newVendor = new Vendor({
            vendorName,
            vendorPhone
        });

        newVendor.save()
            .then(() => res.status(201).json({ message: 'Vendor added successfully' }))
            .catch((saveError) => {
                console.error('Error saving vendor:', saveError);
                res.status(500).json({ message: 'Error adding vendor' });
            });


    } catch (error) {
        console.error('Error adding vendor:', error);
        res.status(500).json({ message: 'Error adding vendor' });
    }

});



router.get('/get-vendors', async (req, res) => {
    try {
        const vendors = await Vendor.find();
        res.json(vendors);
    } catch (error) {
        console.error('Error fetching vendors:', error);
        res.status(500).json({ message: 'Error fetching vendors' });
    }
});

router.get('/get-vendors-names', async (req, res) => {
    console.log("Fetching vendor names...");
    try {

        const vendors = await Vendor.find({}, { vendorName: 1, _id: 1,vendorPhone:1 });
        const response = vendors.map(v => ({ value: v.vendorName, _id: v._id, phone: v.vendorPhone }));
        res.json(response);
        console.log(response);

        // res.json(vendors);
    } catch (error) {
        console.error('Error fetching vendors:', error);
        res.status(500).json({ message: 'Error fetching vendors' });
    }
});

module.exports = router;