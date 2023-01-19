migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("j2qukoaajq34yik")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lurbvpd9",
    "name": "funds",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": null,
      "collectionId": "rtias8h0ed3nkp6",
      "cascadeDelete": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "imlotuso",
    "name": "grants",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": null,
      "collectionId": "p0n56c7zdikauc0",
      "cascadeDelete": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "thpaqgn9",
    "name": "investments",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": null,
      "collectionId": "il4dnnh4q9xoenu",
      "cascadeDelete": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("j2qukoaajq34yik")

  // remove
  collection.schema.removeField("lurbvpd9")

  // remove
  collection.schema.removeField("imlotuso")

  // remove
  collection.schema.removeField("thpaqgn9")

  return dao.saveCollection(collection)
})
