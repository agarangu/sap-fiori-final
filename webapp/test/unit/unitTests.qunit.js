/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/agarangu/supplierssapfiori/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
