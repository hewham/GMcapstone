webpackJsonp(["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app.component.css":
/***/ (function(module, exports) {

module.exports = ".main{\n  /* background-color: #202020; */\n  font-family: \"Verdana\", sans-serif;\n  width: 100%;\n  height: 100%;\n}\n\n\ntable{\n  border-collapse: collapse;\n  width: 100%;\n}\n\n\ntable, th, tr, td{\n  /* color: whitesmoke; */\n  /* border: solid grey 2px; */\n  padding: 8px;\n  margin: 0 !important;\n}\n\n\nth, td {\n    border: 1px solid #ddd;\n}\n\n\nh1 {\n  color: #073980;\n}\n\n\nth {\n    background-color: #073980;\n    color: white;\n}\n\n\ninput{\n  padding-top: 30px;\n}\n\n\ntr:hover {background-color: gainsboro;}\n\n\n.ok-button {\n  background-color: #073980;\n  margin-top: 30px;\n  padding: 20px 40px;\n  border-radius: 10px;\n  color: white;\n}\n\n\n.grid-container {\n  display: -ms-grid;\n  display: grid;\n  -ms-grid-columns: auto auto auto;\n      grid-template-columns: auto auto auto;\n  grid-column-gap: 10px;\n  margin-top: 40px;\n\n}\n\n\n.grid-item{\n  background-color: #e7f0fe;\n  padding-top: 20px;\n  padding-bottom: 60px;\n  border-radius: 10px;\n  border: solid 3px #073980;\n  color: #073980;\n}\n\n\n.gm-logo {\n  height: 200px;\n  width: 200px;\n  border-radius: 10px;\n  border: solid 3px silver;\n}\n"

/***/ }),

/***/ "./src/app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<!--The content below is only a placeholder and can be replaced.-->\n<div class=\"main\">\n\n<div style=\"text-align:center\">\n  <h1>\n    GM CapStone\n  </h1>\n</div>\n\n<div style=\"text-align:center\" *ngIf=\"!showTable\">\n  <img class=\"gm-logo\" width=\"300\" alt=\"GM Logo\" src=\"{{gmLogo}}\">\n\n  <br />\n  <div class=\"grid-container\">\n    <div class=\"grid-item\">\n      Drop Parts CSV File Here\n      <br />\n      <input id=\"partsFile\" type=\"file\" />\n    </div>\n    <div class=\"grid-item\">\n      Drop Routes CSV File Here\n      <br />\n      <input id=\"routesFile\" type=\"file\" />\n    </div>\n    <div class=\"grid-item\">\n      Drop Containers CSV File Here\n      <br />\n      <input id=\"containersFile\" type=\"file\" />\n    </div>\n  </div>\n\n  <br />\n  <button class=\"ok-button\" (click)=\"clickedOK()\">\n    <u>GO</u>\n  </button>\n  <br />\n  <button class=\"ok-button\" (click)=\"clickedDemo()\">\n    Demo Table...\n  </button>\n</div>\n\n<div *ngIf=\"showTable\">\n  <table>\n    <tr> <th>Supplier</th> <th>Best Frequency</th> <th>Best Cost</th> <th>Originial Frequency</th> <th>Original Cost</th> <th> Cost Difference</th> </tr>\n\n    <tr><td>detroit</td><td>2456.3</td><td>4324</td><td>8494</td></tr>\n\n    <tr><td>ypsi</td><td>1234.23</td><td>5356.34</td><td>7549.98</td></tr>\n\n    <tr><td>ann arbor</td><td>4237.5</td><td>8599.2</td><td>5574.3</td></tr>\n  </table>\n</div>\n\n\n</div>\n\n\n\n\n\n\n\n<!-- <h2>Here are some links to help you start: </h2>\n<ul>\n  <li>\n    <h2><a target=\"_blank\" rel=\"noopener\" href=\"https://angular.io/tutorial\">Tour of Heroes</a></h2>\n  </li>\n  <li>\n    <h2><a target=\"_blank\" rel=\"noopener\" href=\"https://github.com/angular/angular-cli/wiki\">CLI Documentation</a></h2>\n  </li>\n  <li>\n    <h2><a target=\"_blank\" rel=\"noopener\" href=\"https://blog.angular.io/\">Angular blog</a></h2>\n  </li>\n</ul> -->\n"

/***/ }),

