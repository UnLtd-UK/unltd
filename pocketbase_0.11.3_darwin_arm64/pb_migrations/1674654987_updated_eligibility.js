migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vyexlbgz7aonpji")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ckfgywgt",
    "name": "grant",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": null,
      "collectionId": "p0n56c7zdikauc0",
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
    "id": "ckfgywgt",
    "name": "grant",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "collectionId": "p0n56c7zdikauc0",
      "cascadeDelete": false
    }
  }))

  return dao.saveCollection(collection)
})
