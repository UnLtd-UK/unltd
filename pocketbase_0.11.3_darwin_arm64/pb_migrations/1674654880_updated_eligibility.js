migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vyexlbgz7aonpji")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "za1wh63l",
    "name": "name",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vyexlbgz7aonpji")

  // remove
  collection.schema.removeField("za1wh63l")

  return dao.saveCollection(collection)
})
