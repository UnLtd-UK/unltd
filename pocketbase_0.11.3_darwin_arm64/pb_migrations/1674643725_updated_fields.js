migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7fn3fjl77wmfqph")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jeu774yk",
    "name": "guidance",
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
  const collection = dao.findCollectionByNameOrId("7fn3fjl77wmfqph")

  // remove
  collection.schema.removeField("jeu774yk")

  return dao.saveCollection(collection)
})
