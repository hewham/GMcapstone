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
incompleteDataSuppliers = []

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

loadFlag: boolean = false;
demo: boolean = false;
showTable: boolean = false;


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
      this.populatePartsNoUpload();
  }

  populatePartsNoUpload() {
    //console.log("in populateParts...");
    var self = this;
    this.papa.parse("../assets/CSV_files/silao_data_set_parts.csv", {
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
    this.papa.parse("../assets/CSV_files/silao_data_set_routes.csv", {
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
    this.papa.parse("../assets/CSV_files/silao_data_set_containers.csv", {
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
    console.log("PARTS: ",this.parts);
    //console.log("ROUTES: ",this.routes);
    //console.log("CONTAINERS: ",this.containers);

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
  console.log(this.incompleteDataSuppliers);

  this.showTable = true;

} // main() end



  gmLogo = 'data:image/png;base64,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'

}
