migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("j2qukoaajq34yik")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "4i4hnizy",
    "name": "slug",
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
  const collection = dao.findCollectionByNameOrId("j2qukoaajq34yik")

  // remove
  collection.schema.removeField("4i4hnizy")

  return dao.saveCollection(collection)
})
