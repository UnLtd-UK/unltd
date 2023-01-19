migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("j2qukoaajq34yik")

  // remove
  collection.schema.removeField("imlotuso")

  // remove
  collection.schema.removeField("thpaqgn9")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "us45w92y",
    "name": "name",
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

  // remove
  collection.schema.removeField("us45w92y")

  return dao.saveCollection(collection)
})
