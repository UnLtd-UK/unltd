migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("il4dnnh4q9xoenu")

  // remove
  collection.schema.removeField("iyazadoe")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "j357t3m1",
    "name": "round",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "collectionId": "j2qukoaajq34yik",
      "cascadeDelete": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("il4dnnh4q9xoenu")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "iyazadoe",
    "name": "fund",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "collectionId": "rtias8h0ed3nkp6",
      "cascadeDelete": false
    }
  }))

  // remove
  collection.schema.removeField("j357t3m1")

  return dao.saveCollection(collection)
})
