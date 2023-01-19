migrate((db) => {
  const collection = new Collection({
    "id": "vyexlbgz7aonpji",
    "created": "2023-01-12 11:49:25.256Z",
    "updated": "2023-01-12 11:49:25.256Z",
    "name": "eligibility",
    "type": "base",
    "system": false,
    "schema": [
      {
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
      }
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("vyexlbgz7aonpji");

  return dao.deleteCollection(collection);
})
