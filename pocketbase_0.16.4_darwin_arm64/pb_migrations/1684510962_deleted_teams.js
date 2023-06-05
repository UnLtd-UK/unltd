migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("dsapvm6xytb8t0r");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "dsapvm6xytb8t0r",
    "created": "2022-11-30 13:08:58.251Z",
    "updated": "2023-04-06 13:42:16.993Z",
    "name": "teams",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "oaur6p4g",
        "name": "name",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "vnmkvze4",
        "name": "description",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [
      "CREATE INDEX `_dsapvm6xytb8t0r_created_idx` ON `teams` (`created`)"
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
