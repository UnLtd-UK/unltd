migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("p0n56c7zdikauc0");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "p0n56c7zdikauc0",
    "created": "2023-01-12 11:45:19.277Z",
    "updated": "2023-04-06 13:42:16.994Z",
    "name": "grants",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "igi2ybpl",
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
        "id": "5fntsyll",
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
        "id": "h2fobwtl",
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
        "id": "b08pxmxy",
        "name": "max",
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
        "id": "wcbzqswf",
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
        "id": "4vqonckp",
        "name": "type1",
        "type": "select",
        "required": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "grant",
            "investment"
          ]
        }
      },
      {
        "system": false,
        "id": "fzflevuj",
        "name": "type2",
        "type": "select",
        "required": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "Repayable",
            "Non-repayable"
          ]
        }
      },
      {
        "system": false,
        "id": "srq1diz5",
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
      },
      {
        "system": false,
        "id": "qr6p5ykl",
        "name": "top_up",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      }
    ],
    "indexes": [
      "CREATE INDEX `_p0n56c7zdikauc0_created_idx` ON `grants` (`created`)"
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
