const express = require('express');
const router = express.Router();
const Cartonroomitems = require('../modulesDB/Cartonroomitems');
const Cartonroominevnt = require('../modulesDB/Cartonroominevnt');
const Purchaseorder = require('../modulesDB/Purchaseorder');
const Vendor = require('../modulesDB/Vendor');

router.get('/get-carton-room-inventory', async (req, res) => {


    try {

        let data = []

        const inventoryItems = await Cartonroomitems.find();

        await Promise.all(inventoryItems.map(async (item) => {



            const stock = await Cartonroominevnt.findOne({ itemID: item._id });
            console.log(stock)

            await data.push({
                id: item._id,
                item: item.item,
                name: `${item.name ? item.name + " - " : ''} ${item.dimensions ? item.dimensions + "-" : ""}  ${item.micron ? item.micron + "μ - " : ''}  ${item.ply ? item.ply + "ply - " : ''} ${item.color ? item.color : ''} ${item.party ? "- " + item.party : ''}`,
                type: item.type,
                party: item.party,
                status: stock?.Stock < 20 || stock?.Stock < stock?.Required ? "Restock Required" : "Okay",
                stock: stock?.Stock || "0",
            })
        }
        ))

        res.status(200).json(data);

    } catch (error) {
        console.error('Error fetching carton room inventory:', error);
        res.status(500).json({ message: 'Error fetching carton room inventory' });
    }
});


router.get('/get-master-inventory', async (req, res) => {


    try {


        const inventoryItems = await Cartonroomitems.find().sort({ timestamp: -1 });


        res.status(200).json(inventoryItems);

    } catch (error) {
        console.error('Error fetching carton room inventory:', error);
        res.status(500).json({ message: 'Error fetching carton room inventory' });
    }
});

router.post('/add-master-inventory', async (req, res) => {

    const {
        item,
        name,
        type,
        party,
        dimensions,
        micron,
        ply,
        color
    } = req.body;


    try {


        console.log(req.body)
        const newInventoryItem = new Cartonroomitems({
            item,
            ...(name && { name }),
            ...(type && { type }),
            ...(party && { party }),
            ...(dimensions && { dimensions }),
            ...(micron && { micron }),
            ...(ply && { ply }),
            ...(color && { color })
        });
        await newInventoryItem.save()

        res.status(201).json({ message: 'Master inventory item added successfully' });

    } catch (error) {
        console.error('Error adding master inventory:', error);
        res.status(500).json({ message: 'Error adding master inventory' });
    }



})



router.post('/place-purchase-order', async (req, res) => {


    try {


        const now = new Date();

        const day = String(now.getDate()).padStart(2, "0");

        const months = ["JN", "FB", "MR", "AP", "MY", "JU",
            "JL", "AG", "SP", "OT", "NV", "DC"];

        const month = months[now.getMonth()];

        const year = String(now.getFullYear()).slice(-2);

        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");

        const poNumber = `PO${day}${month}${year}${hours}${minutes}${seconds}`;



        const newPurchaseOrder = new Purchaseorder({
            vendor: req.body.vendor,
            items: req.body.items,
            required: req.body.required,
            POnumber: poNumber
        });
        await newPurchaseOrder.save();

        res.status(201).json({ message: 'Purchase order placed successfully', _id: newPurchaseOrder._id });

    } catch (error) {
        console.error('Error placing purchase order:', error);
        res.status(500).json({ message: 'Error placing purchase order' });
    }



})



router.get('/get-purchase-order-by-id', async (req, res) => {
    const { id } = req.query;

    try {
        let items = []

        const purchaseOrder = await Purchaseorder.findById(id);
        const vendor = await Vendor.findById(purchaseOrder.vendor);

        await Promise.all(purchaseOrder.items.map(async (item) => {

            const inventoryItem = await Cartonroomitems.findById(item._id);

            items.push({
                item: inventoryItem ? `${inventoryItem.name ? inventoryItem.name + " - " : ''} ${inventoryItem.dimensions ? inventoryItem.dimensions + "-" : ""}  ${inventoryItem.micron ? inventoryItem.micron + "μ - " : ''}  ${inventoryItem.ply ? inventoryItem.ply + "ply - " : ''} ${inventoryItem.color ? inventoryItem.color : ''} ${inventoryItem.party ? "- " + inventoryItem.party : ''}` : 'Unknown Item',
                priceperunit: parseInt(item.priceperunit),
                required: parseInt(item.required),
            })
        }
        ))

        const response = {
            _id: purchaseOrder._id,
            vendor,
            items,
            POnumber: purchaseOrder.POnumber,
            timestamp: purchaseOrder.timestamp,
        }
        res.status(200).json(response);

    } catch (error) {
        console.error('Error fetching purchase order:', error);
        res.status(500).json({ message: 'Error fetching purchase order' });
    }
});


router.get('/get-purchase-list', async (req, res) => {


    try {

        const data = []
        const inventoryItems = await Cartonroomitems.find().sort({ timestamp: -1 });

        await Promise.all(inventoryItems.map(async (item) => {

            const stock = await Cartonroominevnt.findOne({ itemID: item._id });

            const iddd = item._id.toString()


            const isinorder = await Purchaseorder.find({
                "items._id": iddd,
            });

            let howmanyinrder = 0

            await Promise.all(isinorder.map(order => {

                const orderitem = order.items.find(i => i._id.toString() === iddd);

                if (orderitem) {
                    howmanyinrder += Number(orderitem.required) || 0;
                }
            }))



            let required = 20 + parseInt(stock?.Required) - parseInt(howmanyinrder) - parseInt(stock?.Stock)



            if (required > 0) {

                console.log("in order", parseInt(howmanyinrder))
                console.log("in stock", parseInt(stock?.Stock))
                console.log("req",parseInt(stock?.Required))
                console.log("to oder",required)
                console.log("")

                await data.push({
                    _id: item._id,
                    item: item.item,
                    name: `${item.name ? item.name + " - " : ''} ${item.dimensions ? item.dimensions + "-" : ""}  ${item.micron ? item.micron + "μ - " : ''}  ${item.ply ? item.ply + "ply - " : ''} ${item.color ? item.color : ''} ${item.party ? "- " + item.party : ''}`,
                    priceperunit: 0,
                    stock: stock?.Stock || "0",
                    required: required,
                })
            }

        }))

        res.status(200).json(data);

    } catch (error) {
        console.error('Error fetching carton room inventory:', error);
        res.status(500).json({ message: 'Error fetching carton room inventory' });
    }
});
// Here you would typically save the data to your database

module.exports = router;