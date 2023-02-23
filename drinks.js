const drinksdb = require("./drinksdb")
const { writeJson, readRequestData, getIdFromUrl } = require("./utils");

function getAllDrinks(req, res){
    const drinks = drinksdb.getDrinks();
    writeJson(res, drinks);
}

function getOneDrink(req, res) {
    const id = getIdFromUrl(req.url);
    const drinks = drinksdb.getDrinks();
    const drink = drinks.find((u) => u.id === id);
    if(drinks) {
        writeJson(res, drink);
    } else {
        writeJson(res, {status: "NOT_FOUND"}, 404);
    }
}

async function updateOneDrink(req, res) {
    const id = getIdFromUrl(req.url);
    const { name, description, imageUrl, ingredients, userId } = await readRequestData(req);
    if (!name || !description || !imageUrl || !ingredients || !userId) {
        return writeJson(res, { error: "Drink data missing" }, 403);
    }
    const drinks = drinksdb.getDrinks();
    const index = drinks.findIndex((drink) => drink.id === id);
    if (index > -1) {
        drinks.splice(index, 1, { name, description, imageUrl, ingredients, userId, id });
        drinksdb.saveDrinks(drinks);
        writeJson(res, drinks[index]);
    } else {
        writeJson(res, {status: "NOT_FOUND"}, 404)
    }
}

function deleteOneDrink(req, res) {
    const id = getIdFromUrl(req.url);
    const drinks = drinksdb.getDrinks();
    const index = drinks.findIndex((drink) => drink.id === id);
    if (index > -1) {
    drinks.splice(index, 1);
    drinksdb.saveDrinks(drinks);
  }
  writeJson(res, { status: "success" }); 
}

async function patchOnDrink(req, res) {
    const id = getIdFromUrl(req.url);
    const data = await readRequestData(req);
    if (!data) {
      return writeJson(res, { error: "Drink data missing" }, 403);
    }
    const drinks = drinksdb.getDrinks();
    const index = drinks.findIndex((drink) => drink.id === id)
    if (index > -1) {
      drinks.splice(index, 1, { ...drinks[index], ...data, id });
      drinksdb.saveDrinks(drinks);
      writeJson(res, drinks[index]);
    } else {
      writeJson(res, { status: "NOT_FOUND" }, 404);
    }
}

async function createDrink(req, res) {
    const data = await readRequestData(req);
    if(!data) {
        return writeJson(res, { error: "Drink data missing" }, 403);
    }

    const newDrink = { ...data, id: Date.now() }
    const drinks = drinksdb.getDrinks();
    drinksdb.saveDrinks([...drinks, newDrink]);
    writeJson(res, newDrink);
    
}

module.exports = {
    getAllDrinks,
    createDrink,
    getOneDrink,
    updateOneDrink,
    deleteOneDrink,
    patchOnDrink
}

