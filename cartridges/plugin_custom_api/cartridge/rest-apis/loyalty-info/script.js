var RESTResponseMgr = require("dw/system/RESTResponseMgr");

exports.getLoyaltyInfo = function () {

    var customerId = request.getHttpParameterMap().get("c_customer_id")
        .getStringValue();

 /*
 ...some integration lookup of loyalty data based on customer id...
 */

 if (customerId) {

    var info = {
        customerId: customerId,
        points: 2500,
        tier: "Gold",
        expirationDate: "2026-12-31" 
    };

    RESTResponseMgr.createSuccess(info).render();
} else {
    RESTResponseMgr
        .createError(404, "customer-not-found", "Customer Unknown",
            "You provided an unknown customer ID.")
        .render();
    }
};

exports.getLoyaltyInfo.public = true;