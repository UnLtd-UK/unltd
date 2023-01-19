migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("j2qukoaajq34yik")

  // remove
  collection.schema.removeField("bu2witfh")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qjrot3ah",
    "name": "closed",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bu2witfh",
    "name": "closed",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // remove
  collection.schema.removeField("qjrot3ah")

  return dao.saveCollection(collection)
})
