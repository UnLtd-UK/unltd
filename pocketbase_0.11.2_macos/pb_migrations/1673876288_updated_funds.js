migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rtias8h0ed3nkp6")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0vqn6fvm",
    "name": "type",
    "type": "select",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 2,
      "values": [
        "Grants",
        "Investments"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rtias8h0ed3nkp6")

  // remove
  collection.schema.removeField("0vqn6fvm")

  return dao.saveCollection(collection)
})
