myApp.compileProvider.directive("drawTaskWorkflow",['$rootScope', function ($rootScope) {
    return {
        restrict: "E",
        templateUrl: FrontendDomain + "/modules/office/task_workflow/directives/draw_task_workflow.html"
        , link: function (scope) {
            /**
             * Xem từng obj được vẽ trong canvas element như những micro service, và CanvasModel như một store/service chuyên quản lý state 
             * và đưa ra action dựa trên state của store và  state của từng service.
             * Đối tượng CanvasModel là đối tượng sẽ giữ các logic lưu trữ thao tác state của hệ thống.
             * Đối tượng service sẽ lưu trữ các api cập nhật state local và update UI
             * Đối tượng event sẽ thực hiện execute api của CanvasModel và update service data và thực hiện thay đổi số lượng service trong hệ thống
             * Đối tượng vòng xoay tức nội dung trong hàm đệ quy Animate sẽ thực hiện trigger api update từ các service.
             * Quy trình về việc cập nhật state và thao tác trên hệ thống sẽ như sau:
             *  1/ Các event sẽ trigger action của CanvasModel để ghi nhật state ở CanvasModel và thao tác thay đổi số lượng service trong hệ thống.
             *  2/ Các service sẽ dựa vào state ở CanvasModel để thực hiện update state ở service 
             *  (đây là các state liên quan đến hiển thị chi tiết cho object đó, như màu sắc, vị trí)
             *  3/ Vòng xoay sẽ trigger api update UI của các services.
             */
            var d = new Date();
            scope._ctrlName = "drawTaskWorkflow" + d.getTime();
            var canvasModel = {};
            var containerComponent = {};
            scope.rectangle = {};
            scope.arrow = {};
            function getSizeOfElement() {
                return {
                    width: window.innerWidth * 0.8 - 250,
                    height: window.innerHeight - 85,
                }
            }
            function CanvasModel(_flow, _canvasID) {

                this.canvas = window.document.getElementById(_canvasID);
                this.canvasListObject = [];
                this.flow = _flow;
                let size = getSizeOfElement();
                this.canvas.width = size.width;
                this.canvas.height = size.height;
                this.context = this.canvas.getContext('2d');
                // this.canvas.style.border = "1px solid black";
                this.radiusOfHoverPointInRectangle = 5;
                this.distanceLimit = 10;
                this.isDrawing = true;
                this.currentAction = {
                    action: "",
                    objID: ""
                };
                for (let i in this.flow) {
                    switch (this.flow[i].type) {
                        case "Rectangle":
                            this.canvasListObject.push(
                                new Rectangle(this.context, this.flow[i].id,
                                    this.flow[i].x, this.flow[i].y,
                                    this.flow[i].width, this.flow[i].height,
                                    this.flow[i].color, this.flow[i].name,
                                    this.flow[i].toElement)
                            );
                            break;
                        case "Arrow":
                            this.canvasListObject.push(
                                new Arrow(this.context, this.flow[i].id,
                                    this.flow[i].fromx, this.flow[i].fromy,
                                    this.flow[i].tox, this.flow[i].toy
                                )
                            );
                            break;
                    }
                }

                this.setCurrentAction = function (action, objID, opts) {
                    this.currentAction = { action, objID, ...opts };
                }

                this.clearCurrentAction = function () {
                    this.currentAction = {
                        action: "",
                        objID: ""
                    };
                }

                this.hasCurrentAction = function () {
                    return this.currentAction && this.currentAction.objID;
                }

                this.clearTemporayArrow = function () {
                    this.canvasListObject = this.canvasListObject.filter(e => e.id !== "arrow_temporary");
                }

                this.replaceCanvasListObjects = function (replacedArray) {
                    let arrayID = replacedArray.map(item => item.id);
                    this.canvasListObject = this.canvasListObject.filter(e => arrayID.indexOf(e.id) === -1);
                    this.canvasListObject = this.canvasListObject.concat(replacedArray);
                }

                this.stopDraw = function () {
                    this.isDrawing = false;
                }
            }


            function Rectangle(_context, _id, _x, _y, _width, _height, _color, _text, _toElement) {
                this.context = _context;
                this.id = _id;
                this.x = _x;
                this.y = _y;
                this.width = _width;
                this.height = _height;
                this.color = _color;
                this.text = _text;
                this.toElement = _toElement;
                this.type = "Rectangle";
                this.draw = function () {
                    this.context.font = "bold 12px Arial";
                    let textWidth = _context.measureText(this.text).width;
                    let centerX = this.width / 2;
                    let centerY = this.height / 2;
                    this.context.beginPath();
                    this.context.fillStyle = this.color ? this.color : "rgba(255,0,0,0.5)";
                    this.context.fillRect(this.x, this.y, this.width, this.height);
                    this.context.fillStyle = "black";
                    this.context.fillText(this.text, this.x + (centerX - textWidth / 2), this.y + centerY + 4);
                    this.context.closePath();

                }

                this.drawHoverPoint = function (x, y) {
                    const point = new HoverPointInRectangle(this.context, x, y);
                    point.update();
                }

                this.update = function () {
                    this.draw();
                    if (canvasModel.currentAction.objID === this.id && canvasModel.currentAction.action === "hoverRectangle") {
                        this.drawHoverPoint(this.x + (this.width / 2), this.y);
                        this.drawHoverPoint(this.x + (this.width / 2), this.y + this.height);
                        this.drawHoverPoint(this.x, this.y + (this.height / 2));
                        this.drawHoverPoint(this.x + this.width, this.y + (this.height / 2));
                    }
                }

                this.setPosition = function (x, y) {
                    this.x = x;
                    this.y = y;
                }

                this.addToElement = function (arID) {
                    if (!this.toElement) { this.toElement = arID; } else {
                        for (let i in arID) {
                            if (this.toElement.indexOf(arID[i]) === -1) {
                                this.toElement.push(arID[i]);
                            }
                        }
                    }
                }
            }

            function Arrow(_context, _id, _fromx, _fromy, _tox, _toy) {
                this.context = _context;
                this.id = _id;
                this.fromx = _fromx;
                this.fromy = _fromy;
                this.tox = _tox;
                this.toy = _toy;
                this.controlX = _fromx + (_tox - _fromx) / 5;
                this.controlY = _fromy + (_toy - _fromy) / 2;
                this.headlen = 7;
                this.type = "Arrow";
                this.points = [];


                this.draw = function () {
                    this.context.beginPath();
                    if (canvasModel.currentAction.objID === this.id && canvasModel.currentAction.action === "hoverArrow") {
                        this.context.lineWidth = 2;
                        this.context.strokeStyle = "#4278f5";
                    } else {
                        this.context.lineWidth = 1;
                        this.context.strokeStyle = "#8da4c9";
                    }
                    const dx = this.tox - this.fromx - (this.tox - this.fromx) / 5;
                    const dy = this.toy - this.fromy - (this.toy - this.fromy) / 2;
                    const angle = Math.atan2(dy, dx);
                    this.context.moveTo(this.fromx, this.fromy);

                    this.context.quadraticCurveTo(this.controlX, this.controlY, this.tox, this.toy);
                    this.context.stroke();
                    this.context.lineTo(this.tox, this.toy);
                    this.context.lineTo(this.tox - this.headlen * Math.cos(angle - Math.PI / 6), this.toy - this.headlen * Math.sin(angle - Math.PI / 6));
                    this.context.moveTo(this.tox, this.toy);
                    this.context.lineTo(this.tox - this.headlen * Math.cos(angle + Math.PI / 6), this.toy - this.headlen * Math.sin(angle + Math.PI / 6));

                    this.context.stroke();
                    this.context.closePath();
                    this.context.lineWidth = 1;
                    this.context.strokeStyle = "#8da4c9";
                }

                this.update = function () {
                    this.draw();
                }
            }

            function HoverPointInRectangle(_context, _x, _y) {
                this.x = _x;
                this.y = _y;
                this.context = _context;
                this.radius = canvasModel.radiusOfHoverPointInRectangle;
                this.color = "#9fc5e8";
                this.draw = function () {
                    this.context.beginPath();
                    this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                    this.context.strokeStyle = this.color;
                    this.context.fillStyle = this.color;
                    this.context.stroke();
                    this.context.fill();
                    this.context.closePath();
                }

                this.update = function () {
                    this.draw();
                }
            }

            function calculateArrowPosition(_fromElement, _toElement) {

                let fromPositionArray = [
                    {
                        x: _fromElement.x + _fromElement.width / 2,
                        y: _fromElement.y
                    },
                    {
                        x: _fromElement.x + _fromElement.width / 2,
                        y: _fromElement.y + _fromElement.height
                    },
                    {
                        x: _fromElement.x,
                        y: _fromElement.y + _fromElement.height / 2
                    },
                    {
                        x: _fromElement.x + _fromElement.width,
                        y: _fromElement.y + _fromElement.height / 2
                    }
                ];

                let toPositionArray = [
                    {
                        x: _toElement.x + _toElement.width / 2,
                        y: _toElement.y
                    },
                    {
                        x: _toElement.x + _toElement.width / 2,
                        y: _toElement.y + _toElement.height
                    },
                    {
                        x: _toElement.x,
                        y: _toElement.y + _toElement.height / 2
                    },
                    {
                        x: _toElement.x + _toElement.width,
                        y: _toElement.y + _toElement.height / 2
                    }
                ];

                let minDistancePosition = {};
                for (let i in fromPositionArray) {
                    for (let j in toPositionArray) {
                        let thisDistanceSquare = (fromPositionArray[i].x - toPositionArray[j].x) ** 2 + (fromPositionArray[i].y - toPositionArray[j].y) ** 2;
                        if (typeof minDistancePosition.distance === 'undefined' || minDistancePosition.distance > thisDistanceSquare) {
                            minDistancePosition = {
                                distance: thisDistanceSquare,
                                fromx: fromPositionArray[i].x,
                                fromy: fromPositionArray[i].y,
                                tox: toPositionArray[j].x,
                                toy: toPositionArray[j].y
                            };
                        }
                    }
                }
                return minDistancePosition;
            }

            function handleData(_flow) {
                let temp = [];
                for (let i in _flow) {
                    switch (_flow[i].type) {
                        case "Rectangle":
                            temp.push(_flow[i]);
                            if (_flow[i].toElement && _flow[i].toElement.length) {
                                const arrowArray = getArrowItemsFromInitData(_flow, _flow[i], _flow[i].toElement);
                                temp = temp.concat(arrowArray);
                            }
                            break;
                    }
                }
                return temp;
            }

            function getArrowItemsFromInitData(_myFlow, fromElement, elementAr) {
                let result = [];
                for (let i in elementAr) {
                    let toElement = getDetailCanvas(_myFlow, elementAr[i]);
                    let arrowDetails = calculateArrowPosition(fromElement, toElement);
                    result.push({
                        id: `arrow_${fromElement.id}_${toElement.id}`,
                        type: "Arrow",
                        ...arrowDetails
                    });
                }
                return result;
            }

            function getArrowItemsFromCanvasObjectData(fromElement, elementAr) {
                let result = [];
                for (let i in elementAr) {
                    let toElement = getDetailCanvas(canvasModel.canvasListObject, elementAr[i]);
                    let arrowDetails = calculateArrowPosition(fromElement, toElement);
                    result.push({
                        id: `arrow_${fromElement.id}_${toElement.id}`,
                        type: "Arrow",
                        ...arrowDetails
                    });
                }
                for (let i in canvasModel.canvasListObject) {
                    if (canvasModel.canvasListObject[i].toElement && canvasModel.canvasListObject[i].toElement.indexOf(fromElement.id) !== -1) {
                        const arrowDetails = calculateArrowPosition(canvasModel.canvasListObject[i], fromElement);
                        result = result.concat([{
                            id: `arrow_${canvasModel.canvasListObject[i].id}_${fromElement.id}`,
                            type: "Arrow",
                            ...arrowDetails
                        }]);
                    }
                }
                return result;
            }

            function getDetailCanvas(data, id) {
                for (let i in data) {
                    if (data[i].id === id) {
                        return data[i];
                    }
                }
                return undefined;
            }

            function animate() {
                if (canvasModel.isDrawing) {
                    requestAnimationFrame(animate);
                    canvasModel.context.clearRect(0, 0, canvasModel.canvas.width, canvasModel.canvas.height);
                    for (let i in canvasModel.canvasListObject) {
                        canvasModel.canvasListObject[i].update();
                    }
                }
            }

            function isInRectangle(_x, _y, _fromx, _fromy, _width, _height) {
                if (_x >= _fromx && _x <= (_fromx + _width)
                    && _y >= _fromy && _y <= (_fromy + _height)) {
                    return true;
                }
                return false;
            }
            function isInHoverPoint(_x, _y, _fromx, _fromy, _width, _height) {
                if (_x >= _fromx + (_width / 2) - canvasModel.radiusOfHoverPointInRectangle
                    && _x <= _fromx + (_width / 2) + canvasModel.radiusOfHoverPointInRectangle
                    && _y >= _fromy - canvasModel.radiusOfHoverPointInRectangle
                    && _y <= _fromy + canvasModel.radiusOfHoverPointInRectangle) {
                    return true;
                }

                if (_x >= _fromx + (_width / 2) - canvasModel.radiusOfHoverPointInRectangle
                    && _x <= _fromx + (_width / 2) + canvasModel.radiusOfHoverPointInRectangle
                    && _y >= _fromy + _height - canvasModel.radiusOfHoverPointInRectangle
                    && _y <= _fromy + _height + canvasModel.radiusOfHoverPointInRectangle) {
                    return true;
                }

                if (_x >= _fromx - canvasModel.radiusOfHoverPointInRectangle
                    && _x <= _fromx + canvasModel.radiusOfHoverPointInRectangle
                    && _y >= _fromy + (_height / 2) - canvasModel.radiusOfHoverPointInRectangle
                    && _y <= _fromy + (_height / 2) + canvasModel.radiusOfHoverPointInRectangle) {
                    return true;
                }

                if (_x >= _fromx + _width - canvasModel.radiusOfHoverPointInRectangle
                    && _x <= _fromx + _width + canvasModel.radiusOfHoverPointInRectangle
                    && _y >= _fromy + (_height / 2) - canvasModel.radiusOfHoverPointInRectangle
                    && _y <= _fromy + (_height / 2) + canvasModel.radiusOfHoverPointInRectangle) {
                    return true;
                }

                return false;
            }

            function isInArrow(_x, _y, _fromx, _fromy, _tox, _toy, _controlx, _controly) {
                function getDistance(x1, y1, x2, y2) {
                    const dx = x2 - x1;
                    const dy = y2 - y1;
                    return Math.sqrt(dx * dx + dy * dy);
                }

                function distanceToQuadraticCurve(x, y, x1, y1, cx, cy, x2, y2) {
                    // x, y: coordinates of the point
                    // x1, y1: coordinates of the start point of the quadratic curve
                    // cx, cy: coordinates of the control point of the quadratic curve
                    // x2, y2: coordinates of the end point of the quadratic curve

                    // Calculate the minimum distance between the point and the quadratic curve
                    var t = getClosestQuadraticCurveT(x, y, x1, y1, cx, cy, x2, y2);
                    var closestPoint = getQuadraticCurvePoint(x1, y1, cx, cy, x2, y2, t);
                    var distance = getDistance(x, y, closestPoint.x, closestPoint.y);

                    return distance;
                }

                function getClosestQuadraticCurveT(x, y, x1, y1, cx, cy, x2, y2) {
                    // Find the closest value of t for the quadratic curve using Newton's method
                    var iterations = 10;
                    var tolerance = 0.0001;
                    var t = 0.5;
                    var dt = 0;

                    for (var i = 0; i < iterations; i++) {
                        var closestPoint = getQuadraticCurvePoint(x1, y1, cx, cy, x2, y2, t);
                        var gradient = getQuadraticCurveGradient(x1, y1, cx, cy, x2, y2, t);
                        var dx = closestPoint.x - x;
                        var dy = closestPoint.y - y;

                        if (dx * dx + dy * dy < tolerance) {
                            break;
                        }

                        dt = (dx * gradient.x + dy * gradient.y) / (gradient.x * gradient.x + gradient.y * gradient.y);

                        if (!isFinite(dt)) {
                            break;
                        }

                        t -= dt;
                        t = Math.max(0, Math.min(1, t));
                    }

                    return t;
                }

                function getQuadraticCurveGradient(x1, y1, cx, cy, x2, y2, t) {
                    // Calculate the gradient of the quadratic curve at the given value of t
                    var x = 2 * (1 - t) * (cx - x1) + 2 * t * (x2 - cx);
                    var y = 2 * (1 - t) * (cy - y1) + 2 * t * (y2 - cy);

                    return {
                        x: x,
                        y: y
                    };
                }

                function getQuadraticCurvePoint(x1, y1, cx, cy, x2, y2, t) {
                    // Calculate the point on the quadratic curve for the given value of t
                    var x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2;
                    var y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2;

                    return {
                        x: x,
                        y: y
                    };
                }

                return canvasModel.distanceLimit > distanceToQuadraticCurve(_x, _y, _fromx, _fromy, _controlx, _controly, _tox, _toy);
            }

            function addEvents() {
                containerComponent.addEventListener('mousedown', function (event) {
                    const rect = containerComponent.getBoundingClientRect();
                    const x = event.clientX - rect.left;
                    const y = event.clientY - rect.top;
                    let isThisConnectRectangle = false;
                    for (let i in canvasModel.canvasListObject) {
                        switch (canvasModel.canvasListObject[i].type) {
                            case "Rectangle":
                                if (isInRectangle(x, y, canvasModel.canvasListObject[i].x, canvasModel.canvasListObject[i].y, canvasModel.canvasListObject[i].width, canvasModel.canvasListObject[i].height)) {
                                    if (!canvasModel.hasCurrentAction()) {
                                        canvasModel.setCurrentAction("chooseRectangle", canvasModel.canvasListObject[i].id);
                                        break;
                                    } else {
                                        switch (canvasModel.currentAction.action) {
                                            case "hoverRectangle":
                                                if (isInHoverPoint(x, y, canvasModel.canvasListObject[i].x, canvasModel.canvasListObject[i].y, canvasModel.canvasListObject[i].width, canvasModel.canvasListObject[i].height)) {
                                                    canvasModel.setCurrentAction("connectRectangle", canvasModel.canvasListObject[i].id, { x, y });
                                                    isThisConnectRectangle = true;
                                                } else {
                                                    canvasModel.setCurrentAction("chooseRectangle", canvasModel.canvasListObject[i].id);
                                                }
                                                break;
                                        }
                                    }
                                }
                                if (isInHoverPoint(x, y, canvasModel.canvasListObject[i].x, canvasModel.canvasListObject[i].y, canvasModel.canvasListObject[i].width, canvasModel.canvasListObject[i].height)) {
                                    canvasModel.setCurrentAction("connectRectangle", canvasModel.canvasListObject[i].id, { x, y });
                                    isThisConnectRectangle = true;
                                }
                                break;
                            case "Arrow":
                                if (!isThisConnectRectangle
                                    && isInArrow(x, y, canvasModel.canvasListObject[i].fromx,
                                        canvasModel.canvasListObject[i].fromy, canvasModel.canvasListObject[i].tox, canvasModel.canvasListObject[i].toy,
                                        canvasModel.canvasListObject[i].controlX, canvasModel.canvasListObject[i].controlY)) {
                                    canvasModel.setCurrentAction("chooseArrow", canvasModel.canvasListObject[i].id);
                                    break;
                                }
                                break;

                        }
                    }
                });

                containerComponent.addEventListener('mouseup', function (event) {
                    const rect = containerComponent.getBoundingClientRect();
                    const x = event.clientX - rect.left;
                    const y = event.clientY - rect.top;
                    if (canvasModel.hasCurrentAction()) {
                        switch (canvasModel.currentAction.action) {
                            case "connectRectangle": {
                                let check = false;
                                for (let i in canvasModel.canvasListObject) {
                                    if (canvasModel.canvasListObject[i].type === "Rectangle"
                                        && isInRectangle(x, y, canvasModel.canvasListObject[i].x, canvasModel.canvasListObject[i].y, canvasModel.canvasListObject[i].width, canvasModel.canvasListObject[i].height)) {

                                        for (let j in canvasModel.canvasListObject) {
                                            if (canvasModel.canvasListObject[j].id === canvasModel.currentAction.objID) {

                                                const arrowDetails = calculateArrowPosition(canvasModel.canvasListObject[j], canvasModel.canvasListObject[i]);
                                                const ArrowModel = {
                                                    id: `arrow_${canvasModel.canvasListObject[j].id}_${canvasModel.canvasListObject[i].id}`,
                                                    type: "Arrow",
                                                    ...arrowDetails
                                                };

                                                canvasModel.replaceCanvasListObjects([new Arrow(canvasModel.context, ArrowModel.id,
                                                    ArrowModel.fromx, ArrowModel.fromy,
                                                    ArrowModel.tox, ArrowModel.toy
                                                )]);

                                                canvasModel.canvasListObject[j].addToElement([canvasModel.canvasListObject[i].id]);
                                                check = true;
                                                break;
                                            }
                                        }


                                        break;
                                    }
                                }
                                canvasModel.clearTemporayArrow();
                                canvasModel.clearCurrentAction();
                            }
                                break;
                            case "chooseRectangle":
                                {
                                    for (let i in canvasModel.canvasListObject) {
                                        if (canvasModel.canvasListObject[i].type === "Rectangle"
                                            && canvasModel.canvasListObject[i].id === canvasModel.currentAction.objID
                                            && isInRectangle(x, y, canvasModel.canvasListObject[i].x, canvasModel.canvasListObject[i].y, canvasModel.canvasListObject[i].width, canvasModel.canvasListObject[i].height)
                                        ) {
                                            setRectangleObject(canvasModel.canvasListObject[i]);
                                            break;
                                        }
                                    }
                                    canvasModel.clearCurrentAction();
                                }

                                break;
                            case "chooseArrow":
                                {
                                    for (let i in canvasModel.canvasListObject) {
                                        if (canvasModel.canvasListObject[i].type === "Arrow"
                                            && canvasModel.canvasListObject[i].id === canvasModel.currentAction.objID
                                            && isInArrow(x, y, canvasModel.canvasListObject[i].fromx,
                                                canvasModel.canvasListObject[i].fromy, canvasModel.canvasListObject[i].tox, canvasModel.canvasListObject[i].toy,
                                                canvasModel.canvasListObject[i].controlX, canvasModel.canvasListObject[i].controlY)
                                        ) {
                                            setArrowObject(canvasModel.currentAction.objID);
                                            break;
                                        }
                                    }
                                    canvasModel.clearCurrentAction();
                                }

                                break;
                        }
                    }
                })

                containerComponent.addEventListener('mousemove', function (event) {
                    const rect = containerComponent.getBoundingClientRect();
                    const x = event.clientX - rect.left;
                    const y = event.clientY - rect.top;
                    if (canvasModel.hasCurrentAction()) {
                        switch (canvasModel.currentAction.action) {
                            case "chooseRectangle":
                                for (let i in canvasModel.canvasListObject) {
                                    if (canvasModel.canvasListObject[i].id === canvasModel.currentAction.objID) {
                                        canvasModel.canvasListObject[i].setPosition(x - 12, y - 10);
                                        const arrowArray = getArrowItemsFromCanvasObjectData(canvasModel.canvasListObject[i], canvasModel.canvasListObject[i].toElement);
                                        let replacedArray = [];
                                        for (let j in arrowArray) {
                                            replacedArray.push(
                                                new Arrow(canvasModel.context, arrowArray[j].id,
                                                    arrowArray[j].fromx, arrowArray[j].fromy,
                                                    arrowArray[j].tox, arrowArray[j].toy
                                                )
                                            );
                                        }
                                        canvasModel.replaceCanvasListObjects(replacedArray);
                                        break;
                                    }
                                }
                                break;
                            case "hoverRectangle":
                                {
                                    let check = false;
                                    for (let i in canvasModel.canvasListObject) {
                                        if (canvasModel.canvasListObject[i].type === "Rectangle" &&
                                            (isInRectangle(x, y, canvasModel.canvasListObject[i].x, canvasModel.canvasListObject[i].y, canvasModel.canvasListObject[i].width, canvasModel.canvasListObject[i].height)
                                                || isInHoverPoint(x, y, canvasModel.canvasListObject[i].x, canvasModel.canvasListObject[i].y, canvasModel.canvasListObject[i].width, canvasModel.canvasListObject[i].height))) {
                                            check = true;
                                            break;
                                        }
                                    }
                                    if (!check) {
                                        canvasModel.clearCurrentAction();
                                    }
                                }

                                break;
                            case "connectRectangle":
                                canvasModel.replaceCanvasListObjects([
                                    new Arrow(canvasModel.context, "arrow_temporary", canvasModel.currentAction.x, canvasModel.currentAction.y, x, y)
                                ]);
                                break;
                            case "hoverArrow":
                                {
                                    let check = false;
                                    for (let i in canvasModel.canvasListObject) {
                                        if (canvasModel.canvasListObject[i].type === "Arrow" &&
                                            isInArrow(x, y, canvasModel.canvasListObject[i].fromx,
                                                canvasModel.canvasListObject[i].fromy, canvasModel.canvasListObject[i].tox, canvasModel.canvasListObject[i].toy,
                                                canvasModel.canvasListObject[i].controlX, canvasModel.canvasListObject[i].controlY)) {
                                            check = true;
                                            break;
                                        }
                                    }
                                    if (!check) {
                                        canvasModel.clearCurrentAction();
                                    }
                                }

                                break;
                        }
                    } else {
                        for (let i in canvasModel.canvasListObject) {
                            switch (canvasModel.canvasListObject[i].type) {
                                case "Rectangle":
                                    if (isInRectangle(x, y, canvasModel.canvasListObject[i].x, canvasModel.canvasListObject[i].y, canvasModel.canvasListObject[i].width, canvasModel.canvasListObject[i].height)
                                        || isInHoverPoint(x, y, canvasModel.canvasListObject[i].x, canvasModel.canvasListObject[i].y, canvasModel.canvasListObject[i].width, canvasModel.canvasListObject[i].height)) {
                                        if (!canvasModel.hasCurrentAction()) {
                                            canvasModel.setCurrentAction("hoverRectangle", canvasModel.canvasListObject[i].id);
                                            break;
                                        }
                                    }
                                    break;
                                case "Arrow":
                                    if (isInArrow(x, y, canvasModel.canvasListObject[i].fromx,
                                        canvasModel.canvasListObject[i].fromy, canvasModel.canvasListObject[i].tox, canvasModel.canvasListObject[i].toy,
                                        canvasModel.canvasListObject[i].controlX, canvasModel.canvasListObject[i].controlY)) {
                                        canvasModel.setCurrentAction("hoverArrow", canvasModel.canvasListObject[i].id);
                                        break;
                                    }
                                    break;

                            }
                        }
                    }
                });


            }

            function setRectangleObject(obj) {
                scope.rectangle = {
                    id: obj.id,
                    name: obj.text,
                    color: obj.color
                };
                scope.$apply();
            }

            function setArrowObject(id) {
                scope.arrow = {
                    id: id
                };
                let nameAr = id.split("_");
                scope.arrow.fromID = nameAr[1];
                scope.arrow.toID = nameAr[2];
                for (let i in canvasModel.canvasListObject) {
                    if (canvasModel.canvasListObject[i].type === "Rectangle") {
                        if (canvasModel.canvasListObject[i].id === scope.arrow.fromID) {
                            scope.arrow.from = canvasModel.canvasListObject[i].text;
                        };
                        if (canvasModel.canvasListObject[i].id === scope.arrow.toID) {
                            scope.arrow.to = canvasModel.canvasListObject[i].text;
                        }
                    }


                }

                scope.$apply();
            }

            scope.startDraw = function (flow) {
                let myFlow = handleData(flow);
                containerComponent = window.document.getElementById(scope._ctrlName + "_container");
                canvasModel = new CanvasModel(myFlow, scope._ctrlName + "_main_board");
                canvasModel.isDrawing = true;
                animate();
                addEvents();
            }

            scope.stopDraw = function () {
                canvasModel.stopDraw();
                canvasModel = {};
            }

            scope.exportFlow = function () {
                let result = [];
                for (let i in canvasModel.canvasListObject) {
                    if (canvasModel.canvasListObject[i].type === 'Rectangle') {
                        result.push({
                            id: canvasModel.canvasListObject[i].id,
                            name: canvasModel.canvasListObject[i].text,
                            type: canvasModel.canvasListObject[i].type,
                            x: canvasModel.canvasListObject[i].x,
                            y: canvasModel.canvasListObject[i].y,
                            width: canvasModel.canvasListObject[i].width,
                            height: canvasModel.canvasListObject[i].height,
                            color: canvasModel.canvasListObject[i].color,
                            toElement: canvasModel.canvasListObject[i].toElement
                        });
                    }

                }
                return result;
            }

            scope.deleteRectangle = function () {
                let temp = [];
                for (let i in canvasModel.canvasListObject) {
                    switch (canvasModel.canvasListObject[i].type) {
                        case "Rectangle":
                            if (canvasModel.canvasListObject[i].id !== scope.rectangle.id) {
                                if (canvasModel.canvasListObject[i].toElement) {
                                    let tempToElement = [];
                                    for (let j in canvasModel.canvasListObject[i].toElement) {
                                        if (canvasModel.canvasListObject[i].toElement[j] !== scope.rectangle.id) {
                                            tempToElement.push(canvasModel.canvasListObject[i].toElement[j]);
                                        }
                                    }
                                    console.log(canvasModel.canvasListObject[i].text, tempToElement);
                                    canvasModel.canvasListObject[i].toElement = tempToElement;
                                }
                                temp.push(canvasModel.canvasListObject[i]);
                            }
                            break;
                        case "Arrow":
                            let nameAr = canvasModel.canvasListObject[i].id.split("_");
                            if (nameAr[1] !== scope.rectangle.id && nameAr[2] !== scope.rectangle.id) {
                                temp.push(canvasModel.canvasListObject[i]);
                            }
                            break;
                    }
                }
                canvasModel.canvasListObject = temp;
                scope.rectangle = {};
                canvasModel.clearCurrentAction();
            }

            scope.updateRectangle = function () {
                for (let i in canvasModel.canvasListObject) {
                    if (canvasModel.canvasListObject[i].id === scope.rectangle.id) {
                        canvasModel.canvasListObject[i].text = scope.rectangle.name;
                        canvasModel.canvasListObject[i].color = scope.rectangle.color;
                    }
                }
            }

            scope.deleteArrow = function () {
                let temp = [];
                for (let i in canvasModel.canvasListObject) {
                    switch (canvasModel.canvasListObject[i].type) {
                        case "Rectangle":
                            if (canvasModel.canvasListObject[i].toElement
                                && canvasModel.canvasListObject[i].id === scope.arrow.fromID) {
                                canvasModel.canvasListObject[i].toElement = canvasModel.canvasListObject[i].toElement.filter(e => e !== scope.arrow.toID);
                                console.log(canvasModel.canvasListObject[i].toElement);
                            }
                            temp.push(canvasModel.canvasListObject[i]);
                            break;
                        case "Arrow":
                            if (canvasModel.canvasListObject[i].id !== scope.arrow.id) {
                                temp.push(canvasModel.canvasListObject[i]);
                            }
                            break;
                    }
                }
                canvasModel.canvasListObject = temp;
                scope.arrow = {};
                canvasModel.clearCurrentAction();
            }

            scope.addNew = function(){
                let d  = new Date();
                canvasModel.canvasListObject.push(
                    new Rectangle(canvasModel.context, $rootScope.logininfo.username +d.getTime().toString(),
                        400, 400,
                        100, 46,
                        "#ede9e9", 'New',
                        [])
                );
            }
        }
    };
}]);