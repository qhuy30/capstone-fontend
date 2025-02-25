this.tqvSP = function(){
	var enter = "<br/>";
	
	/* DateTime Object*/
	this.DateTime = { 
		/*Format Date */
		 convert:function (date,input,output){
			switch(input){
				case 'd':
					switch(output){
						case 'dd/mm/yyyy':
						return date.substring(0,2)+'/'+date.substring(3,5)+'/'+date.substring(6,10);
						break;
						case 'dd-mm-yyyy':
						return date.substring(0,2)+'-'+date.substring(3,5)+'-'+date.substring(6,10);
						break;
						case 'yyyy/mm/dd':
						return date.substring(6,10)+'-'+date.substring(3,5)+'-'+date.substring(0,2);
						break;
						case 'yyyy-mm-dd':
						return date.substring(6,10)+'/'+date.substring(3,5)+'/'+date.substring(0,2);
						break;
					}
				break;
				case 'y':
					switch(output){
						case 'dd/mm/yyyy':
						 return date.substring(8,10)+'/'+date.substring(5,7)+'/'+date.substring(0,4);
						break;
						case 'dd-mm-yyyy':
						 return date.substring(8,10)+'-'+date.substring(5,7)+'-'+date.substring(0,4);
						break;
						case 'yyyy/mm/dd':
						 return date.substring(0,4)+'/'+date.substring(5,7)+'/'+date.substring(8,10);
						break;
						case 'yyyy-mm-dd':
						 return date.substring(0,4)+'-'+date.substring(5,7)+'-'+date.substring(8,10);
						break;
					}
				break;
			}
		}
		/*Difference Monday*/
		, difMonday: function(date){
			var w = new Array(7);
			w[0]=  7;
			w[1] = 1;
			w[2] = 2;
			w[3] = 3;
			w[4] = 4;
			w[5] = 5;
			w[6] = 6;
		return w[day]-1;
		}
		/*number of days in month*/
		,daysInMonth: function(m,y){
			return new Date(y,m, 0).getDate();
		}
		/*Subtraction Date with number days*/
		,SubDays:function(date,days,input,output){
			if(this.getMonth(date,input)!=1){
				if(this.getDay(date,input)>days){
					var d =this.numberToString(this.getDay(date,input)-days);
					var m =this.numberToString(this.getMonth(date,input));
					var y = this.getYear(date,input);
					switch(output){
						case 'dd/mm/yyyy':
							return d+'/'+m+'/'+y;
						break;
						case 'dd-mm-yyyy':
							return d+'-'+m+'-'+y;
						break;
						case 'yyyy/mm/dd':
							return y+'/'+m+'/'+d;
						break;
						case 'yyyy-mm-dd':
							return y+'-'+m+'-'+d;
						break;
					}
				}
				else{
					var d = this.numberToString(this.daysInMonth(this.getMonth(date,input)-1,this.getYear(date,input))-(days-this.getDay(date,input))+1);
					var m = this.numberToString(this.getMonth(date,input)-1);
					var y= this.getYear(date,input);
					switch(output){
						case 'dd/mm/yyyy':
							return d+'/'+m+'/'+y;
						break;
						case 'dd-mm-yyyy':
							return d+'-'+m+'-'+y;
						break;
						case 'yyyy/mm/dd':
							return y+'/'+m+'/'+d;
						break;
						case 'yyyy-mm-dd':
							return y+'-'+m+'-'+d;
						break;
					}
				}
			}
			else{
				if(this.getDay(date,input)>days){
					var d = this.numberToString(this.getDay(date,input)-days);
					var m = this.numberToString(this.getMonth(date,input));
					var y = this.getYear(date,input);
					switch(output){
						case 'dd/mm/yyyy':
							return d+'/'+m+'/'+y;
						break;
						case 'dd-mm-yyyy':
							return d+'-'+m+'-'+y;
						break;
						case 'yyyy/mm/dd':
							return y+'/'+m+'/'+d;
						break;
						case 'yyyy-mm-dd':
							return y+'-'+m+'-'+d;
						break;
					}
				}
				else{
					var d = this.numberToString(this.daysInMonth(12,this.getYear(date,input)-1)-(days-this.getDay(date,input))+1);
					var m= 12;
					var y = this.getYear(date,input)-1;
					switch(output){
						case 'dd/mm/yyyy':
							return d+'/'+m+'/'+y;
						break;
						case 'dd-mm-yyyy':
							return d+'-'+m+'-'+y;
						break;
						case 'yyyy/mm/dd':
							return y+'/'+m+'/'+d;
						break;
						case 'yyyy-mm-dd':
							return y+'-'+m+'-'+d;
						break;
					}
				}
			}
		}
		/*get Month of string*/
		,getMonth: function(date,input){
			switch(input){
				case 'y':
				return parseInt(date.substring(5,7));
				break;
				case 'd':
				return parseInt(date.substring(3,5));
				break;
			}
		}
		/*get Year of string*/
		,getYear: function(date,input){
			switch(input){
				case 'y':
				return parseInt(date.substring(0,4));
				break;
				case 'd':
				return parseInt(date.substring(6,10));
				break;
			}
		}
		/* get Day of string*/
		,getDay:function(date,input){
			switch(input){
				case 'y':
				return parseInt(date.substring(8,10));
				break;
				case 'd':
				return parseInt(date.substring(0,2));
				break;
			}
		}
		/*convert number to string with 2 words*/
		,numberToString:function(num){
			if(num<10){return '0'+num;}
			else{return ''+num+'';}
		}
		/*check weekend*/
		,checkWeekend: function(date,input){
			var d = new Date();
			d.setFullYear(this.getYear(date,input));
			d.setMonth(this.getMonth(date,input)-1);
			d.setDate(this.getDay(date,input));
			if (d.getDay()==0|| d.getDay()==6){
				return true;
			}
			else{
				return false;
			}

		}
		/*count Days offset Weekends in a time*/
		,countDaysOutWeekends: function(date1,date2,m,y){
			var result=0;
			var weekends=0;
			/*full*/
			if((this.getYear(date2,'y')>y&&this.getYear(date1,'y')==y&&this.getMonth(date1,'y')<m)||
			   (this.getYear(date2,'y')>y&&this.getYear(date1,'y')<y)||
			  (this.getYear(date2,'y')==y&&this.getYear(date1,'y')==y&&this.getMonth(date2,'y')>m&&this.getMonth(date1,'y')<m)||
			  (this.getYear(date2,'y')==y&&this.getYear(date1,'y')<y&&this.getMonth(date2,'y')>m)
			){
				console.log('dang Full');
				for(var i = 1;i<=this.daysInMonth(m,y);i++){
						if(this.checkWeekend(this.getYear(date1,'y')+'-'+this.numberToString(m)+'-'+this.numberToString(i),'y')){
							weekends++;
						}
					}
					result+= this.daysInMonth(m,y)  -weekends;
			}
			/*d1-30*/
			if((this.getYear(date2,'y')>y&&this.getYear(date1,'y')==y&&this.getMonth(date1,'y')==m)||
			   (this.getYear(date2,'y')==y&&this.getYear(date1,'y')==y&&this.getMonth(date2,'y')>m&&this.getMonth(date1,'y')==m)
			){
				console.log('dang d1-30');
				for(var i = this.getDay(date1,'y');i<=this.daysInMonth(m,y);i++){
						if(this.checkWeekend(this.getYear(date1,'y')+'-'+this.numberToString(m)+'-'+this.numberToString(i),'y')){
							weekends++;
						}
					}
					result+= this.daysInMonth(m,y) - this.getDay(date1,'y')+ -weekends;
			}
			/*d1-d2*/
			if(this.getYear(date2,'y')==y&&this.getYear(date1,'y')==y&&this.getMonth(date2,'y')==m&&this.getMonth(date1,'y')==m){
				console.log('dang d1-d2');
				for(var i = this.getDay(date1,'y');i<=this.getDay(date2,'y');i++){
						if(this.checkWeekend(y+'-'+this.numberToString(m)+'-'+this.numberToString(i),'y')){
							weekends++;
						}
					}
					result += this.getDay(date2,'y')-this.getDay(date1,'y')+1 -weekends;
			}
			/*1-d2*/
			if((this.getYear(date2,'y')==y&&this.getYear(date1,'y')==y&&this.getMonth(date2,'y')==m&&this.getMonth(date1,'y')<m)||
			   (this.getYear(date2,'y')==y&&this.getYear(date1,'y')<y&&this.getMonth(date2,'y')==m)
			){
				console.log('dang 1-d2');
				for(var i = 1;i<=this.getDay(date2,'y');i++){
						if(this.checkWeekend(this.getYear(date1,'y')+'-'+this.numberToString(m)+'-'+this.numberToString(i),'y')){
							weekends++;
						}
					}
					result += this.getDay(date2,'y')-weekends;
			}
			
			return result;
		}
		/*convert full string Time*/
		,convertDateTime: function (stringDate,dif){
			var temp=[];
			temp[0]={
			year: stringDate.substring(0,4),
			month: stringDate.substring(5,7),
			day: stringDate.substring(8,10),
			hour: tqv_changeTimeForm(parseInt(stringDate.substring(11,13))+dif),
			min:stringDate.substring(14,16),
			sec:stringDate.substring(17,19)}
		return temp;
		}
	};
		
	/* Excel Object*/
	this.Excel={
		/* export excel  base on table id*/
		exportExcel: function(id){
				var tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
				tab_text = tab_text + '<head> \
				<meta name="WebPartPageExpansion" content="full" /> \
				<meta name="WebPartPageExpansion" content="full" />	\
				<meta name="WebPartPageExpansion" content="full" /> \
				<meta name="WebPartPageExpansion" content="full" /> \
				<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>';
				tab_text = tab_text + '<x:Name>Test Sheet</x:Name>';
				tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
				tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';
				tab_text = tab_text + "<table border='1px'>";
				tab_text = tab_text + $('#'+id).html();
				tab_text = tab_text + '</table></body></html>';
				var data_type = 'data:application/vnd.ms-excel';
				$('#'+id).attr('href',data_type +', '+encodeURIComponent(tab_text));
				$('#'+id).attr('download','Thongke'+id+'.xls');
		}
	};	
	
	/* Chart Object */
	this.Chart={
			createBar: function(id,labelAr,valueAr,nameChart,color){
		const CHART =document.getElementById(id);
		let  barChart = new Chart(CHART,{
		type:'bar',
		data:{
		labels: labelAr,
		datasets: [{
			label:nameChart,
			backgroundColor: [
                'rgba(220,20,60, 0.2)',
                'rgba(0,0,139, 0.2)',
                'rgba(139,69,19, 0.2)',
				 'rgba(220,20,60, 0.2)',
                'rgba(0,0,139, 0.2)',
                'rgba(139,69,19, 0.2)',
				 'rgba(220,20,60, 0.2)',
                'rgba(0,0,139, 0.2)',
                'rgba(139,69,19, 0.2)',
				 'rgba(220,20,60, 0.2)',
                'rgba(0,0,139, 0.2)',
                'rgba(139,69,19, 0.2)',
				'rgba(220,20,60, 0.2)',
                'rgba(0,0,139, 0.2)',
                'rgba(139,69,19, 0.2)'          
                ],
			borderColor: [
                'rgba(220,20,60,1)',
                'rgba(0,0,139, 1)',
                'rgba(139,69,19, 1)',
                'rgba(220,20,60,1)',
                'rgba(0,0,139, 1)',
                'rgba(139,69,19, 1)',
                'rgba(220,20,60,1)',
                'rgba(0,0,139, 1)',
                'rgba(139,69,19, 1)',
                'rgba(220,20,60,1)',
                'rgba(0,0,139, 1)',
                'rgba(139,69,19, 1)',
                'rgba(220,20,60,1)',
                'rgba(0,0,139, 1)',
                'rgba(139,69,19, 1)'
            ],
			borderWidth: 1, 
			data: valueAr}]
		},
		options: {
        	scales: {
           	 yAxes: [{ticks: {beginAtZero:true}}],
             yAxes: [{ticks: {fontSize: 18}}],
             xAxes: [{ticks: {fontSize: 18}}]	
       	     }
   		 }
		});
		},
		createBar2: function(id,labelAr,valueAr,nameChart,color){
		const CHART =document.getElementById(id);
		let  barChart = new Chart(CHART,{
			type:'bar',
			data:{
			labels: labelAr,
			datasets: [{
				label:nameChart,
				backgroundColor: color,
				borderColor: color,
				borderWidth: 1, 
				data: valueAr}]
			},
			options: {
        		scales: {
           		 yAxes: [{ticks:{beginAtZero:true,fontSize: 30}}],
           		 xAxes: [{ticks: {fontSize: 25,fontStyle:"bold"}}]	
       			 }
     		 }
		});
		console.log(barChart);
		},
		createBar3: function(id,labelAr,valueAr,nameChart,color){
		const ctx =document.getElementById(id).getContext("2d");
		let  barChart = new Chart(ctx,{
			type:'bar',
			data:{
			labels: labelAr,
			datasets: [{
				label:nameChart,
				backgroundColor: color,
				borderColor: color,
				borderWidth: 1, 
				data: valueAr}]
			},
			options: {
        		scales: {
           		 yAxes: [{ticks:{beginAtZero:true,fontSize: 30}}],
           		 xAxes: [{ticks: {fontSize: 22,fontStyle:"bold"}}]	
       			 },
       			animation: {
            duration: 500,
            easing: "easeOutQuart",
            onComplete: function () {
                var ctx = this.chart.ctx;
                ctx.font = Chart.helpers.fontString('50', 'bold', 'Arial');
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';

                this.data.datasets.forEach(function (dataset) {
                    for (var i = 0; i < dataset.data.length; i++) {
                        var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                            scale_max = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._yScale.maxHeight;
                        ctx.fillStyle = "#f1c140";
                        var y_pos = model.y - 5;
                        if ((scale_max - model.y) / scale_max >= 0.85)
                            y_pos = model.y +50; 
                        ctx.fillText(dataset.data[i], model.x, y_pos);
                    }
                });               
            }
       		}
        }
		});	
		console.log(barChart);		
		}		
	};
	/*Array Object*/
	this.Ar={
		/* Classify Ar*/
		classify2 :function(mang,f){
		var resultAr =[];
			for(var i=0; i<mang.length;i++){
				resultAr[i]=mang[i][f];
			}
			resultAr.sort();
			var temp=[];
			for(var i=0;i<resultAr.length;i++){
				if(i==0){
					temp.push(resultAr[i]);
				}
				else{
					if(temp[temp.length-1]!=resultAr[i]){
						temp.push(resultAr[i]);
					}
				}	
			}
			return temp;
		},
		/* Classify Ar*/
		classify: function(mang,f){
			var resultAr =[];
			for(var i=0; i<mang.length;i++){
				resultAr[i]=mang[i][f];
			}
			return resultAr;
		}

		/* count a field in a Array*/
		,count: function(mang){
				mang.sort();
		var resultAr =[];
		var dem =0;
		var f= mang[0];
		for (var i=0;i<mang.length;i++){
		 if (f==mang[i]){
			 dem++;
			 if(i==(mang.length-1)){
				 resultAr.push({a:f, b:dem});
				  }
		 }
		 else{
			 resultAr.push({a:f, b: dem});
			 f = mang[i];
			 dem=1;
			  if(i==(mang.length-1)){
				 resultAr.push({a:f, b:dem});
			 }
		 }	 
		}
		return resultAr;
		}
		/* count  by Array*/
		,countMul :function(mangLb,mangVal,f){
			var countAr=[];
			for(var i=0;i<mangLb.length;i++){
			count=0;
			for(var j=0;j<mangVal.length;j++){
			if(mangLb[i]==mangVal[j][f]){
				count++;
			}
			}
			countAr.push({a:mangLb[i],b:count});
			}
			return countAr;
		}
		/* sum Array*/
		,sum: function(manglb,mangval,f,sumf){
			var resultAr =[];
			for (var i=0; i<manglb.length;i++){
			var sum=0;
			for (var j=0; j<mangval.length;j++){
				if(manglb[i]==mangval[j][f]){
				sum+=parseInt(mangval[j][sumf]);
			}
		}
			resultAr.push({a: manglb[i],b:sum});
		}
			return resultAr;
		}
		/* list Ar */
		, list: function(mang){
			mang.sort();
			var tempAr=[];
			var f=mang[0]+"a";
			for (var i =0; i<mang.length;i++){
				if(f!=mang[i]){
					tempAr.push(mang[i]);
					f =mang[i];
				}
			}
			return tempAr;
		}
		/* get value by a field*/
		,getValbyF: function(mang,f,val){
			var result;
			for(var i=0;i<mang.length;i++){
				if(mang[i][f]==val){
					result=mang[i];
				}
			}
			return result;
		}
		/*check val in a Ar*/
		,checkElement: function(val,Ar){
			var result = false;
			for(var i=0;i<Ar.length;i++){
				if(Ar[i]==val){
					result = true;
				}
			}
			return result;
		}
	};
	
	this.Item={
		load:function(id,strQ){
			console.log(_spPageContextInfo.webAbsoluteUrl+ "/_api/lists(guid'"+id+"')/Items"+strQ);
			 var strUrl =_spPageContextInfo.webAbsoluteUrl+ "/_api/lists(guid'"+id+"')/Items"+strQ;
			 var kq=[];
			 console.log(strUrl);
			$.ajax({
			url: strUrl,
			type: "GET",
			async:false,
			headers:{ "accept":"application/json; odata=verbose"},
			success: function(data){
			kq=  data.d.results;},
			error:function(response){console.log('Khong the load do: '+response.responseText);}
			});
			return kq;
		},
		loadNext:function(id,strQ){
		
			 var strUrl =strQ;
			 var kq=[];
			 console.log(strUrl);
			$.ajax({
			url: strUrl,
			type: "GET",
			async:false,
			headers:{ "accept":"application/json; odata=verbose"},
			success: function(data){
			kq=  data;},
			error:function(response){console.log('Khong the load do: '+response.responseText);}
			});
			return kq;
		},

		loadOri:function(id,strQ){
		
			 var strUrl =_spPageContextInfo.webAbsoluteUrl+ "/_api/lists(guid'"+id+"')/Items"+strQ;
			 var kq=[];
			 console.log(strUrl);
			$.ajax({
			url: strUrl,
			type: "GET",
			async:false,
			headers:{ "accept":"application/json; odata=verbose"},
			success: function(data){
			kq=  data;},
			error:function(response){console.log('Khong the load do: '+response.responseText);}
			});
			return kq;
		},

			loadByTitle:function(name,strQ){
		
			 var strUrl =_spPageContextInfo.webAbsoluteUrl+ "/_api/lists/getbyTitle('"+name+"')/Items"+strQ;
			 var kq=[];
			 console.log(strUrl);
			$.ajax({
			url: strUrl,
			type: "GET",
			async:false,
			headers:{ "accept":"application/json; odata=verbose"},
			success: function(data){
			kq=  data.d.results;},
			error:function(response){console.log('Khong the load do: '+response.responseText);}
			});
			return kq;
		},
			getLink: function (input, embed) {
				var extensionFile =input.substring(input.length-3,input.length);
				if (extensionFile.toLowerCase() == 'pdf' || extensionFile.toLowerCase() == 'jpg' || extensionFile.toLowerCase() == "png" || extensionFile.toLowerCase() == "gif" || extensionFile.toLowerCase() == "png" || extensionFile.toLowerCase() == "rar") {
					window.open(_spPageContextInfo.webAbsoluteUrl+input);
					return;
				}
				if (extensionFile.toLowerCase() == 'ocx' || extensionFile.toLowerCase() == 'doc') {
					window.open(embed);
					return;
				}
				if (extensionFile.toLowerCase() == 'xls' || extensionFile.toLowerCase() == 'xla' || extensionFile.toLowerCase() == 'lsx') {
					var temp = input.substr(1,input.length);
					console.log(embed+'&file='+temp.substring(temp.indexOf('/')+1,temp.length));
					console.log(embed);
					window.open(embed+'&file='+temp.substring(temp.indexOf('/')+1,temp.length));
					return;
				}
			}
		};
	this.List={
		createLib:function(name){
			var clientContext = new SP.ClientContext.get_current();
        var oWebsite = clientContext.get_web();

        var listCreationInfo = new SP.ListCreationInformation();
        listCreationInfo.set_title(name); // list name
        listCreationInfo.set_description('description'); // list description
        listCreationInfo.set_templateType(SP.ListTemplateType.documentLibrary); //list type

        oWebsite.get_lists().add(listCreationInfo);

        clientContext.executeQueryAsync(
           function(){
           		console.log('Đã tạo thành công Lib');
           },
           function(sender,args){
           		console.log('Tạo lib thất bại vì:'+args.get_message());
           });

		},
		createList:function(name){
			var clientContext = new SP.ClientContext.get_current();
        var oWebsite = clientContext.get_web();

        var listCreationInfo = new SP.ListCreationInformation();
        listCreationInfo.set_title(name); // list name
        listCreationInfo.set_description('description'); // list description
        listCreationInfo.set_templateType(SP.ListTemplateType.genericList); //list type

        oWebsite.get_lists().add(listCreationInfo);

        clientContext.executeQueryAsync(
           function(){
           		console.log('Đã tạo thành công List');
           },
           function(sender,args){
           		console.log('Tạo list thất bại vì:'+args.get_message());
           });

		},
		createLink:function(name){
			var clientContext = new SP.ClientContext.get_current();
        var oWebsite = clientContext.get_web();

        var listCreationInfo = new SP.ListCreationInformation();
        listCreationInfo.set_title(name); // list name
        listCreationInfo.set_description('description'); // list description
        listCreationInfo.set_templateType(SP.ListTemplateType.links); //list type

        oWebsite.get_lists().add(listCreationInfo);

        clientContext.executeQueryAsync(
           function(){
           		console.log('Đã tạo thành công Lib');
           },
           function(sender,args){
           		console.log('Tạo lib thất bại vì:'+args.get_message());
           });

		},
		createAnnounce:function(name){
			var clientContext = new SP.ClientContext.get_current();
        var oWebsite = clientContext.get_web();

        var listCreationInfo = new SP.ListCreationInformation();
        listCreationInfo.set_title(name); // list name
        listCreationInfo.set_description('description'); // list description
        listCreationInfo.set_templateType(SP.ListTemplateType.Announcements); //list type

        oWebsite.get_lists().add(listCreationInfo);

        clientContext.executeQueryAsync(
           function(){
           		console.log('Đã tạo thành công Lib');
           },
           function(sender,args){
           		console.log('Tạo lib thất bại vì:'+args.get_message());
           });

		}
	}	
}