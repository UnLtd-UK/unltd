migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("794o0senj0u5e3c");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "794o0senj0u5e3c",
    "created": "2022-11-30 13:07:46.024Z",
    "updated": "2023-04-06 13:42:16.992Z",
    "name": "people",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "xnq1j4il",
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
        "id": "yafkvhqc",
        "name": "prefix",
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
        "id": "u8otzxkx",
        "name": "suffix",
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
        "id": "pycdfdti",
        "name": "image",
        "type": "file",
        "required": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "maxSize": 5242880,
          "mimeTypes": [
            "image/jpg",
            "image/jpeg",
            "image/png",
            "image/svg+xml",
            "image/gif"
          ],
          "thumbs": [
            "100x100"
          ],
          "protected": false
        }
      },
      {
        "system": false,
        "id": "asx2wujy",
        "name": "pronouns",
        "type": "select",
        "required": false,
        "unique": false,
        "options": {
          "maxSelect": 3,
          "values": [
            "he/him",
            "she/her",
            "they/them"
          ]
        }
      },
      {
        "system": false,
        "id": "dtqdu0y5",
        "name": "linkedin",
        "type": "url",
        "required": false,
        "unique": false,
        "options": {
          "exceptDomains": [],
          "onlyDomains": [
            "www.linkedin.com"
          ]
        }
      },
      {
        "system": false,
        "id": "uor3fdge",
        "name": "role",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "bt4dtwpe5921i5x",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      }
    ],
    "indexes": [
      "CREATE INDEX `_794o0senj0u5e3c_created_idx` ON `people` (`created`)"
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
