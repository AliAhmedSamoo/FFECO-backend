const express = require('express');
const Buyer = require('../../modulesDB/buyers');
const Order = require('../../modulesDB/Orderforbuys');
const Item = require('../../modulesDB/Items');
const DailyPack = require('../../modulesDB/dailypack');
const Order_Item = require('../../modulesDB/orderItems');
const router = express.Router();




router.post('/add-buyer', async (req, res) => {
    try {

        const { information, Shortname, conutry, Registration, logo } = req.body;

        // ✅ Validation
        if (!information || information.length === 0 || !information[0].value) {
            return res.status(400).json({ message: "Buyer full name is required" });
        }

        const FullName = information[0].value;

        const otherinformation = information.filter((_, index) => index !== 0);

        const newBuyer = new Buyer({
            FullName,
            information: otherinformation,
            Shortname,
            conutry,
            Registration,
            logo, // base64 or file path
        });

        await newBuyer.save();

        // ✅ Response
        res.status(201).json({
            message: "Buyer added successfully",
        });

    } catch (error) {
        console.error('Error adding buyer:', error);
        res.status(500).json({ message: 'Error adding buyer' });
    }

})




router.get('/get-buyer', async (req, res) => {
    try {
        const { data } = req.query

        const buyer = await Buyer.find()
        res.status(201).json(buyer);

    } catch (error) {
        console.error('Error geting buyer:', error);
        res.status(500).json({ message: 'Error geting buyer' });
    }
})


router.get('/get-buyershorname', async (req, res) => {
    try {
        const { data } = req.query

        const buyer = await Buyer.find({}, { Shortname: 1 })

        const buyers = buyer.map(b => ({ value: b.Shortname, _id: b._id }));
        res.status(201).json(buyers);

    } catch (error) {
        console.error('Error geting buyer:', error);
        res.status(500).json({ message: 'Error geting buyer' });
    }
})






router.post('/add-order', async (req, res) => {
    try {

        const {
            buyerName,
            oderID,
            DOP,
            DOE,
            RefNo,
            LOTNo,
        } = req.body;


        const newOrder = new Order({
            Buyer: buyerName._id,
            oderID,
            DOP,
            DOE,
            RefNo,
            LOTNo,
        });

        await newOrder.save();

        // ✅ Response
        res.status(201).json({
            message: "order added successfully",
        });

    } catch (error) {
        console.error('Error adding order:', error);
        res.status(500).json({ message: 'Error adding order' });
    }

})


router.get('/get-order', async (req, res) => {
    try {
        const { date } = req.query
        let data = []
        const orders = await Order.find({ oderID: { $ne: "loose" } }, { Buyer: 1, oderID: 1 }).sort({ timestamp: -1 })

        await Promise.all(

            await orders.map(async (value) => {

                const buyer = await Buyer.findOne({ _id: value.Buyer }, { FullName: 1, information: 1, logo: 1, Shortname: 1 })
                const Order_Items = await Order_Item.find({ orderId: value._id }, { TotalCartons: 1 })
                const packing = await DailyPack.find({ orderID: value._id }, { numberofCT: 1 })
                const TotalCarton = Order_Items.reduce((sum, item) => sum + parseInt(item.TotalCartons), 0)
                const FullFilled = packing.reduce((sum, item) => sum + parseInt(item.numberofCT), 0)


                // const FullFilled = 120


                const resss = {
                    _id: value._id,
                    Fullname: buyer.FullName,
                    information: buyer.information,
                    logo: buyer.logo,
                    Order: buyer.Shortname + " " + value.oderID,
                    TotalCarton: TotalCarton,
                    FullFilled: FullFilled,
                    Requried: TotalCarton - FullFilled,
                    progress: ((FullFilled / TotalCarton) * 100).toFixed(1),
                }

                await data.push(resss)
            })
        )

        res.status(201).json(data);

    } catch (error) {
        console.error('Error geting buyer:', error);
        res.status(500).json({ message: 'Error geting buyer' });
    }
})




router.post('/add-orderByID', async (req, res) => {
    try {
        const { _id } = req.body
        const order = await Order.findOne({ _id }, { Buyer: 1, oderID: 1, DOP: 1, DOE: 1 })

        const buyer = await Buyer.findOne({ _id: order.Buyer }, { Shortname: 1 })

        const OrderItems = await Order_Item.find({ orderId: _id })


        const itemtosend = await getItams(OrderItems)




        const totalCartons = await itemtosend.reduce((sum, item) => sum + item.totalcartons, 0);
        //    console.log(itemtosend)
        const totalWeight = await itemtosend.reduce((sum, item) => sum + item.TotalWieght, 0);

        let orderinfo = {
            name: buyer.Shortname + " " + order.oderID,
            DOP: order.DOP,
            DOE: order.DOE,
            Items: itemtosend,
            TotalCarton: totalCartons,
            TotalWieght: totalWeight,
            _id: _id
        }


        res.status(201).json(orderinfo);

    } catch (error) {
        console.error('Error adding order:', error);
        res.status(500).json({ message: 'Error adding order' });
    }

})


