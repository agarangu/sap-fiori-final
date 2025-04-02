sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
], (Controller,JSONModel,Filter,FilterOperator) => {
    "use strict";

    return Controller.extend("com.agarangu.supplierssapfiori.controller.Suppliers", {
        onInit() {
            const oView = this.getView();
            oView.setModel(new JSONModel({
				globalFilter: ""
			}), "ui");
			this._oGlobalFilter = null;
			this.oRouter = this.getOwnerComponent().getRouter();
        },
        _filter: function() {
			let oFilter = null;
			if (this._oGlobalFilter) {
				oFilter = this._oGlobalFilter;
			}
			this.byId("table").getBinding().filter(oFilter);
		},
		filterGlobally: function(oEvent) {
			const sQuery = String(oEvent.getParameter("query"));
			this._oGlobalFilter = null;
			if (sQuery) {
				this._oGlobalFilter = new Filter([
					new Filter("CompanyName", FilterOperator.Contains, sQuery),
					new Filter("Country", FilterOperator.Contains, sQuery),
				], false);
			}
			this._filter();
		},
        clearAllFilters: function(oEvent) {
			const oTable = this.byId("table");
			const oUiModel = this.getView().getModel("ui");
			oUiModel.setProperty("/globalFilter", "");
			this._oGlobalFilter = null;
			this._filter();
			const aColumns = oTable.getColumns();
			for (let i = 0; i < aColumns.length; i++) {
				oTable.filter(aColumns[i], null);
			}
		},
		onCellClicked: function(oEvent) {
			let oRow = oEvent.getParameter("row");
			let oSupplier = oRow.getBindingContext().getObject();
			this.oRouter.navTo("RouteSupplierDetails", {
				SupplierID: oSupplier.SupplierID
			})
		}
        
    });
});