//引入商品信息
function loadAllItems() {
  return [{
    id: 'ITEM0001',
    name: '黄焖鸡',
    price: 18.00
  }, {
    id: 'ITEM0013',
    name: '肉夹馍',
    price: 6.00
  }, {
    id: 'ITEM0022',
    name: '凉皮',
    price: 8.00
  }, {
    id: 'ITEM0030',
    name: '冰锋',
    price: 2.00
  }];
}


//引入优惠信息
function loadPromotions() {
  return [{
    type: '满30减6元'
  }, {
    type: '指定菜品半价',
    items: ['ITEM0001', 'ITEM0022']
  }];
}
function bestCharge(selectedItems) {
	let summary;
	let itemsArray = getCounts(selectedItems);
  
    //let inputs = ["ITEM0013 x 4", "ITEM0022 x 1"];
	//let itemsArray = getCounts(inputs);
	var items = loadAllItems();
	var promotions = loadPromotions();
	var outputs = getPromotions(itemsArray, promotions, items);
	summary = outputSum(outputs);
	return summary;
	console.log(summary);
}

function getCounts(inputs) {
	let outputs = [];
	inputs.map(function(element) {
		let item = element.split(" x ");
		outputs.push({
			id: item[0],
			count: item[1]
		});
	});
	console.log(outputs);
	return outputs;
}

function getPromotions(inputs, promotions, items) {
	let outputs = [];
	let itemsoutput = [];
	console.log("inputs's length " + inputs.length);
	inputs.map(function(element) {
		for (let i = 0; i < items.length; i++) {
			if (element["id"] == items[i].id) {
				element["name"] = items[i].name;
				element["price"] = items[i].price;
				element["total"] = element["price"] * element["count"];
				console.log(element);
				itemsoutput.push(element);
				break;
			}
		}
	});
	/*let sum = itemsoutput.reduce(function(a, b) {
		return a["total"] + b["total"];
	});*/
	let sum = 0;
	for (let i = 0; i < itemsoutput.length; i++) {
		sum += itemsoutput[i].total;
	}
	let promotionsoutput = [];
	let max = 0;
	let maxpromotion;
	let promotion;
	promotions.map(function(element) {
		if (element.type == '满30减6元' && sum >= 30) {
			promotion = {
				type:'满30减6元',
				total:6
			}
			promotionsoutput.push(promotion);
			max = 6;
			maxpromotion = promotion;
		} else if (element.type == '指定菜品半价') {
			let val = 0;
			let array = [];
			itemsoutput.map(function(e) {
				if (element["items"].indexOf(e["id"]) > -1) {
					val += e["total"] / 2;
					array.push(e["name"]);
				}
			});
			let arraystring = '';
			for (let i = 0; i < array.length; i++) {
				if (i != array.length - 1) {
					arraystring += array[i] + "，"
				} else {
					arraystring += array[i]
				}
			}
			promotion = {
				type:'指定菜品半价' + "(" + arraystring + ")",
				total:val,
			}
			promotionsoutput.push(promotion);
			if (val > max) {
				max = val;
				maxpromotion = promotion;
			}
		} else {
			promotion = {
				type: "无优惠"
			}
			promotionsoutput.push(promotion);
			maxpromotion = promotion;
		}
	});
	let sumoutput = [];
	console.log("max " + max)
	sum = sum - max;
	sumoutput.push({
		sum: sum
	});
	outputs.push(itemsoutput);
	outputs.push([maxpromotion]);
	outputs.push(sumoutput);
	console.log(outputs);
	return outputs;
}

function outputSum(inputs) {
	let str = '============= 订餐明细 =============\n';
	inputs[0].map(function(element) {
		str += element["name"] + " x " + element["count"] + " = " + element["total"] + "元" + "\n";
	});
	str += '-----------------------------------\n';
	if(inputs[1][0].type != "无优惠") {
		str += '使用优惠:\n';
		inputs[1].map(function(element) {
		str += element["type"] + "，";
		str += "省" + element["total"] + "元" + "\n"
	});
	str += '-----------------------------------\n';
	}
	str += "总计：" + inputs[2][0].sum + "元" + "\n";
	str += "===================================\n"
	console.log(str);
	str = str.replace(/\,/g, "，");
	return str;
}

module.exports = bestCharge;