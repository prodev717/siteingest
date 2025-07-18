/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2001081480")

  // update collection data
  unmarshal({
    "listRule": ""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2001081480")

  // update collection data
  unmarshal({
    "listRule": "owner.id = @request.auth.id"
  }, collection)

  return app.save(collection)
})