/***/ "./src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var AppComponent = /** @class */ (function () {
    function AppComponent() {
        this.showTable = false;
        this.routeLegend = [];
        this.partLegend = [];
        this.containerLegend = [];
        this.routes = [];
        this.parts = [];
        this.containers = [];
        // Dictionary for looking up route type by route number, ex: "MR" for MilkRun
        this.routeDict = {};
        // routeDict  Legend::
        this.routeID = 0;
        this.plannedLaneRate = 2;
        this.laneFreq = 3;
        this.isRoundTrip = 4;
        this.mode = 5;
        this.equipCode = 6;
        this.miles = 7;
        this.piecePrice = 8;
        this.pieceWeight = 9;
        // Parts Legend:::
        this.drawArea = 2;
        this.originID = 3;
        this.city = 4;
        this.state = 5;
        this.postalCode = 6;
        this.partID = 7;
        this.containerNameInPart = 8;
        this.stdPack = 9;
        this.contL = 10;
        this.contW = 11;
        this.contH = 12;
        this.contT = 13;
        this.re = 14;
        // Containers Legend:::
        this.containerName = 0;
        this.containerRE = 1;
        this.containerPrice = 2;
        // Dollar weight per
        this.HandlingCost = 1.15;
        this.InboundTrans = 1.25;
        this.mpg = 6.2;
        this.plantWorkingDays = 6;
        this.ManufacTime = 2;
        this.gmLogo = 'data:image/png;base64,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';
    }
    // Following functions give legend index for qtyWk, wtUtil, and lnCube
    AppComponent.prototype.qtyWk = function (week) {
        return week + 14;
    };
    AppComponent.prototype.wtUtil = function (week) {
        return (week * 2) - 1 + 34;
    };
    AppComponent.prototype.lnCube = function (week) {
        return (week * 2) - 1 + 35;
    };
    AppComponent.prototype.clickedDemo = function () {
        this.showTable = true;
    };
    AppComponent.prototype.clickedOK = function () {
        console.log("OK WAS CLICKED");
        // this.showTable = true;
        var partsFile;
        var routesFile;
        var containersFile;
        partsFile = document.getElementById("partsFile");
        routesFile = document.getElementById("routesFile");
        containersFile = document.getElementById("containersFile");
        var allFilesAreThere = true;
        if (!partsFile.files[0]) {
            allFilesAreThere = false;
        }
        if (!routesFile.files[0]) {
            allFilesAreThere = false;
        }
        if (!containersFile.files[0]) {
            allFilesAreThere = false;
        }
        if (!allFilesAreThere) {
            alert("You forgot to add a File.\n\n        Please add all files and try again!");
        }
        else {
            this.populateParts(partsFile.files[0], routesFile.files[0], containersFile.files[0]);
        }
    };
    AppComponent.prototype.populateParts = function (partsFile, routesFile, containersFile) {
        console.log("in populateParts...");
        var self = this;
        this.Papa.parse(partsFile, {
            complete: function (results) {
                // console.log("Finished:", results.data);
                self.parts = results.data;
                self.populateRoutes(partsFile, routesFile, containersFile);
            }
        });
    };
    AppComponent.prototype.populateRoutes = function (partsFile, routesFile, containersFile) {
        console.log("in populateRoutes...");
        var self = this;
        this.Papa.parse(routesFile, {
            complete: function (results) {
                console.log("Finished:", results.data);
                self.routes = results.data;
                self.populateContainers(partsFile, routesFile, containersFile);
            }
        });
    };
    AppComponent.prototype.populateContainers = function (partsFile, routesFile, containersFile) {
        console.log("in populateContainers...");
        var self = this;
        this.Papa.parse(containersFile, {
            complete: function (results) {
                console.log("Finished:", results.data);
                self.containers = results.data;
                self.main();
            }
        });
    };
    AppComponent.prototype.main = function () {
        console.log("In main()...");
        console.log("PARTS: ", this.parts);
        console.log("ROUTES: ", this.routes);
        //////////////////////////////METRICS WE NEED TO LOOKUP BY ROW//////////////////////
        //ONE WAY PLANT DISTANCE - Miles
        function getMiles(part) {
            var i = 0;
            for (var _i = 0, _a = this.routes; _i < _a.length; _i++) {
                var route = _a[_i];
                if (route[this.routeID] == part[this.routeID]) {
                    break;
                }
            }
            i++;
            return parseFloat(this.routes[i][this.miles]);
        }
        //AVG WEEKLY PARTS REQUIRED done
        function averageQtyWk(part) {
            var total = 0;
            for (var i = 0; i < 20; i++) {
                if (part[this.qtyWk(i)].isalpha() == false) {
                    total += parseFloat(part[this.qtyWk(i)]);
                }
            }
            return total / 20;
        }
        //MANUFACTURING TIME
        //PEAK WEEKLY PARTS REQUIRED
        function maxQtyWk(part) {
            var max = 0;
            for (var i = 0; i < 20; i++) {
                if (this.qtyWk(i) > max) {
                    max = this.qtyWk(i);
                }
            }
            return max;
        }
        //NUMBER OF PARTS
        function numOfParts(route) {
            var num = 0;
            for (var _i = 0, _a = this.parts; _i < _a.length; _i++) {
                var part = _a[_i];
                if (part[this.routeID] == route[this.routeID]) {
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
        function gasCost(miles) {
            return (miles / this.mpg) * fuelRate;
        }
        function containerPrice(part) {
            for (var _i = 0, _a = this.containers; _i < _a.length; _i++) {
                var container = _a[_i];
                if (part[this.containerNameInPart] == container[this.this.containerName]) {
                    return container[this.containerPrice];
                }
                else {
                    return 0;
                }
            }
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function finalCost(part, frequency) {
            var cost = freight(part, frequency) + floorSpace(part, frequency) + invHolding(part, frequency) + contCapital(part, frequency);
            return cost;
        }
        ////////////////////////////////// 4 MAIN COST CALCULATIONS ////////////////////////////////
        function freight(part, frequency) {
            return (getMiles(part) / this.mpg) * fuelRate;
        }
        function floorSpace(part, frequency) {
            var space = parseFloat(part[this.qtyWk(1)]) / parseFloat(part[this.stdPack]) / parseFloat(frequency);
            if (frequency % this.plantWorkingDays != 0) {
                space = Math.ceil(space * 1.1);
            }
            return space;
        }
        function invHolding(part, frequency) {
            // I = 0.15 * numberParts * costPerPart
            // I = 0.15 * floorSpace(part, frequency) * costPerPart
            // return I
            return 5;
        }
        function contCapital(part, frequency) {
            var containerNum = contPlant(part, frequency) + contSupplier(part, frequency) + contTransit(part, frequency);
            var contCapital = containerNum * containerPrice(part);
            return contCapital;
        }
        ////////////////////////////////////////// PLANT CALC ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function contPlant(part, frequency) {
            return ShipSize(part, frequency) + PlantSafetyStock(part, frequency);
        }
        function PlantSafetyStock(part, frequency) {
            return Math.min(2, PlantVolumeCalc(part, frequency));
        }
        function PlantVolumeCalc(part, frequency) {
            return PlantMin(part) + PartVolatility(part) + IntHandling(part) + 1;
        }
        function PlantMin(part) {
            var expedTrans = (getMiles(part) / 50) / this.ManufacTime;
            return Math.min(TransTime(part), expedTrans) * ContainersPerDay(part);
        }
        function PartVolatility(part) {
            var PeakPartDemandPerDay = maxQtyWk(part) / 6;
            return (PeakPartDemandPerDay - AvgPartDemand(part)) / (parseFloat(part[this.stdPack]));
        }
        function IntHandling(part) {
            var IntHandlingTime = 4 / this.ManufacTime;
            return IntHandlingTime * ContainersPerDay(part);
        }
        ////////////////////////////////SUPPLIER CALC //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function contSupplier(part, frequency) {
            return ShipSize(part, frequency) + SupplierSafetyStock(part, frequency);
        }
        function SupplierSafetyStock(part, frequency) {
            //////check w/ supply chain, as contperday is part of shipsize calc???
            return Math.min(2, (ContainersPerDay(part) + ShipSize(part, frequency) + 1));
        }
        ////////////////////////// TRANSIT CALC //////////////
        function contTransit(part, frequency) {
            //EQ GOOD
            return ShipSize(part, frequency) * Math.ceil(frequency * TransTime(part)) + 1;
        }
        function ShipSize(part, frequency) {
            //EQ GOOD
            return (ContainersPerDay(part)) / frequency;
        }
        function ContainersPerDay(part) {
            //EQ GOOD
            return AvgPartDemand(part) / (parseFloat(part[this.stdPack]));
        }
        function AvgPartDemand(part) {
            //EQ GOOD
            return (averageQtyWk(part) / 6);
        }
        function TransTime(part) {
            return TruckTime(part) + MxBorder(part) + ODC(part);
        }
        function TruckTime(part) {
            //EQ GOOD
            return (2 + ((2 * getMiles(part)) / 50)) / 10;
        }
        function MxBorder(part) {
            //EQ GOOD
            //if departure is in US:
            //    return 3
            //else:
            return 0;
        }
        function ODC(part) {
            //if type is 'CON':
            //   return 1.5
            //else:
            return 0;
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
        for (var _i = 0, _a = this.parts; _i < _a.length; _i++) {
            var part = _a[_i];
            if (this.routeDict[part[this.routeID]][this.mode] == "TL") {
                // console.log(finalCost(part, 3))
            }
            else if (this.routeDict[part[this.routeID]][this.mode] == "MR") {
                // console.log("GOT MR")
            }
            else if (this.routeDict[part[this.routeID]][this.mode] == "CON") {
                // console.log("GOT CON")
            }
            else if (this.routeDict[part[this.routeID]][this.mode] == "ITL") {
                // console.log("GOT ITL")
            }
        }
    };
    AppComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'app-root',
            template: __webpack_require__("./src/app/app.component.html"),
            styles: [__webpack_require__("./src/app/app.component.css")]
        })
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__("./node_modules/@angular/platform-browser/esm5/platform-browser.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_component__ = __webpack_require__("./src/app/app.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["E" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__app_component__["a" /* AppComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */]
            ],
            providers: [],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2__app_component__["a" /* AppComponent */]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var environment = {
    production: false
};


/***/ }),

/***/ "./src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__("./node_modules/@angular/platform-browser-dynamic/esm5/platform-browser-dynamic.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__("./src/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("./src/environments/environment.ts");




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* enableProdMode */])();
}
Object(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./src/main.ts");


/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map