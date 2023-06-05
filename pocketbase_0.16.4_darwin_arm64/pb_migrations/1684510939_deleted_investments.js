migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("il4dnnh4q9xoenu");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "il4dnnh4q9xoenu",
    "created": "2023-01-13 11:05:00.543Z",
    "updated": "2023-04-06 13:42:16.995Z",
    "name": "investments",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "4lknkbd2",
        "name": "slug",
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
        "id": "0ej6dsgm",
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
        "id": "f7dx0lb4",
        "name": "min",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null
        }
      },
      {
        "system": false,
        "id": "kt5oxerp",
        "name": "max",
        "type": "number",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null
        }
      },
      {
        "system": false,
        "id": "t5cuhnat",
        "name": "fixed",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null
        }
      },
      {
        "system": false,
        "id": "hdkuml42",
        "name": "type",
        "type": "select",
        "required": true,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "Equity",
            "Revenue Share",
            "Patient Debt"
          ]
        }
      },
      {
        "system": false,
        "id": "j357t3m1",
        "name": "round",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "j2qukoaajq34yik",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      }
    ],
    "indexes": [
      "CREATE INDEX `_il4dnnh4q9xoenu_created_idx` ON `investments` (`created`)"
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
