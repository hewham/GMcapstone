import { Component } from '@angular/core';

import { PapaParseService } from 'ngx-papaparse';
import { UploadEvent, UploadFile } from 'ngx-file-drop';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
// Papa = require("papaparse");
Papa: any;

fuelRate = 2.559;
routesLegend = []
partsLegend = []
containersLegend = []
routes = []
parts = []
containers = []
outputMatrix = [];
trueMatrix = [];
incompleteDataSuppliers = []
totals = [];

freightCostArray = [];
floorSpaceArray = [];
invHoldingArray = [];
contCapitalArray = [];
supplierCostArray = [];

freightCostDict = {};
floorSpaceDict = {};
invHoldingDict = {};
contCapitalDict = {};
supplierCostDict = {};


rowNumber = 0;

// Dictionary for looking up route type by route number, ex: "MR" for MilkRun
routeDict = {}

// Dict for looking up parts
partDict = {}
routeIDtoPartIDDict = {};

// routeDict  Legend::
routeID = 0
plannedLaneRate = 2
laneFreq = 3
isRoundTrip = 4
mode = 5
equipCode = 6
miles = 7
piecePrice = 8
pieceWeight = 9

// Parts Legend:::
drawArea = 2
originID = 3
city = 4
state = 5
postalCode = 6
partID = 7
containerNameInPart = 10
stdPack = 11
contL = 12
contW = 13
contH = 14
contT = 15
re = 16
// Following functions give legend index for qtyWk, wtUtil, and lnCube
qtyWk(week){
  return week + 17;
}
wtUtil(week){
  return (week*2) + 38 - 1;
}
lnCube(week){
  return (week*2) + 38;
}

// Containers Legend:::
containerName = 0
containerRE = 1
containerPriceIndex = 2

// Dollar weight per
HandlingCost = 1.15
InboundTrans = 1.25

mpg = 6.2
plantWorkingDays = 6

ManufacTime = 2

loadingFlag: boolean = false;
demo: boolean = false;
showTable: boolean = false;
sorted: boolean = false;
routeDetail: boolean = false;
showSavings = 0;
routeIndex = 0;

//Stuff for route part page
freqArray = [];
totalsDict = {};
selectedFreq: any;
selectedIndex: any;
currentFreq: any;
bestFreq: any;
routeFreightCostDict = {};
routeFloorSpaceDict = {};
routeInvHoldingDict = {};
routeContCapitalDict = {};
routeSupplierCostDict = {};

  constructor(private papa: PapaParseService) {

  }


