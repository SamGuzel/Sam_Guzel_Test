var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**Three Classes needed
 First to get the variables ready for Stocks such as header names and construct the object ready for the data
 Second to get the details from the file and initialise them into the stock variables, split the headers from the csv
 Third to Make a grid and display the details in the grid

*/
class Stock {
    constructor(data) {
        this.name = data.name;
        this.companyName = data.companyName;
        this.price = data.price;
        this.change = data.change;
        this.changePercent = data.changePercent;
        this.marketCap = data.marketCap;
    }
}
//creating class to get Stock details and input into Grid
class StockDetailLoader {
    /** ^Recognise as Bad idea to create public variables here rather than the public methods GET. couldnt figure out how to get it to work with Map */
    //constructing object
    constructor() {
        this.headers = [];
        this.stocks = [];
    }
    //Initialising var with headers and stocks from 'Filepath' that is passed through load
    Init(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshotFile = yield fetch(filePath); //create var and assign it to the csv file
            const valuesWithinSnapfile = yield snapshotFile.text(); //Create Var and assign it to the text within the file
            const [headers, ...stocks] = valuesWithinSnapfile.split(`\n`); //split the file to seperate headers stocks 
            this.headers = headers.split(`,`); //split the headers by their , in the csv
            this.stocks = stocks.filter((stock) => stock !== ``).map((stock) => {
                const [name, companyName, price, change, changePercent, marketCap,] = stock.split(`,`);
                return new Stock({
                    change: +change,
                    changePercent,
                    companyName,
                    marketCap,
                    name,
                    price: +price,
                });
            });
        });
    }
}
//Creating A Grid to put details in
class Grid {
    constructor() {
        this.UseStockDetailLoader = new StockDetailLoader();
        this.table = document.getElementById(`ticker-grid`);
        this.thead = this.table.createTHead();
        this.headerRow = this.thead.insertRow(0);
        this.tbody = this.table.createTBody();
        this.history = {};
    }
    //Render the Grid
    render() {
        return __awaiter(this, void 0, void 0, function* () {
            //Load init func and directory of file - Filename = X.csv
            yield this.UseStockDetailLoader.Init(`./data/snapshot.csv`);
            //Get the headers and fill the rows on the header row of grid 
            this.UseStockDetailLoader. /**Get**/headers.map((header, i) => {
                const cell = this.headerRow.insertCell(i);
                cell.className = `grid__thead`;
                cell.innerHTML = header;
            });
            //Get the stocks and fill the rows with the stock details
            this.tbody.className = `grid__tbody`;
            this.UseStockDetailLoader. /**Get**/stocks.map((stock, i) => {
                this.history[stock.name] = stock.price;
                const row = this.tbody.insertRow(i);
                if ((i + 1) % 2 === 0) {
                    row.className = `grid__row--even `;
                }
                row.className += `grid__row`;
                row.id = stock.name;
                Object.keys(stock).map((key, j) => {
                    const cell = row.insertCell(j);
                    cell.innerHTML = `${stock[key]}`;
                    cell.className += `grid__cell cell__${key} ${stock.name}-${key}`;
                });
            });
        });
    }
}
//# sourceMappingURL=load.js.map