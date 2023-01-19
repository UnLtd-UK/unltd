migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vyexlbgz7aonpji")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "spt9jpvt",
    "name": "social_venture",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "puojssdf",
    "name": "social_entrepreneur",
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
  const collection = dao.findCollectionByNameOrId("vyexlbgz7aonpji")

  // remove
  collection.schema.removeField("spt9jpvt")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "puojssdf",
    "name": "description",
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
})
