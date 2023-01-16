migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rtias8h0ed3nkp6")

  // remove
  collection.schema.removeField("2e4cao8f")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "7umb7mq5",
    "name": "start",
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
    "id": "3mkohurt",
    "name": "end",
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
    "id": "0vqjymvg",
    "name": "email",
    "type": "email",
    "required": false,
    "unique": false,
    "options": {
      "exceptDomains": null,
      "onlyDomains": [
        "unltd.org.uk"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rtias8h0ed3nkp6")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "2e4cao8f",
    "name": "active",
    "type": "bool",
    "required": false,
    "unique": false,
    "options": {}
  }))

  // remove
  collection.schema.removeField("7umb7mq5")

  // remove
  collection.schema.removeField("3mkohurt")

  // remove
  collection.schema.removeField("0vqjymvg")

  return dao.saveCollection(collection)
})
