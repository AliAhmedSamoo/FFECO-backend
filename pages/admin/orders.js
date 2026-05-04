const express = require('express');
const Buyer = require('../../modulesDB/Buyers');
const Order = require('../../modulesDB/Order');
// const Item = require('../../modulesDB/Items');
// const DailyPack = require('../../modulesDB/Dailypack');
// const Order_Item = require('../../modulesDB/OrderItems');
const router = express.Router();


 

// router.post('/add-buyer', async (req, res) => {
//     try {

//         const { information, Shortname, conutry, Registration, logo } = req.body;

//         // ✅ Validation
//         if (!information || information.length === 0 || !information[0].value) {
//             return res.status(400).json({ message: "Buyer full name is required" });
//         }

//         const FullName = information[0].value;

//         const otherinformation = information.filter((_, index) => index !== 0);

//         const newBuyer = new Buyer({
//             FullName,
//             information: otherinformation,
//             Shortname,
//             conutry,
//             Registration,
//             logo, // base64 or file path
//         });

//         await newBuyer.save();

//         // ✅ Response
//         res.status(201).json({
//             message: "Buyer added successfully",
//         });

//     } catch (error) {
//         console.error('Error adding buyer:', error);
//         res.status(500).json({ message: 'Error adding buyer' });
//     }

// })




// router.get('/get-buyer', async (req, res) => {
//     try {
//         const { data } = req.query

//         const buyer = await Buyer.find()
//         res.status(201).json(buyer);

//     } catch (error) {
//         console.error('Error geting buyer:', error);
//         res.status(500).json({ message: 'Error geting buyer' });
//     }
// })


// router.get('/get-buyershorname', async (req, res) => {
//     try {
//         const { data } = req.query

//         const buyer = await Buyer.find({}, { Shortname: 1 })

//         const buyers = buyer.map(b => ({ value: b.Shortname, _id: b._id }));
//         res.status(201).json(buyers);

//     } catch (error) {
//         console.error('Error geting buyer:', error);
//         res.status(500).json({ message: 'Error geting buyer' });
//     }
// })






// router.post('/add-order', async (req, res) => {
//     try {

//         const {
//             buyerName,
//             oderID,
//             DOP,
//             DOE,
//             RefNo,
//             LOTNo,
//         } = req.body;


//         const newOrder = new Order({
//             Buyer: buyerName._id,
//             oderID,
//             DOP,
//             DOE,
//             RefNo,
//             LOTNo,
//         });

//         await newOrder.save();

//         // ✅ Response
//         res.status(201).json({
//             message: "order added successfully",
//         });

//     } catch (error) {
//         console.error('Error adding order:', error);
//         res.status(500).json({ message: 'Error adding order' });
//     }

// })


// router.get('/get-order', async (req, res) => {
//     try {
//         const { date } = req.query
//         let data = []
//         const orders = await Order.find({}, { Buyer: 1, oderID: 1 })

//         await Promise.all(

//             orders.map(async (value) => {

//                 const buyer = await Buyer.findOne({ _id: value.Buyer }, { FullName: 1, information: 1, logo: 1, Shortname: 1 })
//                 const Order_Items = await Order_Item.find({ orderID: value._id },{numberofCT:1,CartonsWieght:1})
//                 const packing = await DailyPack.find({ orderID: value._id },{numberofCT:1,CartonsWieght:1})
//                 console.log(packing)

//                 const TotalCarton = 100
//                 const FullFilled = 120


//                 const resss = {
//                     _id: value._id,
//                     Fullname: buyer.FullName,
//                     information: buyer.information,
//                     logo: buyer.logo,
//                     Order: buyer.Shortname + " " + value.oderID,
//                     TotalCarton: TotalCarton,
//                     FullFilled: FullFilled,
//                     Requried: TotalCarton - FullFilled,
//                     progress: ((FullFilled / TotalCarton) * 100).toFixed(1),
//                 }

//                 await data.push(resss)
//             })
//         )
//         // const buyer = [
//         //     {
//         //         Order: "MSAG 03",
//         //         logo: "/logo.png",
//         //         Fullname: "/logo.png",
//         //         TotalCarton: 50,
//         //         FullFilled: 50,
//         //         Requried: 50,
//         //         progress: (50 / 50) * 100,
//         //         information: [{ value: "/logo.png" }, { value: "/logo.png" }]
//         //     },

//         // ]
//         res.status(201).json(data);

//     } catch (error) {
//         console.error('Error geting buyer:', error);
//         res.status(500).json({ message: 'Error geting buyer' });
//     }
// })




// router.post('/add-orderByID', async (req, res) => {
//     try {
//         const { _id } = req.body
//         const order = await Order.findOne({ _id }, { Buyer: 1, oderID: 1, DOP: 1, DOE: 1 })

//         const buyer = await Buyer.findOne({ _id: order.Buyer }, { Shortname: 1 })

//         const OrderItems = await Order_Item.find({ orderId: _id })


//         const itemtosend = await getItams(OrderItems)




//         const totalCartons = await itemtosend.reduce((sum, item) => sum + item.totalcartons, 0);
//         //    console.log(itemtosend)
//         const totalWeight = await itemtosend.reduce((sum, item) => sum + item.TotalWieght, 0);

//         let orderinfo = {
//             name: buyer.Shortname + " " + order.oderID,
//             DOP: order.DOP,
//             DOE: order.DOE,
//             Items: itemtosend,
//             TotalCarton: totalCartons,
//             TotalWieght: totalWeight,
//             _id: _id
//         }


//         res.status(201).json(orderinfo);

//     } catch (error) {
//         console.error('Error adding order:', error);
//         res.status(500).json({ message: 'Error adding order' });
//     }

// })


