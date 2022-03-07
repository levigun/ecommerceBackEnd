const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');
const { beforeBulkDestroy } = require('../../models/Product');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findAll();
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category}, 
                { model: Tag, through: ProductTag, as:'tags'}],
    })

    if (!productData) {
      res.status(404).json({ message: 'No product found with that id!'});
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});


// update product
router.put('/:id', (req, res) => {
  // update product data 
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then(async (productTags) => {
      // get list of current tag_ids
            
      const wantedTagIds = req.body.tagIds;

      //[3]

      // [1,3,4]
      // [2,3,5] -- new tag ids to associate to the currect product

      // sync
      // 1. find out what is overllaping between new and old tag ids
      const overlappedProductTags = productTags.filter(existed => wantedTagIds.includes(existed.tag_id));

      // 2. clear the unwated tags
      const unwantedProductTags = productTags.filter(existed => !wantedTagIds.includes(existed.tag_id));
      const unwantedProductTagIds = unwantedProductTags.map(productTag => productTag.id);
      await ProductTag.destroy({where: {id: unwantedProductTagIds}});

      // 3. associated the new tags
      const newTagIds = wantedTagIds.filter(wanted => !overlappedProductTags.includes(wanted));
      const payload = newTagIds.map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id,
        }
      })
      return await ProductTag.bulkCreate(payload)
    })

    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});


router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const productData = await Product.destroy({
      where: {id: req.params.id}
    });
    if(!productData) {
      res.status(404).json({ message: 'No product with this id found!' });
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
