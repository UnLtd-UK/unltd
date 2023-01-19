migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p0n56c7zdikauc0")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "b08pxmxy",
    "name": "max",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p0n56c7zdikauc0")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "b08pxmxy",
    "name": "max",
    "type": "number",
    "required": true,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  return dao.saveCollection(collection)
})