test(){

}



  clickedDemo(){
    this.showTable = true;
    this.demo = true;
  }
  clickedBackToUploads(){
    this.showTable = false;
    this.demo = false;
  }
  clickedBackToTable(){
    this.routeIndex = 0;
    this.routeDetail = false;
  }

  showRouteDetails(i){
    this.routeIndex = i;
    this.selectedIndex = 2;
    this.totalsDict = {};
    var currentFreq = this.outputMatrix[i][2];
    var bestFreq = this.outputMatrix[i][4];
    this.freqArray = [];
    var j = 0;
    for(let entry of this.outputMatrix[i]){
      if((j%3)==1 && j!=1 ){
        if(entry == currentFreq){
          // this.selectedFreq = entry;
        }
        if(entry == bestFreq){
          this.selectedFreq = entry;
        }
        this.freqArray.push(entry);
        this.totalsDict[entry] = [];
      }
      j++;
    }
    var k = 0;
    for(let freq of this.freqArray){
      if(freq == this.selectedFreq){
        this.selectedIndex = k;
      }
      k++;
    }
    this.routeFreightCostDict = this.freightCostDict[this.outputMatrix[i][0]];
    this.routeFloorSpaceDict = this.floorSpaceDict[this.outputMatrix[i][0]];
    this.routeInvHoldingDict = this.invHoldingDict[this.outputMatrix[i][0]];
    this.routeContCapitalDict = this.contCapitalDict[this.outputMatrix[i][0]];
    this.routeContCapitalDict = this.contCapitalDict[this.outputMatrix[i][0]];
    this.routeSupplierCostDict = this.supplierCostDict[this.outputMatrix[i][0]];

    for (let freq of this.freqArray){
      this.totalsDict[freq] = this.routeFreightCostDict[freq] + this.routeFloorSpaceDict[freq] + this.routeInvHoldingDict[freq] + this.routeContCapitalDict[freq];
    }



    this.currentFreq = currentFreq;
    this.bestFreq = bestFreq;
    this.routeDetail = true;

  }

  changeShowSavings(num){
    this.showSavings = num;
  }


  clickedFreq(freq, i){
    this.selectedFreq = freq;
    this.selectedIndex = i;
  }

  isNaN(num){
    if(isNaN(parseInt(num)) == false){
      return true;
    }else{
      return false;
    }
  }





  clickedOKNoUpload() {
    var fuelRateIsThere: boolean = true;
    var fuelrate: any;
    fuelrate = document.getElementById("fuelrate");
    if(fuelrate.value){
      this.fuelRate = parseFloat(fuelrate.value);
      console.log("fuel rate is here")
    }else{
      fuelRateIsThere = false;
      console.log("fuel rate is NOT here")
    }

    if(!fuelRateIsThere){
      if (confirm(`You forgot to enter in the DOE fuel rate.

        'OK' to use the default $`+String(this.fuelRate)+`.
        'Cancel' to go back and enter one.`)) {
          this.loadingFlag = true;
          this.populatePartsNoUpload();
      } else {
          console.log("do nothing");
      }
    }else{
      this.loadingFlag = true;
      this.populatePartsNoUpload();
    }

  }




  clickedOK() {

    //console.log("OK WAS CLICKED");
    // this.showTable = true;

    var partsFile: any;
    var routesFile: any;
    var containersFile: any;

    partsFile = document.getElementById("partsFile");
    routesFile = document.getElementById("routesFile");
    containersFile = document.getElementById("containersFile");

    var allFilesAreThere: boolean = true;
    var fuelRateIsThere: boolean = true;
    if(!partsFile.files[0]){
      allFilesAreThere = false;
    }
    if(!routesFile.files[0]){
      allFilesAreThere = false;
    }
    if(!containersFile.files[0]){
      allFilesAreThere = false;
    }

    var fuelrate: any;
    fuelrate = document.getElementById("fuelrate");
    if(fuelrate.value){
      this.fuelRate = parseFloat(fuelrate.value);
      console.log("fuel rate is here")
    }else{
      fuelRateIsThere = false;
      console.log("fuel rate is NOT here")
    }


    if(!allFilesAreThere){
      alert(`You forgot to add a File.

        Please add all files and try again!`);
    }else if(!fuelRateIsThere){
      if (confirm(`You forgot to enter in the DOE fuel rate.

        'OK' to use the default $`+String(this.fuelRate)+`.
        'Cancel' to go back and enter one.`)) {
          this.loadingFlag = true;
          this.populateParts(partsFile.files[0], routesFile.files[0], containersFile.files[0]);
      } else {
          console.log("do nothing");
      }

    }else{
      this.loadingFlag = true;
      this.populateParts(partsFile.files[0], routesFile.files[0], containersFile.files[0]);
    }
  }




  main() {
    // console.log("using fuelrate: ",this.fuelRate);
    //console.log("In main()...");
    // console.log("PARTS: ",this.parts);
    //console.log("ROUTES: ",this.routes);
    //console.log("CONTAINERS: ",this.containers);
    this.populateDistances();
    this.populateDistances_2();
    this.populateOriginIdDict();
    this.outputMatrix = [];
    this.trueMatrix = [];
    this.freightCostArray = [];

    this.partsLegend = this.parts[0];
    this.parts.splice(0, 1);
    this.parts.splice(this.parts.length-1, 1);
    for (let part of this.parts){// getting rid of commas, still N/As or -
      for(let col = this.qtyWk(0); col < this.qtyWk(20); col++){
      //console.log(part[col]);
        part[col] = part[col].replace(",", "");
      }
      this.partDict[part[this.partID]] = part;
      if(!(part[this.routeID] in this.routeIDtoPartIDDict)){
        this.routeIDtoPartIDDict[part[this.routeID]] = [];
      }
      this.routeIDtoPartIDDict[part[this.routeID]].push(part[this.partID]);
    }

    this.routesLegend = this.routes[0];
    this.routes.splice(0, 1);
    this.containersLegend = this.containers[0];
    this.containers.splice(0, 1);
    for( let cont of this.containers){//splicing , and $ from containerCost, and changing expendable to 0
      cont[this.containerPriceIndex] = cont[this.containerPriceIndex].replace("Expendable", "0");
      cont[this.containerPriceIndex] = cont[this.containerPriceIndex].replace("$", "");
      cont[this.containerPriceIndex] = cont[this.containerPriceIndex].replace(",", "");
    }

    for(let route of this.routes){
      this.routeDict[route[0]] = route;
    }

  this.rowNumber=0;

  for(let supplier of this.routes){

    let breakFlag = false;

    let pushRow = [];
    let currentCost = 0;

    let CostArray = [];
    let avgFreq = 0;
    let originalFrequency = 0;
    let bestCost = 0;
    let bestFreq = 0;
        if (supplier[this.mode] == "TL" || supplier[this.mode] == "ITL"){
            this.freightCostArray.push({});
            this.floorSpaceArray.push({});
            this.invHoldingArray.push({});
            this.contCapitalArray.push({});
            this.supplierCostArray.push({});

            pushRow.push(supplier[this.routeID]); //routeID

            originalFrequency = supplier[this.laneFreq];

            currentCost = this.finalSupplierCost(supplier, supplier[this.laneFreq]);
            if(isNaN(currentCost)){
              this.incompleteDataSuppliers.push(supplier[this.routeID]);
              continue;
            }
            pushRow.push(currentCost); //Original Cost
            pushRow.push(originalFrequency); //Original Frequency

            let frequencyRangeDict = {};
            let frequencyRangeAry = [];

            avgFreq = Math.ceil(this.averageFrequency(supplier));
            if( avgFreq < originalFrequency){
              let temp = avgFreq;
              avgFreq = originalFrequency;
              originalFrequency = temp;
            }
            for(let i = originalFrequency; i <= avgFreq; i++){
              frequencyRangeDict[(this.finalSupplierCost(supplier, i))] = i;
              frequencyRangeAry.push(this.finalSupplierCost(supplier, i));
            }

            frequencyRangeAry = frequencyRangeAry.sort(function(a, b){return b - a});

            for(let j = 0; j<100; j++){
              if(frequencyRangeAry.length > 0){
                let minCost = frequencyRangeAry.pop();
                let minFreq = frequencyRangeDict[minCost];
                pushRow.push(minCost); //Minimum Cost
                pushRow.push(minFreq); //Minimum frequency
                let costDiff = currentCost - minCost;
                pushRow.push(costDiff);  //Cost Difference
              }
              else{
                pushRow.push("");
                pushRow.push("");
                pushRow.push("");
              }
            }

            this.outputMatrix.push(pushRow);
            this.rowNumber++;
        }

        else if (supplier[this.mode] == "MR"){
          // console.log("GOT MR")
        }
        else if (supplier[this.mode] == "CON"){
           // console.log("GOT CON")
        }
    }

  this.trueMatrix = this.outputMatrix;

  this.calculateTotals();
  this.populateDicts();

  this.showTable = true;
  this.loadingFlag = false;

} // main() end



