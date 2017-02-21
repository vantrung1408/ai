//TODO: Định nghĩa 1 object điểm chứa các thuộc tính và phương thức của 1 điểm và 1 object map

var TYPE = new type();

function type() {
    this.WHITE = 0;
    this.BLACK = 1;
}

function point(type, location, map) {
    this.type;
    this.location;
    this.canExit;
    this.map;
    this.selected;

    this.getType = function () {
        return this.type;
    }

    this.setType = function (value) {
        this.type = value;
    }

    this.getLocation = function () {
        return this.location;
    }

    this.setLocation = function (value) {
        if (this.map && value && this.map.getGridObj()) {
            // For clear last index 
            if (this.location) {
                var oldX = parseInt(this.location.x);
                var oldY = parseInt(this.location.y);

                var oldIndex = (2 - oldY) * 3 + oldX;

                this.map.getGridObj()[oldIndex].removeClass(type == TYPE.WHITE ? 'white' : 'black');
                this.map.getGridObj()[oldIndex].removeClass('selected');
                this.map.getGridObj()[oldIndex].html('');
            }
            var x = parseInt(value.x);
            var y = parseInt(value.y);

            this.location = value;
            //Check y > 2 hoặc x > 2 thì nước đi đó làm mất 1 quân đen hoặc trắng
            if (x > 2 || y > 2) {
                return;
            }

            var index = (2 - y) * 3 + x;
            if (index < this.map.getGridObj().length) {
                this.map.getGridObj()[index].addClass(type == TYPE.WHITE ? 'white' : 'black');
            }
        }
    }

    this.getCanExit = function () {
        return this.canExit;
    }

    this.setCanExit = function (value) {
        this.canExit = value;
    }

    this.getMap = function () {
        return this.map;
    }

    this.setMap = function (value) {
        this.map = value;
    }

    this.getSelected = function () {
        return this.selected;
    }

    this.setSelected = function (value) {
        this.selected = value;
    }

    this.moveUp = function () {
        this.setLocation({ 'x': this.location.x, 'y': this.location.y + 1 });
    }

    this.moveDown = function () {
        if (this.type == TYPE.BLACK) {
            return;
        }
        this.setLocation({ 'x': this.location.x, 'y': this.location.y - 1 });
    }

    this.moveLeft = function () {
        if (this.type == TYPE.WHITE) {
            return;
        }
        this.setLocation({ 'x': this.location.x - 1, 'y': this.location.y });
    }

    this.moveRight = function () {
        this.setLocation({ 'x': this.location.x + 1, 'y': this.location.y });
    }

    this.installMember = function () {
        this.type = type;
        this.map = map;
        this.setLocation(location);
        this.selected = false;
    }
}

