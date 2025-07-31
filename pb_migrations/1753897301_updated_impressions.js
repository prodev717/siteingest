/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1472017620")

  // remove field
  collection.fields.removeById("number6099890412")

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "number609989041",
    "max": null,
    "min": 0,
    "name": "impression",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1472017620")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "number6099890412",
    "max": null,
    "min": 0,
    "name": "impression",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "number609989041",
    "max": null,
    "min": 0,
    "name": "reach",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
