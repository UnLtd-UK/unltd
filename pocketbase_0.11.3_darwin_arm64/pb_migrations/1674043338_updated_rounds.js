migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("j2qukoaajq34yik")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lurbvpd9",
    "name": "fund",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "collectionId": "rtias8h0ed3nkp6",
      "cascadeDelete": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("j2qukoaajq34yik")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lurbvpd9",
    "name": "funds",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "collectionId": "rtias8h0ed3nkp6",
      "cascadeDelete": false
    }
  }))

  return dao.saveCollection(collection)
})
