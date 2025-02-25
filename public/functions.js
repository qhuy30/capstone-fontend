/**DECLARE */

window.modeProduction = "development";
window.FrontendDomain = {
    development: "http://localhost:3005",
    production: 'https://vpdt.pnt.edu.vn'
};
window.primaryDomain = {
    development: "http://localhost:3005",
    production: 'https://vpdt.pnt.edu.vn'
};
window.domainB = {
    development: "http://localhost",
    production: 'https://vpdt-be.pnt.edu.vn'
};
window.portB = {
    development: "9002",
    production: false
};

window.domainSocket = {
    development: "http://localhost",
    production: "https://vpdt-be.pnt.edu.vn"
};
window.portSocket = {
    development: "9002",
    production: false
};
// Using to seperate the checkRouter API
window.originalDomain = 'https://tenant.vnadev.com';
window.domainB = window.domainB[window.modeProduction];
window.portB = window.portB[window.modeProduction];
window.domainSocket = window.domainSocket[window.modeProduction];
window.FrontendDomain = window.FrontendDomain[window.modeProduction];
window.primaryDomain = window.primaryDomain[window.modeProduction];
window.portSocket = window.portSocket[window.modeProduction];
window.cookieKey = {
    token: "theera_tenant_login",
    refreshToken: "theera_tenant_refresh",
    currentPath: "theera_tenant_current_path"
};

window.idleTime = 500;


window.BackendDomain = (function () {
    if (portB) {
        return domainB + ":" + portB;
    } else {
        return domainB;
    }
})()

window.socketDomain = (function () {
    if (portSocket) {
        return domainSocket + ":" + portSocket;
    } else {
        return domainSocket;
    }
})()

window.homeRoute = primaryDomain + "/home";
window.loginRoute = primaryDomain + "/login";
window.notfoundRoute = primaryDomain + "/notfound";

window.homeFiles = [primaryDomain + "/modules/management/system/home.service.js", primaryDomain + "/modules/management/system/home.controller.js"];
window.notfoundFiles = [primaryDomain + "/modules/management/system/notfound.service.js", primaryDomain + "/modules/management/system/notfound.controller.js"];
window.notpermissionFiles = [primaryDomain + "/modules/management/system/notpermission.service.js", primaryDomain + "/modules/management/system/notpermission.controller.js"];
window.loginFiles = [primaryDomain + "/modules/management/user/login.service.js", primaryDomain + "/modules/management/user/login.controller.js"];

window.urlHomePage = primaryDomain + "/modules/management/system/views/home.html";
window.urlNotFoundPage = primaryDomain + "/modules/management/system/views/notfound.html";
window.urlNotPermissionPage = primaryDomain + "/modules/management/system/views/notpermission.html";
window.urlLoginPage = primaryDomain + "/modules/management/user/views/login.html";

window.urlAddTask = primaryDomain + "/modules/office/task/newtask/newtask.html";
window.urlAddTasksForDepartments = primaryDomain + "/modules/office/task/newtask/tasks_for_departments.html";
window.urlAddTasksForProjects = primaryDomain + "/modules/office/task/newtask/tasks_for_projects.html";
window.urlDetailsQuestion = primaryDomain + "/modules/education/question_answer/details/views/details.html";
window.urlDepartmentDetails = primaryDomain + "/modules/office/task/views/department_view.html";
/**END DECLARE */

/** LOGIC */

$(document).on({
    'show.bs.modal': function () {
        var zIndex = 1040 + (10 * $('.modal:visible').length);
        $(this).css('z-index', zIndex);
        setTimeout(function () {
            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
        }, 0);
    },
    'hidden.bs.modal': function () {
        if ($('.modal:visible').length > 0) {
            // restore the modal-open class to the body element, so that scrolling works
            // properly after de-stacking a modal.
            setTimeout(function () {
                $(document.body).addClass('modal-open');
            }, 0);
        }
    }
}, '.modal');

window.isLogic = function (arg, lgFn) {
    for (var _len = arg.length, a = new Array(_len), _key = 0; _key < _len; _key++) {
        a[_key] = arg[_key];
    }
    return a.every(function (e) {
        return lgFn(e);
    })
};



