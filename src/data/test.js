import { pb } from "./pocketbase.js";

let grants = await pb.collection("grants").getFullList(200);
let applications = await pb.collection("applications").getFullList(200);
let eligibility = await pb.collection("applications").getFullList(200);

function joined(parentCollection, childCollection) {
    return parentCollection.map((parentCollectionItem) => {
        childCollection.map((childCollectionItem) => {
            if (childCollectionItem.hasOwnProperty(parentCollectionItem.CollectionName)) {
                parentCollectionItem[childCollectionItem.name] = [];
                if (typeof childCollectionItem[parentCollectionItem.CollectionName] == 'string' && childCollectionItem[parentCollectionItem.CollectionName] == parentCollectionItem.id) {
                    parentCollectionItem[childCollectionItem.CollectionName].push(childCollectionItem)
                } else if (typeof childCollectionItem[parentCollectionItem.CollectionName] == 'array') {
                    childCollectionItem[parentCollectionItem.CollectionName].map((item) => {
                        parentCollectionItem[childCollectionItem.CollectionName].push(item)
                    })
                    parentCollectionItem[childCollectionItem.CollectionName].push(childCollectionItem)
                } else {
                    return "collection name already exists and/or is not a type array"
                }
            } else {
                return "no collect match";
            }
        })
    })
}

let results = joined(grants, applications)