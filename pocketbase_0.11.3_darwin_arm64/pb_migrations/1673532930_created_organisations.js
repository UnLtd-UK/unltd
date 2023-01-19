migrate((db) => {
  const collection = new Collection({
    "id": "zwufv0tg1ap3mm9",
    "created": "2023-01-12 14:15:30.031Z",
    "updated": "2023-01-12 14:15:30.031Z",
    "name": "organisations",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "j4ivc61a",
        "name": "name",
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
  const collection = dao.findCollectionByNameOrId("zwufv0tg1ap3mm9");

  return dao.deleteCollection(collection);
})
