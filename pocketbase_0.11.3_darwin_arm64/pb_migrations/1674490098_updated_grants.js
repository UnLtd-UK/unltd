migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p0n56c7zdikauc0")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qr6p5ykl",
    "name": "top_up",
    "type": "bool",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p0n56c7zdikauc0")

  // remove
  collection.schema.removeField("qr6p5ykl")

  return dao.saveCollection(collection)
})