window.isUndefined = function () { return isLogic(arguments, function (v) { return v === undefined }) };
window.isArray = function () { return isLogic(arguments, Array.isArray) };
window.isObject = function () { return isLogic(arguments, angular.isObject) };
window.isFunction = function () { return isLogic(arguments, angular.isFunction) };
window.angularClean = function (arg) { return angular.fromJson(angular.toJson(arg)) }
window.angularCopy = angular.copy;
window.mapPrimary = function (arg, prmry) { return arg.map(e => e[prmry]) }


window.convertToNumber = function (val) {
    var data = ["", "", "hai", "ba", "bon", "nam", "sau"];
    return data[val];
}

function getIndexform(username, length, item) {
    if (typeof username != "string" ||
        typeof length != "number" ||
        typeof item != "object" ||
        Array.isArray(item)) {
        return false;
    }
    for (var i = 1; i <= length; i++) {
        if (item["canhan" + convertToNumber(i)].indexOf(username) != -1) {
            return i;
        }
    }
    return false;
}

function standardJSON(val) {
    if (!val) { return []; }
    if (typeof (val) === 'object') { return val; }
    val = val.trim();
    if (val.charAt(0) == "[" || val.charAt(0) == "{") {

        return JSON.parse(val);
    }
    return val;
}

function standardPush(item, ar) {
    if (!ar) { ar = []; }
    ar.push(item);
    return angular.copy(ar);
}

function tqv_getTime() {
    var d = new Date();
    return d.getTime();
}
/**kiểm tra sự tồn tại của 1 element có tồn tại trong mảng không */
function checkElementinArray(element, array) {
    for (var i in array) {
        if (array[i] == element) { return parseInt(i) + 1; }
    }
    return 0;
}
/** gen ra mảng kí tự a->z theo 2 chế độ là hoa/thường */
function genCharArray(charA, charZ, mode) {
    var a = [],
        i = charA.charCodeAt(0),
        j = charZ.charCodeAt(0);
    for (; i <= j; ++i) {
        switch (mode) {
            case "lower":
                a.push(String.fromCharCode(i).toLocaleLowerCase());
                break;
            case "upper":
                a.push(String.fromCharCode(i).toLocaleUpperCase());
                break;
        }

    }
    return a;
}
/**tách tên cột trong excel ra thành phần chữ và phần số */
function splitCell_XLSX(namecell) {
    var anphabel = genCharArray('a', 'z', 'upper');
    var i = 0;
    while (i < namecell.length &&
        checkElementinArray(namecell.charAt(i), anphabel)) {
        i++;
    }
    return {
        text: namecell.substring(0, i),
        number: namecell.substring(i, namecell.length)
    };
}

function genStringCode(val, number) {
    val.toString();
    var result = "";
    for (var i = val.toString().length; i < number; i++) {
        result += "0";
    }
    result += val.toString()
    return result;
}
/**lấy ra số ngày trong tháng xác định */
function daysInMonth(m, y) {
    return new Date(y, m, 0).getDate();
}

/**trả về true/false việc kiểm tra sự tồn tại của 1 phần tử trong 1 mảng theo thuộc tính nhất định */
function checkElementByField(ar, f, v) {
    for (var i in ar) {
        if (ar[i][f] == v) { return parseInt(i) + 1; }
    }
    return 0;
}


/**check an alphanum text */

function checkAlphanum(val) {
    if (/[^a-zA-Z0-9\-\/]/.test(val)) {
        return false;
    }
    return true;
}

myLogic = {};
/**gen treedata */
myLogic.treedata = {};

myLogic.treedata.findChild = function (id, array) {
    var temp = [];
    for (var i in array) {
        if (array[i].parentid == id) {
            temp.push(array[i]);
        }
    }
    return temp;
}

myLogic.treedata.assignChild = function (data, array) {
    for (var i in data) {
        if (findChild(data[i].id, array).length > 0) {
            data[i].items = myLogic.treedata.findChild(data[i].id, array);
            data[i].items = myLogic.treedata.assignChild(data[i].items, array);
        }
    }
    return data;
}

