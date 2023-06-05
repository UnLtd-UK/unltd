migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("47id2hc4agpaiw7");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "47id2hc4agpaiw7",
    "created": "2023-01-13 17:58:45.477Z",
    "updated": "2023-04-06 13:42:16.995Z",
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
          "collectionId": "p0n56c7zdikauc0",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": null,
          "displayFields": null
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
          "collectionId": "vzy3j3ok3iak6uy",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": null,
          "displayFields": null
        }
      }
    ],
    "indexes": [
      "CREATE INDEX `_47id2hc4agpaiw7_created_idx` ON `applications_grants` (`created`)"
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
})