router.post('/add-order-item', async (req, res) => {
    try {
        const {
            orderId,
            ItemName,
            ExportItemName,
            Process,
            FishGrading,
            Frezeas,
            PACKas,
            PACKGrading,
            TotalCartons,
            WeightperCartons,
            pcperCartons
        } = req.body

        console.log(pcperCartons)
        const newOrderItem = new Order_Item({
            orderId,
            ItemName,
            ExportItemName,
            Process,
            FishGrading,
            Frezeas,
            PACKas,
            PACKGrading,
            TotalCartons,
            WeightperCartons,
            pcperCartons
        });

        await newOrderItem.save();

        res.status(201).json({
            message: "order added successfully",
        });
    } catch (error) {
        console.error('Error adding order-item:', error);
        res.status(500).json({ message: 'Error adding order-item' });
    }
})


router.post('/add-dailypackaging', async (req, res) => {
    try {
        const {
            ItemID,
            numberofCTpack,
            wieghtofCTpack,
            Cartonswieght,
            orderID,
            repack
        } = req.body

        let numberofCT = 0
        let CartonsWieght = 0

        if (Cartonswieght.length !== 0) {
            numberofCT = Cartonswieght.length;

            CartonsWieght = Cartonswieght.reduce(
                (sum, item) => sum + Number(item),
                0
            );
        } else {
            numberofCT = numberofCTpack
            CartonsWieght = numberofCTpack * wieghtofCTpack
        }

        const newOrderItem = new DailyPack({
            ItemID,
            numberofCT,
            CartonsWieght,
            orderID,
            repack
        });

        await newOrderItem.save();

        res.status(201).json({
            message: "order added successfully",
        });
    } catch (error) {
        console.error('Error adding order-item:', error);
        res.status(500).json({ message: 'Error adding order-item' });
    }
})




router.get('/getnamesfordailypacking', async (req, res) => {
    const { id } = req.query

    try {




        const OrderItems = await Order_Item.find({ orderId: id })

        const ids = OrderItems.map(item => item.ItemName);

        const fishes = await Item.find({
            _id: { $in: ids }
        }, { itemName: 1 });





        let response = []

        await Promise.all(OrderItems.map(async (item) => {

            const nameofitem = fishes.find(
                (val) => String(val._id) === String(item.ItemName)
            )?.itemName;


            const lastFishGrading = item.FishGrading?.at(-1);
            const lastPackGrading = item.PACKGrading?.at(-1);

            const nametopush = [
                nameofitem +
                (nameofitem !== item.ExportItemName && item.ExportItemName
                    ? ` (${item.ExportItemName})`
                    : ""),

                item.loaclgradings || "",

                item.Process || "",

                lastFishGrading
                    ? `${lastFishGrading.R1 || ""}${lastFishGrading.R2 ? `-${lastFishGrading.R2}` : ""
                    }${lastFishGrading.unit ? ` ${lastFishGrading.unit}` : ""}`
                    : "",

                item.Frezeas === "I.Q.F" ? item.Frezeas : "",

                item.pcperCartons ? `(${item.pcperCartons} PCs)` : "",
            ]
                .filter(Boolean)
                .join(" ")
                .replace(/\s+/g, " ")
                .trim();

            const SIZEANDPACKING = [
                item.PACKas === "Single PC"
                    ? "Single PC"
                    : lastPackGrading
                        ? `${lastPackGrading.grading || ""}${lastPackGrading.unit || ""}`
                        : "",

                item.Frezeas === "BLOCK" || item.Frezeas === "FORM TRAY"
                    ? item.Frezeas
                    : "",

                item.PACKas !== "Single PC" ? item.PACKas || "" : "",
            ]
                .filter(Boolean)
                .join(" ")
                .replace(/\s+/g, " ")
                .trim();


            response.push({
                value: `${nametopush} ${SIZEANDPACKING}`.replace(/\s+/g, " ").trim(),
                _id: item._id,
                orderId: id,
            });

        }))

        res.status(201).json(response);
    } catch (error) {
        console.error('Error ageting name for daily packaging:', error);
        res.status(500).json({ message: 'Error ageting name for daily packaging' });
    }
})


