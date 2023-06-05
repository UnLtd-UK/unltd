migrate((db) => {
  const snapshot = [
    {
      "id": "_pb_users_auth_",
      "created": "2022-11-28 10:39:30.408Z",
      "updated": "2023-01-19 22:19:38.634Z",
      "name": "users",
      "type": "auth",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "users_name",
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
          "id": "users_avatar",
          "name": "avatar",
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
            "thumbs": null
          }
        }
      ],
      "listRule": "id = @request.auth.id",
      "viewRule": "id = @request.auth.id",
      "createRule": "",
      "updateRule": "id = @request.auth.id",
      "deleteRule": "id = @request.auth.id",
      "options": {
        "allowEmailAuth": true,
        "allowOAuth2Auth": true,
        "allowUsernameAuth": true,
        "exceptEmailDomains": null,
        "manageRule": null,
        "minPasswordLength": 8,
        "onlyEmailDomains": null,
        "requireEmail": false
      }
    },
    {
      "id": "cvt4g4zjpn3vkzf",
      "created": "2022-11-28 11:32:49.366Z",
      "updated": "2023-01-19 22:19:38.636Z",
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
            "maxSelect": 1,
            "displayFields": null
          }
        }
      ],
      "listRule": null,
      "viewRule": null,
      "createRule": null,
      "updateRule": null,
      "deleteRule": null,
      "options": {}
    },
    {
      "id": "0hm8jcor8o0vnc3",
      "created": "2022-11-28 11:34:01.059Z",
      "updated": "2023-01-19 22:19:38.636Z",
      "name": "sections",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "b3ekzr6e",
          "name": "slug",
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
          "id": "trccmswl",
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
          "id": "9vrm59bb",
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
          "id": "frkzsarj",
          "name": "applications",
          "type": "relation",
          "required": true,
          "unique": false,
          "options": {
            "collectionId": "vzy3j3ok3iak6uy",
            "cascadeDelete": false,
            "maxSelect": 3,
            "displayFields": null
          }
        },
        {
          "system": false,
          "id": "fko68bzo",
          "name": "order",
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
    },
    {
      "id": "vzy3j3ok3iak6uy",
      "created": "2022-11-28 11:34:51.820Z",
      "updated": "2023-02-16 12:37:00.429Z",
      "name": "applications",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "tznbjfe6",
          "name": "order",
          "type": "number",
          "required": true,
          "unique": true,
          "options": {
            "min": null,
            "max": null
          }
        },
        {
          "system": false,
          "id": "nfyhxnmk",
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
          "id": "n85dteuz",
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
          "id": "z5maj5ju",
          "name": "awards",
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
          "id": "oriskesv",
          "name": "grant_amount",
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
          "id": "bcghftd3",
          "name": "grant_description",
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
          "id": "z22j04yj",
          "name": "body",
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
          "id": "od879tcw",
          "name": "pdf",
          "type": "file",
          "required": false,
          "unique": false,
          "options": {
            "maxSelect": 1,
            "maxSize": 5242880,
            "mimeTypes": [
              "application/pdf",
              "application/msword",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              "application/vnd.ms-excel",
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            ],
            "thumbs": []
          }
        },
        {
          "system": false,
          "id": "6xohisla",
          "name": "docx",
          "type": "file",
          "required": false,
          "unique": false,
          "options": {
            "maxSelect": 1,
            "maxSize": 5242880,
            "mimeTypes": [
              "application/pdf",
              "application/msword",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              "application/vnd.ms-excel",
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            ],
            "thumbs": []
          }
        },
        {
          "system": false,
          "id": "vkeqwq3i",
          "name": "xlsx",
          "type": "file",
          "required": false,
          "unique": false,
          "options": {
            "maxSelect": 1,
            "maxSize": 5242880,
            "mimeTypes": [
              "application/pdf",
              "application/msword",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              "application/vnd.ms-excel",
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            ],
            "thumbs": []
          }
        },
        {
          "system": false,
          "id": "kgmzejkk",
          "name": "social_venture_costs",
          "type": "bool",
          "required": false,
          "unique": false,
          "options": {}
        },
        {
          "system": false,
          "id": "goz7isye",
          "name": "social_entrepreneur_salary",
          "type": "bool",
          "required": false,
          "unique": false,
          "options": {}
        },
        {
          "system": false,
          "id": "ilnskwx3",
          "name": "selling_goods_and_services",
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
          "id": "ffjdjbjj",
          "name": "positive_impact",
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
          "id": "ojyetwcp",
          "name": "incorporated",
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
    },
    {
      "id": "7fn3fjl77wmfqph",
      "created": "2022-11-28 12:07:02.180Z",
      "updated": "2023-01-25 10:48:44.990Z",
      "name": "fields",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "mwozwzg9",
          "name": "order",
          "type": "number",
          "required": true,
          "unique": false,
          "options": {
            "min": 1,
            "max": null
          }
        },
        {
          "system": false,
          "id": "daurltrf",
          "name": "sections",
          "type": "relation",
          "required": true,
          "unique": false,
          "options": {
            "collectionId": "0hm8jcor8o0vnc3",
            "cascadeDelete": false,
            "maxSelect": null,
            "displayFields": null
          }
        },
        {
          "system": false,
          "id": "t3da8zbx",
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
          "id": "pfuuvyvj",
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
          "id": "ikcryozy",
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
          "id": "2wfexmc1",
          "name": "required",
          "type": "bool",
          "required": false,
          "unique": false,
          "options": {}
        },
        {
          "system": false,
          "id": "bkl3pblb",
          "name": "disabled",
          "type": "bool",
          "required": false,
          "unique": false,
          "options": {}
        },
        {
          "system": false,
          "id": "uguppwrg",
          "name": "type",
          "type": "select",
          "required": false,
          "unique": false,
          "options": {
            "maxSelect": 1,
            "values": [
              "Input",
              "Select",
              "Datalist",
              "Textarea",
              "Checkboxes",
              "Radios"
            ]
          }
        },
        {
          "system": false,
          "id": "kvggocah",
          "name": "input_type",
          "type": "select",
          "required": false,
          "unique": false,
          "options": {
            "maxSelect": 1,
            "values": [
              "button",
              "checkbox",
              "color",
              "date",
              "datetime-local",
              "email",
              "file",
              "hidden",
              "image",
              "month",
              "number",
              "password",
              "radio",
              "range",
              "reset",
              "search",
              "submit",
              "tel",
              "text",
              "time",
              "url",
              "week"
            ]
          }
        },
        {
          "system": false,
          "id": "xcqelovz",
          "name": "max_length",
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
          "id": "ddrieqtt",
          "name": "autocomplete",
          "type": "select",
          "required": false,
          "unique": false,
          "options": {
            "maxSelect": 1,
            "values": [
              "on",
              "name",
              "honorific-prefix",
              "given-name",
              "additional-name",
              "family-name",
              "honorific-suffix",
              "nickname",
              "email",
              "username",
              "new-password",
              "current-password",
              "one-time-code",
              "organization-title",
              "organization",
              "street-address",
              "address-line1",
              "address-line2",
              "address-line3",
              "address-level4",
              "address-level3",
              "address-level2",
              "address-level1",
              "country",
              "country-name",
              "postal-code",
              "cc-name",
              "cc-given-name",
              "cc-additional-name",
              "cc-family-name",
              "cc-number",
              "cc-exp",
              "cc-exp-month",
              "cc-exp-year",
              "cc-csc",
              "cc-type",
              "transaction-currency",
              "transaction-amount",
              "language",
              "bday",
              "bday-day",
              "bday-month",
              "bday-year",
              "sex",
              "tel",
              "tel-country-code",
              "tel-national",
              "tel-area-code",
              "tel-local",
              "tel-extension",
              "impp",
              "url",
              "photo"
            ]
          }
        },
        {
          "system": false,
          "id": "fdzibgin",
          "name": "select_options",
          "type": "json",
          "required": false,
          "unique": false,
          "options": {}
        },
        {
          "system": false,
          "id": "1jwiwgcv",
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
          "id": "otkwa6ru",
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
          "id": "jeu774yk",
          "name": "guidance",
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
    },
    {
      "id": "794o0senj0u5e3c",
      "created": "2022-11-30 13:07:46.024Z",
      "updated": "2023-01-19 22:19:38.636Z",
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
            ]
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
            "maxSelect": 1,
            "displayFields": null
          }
        }
      ],
      "listRule": null,
      "viewRule": null,
      "createRule": null,
      "updateRule": null,
      "deleteRule": null,
      "options": {}
    },
    {
      "id": "bt4dtwpe5921i5x",
      "created": "2022-11-30 13:08:16.671Z",
      "updated": "2023-01-19 22:19:38.636Z",
      "name": "roles",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "ca1jhyrf",
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
          "id": "3hkntxt1",
          "name": "team",
          "type": "relation",
          "required": true,
          "unique": false,
          "options": {
            "collectionId": "dsapvm6xytb8t0r",
            "cascadeDelete": false,
            "maxSelect": 1,
            "displayFields": null
          }
        },
        {
          "system": false,
          "id": "m9bivpqb",
          "name": "geography",
          "type": "select",
          "required": false,
          "unique": false,
          "options": {
            "maxSelect": 5,
            "values": [
              "England",
              "North England",
              "South England",
              "Scotland",
              "Wales",
              "Northern Ireland"
            ]
          }
        },
        {
          "system": false,
          "id": "92ianuvf",
          "name": "fund",
          "type": "select",
          "required": false,
          "unique": false,
          "options": {
            "maxSelect": 1,
            "values": [
              "Healthy Ageing"
            ]
          }
        },
        {
          "system": false,
          "id": "lph5da6y",
          "name": "sector",
          "type": "select",
          "required": false,
          "unique": false,
          "options": {
            "maxSelect": 1,
            "values": [
              "Access to Employment"
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
    },
    {
      "id": "dsapvm6xytb8t0r",
      "created": "2022-11-30 13:08:58.251Z",
      "updated": "2023-01-19 22:19:38.636Z",
      "name": "teams",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "oaur6p4g",
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
          "id": "vnmkvze4",
          "name": "description",
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
    },
    {
      "id": "rtias8h0ed3nkp6",
      "created": "2022-12-18 21:15:21.990Z",
      "updated": "2023-01-24 17:46:41.254Z",
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
            "thumbs": []
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
      "listRule": null,
      "viewRule": null,
      "createRule": null,
      "updateRule": null,
      "deleteRule": null,
      "options": {}
    },
    {
      "id": "p0n56c7zdikauc0",
      "created": "2023-01-12 11:45:19.277Z",
      "updated": "2023-01-23 16:08:18.415Z",
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
      "listRule": null,
      "viewRule": null,
      "createRule": null,
      "updateRule": null,
      "deleteRule": null,
      "options": {}
    },
    {
      "id": "vyexlbgz7aonpji",
      "created": "2023-01-12 11:49:25.256Z",
      "updated": "2023-01-19 22:19:38.636Z",
      "name": "eligibility",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "puojssdf",
          "name": "social_entrepreneur",
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
          "id": "spt9jpvt",
          "name": "social_venture",
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
          "id": "ckfgywgt",
          "name": "grant",
          "type": "relation",
          "required": false,
          "unique": false,
          "options": {
            "collectionId": "p0n56c7zdikauc0",
            "cascadeDelete": false,
            "maxSelect": 1,
            "displayFields": null
          }
        },
        {
          "system": false,
          "id": "fskmcwax",
          "name": "investment",
          "type": "relation",
          "required": false,
          "unique": false,
          "options": {
            "collectionId": "il4dnnh4q9xoenu",
            "cascadeDelete": false,
            "maxSelect": 1,
            "displayFields": null
          }
        }
      ],
      "listRule": null,
      "viewRule": null,
      "createRule": null,
      "updateRule": null,
      "deleteRule": null,
      "options": {}
    },
    {
      "id": "zwufv0tg1ap3mm9",
      "created": "2023-01-12 14:15:30.031Z",
      "updated": "2023-01-19 22:19:38.636Z",
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
    },
    {
      "id": "il4dnnh4q9xoenu",
      "created": "2023-01-13 11:05:00.543Z",
      "updated": "2023-01-19 22:19:38.636Z",
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
            "maxSelect": 1,
            "displayFields": null
          }
        }
      ],
      "listRule": null,
      "viewRule": null,
      "createRule": null,
      "updateRule": null,
      "deleteRule": null,
      "options": {}
    },
    {
      "id": "47id2hc4agpaiw7",
      "created": "2023-01-13 17:58:45.477Z",
      "updated": "2023-01-19 22:19:38.636Z",
      "name": "applications_grants",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "qhbfd6gk",
          "name": "grants",
          "type": "relation",
          "required": false,
          "unique": false,
          "options": {
            "collectionId": "p0n56c7zdikauc0",
            "cascadeDelete": false,
            "maxSelect": null,
            "displayFields": null
          }
        },
        {
          "system": false,
          "id": "bkpz20tx",
          "name": "applications",
          "type": "relation",
          "required": false,
          "unique": false,
          "options": {
            "collectionId": "vzy3j3ok3iak6uy",
            "cascadeDelete": false,
            "maxSelect": null,
            "displayFields": null
          }
        }
      ],
      "listRule": null,
      "viewRule": null,
      "createRule": null,
      "updateRule": null,
      "deleteRule": null,
      "options": {}
    },
    {
      "id": "j2qukoaajq34yik",
      "created": "2023-01-17 13:09:23.461Z",
      "updated": "2023-01-19 22:36:32.010Z",
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
            "maxSelect": 1,
            "displayFields": null
          }
        }
      ],
      "listRule": null,
      "viewRule": null,
      "createRule": null,
      "updateRule": null,
      "deleteRule": null,
      "options": {}
    }
  ];

  const collections = snapshot.map((item) => new Collection(item));

  return Dao(db).importCollections(collections, true, null);
}, (db) => {
  return null;
})
