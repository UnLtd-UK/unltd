migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p0n56c7zdikauc0")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "srq1diz5",
    "name": "rounds",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": null,
      "collectionId": "j2qukoaajq34yik",
      "cascadeDelete": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p0n56c7zdikauc0")

  // remove
  collection.schema.removeField("srq1diz5")

  return dao.saveCollection(collection)
})