router.post('/get-dailypackaging', async (req, res) => {
    const { date, orderID, orderName } = req.body

    try {

        const OrderItems = await Order_Item.find({ orderId: orderID })

        const Items = await getItamsfordailypacking(OrderItems, date)


        const Pre_CTN = Items.reduce((sum, item) => {
            return sum + (parseInt(item.Pre_CTN) || 0);
        }, 0);
        const Pre_KG = Items.reduce((sum, item) => {
            return sum + (parseInt(item.Pre_KG) || 0);
        }, 0);
        const CTN = Items.reduce((sum, item) => {
            return sum + (parseInt(item.CTN) || 0);
        }, 0);
        const KG = Items.reduce((sum, item) => {
            return sum + (parseInt(item.KG) || 0);
        }, 0);
        const Re_CTN = Items.reduce((sum, item) => {
            return sum + (parseInt(item.Re_CTN) || 0);
        }, 0);
        const Re_KG = Items.reduce((sum, item) => {
            return sum + (parseInt(item.Re_KG) || 0);
        }, 0);


        const responce = {
            Order: orderName,
            Items,
            Pre_CTN,
            Pre_KG,
            CTN,
            KG,
            Re_CTN,
            Re_KG,
            total_CTN: CTN + Pre_CTN - Re_CTN,
            total_KG: KG + Pre_KG - Re_KG,
        }
        res.status(201).json(responce);
    }
    catch (error) {
        console.error('Error ageting name for daily packaging:', error);
        res.status(500).json({ message: 'Error ageting name for daily packaging' });
    }
})




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
            FISHNAME: `${nameactualname} ${nameactualname !== curr.ExportItemName ? "(" + curr.ExportItemName + ")" : ""} ${curr.Process} ${curr.FishGrading[curr.FishGrading.length - 1].R1}-${curr.FishGrading[curr.FishGrading.length - 1].R2}${curr.FishGrading[curr.FishGrading.length - 1].R1 ? curr.FishGrading[curr.FishGrading.length - 1].unit : ""} ${curr.Frezeas === "I.Q.F" ? curr.Frezeas : ""} ${curr.pcperCartons ? "(" + curr.pcperCartons + " PCs)" : ""}`,
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















