$(document).ready(function() {
		var elcounter = 12;
		var AA = $("#active");
		var MC = $("#maincontainer");
		var Elements = $(".element");
		var CanvasElements = $(".drag");
		var MediaElements = $(".media");
		tempWidth = $("#maincontainer").width();
		var TempCSS;
		var t1,t2;
		
	$("#clear").click(function(){
			$.ajax({
			url: 'clear.php',
			success: function(data) {
			  
			  console.log('temp css deleted');
			  
		},
		 error: function(){
			console.log("file not found");
			return;
		 }
			
		});
	});	
	
	$("#closebtn").click(function(){
		$("#info").hide();
	});
	
	$("#manual").click(function(){
		$("#info").show();
	});
		
	$("#btn").click(function(){
		parseCSS(MC.width());
	});	
	
	$("#pic").click(function(){
		elcounter++;
	var element = $('<div id="image'+elcounter+'" class="element media drag"><img src="'+$("#pict").val()+'"></div>');
		element.appendTo(MC);
		element.draggable().resizable({ containment: "parent" });
	});	
	
	$("#btnch").click(function(){
		MC.css("background-image", "url("+$("#bgpic").val()+")");
	});	
	
	$("#AAslider").slider({
		  range: "min",
		  step: 1,
		  value: 100,
		  min: 0,
		  max: 100,
		  slide: function( event, ui ) {
			AA.css('opacity', ui.value/100);		
			$("#opacity").html(ui.value);
		}
	});		
	
	$("#border").slider({
		  range: "min",
		  step: 1,
		  value: 0,
		  min: 0,
		  max: 100,
		  slide: function( event, ui ) {
			AA.css('borderRadius', ui.value);		
			$("#border-radius").html(ui.value);
		}
	});		
	
	CanvasElements.resizable({ containment: "parent", disabled: true});	
	
	/*manual resizing*/
	CanvasElements.click(function(){	
		CanvasElements.resizable( "disable" );
		CanvasElements.removeClass('selected');
		$(this).resizable( "enable" );
		$(this).addClass('selected');
		console.log('in')
	})
	

	//CanvasElements.resizable({ containment: "parent" });	
	/***************/	
	function resizeCanvas(width){
		if (width >=700 && width <= 1000){
		MC.width(width);
		offsets();
		}
		else alert("invalid input value [700-1000]");
	}
	
	function collision(t1,t2){
	var retval;
		CanvasElements.each(function() {
			if(overlaps(AA, $(this))){
				console.log("QQ");
				//AA.css({left:t1, top:t2});
				AA.draggable('disable');
						AA.animate({left: t1, top: t2}, { duration: 1000, complete: function(){$(this).draggable("enable"); }});
			//	AA .animate({left: t1, top: t2}, 1000);
           
			}
			else return;
		});
	}
	
	
	function offsets(ow,nw){
		var aascale = AA.position().left * nw / ow;
			AA.css({left: aascale}); 
		CanvasElements.each(function() {
			var top = $(this).position().top;
			var left = $(this).position().left * nw / ow;
			var width = $(this).width();
			var height = $(this).height();
			var id = $(this).attr('id');
			validateOffset($(this));			
			console.log(id+"+"+left)
			checkBoundaries($(this));
			//checkColisions();
			return;

		});
	}
	
	function validateOffset(obj){
		var percent;
		
		if(overlaps(AA, obj)){
			if(AA.position().left < obj.position().left){
			//console.log(AA.position().left*100/MC.width());
			//var uros = AA.position().left*100/MC.width();
			//percent = (obj.position().left - AA.position().left + obj.width())/(AA.width()/obj.width());
			percent = (AA.position().left*100/MC.width() + (AA.width()*100/MC.width()));
			$(obj).css({left: percent+"%"});
		//	console.log("ja sam")
			//validateOffset(obj);
			}
			else
			{
		//	percent = (AA.position().left + AA.width()) /100;
			percent = (AA.position().left - obj.width())/10;
			$(obj).css({left: percent+"%"});
			
			}
		}
		else checkBoundaries(obj); 
	}	

	function checkBoundaries(obj){
		if ((obj.position().left + obj.width()) > MC.width()){
			pom = MC.width() - obj.width();
			$(obj).css({left:pom});
		}
		else if(obj.position().left < 0){
			$(obj).css({left:0});
		}
		else if(AA.position().left < 0){
			$(AA).css({left:0});
		}
		else if ((AA.position().left + AA.width()) > MC.width()){
			pom = MC.width() - AA.width();
			$(AA).css({left:pom});
		}
		else return;
	}
	
	function calibrate(ow, nw){
		console.log(ow+" - "+nw);
		aaleft = AA.position().left * nw / ow;
		AA.css({left:aaleft})
		CanvasElements.each(function() {
				w = $(this).width() * nw / ow;
				var nleft = $(this).position().left * nw / ow;
				$(this).width(w);
				$(this).css({left:nleft});
				return;
		});	
	}
	
	function getCSS(val){
		
		
		$.ajax({
			cache:false,
			url: 'tempcss'+val+'.txt',
			success: function(data) {
			if(data != ''){
			  Elements.each(function() {
				$(this).removeAttr('style');
			  });
			  $('#temp').html(data);
			  }
			//  console.log('Success');
			  
		},
		 error: function(){
			//console.log("file not found");
			return;
		 }
			
		});
	}
	
	function parseCSS(cont){
		
		TempCSS = "";
		MC.width(cont);
		p = cont+100;
		var DataString;

		AAcss = "#"+MC.attr('id')+"{background-image:url("+MC.css*('')+");} #"+AA.attr('id')+"{opacity:"+AA.css('opacity')+"; border-radius:"+AA.css('borderRadius')+";}";
		DataString = "#"+MC.attr('id')+"{width:"+cont+"px;background-image:url("+$("#pict").val()+");} #"+AA.attr('id')+"{opacity:"+AA.css('opacity')+"; border-radius:"+AA.css('borderRadius')+";}";
		Elements.each(function() {
			var top = $(this).position().top;
			var left = $(this).position().left * 100 / cont;
			var width = $(this).width();
			var height = $(this).height();
			var id = $(this).attr('id');
	
		DataString+="#" + id + "{ top:"+ top +"px;  left:" + left +"%; width:"+ width +"px; height:"+ height +"px;}";
		TempCSS += "#" + id + "{ top:"+ top +"px;  left:" + left +"%; width:"+ width +"px; height:"+ height +"px;}";
		$("#AACss").html(AAcss);
		
		});
		
		
		writeCSS(DataString, cont);
		temp(TempCSS, cont);
			
		return;
	}
	
	function writeCSS(DataString,cont){
	
		$.ajax({
			type: "POST",
			url: "parse.php",    
			data: { 'DataString':DataString, 'Cont':cont }, 
			success: function(data){console.log("UPISAN CSS");}
		});
	};
	
 function temp(DataString,cont){
	console.log(DataString);
		$.ajax({
			type: "POST",
			url: "parsetemp.php",    
			data: { 'DataString':DataString, 'Cont':cont }, 
			success: function(data){alert(data);
					getCSS(cont);
			}
		});
	};
 
	/*DIV collision handle*/
	
	var overlaps = (function () {
    function getPositions(elem) {
        var pos, width, height;
        pos = $(elem).position();
        width = $(elem).width();
        height = $(elem).height();
        return [ [ pos.left, pos.left + width ], [ pos.top, pos.top + height ] ];
    }

    function comparePositions(p1, p2) {
        var r1, r2;
        r1 = p1[0] < p2[0] ? p1 : p2;
        r2 = p1[0] < p2[0] ? p2 : p1;
        return r1[1] > r2[0] || r1[0] === r2[0];
    }

    return function (a, b) {
        var pos1 = getPositions(a),
            pos2 = getPositions(b);
        return comparePositions( pos1[0], pos2[0] ) && comparePositions( pos1[1], pos2[1] );
    };
	})();		

		$(".element").draggable({ 
			containment: MC, 
			start: function(){
				t1 = $(this).position().left;
				t2 = $(this).position().top;
				//$("#temp").html("#");
			},
			stop: function (){
				var l = ( 100 * parseFloat($(this).css("left")) / parseFloat($(this).parent().css("width")) )+ "%" ;	
				$(this).css("left" , l);
				if(($(this).attr('id') != 'active')){
					if(overlaps($(this),AA)) {
						console.log("element cannot go below active area");
						$(this).draggable('disable');
						$(this).animate({left: t1, top: t2},  { duration: 1000, complete: function(){$(this).draggable("enable"); }
						//$(this).css({left:t1, top:t2})
						});}
						else {
							
								console.log("kul");	
						}	
				}
				
				else 
					collision(t1, t2);
				
				
				}
			}
		);	
		
		$("#slider").slider({
		  range: "min",
		  step: 100,
		  value: 1000,
		  min: 700,
		  max: 1000,
		  stop: function( event, ui ) {
			$("#resize").val(ui.value + "px");
			calibrate(tempWidth, ui.value);
			
			MC.width(ui.value);
			offsets(tempWidth, ui.value);
		//	checkBoundaries(AA); 
			getCSS(ui.value);
				
				tempWidth = ui.value;		
				
		
		}
	});		
});			