// router.post('/add-order-item', async (req, res) => {
//     try {
//         const {
//             orderId,
//             ItemName,
//             ExportItemName,
//             Process,
//             FishGrading,
//             Frezeas,
//             PACKas,
//             PACKGrading,
//             TotalCartons,
//             WeightperCartons,
//             pcperCartons
//         } = req.body

//         console.log(pcperCartons)
//         const newOrderItem = new Order_Item({
//             orderId,
//             ItemName,
//             ExportItemName,
//             Process,
//             FishGrading,
//             Frezeas,
//             PACKas,
//             PACKGrading,
//             TotalCartons,
//             WeightperCartons,
//             pcperCartons
//         });

//         await newOrderItem.save();

//         res.status(201).json({
//             message: "order added successfully",
//         });
//     } catch (error) {
//         console.error('Error adding order-item:', error);
//         res.status(500).json({ message: 'Error adding order-item' });
//     }
// })


// router.post('/add-dailypackaging', async (req, res) => {
//     try {
//         const {
//             ItemID,
//             numberofCTpack,
//             wieghtofCTpack,
//             Cartonswieght,
//             orderID,
//         } = req.body

//         let numberofCT = 0
//         let CartonsWieght = 0

//         if (Cartonswieght.length !== 0) {
//             numberofCT = Cartonswieght.length;

//             CartonsWieght = Cartonswieght.reduce(
//                 (sum, item) => sum + Number(item),
//                 0
//             );
//         } else {
//             numberofCT = numberofCTpack
//             CartonsWieght = numberofCTpack * wieghtofCTpack
//         }

//         const newOrderItem = new DailyPack({
//             ItemID,
//             numberofCT,
//             CartonsWieght,
//             orderID,

//         });

//         await newOrderItem.save();

//         res.status(201).json({
//             message: "order added successfully",
//         });
//     } catch (error) {
//         console.error('Error adding order-item:', error);
//         res.status(500).json({ message: 'Error adding order-item' });
//     }
// })




// router.get('/getnamesfordailypacking', async (req, res) => {
//     const { id } = req.query

//     try {

//         const OrderItems = await Order_Item.find({ orderId: id })




//         let response = []

//         await Promise.all(OrderItems.map(async (item) => {
//             const nameofitem = await getitemname(item.ItemName)

//             const nametopush = `${nameofitem} ${nameofitem !== item.ExportItemName ? "(" + item.ExportItemName + ")" : ""} ${item.Process} ${item.FishGrading[item.FishGrading.length - 1].R1}-${item.FishGrading[item.FishGrading.length - 1].R2}${item.FishGrading[item.FishGrading.length - 1].unit} ${item.Frezeas} ${item.pcperCartons ? "(" + item.pcperCartons + " PCs)" : ""}`
//             const SIZEANDPACKING = `${item.PACKas === "Single PC" ? "Single PC" : item.PACKGrading[item.PACKGrading.length - 1].grading + item.PACKGrading[item.PACKGrading.length - 1].unit} ${item.Frezeas === "BLOCK" || item.Frezeas === "FORM TRAY" ? item.Frezeas : ""} ${item.PACKas === "Single PC" ? "" : item.PACKas}`


//             response.push({
//                 value: nametopush + " " + SIZEANDPACKING,
//                 _id: item._id,
//                 orderId: id

//             })

//         }))

//         res.status(201).json(response);
//     } catch (error) {
//         console.error('Error adding order-item:', error);
//         res.status(500).json({ message: 'Error adding order-item' });
//     }
// })


async function getItams(OrderItems) {
    const acc = {};

    for (const curr of OrderItems) {
        if (!acc[curr.ItemName]) {
            acc[curr.ItemName] = {
                ItemName: curr.ItemName,
                TotalWieght: 0,
                totalcartons: 0,
                items: []
            };
        }

        // calculate current item weight
        const weight = (curr.TotalCartons || 0) * (curr.WeightperCartons || 0);

        // add to total
        acc[curr.ItemName].TotalWieght += weight;
        // calculate current item weight
        const totalcartons = (parseInt(curr.TotalCartons) || 0);

        acc[curr.ItemName].totalcartons += totalcartons;

        const nameactualname = await getitemname(curr.ItemName);

        const itemtoadd = {
            FISHNAME: `${nameactualname} ${nameactualname !== curr.ExportItemName ? "(" + curr.ExportItemName + ")" : ""} ${curr.Process} ${curr.FishGrading[curr.FishGrading.length - 1].R1}-${curr.FishGrading[curr.FishGrading.length - 1].R2}${curr.FishGrading[curr.FishGrading.length - 1].unit} ${curr.Frezeas} ${curr.pcperCartons ? "(" + curr.pcperCartons + " PCs)" : ""}`,
            SIZEANDPACKING: `${curr.PACKas === "Single PC" ? "Single PC" : curr.PACKGrading[curr.PACKGrading.length - 1].grading + curr.PACKGrading[curr.PACKGrading.length - 1].unit} ${curr.Frezeas === "BLOCK" || curr.Frezeas === "FORM TRAY" ? curr.Frezeas : ""} ${curr.PACKas === "Single PC" ? "" : curr.PACKas}`,
            // SIZEANDPACKING: curr.PACKGrading[curr.PACKGrading.length - 1].grading + curr.PACKGrading[curr.PACKGrading.length - 1].unit + " " + curr.PACKas,
            CARTONS: curr.TotalCartons,
            WperC: curr.WeightperCartons
        };

        acc[curr.ItemName].items.push(itemtoadd);
    }

    const itemtosend = Object.values(acc);






    return itemtosend
}

async function getitemname(params) {
    const itemname = await Item.findOne({ _id: params }, { itemName: 1 })


    return itemname.itemName
}
module.exports = router;