populateDicts(){
  var i = 0;
  for (let row of this.outputMatrix){
    this.freightCostDict[row[0]] = this.freightCostArray[i];
    this.floorSpaceDict[row[0]] = this.floorSpaceArray[i];
    this.invHoldingDict[row[0]] = this.invHoldingArray[i];
    this.contCapitalDict[row[0]] = this.contCapitalArray[i];
    this.supplierCostDict[row[0]] = this.supplierCostArray[i];
    i++;
  }
}


calculateTotals(){
  var t1=0;
  var t2=0;
  var t3=0;
  this.totals = [];
  for(let row of this.trueMatrix){
    t1 += parseFloat(row[5]);
    if(!isNaN(parseFloat(row[8]))){
      t2 += parseFloat(row[8]);
    }
    if(!isNaN(parseFloat(row[11]))){
      t3 += parseFloat(row[11]);
    }
  }

  this.totals.push(t1);
  this.totals.push(t2);
  this.totals.push(t3);
}





unSortByDifference() {
  this.outputMatrix = this.trueMatrix;
  this.sorted = false;
}

sortByDifference() {
  let temp = [];
  let tempTrue = [];
  for(let row of this.trueMatrix){
    tempTrue.push(row);
  }
  for(let rowi of tempTrue){
    let max = rowi;
    let j = 0;
    let index = 0;
    for(let rowj of tempTrue){
      if(rowj[5] > max[5]){
        max = rowj;
        index = j;
      }
      j++;
    }
    temp.push(max);
    tempTrue.splice(index,1);
  }
  this.outputMatrix = temp;
  this.sorted = true;
}

originIdDict = {};
populateOriginIdDict(){
  for(let part of this.parts){
    if(!(part[this.originID] in this.originIdDict)){
      this.originIdDict[part[this.originID]] = part[this.routeID];
    }
  }
}














