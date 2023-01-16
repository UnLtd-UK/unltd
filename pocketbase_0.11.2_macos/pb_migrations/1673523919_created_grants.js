migrate((db) => {
  const collection = new Collection({
    "id": "p0n56c7zdikauc0",
    "created": "2023-01-12 11:45:19.277Z",
    "updated": "2023-01-12 11:45:19.277Z",
    "name": "grants",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "b08pxmxy",
        "name": "max",
        "type": "number",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null
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
  const collection = dao.findCollectionByNameOrId("p0n56c7zdikauc0");

  return dao.deleteCollection(collection);
})