async function getItamsfordailypacking(OrderItems, date) {
    const acc = {};


    const ids = OrderItems.map(item => item.ItemName);
    const idsfororderitems = OrderItems.map(item => item._id);

    const fishes = await Item.find({
        _id: { $in: ids }
    }, { itemName: 1 });

    const packing = await DailyPack.find({
        ItemID: { $in: idsfororderitems }
    });


    for (const curr of OrderItems) {


        if (!acc[curr.ItemName]) {
            acc[curr.ItemName] = {
                ItemName: curr.ItemName,
                TotalWieght: 0,
                Pre_CTN: 0,
                Pre_KG: 0,
                CTN: 0,
                KG: 0,
                Re_CTN: 0,
                Re_KG: 0,
                total_CTN: 0,
                total_KG: 0,
                items: []
            };
        }



        const startDate = new Date(date + "T00:00:00.000+00:00");
        const nextDate = new Date(date + "T23:59:59.999+00:00");

        const prevStartDate = new Date(startDate);
        prevStartDate.setDate(prevStartDate.getDate() - 1);

        const prevEndDate = new Date(startDate);
        prevEndDate.setMilliseconds(prevEndDate.getMilliseconds() - 1);



        const predailyPack = packing.filter(
            (val) =>
                val.timestamp < startDate &&
                String(val.ItemID) === String(curr._id)
        );

        const dailyPack = packing.filter(
            (val) =>
                val.timestamp > startDate &&
                val.timestamp < nextDate &&
                String(val.ItemID) === String(curr._id)
        );


        const Pre_cCTN = predailyPack.filter((val) => val.repack === false).reduce((sum, item) => {
            return sum + (parseInt(item.numberofCT) || 0);
        }, 0);
        const Re_Pre_CTN = predailyPack.filter((val) => val.repack === true).reduce((sum, item) => {
            return sum + (parseInt(item.numberofCT) || 0);
        }, 0);

        const Pre_CTN = Pre_cCTN - Re_Pre_CTN

        acc[curr.ItemName].Pre_CTN += Pre_CTN;


        const Pre_KKG = predailyPack.filter((val) => val.repack === false).reduce((sum, item) => {
            return sum + (parseInt(item.CartonsWieght) || 0);
        }, 0);
        const Re_Pre_KG = predailyPack.filter((val) => val.repack === true).reduce((sum, item) => {
            return sum + (parseInt(item.CartonsWieght) || 0);
        }, 0);

        const Pre_KG = Pre_KKG - Re_Pre_KG

        acc[curr.ItemName].Pre_KG += Pre_KG;


        const CTN = dailyPack.filter((val) => val.repack === false).reduce((sum, item) => {
            return sum + (parseInt(item.numberofCT) || 0);
        }, 0);

        const Re_CTN = dailyPack.filter((val) => val.repack === true).reduce((sum, item) => {
            return sum + (parseInt(item.numberofCT) || 0);
        }, 0);

        acc[curr.ItemName].CTN += CTN;
        acc[curr.ItemName].Re_CTN += Re_CTN;


        const KG = dailyPack.filter((val) => val.repack === false).reduce((sum, item) => {
            return sum + (parseInt(item.CartonsWieght) || 0);
        }, 0);

        const Re_KG = dailyPack.filter((val) => val.repack === true).reduce((sum, item) => {
            return sum + (parseInt(item.CartonsWieght) || 0);
        }, 0);

        acc[curr.ItemName].KG += KG;

        acc[curr.ItemName].Re_KG += Re_KG;

        const TotalWieght = KG + Pre_KG - Re_KG
        acc[curr.ItemName].TotalWieght += TotalWieght;



        const nameactualname = fishes.find(
            (val) => String(val._id) === String(curr.ItemName)
        )?.itemName;


        const itemtoadd = {
            name: nameactualname,
            FISHNAME: `${nameactualname}${nameactualname !== curr.ExportItemName && curr.ExportItemName
                ? ` (${curr.ExportItemName})`
                : ""
                } ${curr.loaclgradings === undefined? "":curr.loaclgradings}
                
                ${curr.Process || ""} ${curr.FishGrading?.length
                    ? `${curr.FishGrading[curr.FishGrading.length - 1].R1 || ""}${curr.FishGrading[curr.FishGrading.length - 1].R2
                        ? `-${curr.FishGrading[curr.FishGrading.length - 1].R2}`
                        : ""
                    }${curr.FishGrading[curr.FishGrading.length - 1].R1
                        ? ` ${curr.FishGrading[curr.FishGrading.length - 1].unit || ""}`
                        : ""
                    }`
                    : ""
                } ${curr.Frezeas === "I.Q.F" ? curr.Frezeas : ""} ${curr.pcperCartons ? `(${curr.pcperCartons} PCs)` : ""
                } ${curr.PACKas === "Single PC"
                    ? "Single PC"
                    : curr.PACKGrading?.length
                        ? `${curr.PACKGrading[curr.PACKGrading.length - 1].grading || ""}${curr.PACKGrading[curr.PACKGrading.length - 1].unit || ""
                        }`
                        : ""
                } ${curr.Frezeas === "BLOCK" || curr.Frezeas === "FORM TRAY"
                    ? curr.Frezeas
                    : ""
                } ${curr.PACKas !== "Single PC" ? curr.PACKas || "" : ""}`
                .replace(/\s+/g, " ")
                .trim(),
            Pre_CTN: Pre_CTN,
            Pre_KG: Pre_KG,
            CTN: CTN,
            KG: KG,
            Re_CTN: Re_CTN,
            Re_KG: Re_KG,
            total_CTN: CTN + Pre_CTN - Re_CTN,
            total_KG: KG + Pre_KG - Re_KG,

        };

        acc[curr.ItemName].items.push(itemtoadd);
    }

    const itemtosend = Object.values(acc);






    return itemtosend
}














// async function name(params) {
//     const start = new Date();
//     start.setHours(0, 0, 0, 0); // today 00:00

//     const end = new Date();
//     end.setHours(23, 59, 59, 999); // today end


//     // DailyPack
//     const result = await DailyPack.deleteMany({
//         timestamp: {
//             $gte: start,
//             $lte: end
//         }
//     });

//     console.log("Deleted:", result.deletedCount);
// }

// name()



// router.post('/addlose', async (req, res) => {

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
//             pcperCartons,
//             loaclgradings,
//         } = req.body


//         const item = await Item.findOne({ itemName: ItemName })

//         if (item) {


//             const newOrderItem = new Order_Item({
//                 orderId,
//                 ItemName: item._id,
//                 ExportItemName,
//                 Process,
//                 FishGrading,
//                 Frezeas,
//                 PACKas,
//                 PACKGrading,
//                 TotalCartons,
//                 WeightperCartons,
//                 pcperCartons,
//                 loaclgradings
//             });

//             await newOrderItem.save();


//             const newOrderItem2 = new DailyPack({
//                 ItemID:newOrderItem._id,
//                 numberofCT:TotalCartons,
//                 CartonsWieght:WeightperCartons,
//                 orderID:orderId,
//                 repack:false
//             });

//             await newOrderItem2.save();

//             console.log("added")
//         }


//         res.status(201).json({ responce: "DATA ADDED" });
//     } catch (error) {
//         console.error('Error ageting name for daily packaging:', error);
//         res.status(500).json({ message: 'Error ageting name for daily packaging' });

//     }
// })





module.exports = router;