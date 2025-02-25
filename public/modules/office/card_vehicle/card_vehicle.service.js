myApp.registerFtr("card_vehicle_service", [
  "fRoot",
  function (fRoot) {
    var obj = {};

    obj.loadCardVehicleList = function (search, offset, top, sort) {
      return fRoot.requestHTTP({
        url: BackendDomain + "/office/card_vehical/load",
        method: "POST",
        data: JSON.stringify({ search, offset, top, sort }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;odata=verbose",
        },
      });
    };

    obj.countCardVehicleList = function (search) {
      return fRoot.requestHTTP({
        url: BackendDomain + "/office/card_vehical/count",
        method: "POST",
        data: JSON.stringify({ search }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;odata=verbose",
        },
      });
    };

    obj.insert = function (name, code) {
      return fRoot.requestHTTP({
        url: BackendDomain + "/office/card_vehical/insert",
        method: "POST",
        data: JSON.stringify({ name, code }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;odata=verbose",
        },
      });
    };

    obj.update = function (id, name) {
      return fRoot.requestHTTP({
        url: BackendDomain + "/office/card_vehical/update",
        method: "POST",
        data: JSON.stringify({ id, name }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;odata=verbose",
        },
      });
    };

    obj.delete = function (id) {
      return fRoot.requestHTTP({
        url: BackendDomain + "/office/card_vehical/delete",
        method: "POST",
        data: JSON.stringify({ id }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;odata=verbose",
        },
      });
    };

    obj.checkExist = function (code) {
      return fRoot.requestHTTP({
          url: BackendDomain + "/office/card_vehical/checkexist",
          method: "POST",
          data: JSON.stringify({ code }),
          headers: {
              "Content-Type": "application/json",
              "Accept": "application/json;odata=verbose"
          }
      });
  }

    return obj;
  },
  
]);
