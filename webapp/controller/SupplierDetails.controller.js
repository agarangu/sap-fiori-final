sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    "sap/ui/core/Messaging",
    "sap/m/MessageToast"
], (Controller,JSONModel,Filter,FilterOperator,Messaging,MessageToast) => {
    "use strict";

    return Controller.extend("com.agarangu.supplierssapfiori.controller.SupplierDetails", {
        onInit() {
            let oRouter = this.getOwnerComponent().getRouter();
            let oRoute = oRouter.getRoute("RouteSupplierDetails");
			oRoute.attachPatternMatched(this._onObjectMatched, this);

            const oModel = new JSONModel([]);           
            this.getView().setModel(oModel, "productsModel");
            this.clearNewProduct();
            
            this._oMessageManager = Messaging;
			this._oMessageManager.removeAllMessages();
        },

        _onObjectMatched: function (oEvent) {
            this.sSupplierID = oEvent.getParameter("arguments").SupplierID;
            this.getView().bindElement({
                "path": "/Suppliers(" + this.sSupplierID + ")",
                "parameters": {
                    "expand": "Products/Category"
                }
            });
        },
        clearNewProduct: function() {
            const oModel = new JSONModel({
                "ProductName": null,
                "CategoryID": null,
                "QuantityPerUnit": null,
                "UnitPrice": null,
                "UnitsInStock": null,
                "UnitsOnOrder": null,
                "ReorderLevel": null,
                "Discontinued": null
            });
            this.getView().setModel(oModel, "newProductModel");
        },
        onOpenPopoverDialog: function (oEvent) {
			// create dialog lazily
            let oProducts = oEvent.getParameter("row").getBindingContext().getObject();
			if (!this.oProductDetailsDialog) {
				this.oProductDetailsDialog = this.loadFragment({
					name: "com.agarangu.supplierssapfiori.view.fragments.ProductDetails"
				});
			}
			this.oProductDetailsDialog.then(function (oDialog) {
				this.oDialog = oDialog;
                this.oDialog.bindElement({
                    "path": "/Products(" + oProducts.ProductID + ")",
                });
				this.oDialog.open();
				this._oMessageManager.registerObject(this.oView.byId("formContainer"), true);

			}.bind(this));
		},
        onCreatePopoverDialog: function (oEvent) {
			// create dialog lazily
			if (!this.oCreateProductDialog) {
				this.oCreateProductDialog = this.loadFragment({
					name: "com.agarangu.supplierssapfiori.view.fragments.CreateProductDialog"
				});
			}
			this.oCreateProductDialog.then(function (oDialog) {
				this.oDialog = oDialog;
                this.oDialog.setModel(this.getView().getModel("newProductModel"), "newProductModel");
				this.oDialog.open();
				this._oMessageManager.registerObject(this.oView.byId("createProductFormContainer"), true);

			}.bind(this));
		},
        clearAllFilters: function(oEvent) {
			const oTable = this.byId("productsTable");
			const aColumns = oTable.getColumns();
			for (let i = 0; i < aColumns.length; i++) {
				oTable.filter(aColumns[i], null);
			}
		},
        _closeDialog: function () {
			this.oDialog.close();
		},
        onSave: function() {
            let oView = this.getView();
            const oNewProduct = oView.getModel("newProductModel").getData();
            const bIsEmptyProductName = oNewProduct.ProductName === null || oNewProduct.ProductName === "";
            const bIsEmptyDiscontinued = oNewProduct.Discontinued === null || oNewProduct.Discontinued === "";
            if(bIsEmptyProductName || bIsEmptyDiscontinued) {
                const sMissingFieldMessage = this.getView().getModel("i18n").getResourceBundle().getText("missingFieldMessage");
                MessageToast.show(sMissingFieldMessage);
                return;
            }
            let oProducts = oView.getModel("productsModel").getData();
            oProducts.push(oNewProduct);
            oView.setModel(new JSONModel(oProducts), "productsModel")
            this.clearNewProduct();
            this.oDialog.close();
        }
    });
});