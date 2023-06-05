migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("j2qukoaajq34yik");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "j2qukoaajq34yik",
    "created": "2023-01-17 13:09:23.461Z",
    "updated": "2023-04-06 13:42:16.995Z",
    "name": "rounds",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "4i4hnizy",
        "name": "slug",
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
        "id": "us45w92y",
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
        "id": "qjrot3ah",
        "name": "closed",
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
        "id": "gtith2vr",
        "name": "accessed_from",
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
        "id": "lz3x1unb",
        "name": "accessed_to",
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
        "id": "lurbvpd9",
        "name": "fund",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "rtias8h0ed3nkp6",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      }
    ],
    "indexes": [
      "CREATE INDEX `_j2qukoaajq34yik_created_idx` ON `rounds` (`created`)"
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
