migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("rtias8h0ed3nkp6");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "rtias8h0ed3nkp6",
    "created": "2022-12-18 21:15:21.990Z",
    "updated": "2023-04-06 13:42:16.993Z",
    "name": "funds",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "auvynoyn",
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
        "id": "eoud7lw9",
        "name": "logo",
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
            "image/gif",
            "image/webp"
          ],
          "thumbs": [],
          "protected": false
        }
      },
      {
        "system": false,
        "id": "qbuau1rt",
        "name": "name",
        "type": "text",
        "required": true,
        "unique": true,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "7umb7mq5",
        "name": "start",
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
        "id": "3mkohurt",
        "name": "end",
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
        "id": "0vqjymvg",
        "name": "email",
        "type": "email",
        "required": false,
        "unique": false,
        "options": {
          "exceptDomains": null,
          "onlyDomains": [
            "unltd.org.uk"
          ]
        }
      },
      {
        "system": false,
        "id": "vk6liw9i",
        "name": "description",
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
        "id": "f0orlkgz",
        "name": "funders",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "zwufv0tg1ap3mm9",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": null,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "cpm1ep3p",
        "name": "partners",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "zwufv0tg1ap3mm9",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": null,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "briy72x3",
        "name": "website",
        "type": "url",
        "required": false,
        "unique": false,
        "options": {
          "exceptDomains": null,
          "onlyDomains": null
        }
      },
      {
        "system": false,
        "id": "hdljnkfi",
        "name": "grants",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "i8dgkwoy",
        "name": "investments",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      }
    ],
    "indexes": [
      "CREATE INDEX `_rtias8h0ed3nkp6_created_idx` ON `funds` (`created`)",
      "CREATE UNIQUE INDEX \"idx_unique_qbuau1rt\" on \"funds\" (\"name\")"
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