function map(element) {
    this.whitePoint = [];
    this.blackPoint = [];
    this.gridObj = [];
    this.selectedPoint;
    this.nextType;

    this.getGridObj = function () {
        return this.gridObj;
    }

    this.getPoint = function (index, type) {
        if (type == TYPE.WHITE) {
            if (index < whitePoint.length) {
                return whitePoint[index];
            }
            return null;
        }

        if (index < blackPoint.length) {
            return blackPoint[index];
        }
    }

    this.selectChild = function (index) {
        if (this.gridObj) {
            index = parseInt(index);
            if (index >= 0 && index < 9 && (this.gridObj[index].hasClass('white') || this.gridObj[index].hasClass('black'))) {
                if (this.nextType || this.nextType == 0 || this.nextType == 1) {
                    if (this.getPointByIndexOfGrid(index).getType() != this.nextType) {
                        return;
                    }
                }

                for (var i = 0; i < this.gridObj.length; i++) {
                    if (i != index) {
                        this.gridObj[i].removeClass('selected');
                    }

                    if (this.getPointByIndexOfGrid(i)) {
                        this.getPointByIndexOfGrid(i).setSelected(false);
                    }

                    this.gridObj[i].html('');
                }
                this.gridObj[index].toggleClass('selected');
                this.getPointByIndexOfGrid(index).setSelected(this.gridObj[index].hasClass('selected'));

                this.selectedPoint = this.getPointByIndexOfGrid(index);

                if (this.gridObj[index].hasClass('selected')) {
                    var director = document.createElement('div');
                    director = $(director);

                    // Up chỉ hiện khi là quân đen hoặc quân trắng nhưng không nằm ở trên đỉnh
                    if ((this.selectedPoint.getType() == TYPE.BLACK ||
						(this.selectedPoint.getType() == TYPE.WHITE &&
							this.selectedPoint.getLocation().y != 2)) &&
								this.checkTraffic('up')) {
                        director.append('<span class="glyphicon glyphicon-chevron-up"></span>');
                    }

                    // Down chỉ hiện khi là quân trắng và không nằm ở đáy
                    if (this.selectedPoint.getType() == TYPE.WHITE &&
						this.selectedPoint.getLocation().y != 0 &&
							this.checkTraffic('down')) {
                        director.append('<span class="glyphicon glyphicon-chevron-down"></span>');
                    }

                    // Right chỉ hiện khi là quân đen và không nằm ở biên phải
                    if (this.selectedPoint.getType() == TYPE.BLACK &&
						this.selectedPoint.getLocation().x != 0 &&
							this.checkTraffic('left')) {
                        director.append('<span class="glyphicon glyphicon-chevron-left"></span>');
                    }

                    // Right hiện khi là quân trắng hoặc quân đen nhưng không nằm ở biên phải
                    if ((this.selectedPoint.getType() == TYPE.WHITE ||
						(this.selectedPoint.getType() == TYPE.BLACK &&
							this.selectedPoint.getLocation().x != 2)) &&
								this.checkTraffic('right')) {
                        director.append('<span class="glyphicon glyphicon-chevron-right"></span>');
                    }

                    this.gridObj[index].html(director);
                }
            }
        }
    }

    this.getPointByIndexOfGrid = function (index) {
        var location;
        for (var i = 0; i < this.whitePoint.length; i++) {
            location = this.whitePoint[i].getLocation();
            if (((2 - location.y) * 3) + location.x == index) {
                return this.whitePoint[i];
            }

            if (i < this.blackPoint.length) {
                location = this.blackPoint[i].getLocation();
                if (((2 - location.y) * 3) + location.x == index) {
                    return this.blackPoint[i];
                }
            }
        }
    }

    this.getSelectedPoint = function () {
        return this.selectedPoint;
    }

    this.checkTraffic = function (moveType) {
        if (this.selectedPoint) {
            var x = this.selectedPoint.getLocation().x;
            var y = this.selectedPoint.getLocation().y;
            var lstPoints = this.whitePoint.concat(this.blackPoint);

            for (var i = 0; i < lstPoints.length; i++) {
                var pX = lstPoints[i].getLocation().x;
                var pY = lstPoints[i].getLocation().y;

                switch (moveType) {
                    case 'up':
                        if (y + 1 == pY && x == pX) {
                            return false;
                        }
                        break;
                    case 'down':
                        if (y - 1 == pY && x == pX) {
                            return false;
                        }
                        break;
                    case 'left':
                        if (x - 1 == pX && y == pY) {
                            return false;
                        }
                        break;
                    case 'right':
                        if (x + 1 == pX && y == pY) {
                            return false;
                        }
                        break;
                    default:
                        break;
                }
            }

            return true;
        }
    }

    this.movePoint = function (moveType) {
        switch (moveType) {
            case 'up':
                this.selectedPoint.moveUp();
                break;
            case 'down':
                this.selectedPoint.moveDown();
                break;
            case 'left':
                this.selectedPoint.moveLeft();
                break;
            case 'right':
                this.selectedPoint.moveRight();
                break;
            default:
                break;
        }

        this.nextType = this.selectedPoint.getType() == TYPE.WHITE ? TYPE.BLACK : TYPE.WHITE;

        // Point sau khi move mà có x lớn hơn 2 chứng tỏ quân trắng đã out
        if (this.selectedPoint.getLocation().x > 2) {
            var index = this.whitePoint.indexOf(this.selectedPoint);
            if (index > -1) {
                this.whitePoint.splice(index, 1);
            }
            if (this.whitePoint.length <= 0) {
                return 'RED WIN GAME!';
            }
        }

        if (this.selectedPoint.getLocation().y > 2) {
            var index = this.blackPoint.indexOf(this.selectedPoint);
            if (index > -1) {
                this.blackPoint.splice(index, 1);
            }
            if (this.blackPoint.length <= 0) {
                return 'BLACK WIN GAME!';
            }
        }

        return null;
    }

    this.installMember = function () {
        // init grid
        var lstChildOfGrid = [];
        for (var i = 0; i < 9; i++) {
            var div = document.createElement('div');
            div = $(div);
            div.addClass('col-xs-4');
            div.addClass('grid-child');

            if (element) {
                element.append(div);
            }
            lstChildOfGrid.push(div);
        }
        this.gridObj = lstChildOfGrid;

        // init points
        for (var i = 0; i < 4; i++) {
            var p;
            if (i < 2) {
                p = new point(TYPE.WHITE, { 'x': 0, 'y': i + 1 }, this);
                p.installMember();
                this.whitePoint.push(p);
            }
            else {
                p = new point(TYPE.BLACK, { 'x': i - 1, 'y': 0 }, this);
                p.installMember();
                this.blackPoint.push(p);
            }
        }
    }
}