migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("bt4dtwpe5921i5x");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "bt4dtwpe5921i5x",
    "created": "2022-11-30 13:08:16.671Z",
    "updated": "2023-04-06 13:42:16.993Z",
    "name": "roles",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ca1jhyrf",
        "name": "name",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "3hkntxt1",
        "name": "team",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "dsapvm6xytb8t0r",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "m9bivpqb",
        "name": "geography",
        "type": "select",
        "required": false,
        "unique": false,
        "options": {
          "maxSelect": 5,
          "values": [
            "England",
            "North England",
            "South England",
            "Scotland",
            "Wales",
            "Northern Ireland"
          ]
        }
      },
      {
        "system": false,
        "id": "92ianuvf",
        "name": "fund",
        "type": "select",
        "required": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "Healthy Ageing"
          ]
        }
      },
      {
        "system": false,
        "id": "lph5da6y",
        "name": "sector",
        "type": "select",
        "required": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "Access to Employment"
          ]
        }
      }
    ],
    "indexes": [
      "CREATE INDEX `_bt4dtwpe5921i5x_created_idx` ON `roles` (`created`)"
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
