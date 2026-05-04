const express = require('express');
const Batch = require('../modulesDB/batch')
const Fish = require('../modulesDB/fish')
const Item = require('../modulesDB/Items')
const Vendor = require('../modulesDB/Vendor')
const VerifiedFishes = require('../modulesDB/verifiedFishes')
const router = express.Router();


router.get('/get-batch', async (req, res) => {
    const { date } = req.query;

    try {

        let response = [];
        const datestart = date + "T00:00:00.000Z";
        const dateend = date + "T23:59:59.999Z";



        // const fish = await Fish.find({
        //     timestamp: {
        //         $gte: new Date(datestart),
        //         $lte: new Date(dateend)
        //     }
        // }, { name: 1, batchID: 1, id: 1 });

        const fish = await Fish.find();

        await Promise.all(fish.map(async (item) => {
            {

                const batch = await Batch.findOne({ _id: item.batchID });
                const vendor = await Vendor.findOne({ _id: batch.vendor }, { vendorName: 1 });




                // await console.log(lastdata);
                await response.push({
                    Item: item.name,
                    itemID: item.id,
                    Vendor: vendor.vendorName,
                    VendorID: vendor._id,
                    batchID: batch._id,
                    TypesGoods: 1,
                    Status: "Not Graded Yet"
                });

            }
        }));

        let uniqueMap = new Map();
        response.forEach(item => {
            const key = `${item.Item}-${item.itemID}-${item.Vendor}-${item.VendorID}-${item.batchID}`;
            if (uniqueMap.has(key)) {
                uniqueMap.get(key).TypesGoods += item.TypesGoods;
            } else {
                uniqueMap.set(key, { ...item });
            }
        });
        response = Array.from(uniqueMap.values());



        res.status(200).json(response);
    } catch (error) {
        console.error('Error verifying batch:', error);
        res.status(500).json({ message: 'Error verifying batch' });
    }
});




router.post('/get-batch-item-Gradings', async (req, res) => {

    try {

        const {
            Item,
            itemID,
            Vendor,
            VendorID,
            batchID,
            TypesGoods,
            Status,
            newGradings,
        } = req.body;




        const items = await Item.findOne({ _id: itemID }, { sizesCategories_FFECO: 1, _id: 0 });


        const ffecograding = items.sizesCategories_FFECO.map(size => ({ value: size }))



        if (newGradings !== undefined) {
            const newfish = new VerifiedFishes({

                itemID,
                VendorID,
                batchID,
                sizeCategories: newGradings.sizeCategories,
                weight: newGradings.weight,
                grade: newGradings.grade,
                tub: newGradings.tub,


            });
            await newfish.save();
        }

        const gradings = await VerifiedFishes.find({
            itemID,
            VendorID,
            batchID,
        });

        console.log(req.body);

        const response = {
            Item: Item,
            itemID: itemID,
            Vendor: Vendor,
            VendorID: VendorID,
            batchID: batchID,
            TypesGoods: TypesGoods,
            Status: Status,
            gradings: gradings,
            ffecograding: ffecograding,
        };


        res.status(200).json(response);
    } catch (error) {
        console.error('Error verifying batch:', error);
        res.status(500).json({ message: 'Error verifying batch' });

    }

})

module.exports = router;