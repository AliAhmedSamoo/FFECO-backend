const express = require('express');
const Batch = require('../modulesDB/batch')
const Vendor = require('../modulesDB/Vendor');
const Fish = require('../modulesDB/fish');
const Item = require('../modulesDB/items');
const VerifiedFishes = require('../modulesDB/verifiedFishes');
const router = express.Router();



router.post('/add-batch', async (req, res) => {
    const { vendor, items } = req.body;

    try {


        const firstChar = vendor.charAt(0);
        const lastChar = vendor.charAt(vendor.length - 1);
        const year = new Date().getFullYear().toString().slice(-2);
        const month = new Date().toLocaleString('en-US', { month: 'short' }).toUpperCase();
        const date = String(new Date().getDate()).padStart(2, '0');
        const batchID = `${firstChar}${lastChar}${year}${month}${date}`;


        const newBatch = new Batch({ vendor, batchID });
        const savedBatch = await newBatch.save();

        await Promise.all(items.map(async (item) => {

            const newfish = new Fish({
                name: item.itemName,
                id: item.itemNameID,
                vendorWeight: item.itemWieght,
                sizesCategories: item.itemSize,
                batchID: savedBatch._id



            });
            await newfish.save();

        }));






        res.status(201).json({ message: 'Batch added successfully' })
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).json({ message: 'Error adding item' });
    }

});


router.get('/get-batches', async (req, res) => {
    try {
        const { date } = req.query;
        // const filter = date ? { timestamp: { $gte: new Date(date) } } : {};

        let response = []

        const batches = await Batch.find();


        await Promise.all(batches.map(async batch => {



            const vendors = await Vendor.findOne({ _id: batch.vendor }, { vendorName: 1 });
            const date = new Date(batch.timestamp).toLocaleString('en-US', { timeZone: 'Asia/Karachi' });

            const fish = await Fish.find({ batchID: batch._id });
            const totalWeight = fish.reduce((total, item) => total + (Number(item.vendorWeight) || 0), 0)
            const verifiedFish = await VerifiedFishes.find({ batchID: batch._id });
            const hallWeight = verifiedFish.reduce((total, item) => total + (Number(item.weight) || 0), 0)


            let data = {
                _id: batch._id,
                Vendor: vendors.vendorName,
                TypesGoods: verifiedFish.length,
                TotalWeight: totalWeight,
                hallWeight: hallWeight,
                Date: date + "(PST)"
            }

            await response.push(data);
        }));



        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching batches:', error);
        res.status(500).json({ message: 'Error fetching batches' });
    }
});


router.get('/get-batches-by-id', async (req, res) => {
    try {
        const { id } = req.query;

        let response = []

        const batch = await Batch.findOne({ _id: id });


        const vendors = await Vendor.findOne({ _id: batch.vendor }, { vendorName: 1 });
        const date = new Date(batch.timestamp).toLocaleString('en-US', { timeZone: 'Asia/Karachi' });


        let table = []

        const fish = await Fish.find({ batchID: batch._id });
        const totalWeight = fish.reduce((total, item) => total + (Number(item.vendorWeight) || 0), 0)
        const verifiedFish = await VerifiedFishes.find({ batchID: batch._id });
        const hallWeight = verifiedFish.reduce((total, item) => total + (Number(item.weight) || 0), 0)
        const halldate = new Date(verifiedFish[0].timestamp).toLocaleString('en-US', { timeZone: 'Asia/Karachi' });



        await Promise.all(verifiedFish.map(async item => {

            const fishDetails = await Item.findOne({ _id: item.itemID });
            console.log(item);

            await table.push({
                Item: fishDetails.itemName,
                ItemSizeCotogory: item.sizeCategories,
                HallWeight: item.weight,
                MarketPriceperKG: 0,
                TotalPrice: 0,

                weightON: item.timestamp
            })

        }))

        let data = {
            // GRCode: "AA240623",
            Vendor: vendors.vendorName,
            batchdate: date + "(PST)",
            GRcode: "",
            Summary: "safcd sdfvsdfv sdfv sdfv",
            TotalWeight: totalWeight,
            hallWeight: hallWeight,
            VerifiedBy: "Faisal  (" + halldate + "(PST))",

            verifiedFish: table


        }




        console.log(data);

        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching batches:', error);
        res.status(500).json({ message: 'Error fetching batches' });
    }
});





module.exports = router;