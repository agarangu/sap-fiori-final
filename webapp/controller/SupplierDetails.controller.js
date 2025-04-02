sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
], (Controller,JSONModel,Filter,FilterOperator) => {
    "use strict";

    return Controller.extend("com.agarangu.supplierssapfiori.controller.SupplierDetails", {
        onInit() {
            let oRouter = this.getOwnerComponent().getRouter();
            let oRoute = oRouter.getRoute("RouteSupplierDetails")
			oRoute.attachPatternMatched(this._onObjectMatched, this);
        },
        _onObjectMatched: function (oEvent) {
            let sSupplierID = oEvent.getParameter("arguments").SupplierID;
            let oView = this.getView();
            this.getView().bindElement({
                "path": "/Suppliers(" + sSupplierID + ")"
            });
        },
    });
});