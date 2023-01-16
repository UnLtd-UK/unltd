migrate((db) => {
  const collection = new Collection({
    "id": "il4dnnh4q9xoenu",
    "created": "2023-01-13 11:05:00.543Z",
    "updated": "2023-01-13 11:05:00.543Z",
    "name": "investments",
    "type": "base",
    "system": false,
    "schema": [
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
        "id": "hdkuml42",
        "name": "dropdown",
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
  const collection = dao.findCollectionByNameOrId("il4dnnh4q9xoenu");

  return dao.deleteCollection(collection);
})
