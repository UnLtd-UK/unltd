migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rtias8h0ed3nkp6")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cpm1ep3p",
    "name": "partners",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": null,
      "collectionId": "zwufv0tg1ap3mm9",
      "cascadeDelete": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rtias8h0ed3nkp6")

  // remove
  collection.schema.removeField("cpm1ep3p")

  return dao.saveCollection(collection)
})
