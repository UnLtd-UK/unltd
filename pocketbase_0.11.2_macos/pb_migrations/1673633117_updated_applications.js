migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vzy3j3ok3iak6uy")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ffjdjbjj",
    "name": "positive_impact",
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
    "id": "ojyetwcp",
    "name": "incorporated",
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
    "id": "ilnskwx3",
    "name": "selling_goods_and_services",
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
  const collection = dao.findCollectionByNameOrId("vzy3j3ok3iak6uy")

  // remove
  collection.schema.removeField("ffjdjbjj")

  // remove
  collection.schema.removeField("ojyetwcp")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ilnskwx3",
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

  return dao.saveCollection(collection)
})
