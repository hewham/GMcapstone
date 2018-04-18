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

// Dictionary for looking up route type by route number, ex: "MR" for MilkRun
routeDict = {}

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
containerNameInPart = 8
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


  constructor(private papa: PapaParseService) {

  }


test(){


}



  clickedDemo(){
    this.showTable = true;
    this.demo = true;
  }
  clickedBack(){
    this.showTable = false;
    this.demo = false;
  }







  /////////////////////////////// NO UPLOAD POPULATE (FOR TESTING) ///////////


  clickedOKNoUpload() {
      this.loadingFlag = true;
      this.populatePartsNoUpload();
  }

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
    if(!partsFile.files[0]){
      allFilesAreThere = false;
    }
    if(!routesFile.files[0]){
      allFilesAreThere = false;
    }
    if(!containersFile.files[0]){
      allFilesAreThere = false;
    }


    if(!allFilesAreThere){
      alert(`You forgot to add a File.

        Please add all files and try again!`);
    }else{
      this.loadingFlag = true;
      this.populateParts(partsFile.files[0], routesFile.files[0], containersFile.files[0]);
    }
  }


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
  getMiles(part){
      let i = 0;
      for (let route of this.routes)
        if (route[this.routeID] == part[this.routeID]){
          break;
        }
        i++;
      return parseFloat(this.routes[i][this.miles])
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

  containerPrice(part){
    for (let container of this.containers){
      if (part[this.containerNameInPart] == container[this.containerName]){
        return parseFloat(container[this.containerPriceIndex]);
      }else{
        return 0;
      }
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  finalSupplierCost(supplier, frequency){ //final cost to be used w/ frequency

    let supplierCost = 0;
    let partCount = 0;
    for(let part of this.parts){
      partCount++;

      if(this.routeDict[part[this.routeID]][this.mode] == "TL" && part[this.routeID] == supplier[this.routeID]){
        supplierCost += this.finalPartCost(part, frequency);
      }
    }
    var freightCost = this.freight(supplier, frequency);

    supplierCost += freightCost;
    //console.log(supplier, frequency, supplierCost);
    return Math.ceil(supplierCost);
  }

  finalPartCost(part, frequency){
    //console.log(part);
    //console.log("floor space: ", this.floorSpace(part, frequency));
    //console.log("invHolding: ",this.invHolding(part, frequency));
    //console.log("contCapital: ", this.contCapital(part, frequency));
    //console.log("contCapital: ",this.contCapital(part, frequency));
    let cost = this.floorSpace(part, frequency) + this.invHolding(part, frequency) + this.contCapital(part, frequency);

    return cost;
  }
  ////////////////////////////////// 4 MAIN COST CALCULATIONS ////////////////////////////////
  freight(supplier, frequency){//DONE
    var freightCost = ((parseFloat(supplier[this.miles])/this.mpg) * this.fuelRate + parseFloat(supplier[this.plannedLaneRate])) * frequency;
    //console.log("freightCost: ", freightCost );
    return freightCost;
  }

  floorSpace(part, frequency){//DONE
      let containerNumber = this.averageQtyWk(part) /  parseFloat(frequency) /parseFloat(part[this.stdPack]);

      if (frequency % this.plantWorkingDays != 0){
        containerNumber = containerNumber*1.1;
        containerNumber = Math.ceil(containerNumber);
      }

      var contInStack = 15/(parseFloat(part[this.contH])/12);
      var sqFt = (parseFloat(part[this.contL])/12)*(parseFloat(part[this.contW])/12);
      var numberOfStacks = Math.floor(containerNumber / contInStack);

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

  contCapital(part, frequency){//DONE
    let containerNum = this.contPlant(part,frequency) + this.contSupplier(part,frequency) + this.contTransit(part, frequency);
    //console.log("contPlant: ", this.contPlant(part, frequency));
    //console.log("contSupplier: ", this.contSupplier(part, frequency));
    //console.log("contTransit: ", this.contTransit(part, frequency));
    //console.log("container Price: ", this.containerPrice(part));
    let contCapital = containerNum * this.containerPrice(part);
    return contCapital;
  }









  ////////////////////////////////////////// PLANT CALC ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
     //EQ GOOD
    return this.ShipSize(part,frequency) * Math.ceil(frequency*this.TransTime(part))+1;
  }

  ShipSize(part,frequency){
     //EQ GOOD
    return (this.ContainersPerDay(part))/frequency;
  }

  ContainersPerDay(part){
     //EQ GOOD
    return this.AvgPartDemand(part)/(parseFloat(part[this.stdPack]));
  }

  AvgPartDemand(part){
    //EQ GOOD
    return (this.averageQtyWk(part)/6);
  }

  TransTime(part){
    return this.TruckTime(part) + this.MxBorder(part) + this.ODC(part);
  }

  TruckTime(part){
     //EQ GOOD
    return (2 + ((2*this.getMiles(part))/50))/10;
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












  main() {
    //console.log("In main()...");
    // console.log("PARTS: ",this.parts);
    //console.log("ROUTES: ",this.routes);
    // console.log("CONTAINERS: ",this.containers);

    this.outputMatrix = [];
    this.trueMatrix = [];
    this.partsLegend = this.parts[0];
    this.parts.splice(0, 1);
    this.parts.splice(2301, 1);
    for (let part of this.parts){// getting rid of commas, still N/As or -
      for(let col = this.qtyWk(0); col < this.qtyWk(20); col++){
      //console.log(part[col]);
        part[col] = part[col].replace(",", "");
      }
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
    for (let route of this.routes){//initializing route Dict
      this.routeDict[route[0]] = route;
    }

let pushRow = [];
let currentCost = 0;

let CostArray = [];
let avgFreq = 0;
let originalFrequency = 0;
let bestCost = 0;
let bestFreq = 0;

for(let supplier of this.routes){
  let pushRow = [];
  let currentCost = 0;

  let CostArray = [];
  let avgFreq = 0;
  let originalFrequency = 0;
  let bestCost = 0;
  let bestFreq = 0;

        if (supplier[this.mode] == "TL"){
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

            for(let j = 0; j<3; j++){
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
            //console.log(pushRow);
            //break;
        }

        else if (supplier[this.mode] == "MR"){
          // console.log("GOT MR")
        }
        else if (supplier[this.mode] == "CON"){
           // console.log("GOT CON")
        }
        else if (supplier[this.mode] == "ITL"){
          // console.log("GOT ITL")
        }
      }

  console.log(this.outputMatrix);
  this.trueMatrix = this.outputMatrix;

  var t1=0;
  var t2=0;
  var t3=0;
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

  // console.log(this.incompleteDataSuppliers);

  this.showTable = true;
  this.loadingFlag = false;

} // main() end




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



}
