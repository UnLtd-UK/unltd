migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("j2qukoaajq34yik")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gtith2vr",
    "name": "accessed",
    "type": "date",
    "required": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lz3x1unb",
    "name": "decision",
    "type": "date",
    "required": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("j2qukoaajq34yik")

  // remove
  collection.schema.removeField("gtith2vr")

  // remove
  collection.schema.removeField("lz3x1unb")

  return dao.saveCollection(collection)
})
