/**
 * @author 暖宝宝
 */

/**
 * 获取职业生产树
 * @param {Object} job
 */
function makeJobTreeData(job){
	
}

function getUPMaterial(id){
	var Objs = [];
	var newid = id.substring(id.indexOf("_")+1);
	console.log("newid = "+newid)
	$.each(makeLis, function(index) {
		var pf = makeLis[index].pf;
		var has = false;
		$.each(pf, function(i) {
			if(pf[i].id == newid){
				has = true;
			}
		});
		if(has){
			var peifang = newPeiFangObject(pf, 0);
			var node = {
				id: makeLis[index]["id"],
				text: makeLis[index]["name"]+ (" ["+makeLis[index]["job"]+" : "+makeLis[index]["lv"]+"]"),
				expanded: true,
				nodeType: "itemNode",
				img: makeLis[index]["img"],
				children: peifang
			};
			Objs.push(node);
		}
	});
	return Objs;
}

function getItemTree(id) {
	var item = makeLis["_" + id];
	var peifang = item["pf"];
	peifang = newPeiFangObject(peifang, 0);
	var children1 = [{
		id: "it_" + id,
		text: item["name"],
		expanded: true,
		children: peifang
	}];
	return children1;
}

function makeTreeItem(id,showJob,expanded) {
	var newid = id.substring(id.indexOf("_"));
	//console.log("id = "+id+" newid = "+newid);
	var item = makeLis[newid];
	var peifang = item["pf"];
	peifang = newPeiFangObject(peifang, 0);
	var children1 = {
		id: id,
		text: item["name"]+ (showJob ? " ["+item["job"]+" : "+item["lv"]+"]" : ""),
		expanded: expanded,
		nodeType: "itemNode",
		img: item["img"],
		children: peifang
	};
	//console.log(children1);
	return children1;
}
/**
 * 获取理符tree 数据
 * @param {Object} job
 */
function makeLiTreeData(job,lv1,lv2,place) {
	if (!jobList[job]) {
		return [];
	}

	var lifus = [];
	for (var i = 0; i < missons.length; i++) {
		var lv = parseFloat(missons[i]["lv"]);
		if ((missons[i]["job"] == job || job == "all") && (lv >= lv1 && lv <= lv2) && ( place == "all" || missons[i]["place"] == place)) {
			//console.log(missons[i]["misson"]);
			//lifus.pu
			var tem = missons[i];
			tem["nodeType"] = "misson";
			tem["expanded"] = true;
			tem["id"] = "li_" + tem["it_id"];
			tem["text"] = "<font color=blue>" + tem["lv"] + "级</font>  <font color=green>" + tem["misson"] + "</font> [ <font color=red>" + tem["place"] + "</font> ]"
			var item = makeLis["_" + tem["it_id"]];
			var peifang = item["pf"];
			
			//peifang = getPeifang(peifang);
			peifang = newPeiFangObject(peifang,0);
			console.log(item["name"]+"的配方");
			console.log(peifang);
			
			var children1 = [{
				id: "it_" + tem["it_id"],
				text: item["name"]+" x"+missons[i]["it_no"],
				expanded: false,
				children: peifang
			}];
			tem["children"] = children1;

			//console.log(tem)
			lifus.push(tem);
		}
	}
	//console.log(lifus);
	return lifus;
}

function newPeiFangObject(peifang,index){
	var ss = newNode(peifang.length);
	//一级物品配方（任务物品配方）
	for (var j = 0; j < peifang.length; j++) {
		ss[j]["id"] = randomString(4)+"_"+peifang[j]["id"];
		ss[j]["text"] = peifang[j]["memo"];
		ss[j]["name"] = peifang[j]["name"];
		ss[j]["no"] = peifang[j]["no"];
		ss[j]["nodeType"] = "pf_"+index;
		ss[j]["job"] = peifang[j]["job"];
		
		var temit = baseItem["_"+peifang[j]["id"]];
		if(temit){
			ss[j]["img"] = temit["img"];
		}
		//console.log(peifang[j]["name"]+" job = "+peifang[j]["job"]+" id = "+peifang[j]["id"])
		if (peifang[j]["job"] != "") {
			var iid = "_"+peifang[j]["id"];
			var item0 = makeLis[iid];
			if(item0){
				ss[j]["children"] = newPeiFangObject(item0["pf"],index+1);
				if(parseFloat(item0["cl"]) > 1){
					ss[j]["text"] = peifang[j]["memo"]+"<font color=green> [产量:"+ item0["cl"] +"]</font>";
				}
				ss[j]["cl"] = item0["cl"];
			}
		}
	}
	return ss;
}

