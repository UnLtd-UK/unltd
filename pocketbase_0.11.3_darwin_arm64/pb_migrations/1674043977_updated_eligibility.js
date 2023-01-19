migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vyexlbgz7aonpji")

  // remove
  collection.schema.removeField("7qekajux")

  // add
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fskmcwax",
    "name": "investment",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "collectionId": "il4dnnh4q9xoenu",
      "cascadeDelete": false
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ckfgywgt",
    "name": "grant",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "collectionId": "p0n56c7zdikauc0",
      "cascadeDelete": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vyexlbgz7aonpji")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "7qekajux",
    "name": "countries",
    "type": "select",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 4,
      "values": [
        "England",
        "Scotland",
        "Wales",
        "Northern Ireland"
      ]
    }
  }))

  // remove
  collection.schema.removeField("puojssdf")

  // remove
  collection.schema.removeField("fskmcwax")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ckfgywgt",
    "name": "grant",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": null,
      "collectionId": "p0n56c7zdikauc0",
      "cascadeDelete": false
    }
  }))

  return dao.saveCollection(collection)
})
