migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("il4dnnh4q9xoenu")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jwtd5d7q",
    "name": "field",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("il4dnnh4q9xoenu")

  // remove
  collection.schema.removeField("jwtd5d7q")

  return dao.saveCollection(collection)
})
