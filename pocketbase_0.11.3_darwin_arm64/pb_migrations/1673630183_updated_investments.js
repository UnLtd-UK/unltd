migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("il4dnnh4q9xoenu")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "hdkuml42",
    "name": "type",
    "type": "select",
    "required": true,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "Equity",
        "Revenue Share",
        "Patient Debt"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("il4dnnh4q9xoenu")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "hdkuml42",
    "name": "dropdown",
    "type": "select",
    "required": true,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "Equity",
        "Revenue Share",
        "Patient Debt"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
