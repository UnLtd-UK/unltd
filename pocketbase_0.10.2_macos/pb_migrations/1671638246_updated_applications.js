migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vzy3j3ok3iak6uy")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "kgmzejkk",
    "name": "social_venture_costs",
    "type": "bool",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vzy3j3ok3iak6uy")

  // remove
  collection.schema.removeField("kgmzejkk")

  return dao.saveCollection(collection)
})