function newNode(len){
	var ss = [];
	for(var i=0;i<len;i++){
		ss.push({id:"",text:"",nodeType:"",job:"",name:"",children:[]});
	}
	return ss;
}

var ItObject = function(item){
	this.id = randomString(5)+"_"+item["id"];
	this.name = item["name"];
	this.job = item["job"];
	this.lv = item["lv"];
	this.type = item["type"];
	this.pf = item["pf"];
	this.sj = item["sj"];
	this.img = item["img"];
	this.lifu = item["lifu"];
}

var PfObjects = function(pf){
	var re = [];
	for (var k = 0; k < pf.length; k++) {
		console.log(pf[k]);
		re.push(new PfObject(pf[k]));
	}
	return re;
}

var PfObject = function(pf){
	this.id = randomString(5)+"_"+pf["id"];
	this.name = pf["name"]; 
	this.memo = pf["memo"]; 
	this.job = pf["job"];
	this.no = pf["no"];
}

/**
 * 获取生产配方，最高4级
 * @param {Object} peifang
 */
function getPeifang(peifang) {
	//一级物品配方（任务物品配方）
	for (var j = 0; j < peifang.length; j++) {
		
		peifang[j]["text"] = "<0>"+peifang[j]["memo"];
		peifang[j]["nodeType"] = "pf_0";
		//console.log(peifang[j]["name"]+" job = "+peifang[j]["job"]+" id = "+peifang[j]["id"])
		if (peifang[j]["job"] != "") {
			var item1 = makeLis["_" + peifang[j]["id"]];
			console.log(item1);
			if (item1) {
				//console.log(item1)
				//console.log(peifang[j]["name"]+" 有生产配方");
				var pc_pf = item1["pf"];

				//二级物品配方
				for (var k = 0; k < pc_pf.length; k++) {
					
					pc_pf[k]["text"] = "<1>"+pc_pf[k]["memo"];
					peifang[j]["expanded"] = true; //父节点 
					pc_pf[k]["nodeType"] = "pf_1";

					if (pc_pf[k]["job"] != "") {
						var item2 = makeLis["_" + pc_pf[k]["id"]];
						if (item2) {
							var pc_pf_pf = item2["pf"];
							//三级物品配方
							for (var l = 0; l < pc_pf_pf.length; l++) {
								
								pc_pf_pf[l]["text"] = "<2>"+pc_pf_pf[l]["memo"];
								//pc_pf[k]["expanded"] = true;//父节点
								pc_pf_pf[l]["nodeType"] = "pf_2";

								if (pc_pf_pf[l]["job"] != "") {
									var item3 = makeLis["_" + pc_pf_pf[l]["id"]];
									if (item3) {
										var pc_pf_pf_pf = item3["pf"];
										//四级配方
										for (var m = 0; m < pc_pf_pf_pf.length; m++) {
											pc_pf_pf_pf[m]["text"] = "<3>"+pc_pf_pf_pf[m]["memo"];
											//pc_pf_pf[l]["expanded"] = true;//父节点
											//console.log(pc_pf_pf_pf[m]["name"]+" 是4级生产配方 ");
											pc_pf_pf_pf[m]["nodeType"] = "pf_3";
											pc_pf_pf_pf[m]["id"] = pc_pf_pf_pf[m]["id"]+"_"+randomString(5);
										}
									}
								}
								pc_pf_pf[l]["id"] = pc_pf_pf[l]["id"]+"_"+randomString(4);
								console.log('pc_pf_pf['+l+']["id"] = '+pc_pf_pf[l]["id"])
							}
							pc_pf[k]["children"] = pc_pf_pf;
						}
					}
					pc_pf[k]["id"] = pc_pf[k]["id"]+"_"+randomString(3);
				}
				peifang[j]["children"] = pc_pf;

			}
		}
		peifang[j]["id"] = peifang[j]["id"]+"_"+randomString(2);
	}
	return peifang;
}

var randomString = function(len) {
　　len = len || 32;
　　var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefhijgklmnopqrstuvwxyz0123456789";
　　var maxPos = chars.length;
　　var pwd = '';
　　for (i = 0; i < len; i++) {
　　　　pwd += chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return pwd;
}