const express = require('express');
const Item = require('../../modulesDB/items');
const router = express.Router();

// POST route to add an item
router.post('/add-items', (req, res) => {
    const { itemName, marketPrice, sizesCategories, sizesCategories_FFECO } = req.body;

    try {
        // Add your logic here to save the item to the database
        // For example, using Mongoose or another ORM



        const newItem = new Item({
            itemName,
            marketPrice,
            sizesCategories,
            sizesCategories_FFECO
        });

        newItem.save()
            .then(() => res.status(201).json({ message: 'Item added successfully' }))
            .catch((saveError) => {
                console.error('Error saving item:', saveError);
                res.status(500).json({ message: 'Error adding item' });
            });


    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).json({ message: 'Error adding item' });
    }

});



router.get('/get-items', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ message: 'Error fetching items' });
    }
});

router.get('/get-items-names', async (req, res) => {
    try {
        const items = await Item.find({}, { itemName: 1, sizesCategories: 1, _id: 1 });


        const response = items.map(v => ({ value: v.itemName, _id: v._id,size:v.sizesCategories }));
        res.json(response);
        console.log(response);

        // const response = items.map(i => ({ value: i.itemName, _id: i._id }));
        // res.json(response);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ message: 'Error fetching items' });
    }
});

module.exports = router;