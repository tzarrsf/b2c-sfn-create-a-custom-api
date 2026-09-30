const BasketMgr = require("dw/order/BasketMgr")

exports.modifyGETResponse = function (searchResponse) {
    // Don't do anything if there is no items returned in the search result.
    if (searchResponse && searchResponse.count > 0) {
        const basket = BasketMgr.getCurrentBasket();
        // Again don't do anything if you currently don't have a basket
        if (basket) {
            var hits = searchResponse.hits.toArray();
            // Get a list consisting of the master product id's for hte items in your basket.
            var productIdsInBasket = basket.getAllProductLineItems().toArray().map(({product}) => product.masterProduct.ID)
            // Assign the c_isInBasket value if the current hit is in the above list.
            hits.forEach(function (hit) {
                hit.c_inBasket = productIdsInBasket.includes(hit.productId);
            });
        }
    }
};