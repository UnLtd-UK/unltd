migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p0n56c7zdikauc0")

  // remove
  collection.schema.removeField("4vqonckp")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fzflevuj",
    "name": "type",
    "type": "select",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "Repayable",
        "Non-repayable"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p0n56c7zdikauc0")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "4vqonckp",
    "name": "type1",
    "type": "select",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "grant",
        "investment"
      ]
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fzflevuj",
    "name": "type2",
    "type": "select",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "Repayable",
        "Non-repayable"
      ]
    }
  }))

  return dao.saveCollection(collection)
})