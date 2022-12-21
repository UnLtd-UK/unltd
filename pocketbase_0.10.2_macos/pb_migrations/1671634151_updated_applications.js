migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vzy3j3ok3iak6uy")

  // remove
  collection.schema.removeField("xzozrezo")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vzy3j3ok3iak6uy")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xzozrezo",
    "name": "description",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
})
