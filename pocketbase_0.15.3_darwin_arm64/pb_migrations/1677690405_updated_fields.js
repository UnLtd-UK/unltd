migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7fn3fjl77wmfqph")

  // remove
  collection.schema.removeField("fedkldu3")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7fn3fjl77wmfqph")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fedkldu3",
    "name": "description1",
    "type": "editor",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
})
