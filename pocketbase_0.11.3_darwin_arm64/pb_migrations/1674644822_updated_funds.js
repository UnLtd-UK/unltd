migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rtias8h0ed3nkp6")

  // remove
  collection.schema.removeField("kmqbumii")

  // remove
  collection.schema.removeField("omhexsi9")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rtias8h0ed3nkp6")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "kmqbumii",
    "name": "open",
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
    "id": "omhexsi9",
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
})
