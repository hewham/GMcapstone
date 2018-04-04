import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
// Papa = require("papaparse");

Papa: any;

showTable: boolean = false;

routeLegend = []
partLegend = []
containerLegend = []
routes = []
parts = []
containers = []

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
stdPack = 9
contL = 10
contW = 11
contH = 12
contT = 13
re = 14
// Following functions give legend index for qtyWk, wtUtil, and lnCube
qtyWk(week){
  return week + 14
}
wtUtil(week){
  return (week*2)-1 + 34
}
lnCube(week){
  return (week*2)-1 + 35
}

// Containers Legend:::
containerName = 0
containerRE = 1
containerPrice = 2

// Dollar weight per
HandlingCost = 1.15
InboundTrans = 1.25

mpg = 6.2
plantWorkingDays = 6

ManufacTime = 2





  clickedOK() {
    console.log("OK WAS CLICKED");
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
      // allFilesAreThere = false;
    }
    if(!containersFile.files[0]){
      // allFilesAreThere = false;
    }


    if(!allFilesAreThere){
      alert(`You forgot to add a File.

        Please add all files and try again!`);
    }else{
      this.populateParts(partsFile.files[0], routesFile.files[0], containersFile.files[0]);
    }
  }


  populateParts(partsFile, routesFile, containersFile) {
    console.log("in populateParts...");
    var self = this;
    this.Papa.parse(partsFile, {
    	complete: function(results) {
    		// console.log("Finished:", results.data);
        self.parts = results.data;
        self.populateRoutes(partsFile, routesFile, containersFile);
    	}
    });
  }

  populateRoutes(partsFile, routesFile, containersFile) {
    console.log("in populateRoutes...");
    var self = this;
    this.Papa.parse(routesFile, {
    	complete: function(results) {
    		console.log("Finished:", results.data);
        self.routes = results.data;
        self.populateContainers(partsFile, routesFile, containersFile);
    	}
    });
  }

  populateContainers(partsFile, routesFile, containersFile){
    this.main();


    // console.log("in populateContainers...");
    // var self = this;
    // this.Papa.parse(containersFile, {
    //   complete: function(results) {
    //     console.log("Finished:", results.data);
    //     self.containers = results.data;
    //     self.main();
    //   }
    // });
  }



  main() {
    console.log("In main()...");
    console.log("PARTS: ",this.parts);
    console.log("ROUTES: ",this.routes);











    //////////////////////////////METRICS WE NEED TO LOOKUP BY ROW//////////////////////
    //ONE WAY PLANT DISTANCE - Miles
    function getMiles(part){
        let i = 0;
        for (let route of this.routes)
          if (route[this.routeID] == part[this.routeID]){
            break;
          }
          i++;
        return parseFloat(this.routes[i][this.miles])
      }
    //AVG WEEKLY PARTS REQUIRED done
    function averageQtyWk(part){
        let total = 0;
        for (let i=0; i<20; i++){
          if (part[this.qtyWk(i)].isalpha() == false){
            total += parseFloat(part[this.qtyWk(i)]);
          }
        }
        return total/20;
      }
    //MANUFACTURING TIME

    //PEAK WEEKLY PARTS REQUIRED
    function maxQtyWk(part){
        let max = 0;
        for (let i=0; i<20; i++){
          if (this.qtyWk(i) > max){
            max = this.qtyWk(i);
          }
        }
        return max
      }
    //NUMBER OF PARTS
    function numOfParts(route){
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

    //FUEL RATE
    var fuelRate = 2.559;

    // GAS PRICE PER ROUTE
    function gasCost(miles){
      return (miles/this.mpg) * fuelRate;
    }

    function containerPrice(part){
      for (let container of this.containers){
        if (part[this.containerNameInPart] == container[this.this.containerName]){
          return container[this.containerPrice];
        }else{
          return 0;
        }
      }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    function finalCost(part, frequency){ //final cost to be used w/ frequency
      let cost = freight(part, frequency) + floorSpace(part, frequency) + invHolding(part, frequency) + contCapital(part, frequency);
      return cost;
    }








    ////////////////////////////////// 4 MAIN COST CALCULATIONS ////////////////////////////////
    function freight(part, frequency){
      return (getMiles(part)/this.mpg) * fuelRate;
    }

    function floorSpace(part, frequency){
        let space = parseFloat(part[this.qtyWk(1)]) / parseFloat(part[this.stdPack]) / parseFloat(frequency);
        if (frequency % this.plantWorkingDays != 0){
          space = Math.ceil(space*1.1);
        }
        return space;
    }
    function invHolding(part, frequency){
        // I = 0.15 * numberParts * costPerPart
        // I = 0.15 * floorSpace(part, frequency) * costPerPart
        // return I
        return 5;
    }

    function contCapital(part, frequency){
      let containerNum = contPlant(part,frequency) + contSupplier(part,frequency) + contTransit(part, frequency);
      let contCapital = containerNum * containerPrice(part);
      return contCapital;
    }









    ////////////////////////////////////////// PLANT CALC ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function contPlant(part, frequency){
      return ShipSize(part, frequency) + PlantSafetyStock(part, frequency);
    }

    function PlantSafetyStock(part, frequency){
      return Math.min(2, PlantVolumeCalc(part, frequency));
    }

    function PlantVolumeCalc(part, frequency){
      return PlantMin(part) + PartVolatility(part) + IntHandling(part) + 1;
    }

    function PlantMin(part){
      let expedTrans = (getMiles(part)/50)/this.ManufacTime;
      return Math.min(TransTime(part), expedTrans) * ContainersPerDay(part);
    }

    function PartVolatility(part){
      let PeakPartDemandPerDay = maxQtyWk(part)/6;
      return (PeakPartDemandPerDay - AvgPartDemand(part))/(parseFloat(part[this.stdPack]));
    }

    function IntHandling(part){
      let IntHandlingTime = 4/this.ManufacTime;
      return IntHandlingTime * ContainersPerDay(part);
    }









    ////////////////////////////////SUPPLIER CALC //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function contSupplier(part, frequency){
        return ShipSize(part, frequency) + SupplierSafetyStock(part, frequency);
      }

    function SupplierSafetyStock(part,frequency){
      //////check w/ supply chain, as contperday is part of shipsize calc???
      return Math.min(2,(ContainersPerDay(part) + ShipSize(part, frequency) + 1));
    }









    ////////////////////////// TRANSIT CALC //////////////
    function contTransit(part, frequency){
       //EQ GOOD
      return ShipSize(part,frequency) * Math.ceil(frequency*TransTime(part))+1;
    }

    function ShipSize(part,frequency){
       //EQ GOOD
      return (ContainersPerDay(part))/frequency;
    }

    function ContainersPerDay(part){
       //EQ GOOD
      return AvgPartDemand(part)/(parseFloat(part[this.stdPack]));
    }

    function AvgPartDemand(part){
      //EQ GOOD
      return (averageQtyWk(part)/6);
    }

    function TransTime(part){
      return TruckTime(part) + MxBorder(part) + ODC(part);
    }

    function TruckTime(part){
       //EQ GOOD
      return (2 + ((2*getMiles(part))/50))/10;
    }




    function MxBorder(part){
       //EQ GOOD
        //if departure is in US:
        //    return 3
        //else:
            return 0
    }

    function ODC(part){
        //if type is 'CON':
        //   return 1.5
        //else:
            return 0
    }
    ///////////////////////////////////








    // j = 0
    // for part in parts:
    //     i = 0
    //     for field in part:
    //         if i > 16 and part[i].strip() != "-":
    //             part[i] = field.strip().replace(',','')
    //         elif part[i].strip() == "-":
    //             parts.pop(j)
    //             break
    //         i += 1
    //     console.log(part)
    //     j += 1


    for (let part of this.parts){
        if (this.routeDict[part[this.routeID]][this.mode] == "TL"){
          // console.log(finalCost(part, 3))
        }
        else if (this.routeDict[part[this.routeID]][this.mode] == "MR"){
          // console.log("GOT MR")
        }
        else if (this.routeDict[part[this.routeID]][this.mode] == "CON"){
           // console.log("GOT CON")
        }
        else if (this.routeDict[part[this.routeID]][this.mode] == "ITL"){
          // console.log("GOT ITL")
        }
    }

  }



}
