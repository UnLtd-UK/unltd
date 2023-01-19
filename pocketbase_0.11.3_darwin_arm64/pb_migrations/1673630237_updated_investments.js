migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("il4dnnh4q9xoenu")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "4lknkbd2",
    "name": "slug",
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
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("il4dnnh4q9xoenu")

  // remove
  collection.schema.removeField("4lknkbd2")

  return dao.saveCollection(collection)
})
