migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("cvt4g4zjpn3vkzf");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "cvt4g4zjpn3vkzf",
    "created": "2022-11-28 11:32:49.366Z",
    "updated": "2023-04-06 13:42:16.991Z",
    "name": "groups",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "jgs06tzi",
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
        "id": "0plg2pza",
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
        "id": "hcyq5wl1",
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
        "id": "ugbiatuc",
        "name": "field",
        "type": "select",
        "required": true,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "checkbox",
            "date",
            "email",
            "file",
            "number",
            "radio",
            "tel",
            "text",
            "url",
            "datalist",
            "select",
            "textarea"
          ]
        }
      },
      {
        "system": false,
        "id": "yqagadvz",
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
        "id": "lnpr4fhl",
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
        "id": "twrxfn4x",
        "name": "order",
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
        "id": "osdfaupt",
        "name": "data",
        "type": "json",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "x4z5hwbn",
        "name": "required",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "e3daywwa",
        "name": "section",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "0hm8jcor8o0vnc3",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      }
    ],
    "indexes": [
      "CREATE INDEX `_cvt4g4zjpn3vkzf_created_idx` ON \"groups\" (`created`)"
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
