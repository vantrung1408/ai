
var TYPE = new type();

function type(){
    this.COM = 0;
    this.PLAYER = 1;
}

function node(parent, value, data, childs, type = TYPE.COM){
    this.parent;			// Nút cha
    this.value;				// Giá trị của nút
    this.data = [];			// Tập giá trị 
    this.childs = [];		// Tạp các con từ tập giá trị trên
    this.isLeaf;			// Nếu tập con rỗng thì là lá
    this.type;				//

    this.getParent = function(){
        return this.parent;
    }

    this.setParent = function(value){
        this.parent = value;
    }

    this.getData = function(){
        return data;
    }

    this.getValue = function(){
        return this.value;
    }

    this.setValue = function(value){
        this.value = value;
    }

    this.getChilds = function(){
        return this.childs;
    }

    this.setChilds = function(value){
        if(value)
        {
            this.childs.push(value);	
        }

        if(this.childs)
        {
            if(this.childs.length > 0)
            {
                this.isLeaf = false;
            }
            else
            {
                this.isLeaf = true;
            }
        }
    }

    this.findLeaf = function(){
        if(this.isLeaf == true)
        {
            return [this];
        }
        else
        {
            // Duyệt các con của node
            if(this.childs.length > 0)
            {
                var lstLeaf = [];
                for(var i = 0; i<this.childs.length; i++)
                {
                    var childLeaf = this.childs[i].findLeaf()
                    for (var j = 0; j < childLeaf.length; j++)
                    {
                        lstLeaf.push(childLeaf[j]);   
                    }
                }

                return lstLeaf;
            }

            return null;
        }
    }

    this.getType = function(){
        return this.type;
    }

    this.installMember = function(){
        this.parent = parent;
        this.value = value;
        this.data = data;
        if (this.parent)
        {
            this.type = this.parent.type == TYPE.COM ? TYPE.PLAYER : TYPE.COM;
        }
        else
        {
            this.type = type;	
        }
        this.setChilds(childs);
    }
}

    function treeObj(n, element, popoverElem){
        this.root;

        this.getRoot = function(){
            return this.root;
        }

        this.prepareChilds = function(parentNode){
            if(parentNode)
            {
                var data = parentNode.getData();	// Đây là 1 mảng gồm các số
                if(data)
                {
                    for (var i = 0; i < data.length; i++)
                    {
                        if(data[i] != 1 && data[i] != 2)
                        {
                            // Tiến hành tách số hiện tại thành mảng chứa mảng các số
                            var newData = this.getDataFromNum(data[i]);
						
                            for (var j=0; j < newData.length; j++)
                            {
                                var tempData = data.slice();	// Backup lại data, từ tempData xóa phần tử có thể tách 

                                // Xóa phần tử cần tách
                                var index = tempData.indexOf(data[i]);
                                tempData.splice(index, 1);
                                // Tiến hành đặt từng phần tử trong mảng vào tempData
                                for (var z=0; z<newData[j].length; z++)
                                {
                                    tempData.push(newData[j][z]);
                                }

                                // Hết vòng for trên thì thu được tempData mới dành cho các node con
                                var child = new node(parentNode, null, tempData, null);
                                child.installMember();
                                parentNode.setChilds(child);
                                this.prepareChilds(child);
                            }
                        }
                    }
                }
            }
        }

        this.getDataFromNum = function(num){
            var m = num % 2;
            var h = (num - m) / 2;
            var lstData = [];
            for (var i = 1; i <= h; i++)
            {
                if (i != num - i)
                {
                    lstData.push([i, num - i]);
                }
            }
            return lstData;
        }

        this.comMove = function(){
            // TODO: Get tất cả giá trị của con thứ 2 kể từ root sau đó xem xét con nào có giá 
            // trị bằng nó thì chọn cha của con đó
            for (var i = 0; i< this.root.getChilds().length; i++)
            {
                // Check thằng con tiếp theo là lá bằng nó thì đi vào => player thua
                if(this.root.getChilds()[i].isLeaf == true &&
                    this.root.getChilds()[i].getValue() == this.root.getValue())
                {
                    this.root = this.root.getChilds()[i];
                    return this.root.getData().join(' - ');
                }
            }

            var lstChilds = [];
            for(var i=0; i<this.root.getChilds().length; i++)
            {
                for(var j =0; j<this.root.getChilds()[i].getChilds().length; j++)
                {
                    if(this.root.getChilds()[i].getChilds()[j].getValue() == this.root.getValue()){
                        lstChilds.push(this.root.getChilds()[i].getChilds()[j]);
                    }
                }
            }

            var c = lstChilds[Math.floor(Math.random() * lstChilds.length)];
            this.root = c.getParent();

            return this.root.getData().join(' - ');
        }

        this.move = function(moveType, selectedData){
            var r;
            if(moveType == TYPE.COM)
            {
                r = this.comMove();
            }
            else
            {
                var index = parseInt(selectedData);
                this.root = this.root.getChilds()[index];
                r = this.root.getData().join(' - ');
            }

            // init html
            var div = document.createElement('div');
            div = $(div);
            var label = document.createElement('label');
            label = $(label);
            label.addClass(moveType == TYPE.COM ? 'label label-danger' : 'label label-primary');
            label.text(r);
            div.append(label);

            element.append(div);

            if(moveType == TYPE.COM && this.root.getChilds().length > 0)
            {
                 // init popover
                popoverElem.html('');
                for(var i = 0; i< this.root.getChilds().length; i++)
                {
                    var nextRowData = this.root.getChilds()[i].getData().join(' - ');
                    var btn = document.createElement('button');
                    btn = $(btn);
                    btn.addClass('btn btn-default');
                    btn.text(nextRowData);
                    btn.attr('data-item', i);
                    btn.attr('data-type', 'playGame');

                    popoverElem.append(btn);
                }

                label.popover({
                    html: true,
                    content: function(){
                        return popoverElem.html();
                    },
                    title: 'Chọn nước đi của bạn',
                    placement: 'bottom'
                });

                label.popover('show');
            }
        }

        this.installMember = function(){
            n = parseInt(n);
            this.root = new node(null, null, [n], null);
            this.root.installMember();
		
            this.prepareChilds(this.root);
            var leafs = this.root.findLeaf();

            // Tiến hành gán giá trị
            for (var i = 0; i < leafs.length; i++)
            {
                leafs[i].setValue(1 - leafs[i].getType());
                var p = leafs[i].getParent();
                while(p)
                {
                    // Xét các con của p
                    var lstChildsValue = [];
                    for (var j = 0; j < p.getChilds().length; j++)
                    {
                        lstChildsValue.push(p.getChilds()[j].getValue());
                    }
                    p.setValue(p.getType() == TYPE.COM ? Math.min.apply(null, lstChildsValue) : Math.max.apply(null, lstChildsValue));
                    p = p.getParent();
                }
            }
        }
    }