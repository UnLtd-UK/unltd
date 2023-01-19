migrate((db) => {
  const collection = new Collection({
    "id": "j2qukoaajq34yik",
    "created": "2023-01-17 13:09:23.461Z",
    "updated": "2023-01-17 13:09:23.461Z",
    "name": "rounds",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "chasfvay",
        "name": "open",
        "type": "date",
        "required": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      },
      {
        "system": false,
        "id": "bu2witfh",
        "name": "closed",
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
  const collection = dao.findCollectionByNameOrId("j2qukoaajq34yik");

  return dao.deleteCollection(collection);
})