myLogic.treedata.genTreeData = function (array) {
    results = [];
    for (var i in array) {
        if (!array[i].parentid) {
            results.push(array[i]);
        }
    }
    results = myLogic.treedata.assignChild(results, array);
}
/**END LOGIC */


/** */
function parse2RE(string) {
    var regexp_String = "";
    string = string.toLowerCase();
    for (var c of string) {
        regexp_String += parseCharacter(c);

    }
    return new RegExp(regexp_String);
}

function parseCharacter(char) {
    if (char === "a") return "[aáàảạãăắằẳẵặâấầẩẫậAÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]";
    if (char === "e") return "[eéèẻẽẹêếềểễệEÈÉẸẺẼÊỀẾỆỂỄ]";
    if (char === "i") return "[iíìỉĩịIÌÍỊỈĨ]";
    if (char === "o") return "[oóòỏõọôốồổỗộơớờởỡợOÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]";
    if (char === "u") return "[uúùủũụưứừửữựUÙÚỤỦŨƯỪỨỰỬỮ]";
    if (char === "y") return "[yýỳỷỹỵYỲÝỴỶỸ]";
    if (char === "d") return "[dđĐ]";
    if (char === " ") return "\\s";
    if (char === "\\" ||
        char === "[" ||
        char === "]" ||
        char === "|" ||
        char === "." ||
        char === "+" ||
        char === "?" ||
        char === "(" ||
        char === ")" ||
        char === "-" ||
        char === "^" ||
        char === "$" ||
        char === "*") return "\\" + char;
    return char;
}



function addElem2Ar(array, keyName, elemAr) {
    if (!Array.isArray(array) || !Array.isArray(elemAr)) return array;
    if (keyName) {
        for (var i in elemAr) {
            if (!checkElementByField(array, keyName, elemAr[i][keyName])) {
                array.push(elemAr[i]);
            }
        }

    } else {
        for (var i in elemAr) {
            if (!checkElementinArray(elemAr[i], array)) {
                array.push(elemAr[i]);
            }
        }
    }
    return array;
}

function rmvElem0Ar(array, keyName, elemAr, elemArKeyName) {
    if (!Array.isArray(array) || !Array.isArray(elemAr)) return array;
    if (keyName) {
        if (elemArKeyName) {
            for (var i in elemAr) {
                array = array.filter(e => e[keyName] !== elemAr[i][elemArKeyName]);
            }
        } else {
            for (var i in elemAr) {
                array = array.filter(e => e[keyName] !== elemAr[i]);
            }
        }


    } else {
        if (elemArKeyName) {
            for (var i in elemAr) {
                array = array.filter(e => e !== elemAr[i][elemArKeyName]);
            }
        } else {
            for (var i in elemAr) {
                array = array.filter(e => e !== elemAr[i]);
            }
        }

    }
    return array;
}

function cbSuccess(cb) { return function (rs) { return cb(rs.data); } }

function cbError(cb) { return function (e) { return cb(e.data); } }

function assignScope(sc, md, val) {
    var ref = sc;
    var ar = md.split(" ");
    // angular.forEach(ar.slice(0, ar.length - 1), function (e) {
    //     ref = ref[e];
    // });
    for (var e of ar.slice(0, ar.length - 1)) {
        if (!ref) return 0;
        ref = ref[e];
    }
    if (isFunction(val)) {
        if (!isUndefined(ref[ar[ar.length - 1]])) {
            ref[ar[ar.length - 1]] = val(ref[ar[ar.length - 1]]);
        }

    } else {
        ref[ar[ar.length - 1]] = val;
    }
    return 1;

}

