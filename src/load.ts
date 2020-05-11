/**Three Classes needed
 First to get the variables ready for Stocks such as header names and construct the object ready for the data
 Second to get the details from the file and initialise them into the stock variables, split the headers from the csv
 Third to Make a grid and display the details in the grid 

*/
class Stock {
    [key: string]: string | number;
    //Variables
    public name: string;
    public companyName: string;
    public price: number;
    public change: number;
    public changePercent: string;
    public marketCap: string;
    
    constructor(data: Stock) { //constructing object
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

    //creating variables
    public headers: string[];
    public stocks: Stock[];

    /** ^Recognise as Bad idea to create public variables here rather than the public methods GET. couldnt figure out how to get it to work with Map */ 

    //constructing object
    constructor() {
        this.headers = [];
        this.stocks = [];
    }

    //Initialising var with headers and stocks from 'Filepath' that is passed through load
    public async Init(filePath : string) {
        const snapshotFile = await fetch(filePath); //create var and assign it to the csv file
        const valuesWithinSnapfile = await snapshotFile.text(); //Create Var and assign it to the text within the file
        const [headers, ...stocks] = valuesWithinSnapfile.split(`\n`); //split the file to seperate headers stocks 
        this.headers = headers.split(`,`); //split the headers by their , in the csv
        this.stocks = stocks.filter((stock) => stock !== ``).map((stock) => { 
            const [
                name,
                companyName,
                price,
                change,
                changePercent,
                marketCap,
            ] = stock.split(`,`);

            return new Stock({
                change: +change, //returns it as a numeric value as does not work with string
                changePercent,
                companyName,
                marketCap,
                name,
                price: +price, //returns it as a numeric value as does not work with string
            });
        });
    } 
  
    // Ask Julian/Developer About this and how to do it
    //   //This Gets headers to parse into Stock Class
    //   public GetHeaders = () => this.headers; 
        
    //   //This Gets stocks to parse into Stock Class
    //   public GetStocks = () => this.stocks; 
}

    //Creating A Grid to put details in
class Grid {

    private UseStockDetailLoader : StockDetailLoader; //inherit of Class SDL 

    private table: HTMLTableElement;
    private thead: HTMLTableSectionElement;
    private tbody: HTMLTableSectionElement;
    private headerRow: HTMLTableRowElement;

    constructor() {
        this.UseStockDetailLoader = new StockDetailLoader();
        this.table = document.getElementById(`ticker-grid`) as HTMLTableElement;
        this.thead = this.table.createTHead();
        this.headerRow = this.thead.insertRow(0);
        this.tbody = this.table.createTBody();
    }

//Render the Grid
public async render() {
    //Load init func and directory of file - Filename = X.csv
    await this.UseStockDetailLoader.Init(`./data/snapshot.csv`);
    //Get the headers and fill the rows on the header row of grid 
    this.UseStockDetailLoader./**Get**/headers.map((header: string, i: number) => {
        const cell: HTMLTableDataCellElement = this.headerRow.insertCell(i);
        cell.className = `grid__thead`;
        cell.innerHTML = header;
    });
    //Get the stocks and fill the rows with the stock details
    this.tbody.className = `grid__tbody`;
    this.UseStockDetailLoader./**Get**/stocks.map((stock: Stock, i: number) => {

        const row: HTMLTableRowElement = this.tbody.insertRow(i); 
        if ((i + 1) % 2 === 0) {
            row.className = `grid__row--even `; //even rows as colour change in css
        }
        row.className += `grid__row`;
        row.id = stock.name;

        Object.keys(stock).map((key: string, j: number) => {
            const cell: HTMLTableDataCellElement = row.insertCell(j);
            cell.innerHTML = `${stock[key]}`;
            cell.className += `grid__cell cell__${key} ${
                stock.name
            }-${key}`;
        });
    });
    }
}