averageFrequency(supplier){ //WORKS
  let freqAry = [];
  let totalpartFrequency = 0;
  for(let part of this.parts){
    if(part[this.routeID] == supplier[this.routeID]){
      totalpartFrequency = 0;
      for(let i = 0; i < 20; i++){
        totalpartFrequency += parseFloat(part[this.lnCube(i)]);
      }
      totalpartFrequency = totalpartFrequency/20;
      freqAry.push(totalpartFrequency);
    }
  }
  let supplierFrequencyTotal = 0;
  let count = 0;
  for(let partavgfreq of freqAry){
    count += 1;
    supplierFrequencyTotal += partavgfreq;
  }
  let averageFrequency = supplierFrequencyTotal / count;
  return averageFrequency;
}

  //////////////////////////////METRICS WE NEED TO LOOKUP BY ROW//////////////////////
  //ONE WAY PLANT DISTANCE - Miles
  getMiles(part){// DONE + CHECKED
    let i = 0;
    let miles = 0;
      for (let route of this.routes){
        if (route[this.routeID] == part[this.routeID]){
          miles = parseFloat(this.routes[i][this.miles])
        }
        i++;
      }
      return miles;
    }

  getMilesSupplier(Supplier){
    let i = 0;
    for (let route of this.routes){
      if (route[this.routeID] == Supplier[this.routeID]){
        return parseFloat(this.routes[i][this.miles]);
      }
      i++;
    }
  }
  //AVG WEEKLY PARTS REQUIRED done
  averageQtyWk(part){ //WORKS
      let total = 0;
      for (let i=0; i<20; i++){
        if (isNaN(part[this.qtyWk(i)]) == false){
          total += parseFloat(part[this.qtyWk(i)]);
        }
      }
      return total/20;
    }
  //MANUFACTURING TIME

  //PEAK WEEKLY PARTS REQUIRED
  maxQtyWk(part){
      let max = 0;
      for (let i=0; i<20; i++){
        if (this.qtyWk(i) > max){
          max = this.qtyWk(i);
        }
      }
      return max
    }
  //NUMBER OF PARTS
  numOfParts(route){
      let num = 0;
      for (let part of this.parts){
        if (part[this.routeID] == route[this.routeID]){
          num++;
        }
      }
      return num;
    }
  //COST PER PART
  // part[piecePrice]


  // GAS PRICE PER ROUTE
  gasCost(miles){
    return (miles/this.mpg) * this.fuelRate;
  }

  containerPrice(part){// if is num change to int then check
    for (let container of this.containers){
      //console.log(part[this.containerNameInPart]);
      if(isNaN(part[this.containerNameInPart])){
        if (part[this.containerNameInPart] == container[this.containerName]){
          return parseFloat(container[this.containerPriceIndex]);
        }
      }
      else{
        if(String(parseInt(part[this.containerNameInPart])) == container[this.containerName]){
          return parseFloat(container[this.containerPriceIndex]);
        }
      }
    }
    return 0;
  }













  //////////////////////////////////////////////////////////


  finalSupplierCost(supplier, frequency){ //final cost to be used w/ frequency
    this.floorSpaceArray[this.rowNumber][frequency] = 0;
    this.invHoldingArray[this.rowNumber][frequency] = 0;
    this.contCapitalArray[this.rowNumber][frequency] = 0;
    this.supplierCostArray[this.rowNumber][frequency] = 0;

    let supplierCost = 0;

    for(let part of this.parts){

      if(part[this.routeID] == supplier[this.routeID]){
        supplierCost += this.finalPartCost(part, frequency);

        this.floorSpaceArray[this.rowNumber][frequency] += this.floorSpace(part, frequency);
        this.invHoldingArray[this.rowNumber][frequency] += this.invHolding(part, frequency);
        this.contCapitalArray[this.rowNumber][frequency] += this.contCapital(part, frequency);
        this.supplierCostArray[this.rowNumber][frequency] += this.finalPartCost(part, frequency);
      }
    }
    var freightCost = this.freight(supplier, frequency) * 49;

    this.freightCostArray[this.rowNumber][frequency] = freightCost;

    supplierCost += freightCost;



    // this.supplierCostArray[this.rowNumber][frequency] = Math.ceil(supplierCost);
    this.supplierCostArray[this.rowNumber][frequency] = supplierCost;

    return Math.ceil(supplierCost);
  }

  finalSupplierCostCheck(supplier, frequency){ //final cost to be used w/ frequency

    let supplierCost = 0;

    for(let part of this.parts){

      if(part[this.routeID] == supplier[this.routeID]){
        supplierCost += this.finalPartCost(part, frequency);

        if(!this.floorSpaceArray[this.rowNumber][frequency]){
          this.floorSpaceArray[this.rowNumber][frequency] = 0; }
        if(!this.invHoldingArray[this.rowNumber][frequency]){
          this.invHoldingArray[this.rowNumber][frequency] = 0; }
        if(!this.contCapitalArray[this.rowNumber][frequency]){
          this.contCapitalArray[this.rowNumber][frequency] = 0; }
        if(!this.supplierCostArray[this.rowNumber][frequency]){
          this.supplierCostArray[this.rowNumber][frequency] = 0; }

        this.floorSpaceArray[this.rowNumber][frequency] += this.floorSpace(part, frequency);
        this.invHoldingArray[this.rowNumber][frequency] += this.invHolding(part, frequency);
        this.contCapitalArray[this.rowNumber][frequency] += this.contCapital(part, frequency);
        this.supplierCostArray[this.rowNumber][frequency] += this.finalPartCost(part, frequency);
      }
    }
    var freightCost = this.freight(supplier, frequency);

    this.freightCostArray[this.rowNumber][frequency] = freightCost;

    supplierCost += freightCost;

    if(supplier[this.routeID] == "MCM07A"){
      console.log("");
      console.log(supplierCost);
      console.log(this.rowNumber);
      console.log(frequency);
    }

    // this.supplierCostArray[this.rowNumber][frequency] = Math.ceil(supplierCost);
    this.supplierCostArray[this.rowNumber][frequency] = supplierCost;

    return Math.ceil(supplierCost);
  }

  finalPartCost(part, frequency){
    //console.log("floor: ", this.floorSpace(part, frequency));
    //     console.log("inv: ", this.invHolding(part, frequency));
    //        console.log("contCapt: ", this.contCapital(part, frequency));
    let cost = this.floorSpace(part, frequency) + this.invHolding(part, frequency) + this.contCapital(part, frequency);

    // this.floorSpaceArray[this.rowNumber][frequency] = this.floorSpace(part, frequency);
    // this.invHoldingArray[this.rowNumber][frequency] = this.invHolding(part, frequency);
    // this.contCapitalArray[this.rowNumber][frequency] = this.contCapital(part, frequency);


    return cost;
  }














  ////////////////////////////////// 4 MAIN COST CALCULATIONS ////////////////////////////////
  freight(supplier, frequency){//DONE + CHECKED
      let freightCost = ((parseFloat(supplier[this.miles])/this.mpg) * this.fuelRate + parseFloat(supplier[this.plannedLaneRate])) * frequency;
    //console.log("freigt: ", freightCost);
    return freightCost;
  }

  floorSpace(part, frequency){//DONE + CHECKED
      let containerNumber = this.averageQtyWk(part) /  parseFloat(frequency) /parseFloat(part[this.stdPack]);
      if (frequency % this.plantWorkingDays != 0){
        containerNumber = containerNumber*1.1;
        containerNumber = Math.ceil(containerNumber);
      }

      var contInStack = 15/(parseFloat(part[this.contH])/12);

      var sqFt = (parseFloat(part[this.contL])/12)*(parseFloat(part[this.contW])/12);
      var numberOfStacks = Math.ceil(containerNumber / contInStack);

      var floorSpace = numberOfStacks*sqFt*2.5*47.57;
      return floorSpace;
  }

  invHolding(part, frequency){//DONE
    let invHoldingCost = this.averageQtyWk(part) /  parseFloat(frequency) / parseFloat(part[this.stdPack]);

    if (frequency % this.plantWorkingDays != 0){
      invHoldingCost = invHoldingCost*1.1;
    }
    invHoldingCost = invHoldingCost * parseFloat(part[this.stdPack]) * parseFloat(part[this.piecePrice]) * 0.15;
    return invHoldingCost;
  }

  contCapital(part, frequency){//DONE + CHECKED
    let containerNum = this.contPlant(part,frequency) + this.contSupplier(part,frequency) + this.contTransit(part, frequency);
    //console.log("contnum: ", containerNum);
    //console.log("contPrice: ", this.containerPrice(part));
    let contCapital = containerNum * this.containerPrice(part);
    return contCapital;
  }








  ////////////////////////////////////////// PLANT CALC ////////////////////
  contPlant(part, frequency){
    return this.ShipSize(part, frequency) + this.PlantSafetyStock(part, frequency);
  }

  PlantSafetyStock(part, frequency){
    return Math.min(2, this.PlantVolumeCalc(part, frequency));
  }

  PlantVolumeCalc(part, frequency){
    return this.PlantMin(part) + this.PartVolatility(part) + this.IntHandling(part) + 1;
  }

  PlantMin(part){
    let expedTrans = (this.getMiles(part)/50)/this.ManufacTime;
    return Math.min(this.TransTime(part), expedTrans) * this.ContainersPerDay(part);
  }

  PartVolatility(part){
    let PeakPartDemandPerDay = this.maxQtyWk(part)/6;
    return (PeakPartDemandPerDay - this.AvgPartDemand(part))/(parseFloat(part[this.stdPack]));
  }

  IntHandling(part){
    let IntHandlingTime = 4/this.ManufacTime;
    return IntHandlingTime * this.ContainersPerDay(part);
  }

  ////////////////////////////////SUPPLIER CALC //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  contSupplier(part, frequency){
      return this.ShipSize(part, frequency) + this.SupplierSafetyStock(part, frequency);
    }

  SupplierSafetyStock(part,frequency){
    //////check w/ supply chain, as contperday is part of shipsize calc???
    return Math.min(2,(this.ContainersPerDay(part) + this.ShipSize(part, frequency) + 1));
  }


  ////////////////////////// TRANSIT CALC //////////////
  contTransit(part, frequency){
    return this.ShipSize(part,frequency) * (Math.ceil((frequency/6)*this.TransTime(part))+1);
  }

  ShipSize(part,frequency){//DONE + CHECKED
    return (this.ContainersPerDay(part))/(frequency/6);
  }

  ContainersPerDay(part){
     //EQ GOOD
    return this.AvgPartDemand(part)/(parseFloat(part[this.stdPack]));
  }

  AvgPartDemand(part){
    //EQ GOOD
    return (this.averageQtyWk(part)/6);
  }

  TransTime(part){//DONE + CHECKED
    return this.TruckTime(part) + this.MxBorder(part) + this.ODC(part);
  }

  TruckTime(part){//DONE + CHECKED
    let truckTime = (2 + ((1*this.getMiles(part))/50))/10;
    return truckTime;
  }




  MxBorder(part){
     //EQ GOOD
    if(part[this.drawArea].trim() == "MEXICO"){
      return 0;
    }
    else{
      return 3;
    }
  }

  ODC(part){
      if( this.routeDict[part[this.routeID]][this.mode] == "CON" || this.routeDict[part[this.routeID]][this.mode] == "ODC"){
        return 1.5;
      }
      else{
        return 0;
      }
  }









    /////////////////////////////// NO UPLOAD POPULATE (FOR TESTING) ///////////


    populatePartsNoUpload() {
      //console.log("in populateParts...");
      var self = this;
      this.papa.parse("assets/CSV_files/silao_data_set_parts.csv", {
        download: true,
        complete: function(results) {
          // console.log("Finished:", results.data);
          self.parts = results.data;
          self.populateRoutesNoUpload();
        }
      });
    }

    populateRoutesNoUpload() {
      //console.log("in populateRoutes...");
      var self = this;
      this.papa.parse("assets/CSV_files/silao_data_set_routes.csv", {
        download: true,
        complete: function(results) {
          //console.log("Finished:", results.data);
          self.routes = results.data;
          self.populateContainersNoUpload();
        }
      });
    }

    populateContainersNoUpload(){
      //console.log("in populateContainers...");
      var self = this;
      this.papa.parse("assets/CSV_files/silao_data_set_containers.csv", {
        download: true,
        complete: function(results) {
          //console.log("Finished:", results.data);
          self.containers = results.data;
          self.main();
        }
      });
    }


  ///////////////////////////////   END NO UPLOAD POPULATE (FOR TESTING) ///////




  ///////////////////////////  POPULATE ////////////////////////////////



    populateParts(partsFile, routesFile, containersFile) {
      //console.log("in populateParts...");
      var self = this;
      this.papa.parse(partsFile, {
      	complete: function(results) {
      		//console.log("Finished:", results.data);
          self.parts = results.data;
          self.populateRoutes(partsFile, routesFile, containersFile);
      	}
      });
    }

    populateRoutes(partsFile, routesFile, containersFile) {
      //console.log("in populateRoutes...");
      var self = this;
      this.papa.parse(routesFile, {
      	complete: function(results) {
      		//console.log("Finished:", results.data);
          self.routes = results.data;
          self.populateContainers(partsFile, routesFile, containersFile);
      	}
      });
    }

    populateContainers(partsFile, routesFile, containersFile){
      //console.log("in populateContainers...");
      var self = this;
      this.papa.parse(containersFile, {
        complete: function(results) {
          //console.log("Finished:", results.data);
          self.containers = results.data;
          self.main();
        }
      });
    }

  ///////////////////////////   END POPULATE ////////////////////////////////






