migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vyexlbgz7aonpji")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fskmcwax",
    "name": "investment",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": null,
      "collectionId": "il4dnnh4q9xoenu",
      "cascadeDelete": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vyexlbgz7aonpji")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fskmcwax",
    "name": "investment",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "collectionId": "il4dnnh4q9xoenu",
      "cascadeDelete": false
    }
  }))

  return dao.saveCollection(collection)
})