function setInput(curScope, cfg, indexAr) {
    var pos;
    angularCopy(cfg).some(function (elm, i) {
        if (isArray(indexAr) && !checkElementinArray(i, indexAr)) return;
        isFunction(elm.v) && (elm.v = elm.v());
        if (isUndefined(elm.dList)) {
            // curScope[elm.m] = elm.v;
            assignScope(curScope, elm.m, elm.v);
            return;
        }
        if (!isUndefined(elm.i)) {
            if (!curScope[elm.dList].length || elm.i >= curScope[elm.dList].length) return;
            if (!isUndefined(elm.k)) {
                // curScope[elm.m] = curScope[elm.dList][elm.i][elm.k];
                assignScope(curScope, elm.m, curScope[elm.dList][elm.i][elm.k]);
            } else {
                // curScope[elm.m] = curScope[elm.dList][elm.i];
                assignScope(curScope, elm.m, curScope[elm.dList][elm.i]);
            }
            return;
        }
        if (isUndefined(elm.k) && (pos = checkElementinArray(elm.v, curScope[elm.dList]))) {
            // curScope[elm.m] = curScope[elm.dList][pos - 1];
            assignScope(curScope, elm.m, curScope[elm.dList][pos - 1]);
        }
        if (!isUndefined(elm.k) && (pos = checkElementByField(curScope[elm.dList], elm.k, elm.v))) {
            // curScope[elm.m] = curScope[elm.dList][pos - 1][elm.k];
            assignScope(curScope, elm.m, curScope[elm.dList][pos - 1][elm.k]);
        }
    });
}

function clearInput(curScope, cfg, indexAr) {
    angularCopy(cfg).some(function (elm, i) {
        if (!checkElementinArray(i, indexAr)) return;
        assignScope(curScope, elm.m);
    });
}

function setOut(curScope, cfg) {
    curScope = angularCopy(curScope);
    for (var elm of cfg) {
        if (isFunction(elm.o)) {
            assignScope(curScope, elm.m, elm.o);
        }
    }
    return curScope;
}

function resetVal(o) {
    for (var prop in o) {
        if (!isFunction(o[prop])) {
            delete o[prop];
        }
    }
}

function loading(ls, curScope, cfg) {
    return new Promise(async function (res, rej) {
        ls = sortByField(ls, 'p', 'number');
        cfg = sortByField(cfg, 'p', 'number');
        var out = [];
        var w;
        for (var elm of group(ls, 'p', true)) {
            if (
                w = await Promise.all(
                    elm.map(function (e) {
                        return e.f();
                    })
                ).catch(e => { })
            ) {
                elm.forEach(function (e, i) {
                    curScope[e.l] = w[i];
                })
                for (var cfg_elm of group(cfg, 'p', true)) {
                    if (cfg_elm[0] && cfg_elm[0].p <= elm[0].p) {
                        setInput(curScope, cfg_elm);
                    }
                }
                Array.prototype.push.apply(out, w);
            } else {
                rej(false);
                return;
            }
        }
        res({
            dataListAr: ls,
            out: out
        });
    });
}

function group(ar, f) {
    var group = [];
    var temp = [];
    var checkgroup = false;
    for (var i in ar) {
        temp = [];
        checkgroup = false;
        for (var g in group) {
            if (group[g][0][f] == ar[i][f]) {
                checkgroup = true;
                break;
            }
        }
        if (!checkgroup) {
            for (var j in ar) {
                if (ar[j][f] == ar[i][f]) {
                    temp.push(ar[j]);
                }
            }
            group.push(temp);
        }
    }
    return group;
}

function sortByField(ar, f, type) {
    switch (type) {
        case 'number':
            {
                return ar.sort(function (a, b) { return a[f] - b[f] });
            }
        case 'string':
            {
                return ar.sort(function (a, b) {
                    var x = a[f].toString().toLowerCase();
                    var y = b[f].toString().toLowerCase();
                    if (x < y) { return -1; }
                    if (x > y) { return 1; }
                    return 0;
                });
            }
    }
    return ar;
}
/** <== */

/** prototype */
Object.defineProperty(Object.prototype, 'merge', {
    value: function (o = {}) { for (var prop in o) { this[prop] = o[prop]; } }
});
/** <== prototype */



window.removeUnicode = function (alias) {
    if (typeof alias !== "string") return alias;
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    str = str.replace(/ + /g, " ");
    str = str.trim();
    return str;
}