distances = {};
populateDistances(){
  this.distances['QUERETARO'] = 405;
  this.distances['Three Rivers'] = 52;
  this.distances['ANGOLA'] = 113;
  this.distances['SCHERTZ'] = 181;
  this.distances['AUSTIN'] = 1142;
  this.distances['REYNOSA'] = 181;
  this.distances['SABINAS HIDALGO'] = 104;
  this.distances['APODACA'] = 60.8;
  this.distances['PUEBLA'] = 601;
  this.distances['CORREGIDORA'] = 407;
  this.distances['EL PASO'] = 0;
  this.distances['El Paso'] = 0;
}


distances_type2 = {};
populateDistances_2(){
  this.distances_type2['AUBURN HILLS'] = 53.5;
  this.distances_type2['CANTON'] = 23.9;
  this.distances_type2['STERLING HEIGHTS'] = 43.2;
  this.distances_type2['HOWELL'] = 62.5;
  this.distances_type2['ROMULUS'] = 13.8;
  this.distances_type2['CHESTERFIELD'] = 51;
  this.distances_type2['MACOMB'] = 58.2;
  this.distances_type2['WESTLAND'] = 24.4;
  this.distances_type2['CLEVELAND'] = 153;
  this.distances_type2['HARRISON TOWNSHIP'] = 46.1;
  this.distances_type2['ROSEVILLE'] = 38.1;
  this.distances_type2['ARMADA'] = 66.8;
  this.distances_type2['CORRY'] = 281;
  this.distances_type2['FLINT'] = 87.4;
  this.distances_type2['DETROIT'] = 23.6;
  this.distances_type2['LAPEER'] = 72.7;
  this.distances_type2['HOLLAND'] = 56.5;
  this.distances_type2['STREETSBORO'] = 170;
  this.distances_type2['MCELHATTAN'] = 404;
  this.distances_type2['PLYMOUTH'] = 26.6;
  this.distances_type2['LIVONIA'] = 20.8;
  this.distances_type2['CENTER LINE'] = 37.3;
  this.distances_type2['BRUNSWICK'] = 153;
  this.distances_type2['TROY'] = 42.7;
  this.distances_type2['WYANDOTTE'] = 8.3;
  this.distances_type2['PENINSULA'] = 160;
  this.distances_type2['PARMA'] = 149;
  this.distances_type2['LOCKPORT'] = 282;
  this.distances_type2['ROCHESTER'] = 411;
  this.distances_type2['WESTMINSTER'] = 724;
  this.distances_type2['WARREN'] = 39.7;
  this.distances_type2['LAKE ORION'] = 58.8;
  this.distances_type2['BLISSFIELD'] = 52.3;
  this.distances_type2['CLARKSTON'] = 62;
  this.distances_type2['NORTHVILLE'] = 33.9;
  this.distances_type2['UTICA'] = 44.1;
  this.distances_type2['TAYLOR'] = 8.2;
  this.distances_type2['HUDSON'] = 165;
  this.distances_type2['MADISON HEIGHTS'] = 33.7;
  this.distances_type2['MILFORD'] = 666;
  this.distances_type2['PORT HURON'] = 82.6;
  this.distances_type2['BELLEVILLE'] = 17.6;
  this.distances_type2['HOLLY'] = 66.9;
  this.distances_type2['FOWLERVILLE'] = 70.6;
  this.distances_type2['DECKERVILLE'] = 122;
  this.distances_type2['Monroe'] = 24.9;
  this.distances_type2['Imlay City'] = 75.9;
  this.distances_type2['Fenton'] = 72.1;
  this.distances_type2['BRIGHTON'] = 52;
  this.distances_type2['CUYAHOGA HEIGHT'] = 155;
  this.distances_type2['ROCHESTER HILLS'] = 45.6;
  this.distances_type2['SHELBY TOWNSHIP'] = 48.4;
  this.distances_type2['CORRY'] = 281;
  this.distances_type2['REDFORD'] = 20;
  this.distances_type2['SANDUSKY'] = 99.2;
  this.distances_type2['ERIE'] = 255;
  this.distances_type2['Bellevue'] = 90.2;
  this.distances_type2['BUFFALO'] = 280;
  this.distances_type2['ROMEO'] = 59.8;
  this.distances_type2['NEW BALTIMORE'] = 57.1;
  this.distances_type2['AVON'] = 133;
  this.distances_type2['Holly'] = 66.9;
  this.distances_type2['STRONGSVILLE'] = 145;
  this.distances_type2['Troy'] = 42.7;
  this.distances_type2['AKRON'] = 175;
  this.distances_type2['East China'] = 71.8;
  this.distances_type2['HUDSONVILLE'] = 25.2;
  this.distances_type2['GAYLORD'] = 193;
  this.distances_type2['GOSHEN'] = 81.5;
  this.distances_type2['ALTO'] = 33.3;
  this.distances_type2['AU GRES'] = 213;
  this.distances_type2['WALKER'] = 31;
  this.distances_type2['BIG RAPIDS'] = 78;
  this.distances_type2['ZEELAND'] = 29;
  this.distances_type2['WILLIAMSBURG'] = 156;
  this.distances_type2['Grand Rapids'] = 21.5;
  this.distances_type2['GRAND RAPIDS'] = 21.5;
  this.distances_type2['TRAVERSE CITY'] = 162;
  this.distances_type2['CADILLAC'] = 116;
  this.distances_type2['MASON'] = 93.3;
  this.distances_type2['Avilla'] = 111;
  this.distances_type2['Oscoda'] = 250;
  this.distances_type2['Litchfield'] = 93.1;
  this.distances_type2['LITCHFIELD'] = 93.1;
  this.distances_type2['WAYLAND'] = 0;
  this.distances_type2['Spring Lake'] = 52.4;
  this.distances_type2['Butler'] = 160;
  this.distances_type2['IONIA'] = 67.4;
  this.distances_type2['KENDALLVILLE'] = 130;
  this.distances_type2['FREMONT'] = 60.7;
  this.distances_type2['ST JOSEPH'] =54.3;
  this.distances_type2['BATTLE CREEK'] = 82.5;
  this.distances_type2['ORLAND'] = 45;
  this.distances_type2['MCALLEN'] = 167;
  this.distances_type2['BROWNSVILLE'] = 208;
  this.distances_type2['PHARR'] = 164;
  this.distances_type2['LAREDO'] = 0;
  this.distances_type2['Schertz'] = 178;
  this.distances_type2['SAN BENITO'] = 190;
  this.distances_type2['DEL RIO'] = 178;
  this.distances_type2['LOS INDIOS'] = 196;
  this.distances_type2['BRAMPTON'] = 75.3;
  this.distances_type2['MARKHAM'] = 107;
  this.distances_type2['KITCHENER'] = 22.5;
  this.distances_type2['BURLINGTON'] = 50.8;
  this.distances_type2['Penetanguishene'] = 208;
  this.distances_type2['LONDON'] = 104;
  this.distances_type2['WOODBRIDGE'] = 81.2;
  this.distances_type2['Cambridge'] = 0;
  this.distances_type2['STONEY CREEK'] = 63.3;
  this.distances_type2['TOTTENHAM'] = 113;
  this.distances_type2['RICHMOND'] = 774;
  this.distances_type2['SCARBOROUGH'] = 108;
  this.distances_type2['WINDSOR'] = 281;
  this.distances_type2['WHITBY'] = 145;
  this.distances_type2['MISSISSAUGA'] = 74.9;
  this.distances_type2['ST CATHARINES'] = 103;
  this.distances_type2['RICHMOND HILL'] = 102;
  this.distances_type2['Ridgetown'] = 181;
  this.distances_type2['TILLSONBURG'] = 85.4;
  this.distances_type2['Ayr'] = 16.1;
  this.distances_type2['INGERSOLL'] = 68;
  this.distances_type2['ETOBICOKE'] = 84;
  this.distances_type2['Waterloo'] = 26.2;
  this.distances_type2['OWEN SOUND'] = 160;
  this.distances_type2['Bradford'] = 126;
  this.distances_type2['CONCORD'] = 88.9;
  this.distances_type2['BRADFORD'] = 126;
  this.distances_type2['Concord'] = 88.9;
  this.distances_type2['SAN LUIS POTOSI'] = 458;
  this.distances_type2['Silao'] = 607;
  this.distances_type2['EL PASO'] = 0;
  this.distances_type2['NOGALES'] = 342;
  this.distances_type2['CIUDAD JUAREZ'] = 1106;
  this.distances_type2['SALTILLO'] = 13.6;
  this.distances_type2['CHIHUAHUA'] = 737;
  this.distances_type2['MEOQUI'] = 662;
  this.distances_type2['MATAMOROS'] = 384;
  this.distances_type2['SANTA CATARINA'] = 60.3;
  this.distances_type2['Princeton'] = 245;
  this.distances_type2['Hamptonville'] = 416;
  this.distances_type2['Fletcher'] = 37.2;
  this.distances_type2['Stanfield'] = 499;
  this.distances_type2['Old Fort'] = 456;
  this.distances_type2['Cadiz'] = 357;
  this.distances_type2['Morgantown'] = 274;
  this.distances_type2['Buford'] = 277;
  this.distances_type2['Ormond Beach'] = 679;
  this.distances_type2['Hartwell'] = 347;
  this.distances_type2['Maryville'] = 169;
  this.distances_type2['Tuscumbia'] = 152;
  this.distances_type2['Clinton'] = 157;
  this.distances_type2['BOWLING GREEN'] = 82;
  this.distances_type2['Athens'] = 153;
  this.distances_type2['Pulaski'] = 88.4;
  this.distances_type2['Lafayette'] = 47.2;
  this.distances_type2['Gadsden'] = 203;
  this.distances_type2['Williamston'] = 349;
  this.distances_type2['Mt. Juliet'] = 0;
  this.distances_type2['Manchester'] = 67.2;
  this.distances_type2['Gallatin'] = 17.9;
  this.distances_type2['Livingston'] = 84.1;
  this.distances_type2['Pine Bluff'] = 382;
  this.distances_type2['Rockford'] = 165;
  this.distances_type2['Kellyton'] = 272;
  this.distances_type2['Fort Worth'] = 978;
  this.distances_type2['PUEBLA'] = 968;
  this.distances_type2['HUEJOTZINGO'] = 950;
  this.distances_type2['TOLUCA'] = 833;
  this.distances_type2['HAYS'] = 771;
}

}
