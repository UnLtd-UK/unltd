migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p0n56c7zdikauc0")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qmdi4cgy",
    "name": "available_to",
    "type": "select",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 2,
      "values": [
        "Social Entrepreneur",
        "Social Venture"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p0n56c7zdikauc0")

  // remove
  collection.schema.removeField("qmdi4cgy")

  return dao.saveCollection(collection)
})
