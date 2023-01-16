migrate((db) => {
  const collection = new Collection({
    "id": "47id2hc4agpaiw7",
    "created": "2023-01-13 17:58:45.477Z",
    "updated": "2023-01-13 17:58:45.477Z",
    "name": "applications_grants",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "qhbfd6gk",
        "name": "grants",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "maxSelect": null,
          "collectionId": "p0n56c7zdikauc0",
          "cascadeDelete": false
        }
      },
      {
        "system": false,
        "id": "bkpz20tx",
        "name": "applications",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "maxSelect": null,
          "collectionId": "vzy3j3ok3iak6uy",
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
  const collection = dao.findCollectionByNameOrId("47id2hc4agpaiw7");

  return dao.deleteCollection(collection);
})
