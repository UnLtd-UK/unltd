migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rtias8h0ed3nkp6")

  // remove
  collection.schema.removeField("0vqn6fvm")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "hdljnkfi",
    "name": "grants",
    "type": "bool",
    "required": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "i8dgkwoy",
    "name": "investments",
    "type": "bool",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
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

  // remove
  collection.schema.removeField("hdljnkfi")

  // remove
  collection.schema.removeField("i8dgkwoy")

  return dao.saveCollection(collection)
})
