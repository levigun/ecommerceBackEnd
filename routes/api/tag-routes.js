const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findAll();
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// find a single tag by its `id`
router.get('/:id', async (req, res) => {
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag, as: 'products' }],
    })

    if (!tagData) {
      res.status(404).json({ message: 'No tag found with that id!' });
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create a new tag
router.post('/',  (req, res) => {
  /* req.body should look like this....
    {
      "tag_name" = "",
      "productIds" = []
    }
  */
    Tag.create(req.body)
      .then((tag) => {
        // if there are tag's products, need to create pairing to bul create in the ProductTag model
        if (req.body.productIds.length) {
          const tagProductIdArr = req.body.productIds.map((product_id) => {
            return {
              product_id,
              tag_id: tag.id
            }
          });
          return ProductTag.bulkCreate(tagProductIdArr);
        }
        // if no tag's products
        res.status(200).json(tag);
      })
      .then((tagProductIds) => res.status(200).json(tagProductIds))
      .catch((err) => {
        res.status(400).json(err);
      })
});

// try {
//   const tagData = await Tag.create(req.body);
//   res.status(200).json(tagData);
// } catch (err) {
//   res.status(400).json(err);
// }

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
 
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!tagData) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
