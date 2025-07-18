/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2001081480")

  // remove field
  collection.fields.removeById("bool3081333883")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2001081480")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "bool3081333883",
    "name": "isdeployed",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
})
