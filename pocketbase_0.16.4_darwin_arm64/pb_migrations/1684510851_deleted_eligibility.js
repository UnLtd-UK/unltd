migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("vyexlbgz7aonpji");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "vyexlbgz7aonpji",
    "created": "2023-01-12 11:49:25.256Z",
    "updated": "2023-04-06 13:42:16.994Z",
    "name": "eligibility",
    "type": "base",
    "system": false,
    "schema": [
      {
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
      },
      {
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
      },
      {
        "system": false,
        "id": "ckfgywgt",
        "name": "grant",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "p0n56c7zdikauc0",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "fskmcwax",
        "name": "investment",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "il4dnnh4q9xoenu",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      }
    ],
    "indexes": [
      "CREATE INDEX `_vyexlbgz7aonpji_created_idx` ON `eligibility` (`created`)"
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
