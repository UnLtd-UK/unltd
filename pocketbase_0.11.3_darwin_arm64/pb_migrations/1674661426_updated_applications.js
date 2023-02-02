migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vzy3j3ok3iak6uy")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "y9gpcckw",
    "name": "eligibility",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": null,
      "collectionId": "vyexlbgz7aonpji",
      "cascadeDelete": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vzy3j3ok3iak6uy")

  // remove
  collection.schema.removeField("y9gpcckw")

  return dao.saveCollection(collection)
})
