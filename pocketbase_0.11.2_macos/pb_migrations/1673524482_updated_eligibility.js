migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vyexlbgz7aonpji")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "7qekajux",
    "name": "countries",
    "type": "select",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 4,
      "values": [
        "England",
        "Scotland",
        "Wales",
        "Northern Ireland"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vyexlbgz7aonpji")

  // remove
  collection.schema.removeField("7qekajux")

  return dao.saveCollection(collection)
})
