

<script>

$( document ).ready(function() {


  var xhttp = new XMLHttpRequest();


	// Populate the date and opening times info immediately on page load then set a timer to check it every sec
	// to make sure it accurately reflects reality and update if it has just passed midnight
	// Set this to an unrealistic day value (anything more than 0-6) used to detect if a midnight has passed further down
	var DayDateOld=10;
	var locofopeningdata ="https://www111.lamp.le.ac.uk/cors/openingtimes.xml";
	populateOpeningtimes();
	var bleh = setInterval(populateOpeningtimes, 1000);



	// setup a toggle event to make next week appear whereever on the opening times app is clicked
    	$("#openingtime").click(function(){
       	 $("#nextweek").slideToggle("slow");
    	});


	//add the toggle event to the div that appears so a click or touch on it will make it disappear
    	$("#nextweek").click(function(){
       	 $("#nextweek").slideToggle("slow");
    	});




	//create an array to store the html to be sorted & displayed: this is necc as the data comes asyncronously in the wrong date order
	var daysahead= [{ openinghtml: '', value: 0 }];


	// this func searches an XML date file for todays date and the associated opening times
	// it is triggered regularly by a timer to make sure it is always up to date
	function populateOpeningtimes(){

		var numofdaysahead=5;
		var formattedDate = new Date();
		var dayDateNow=formattedDate.getDay();

		// Check to see if  the day has changed which means midnight has passed and  all data needs refreshing
		if (dayDateNow!=DayDateOld){

			var currdate=fixdateformat(formattedDate,0);
	
			// get current opening times and write to screen

	  		xhttp.open("GET", locofopeningdata, true);
  			xhttp.send();

			xhttp.onreadystatechange = function() {
    				if (this.readyState == 4 && this.status == 200) {

					var rowCount=0;
					$(xhttp.responseText).find('ROW').each(function(){

						var $Row = $(this); 
						// search each row in XML for correct date dd/mm/yyyy
						if ($Row.find('shortdate').text().search(currdate)!=-1){
							// populate the info pane on the front page
							$('.longdate').text($Row.find('longdate').text());
							$('.openpreamble').text("Open Today: ");
							$('.opening').text($Row.find('opening').text());
							$('.staffed').text(" (Staffed: "+$Row.find('staffed').text()+")");
							$('.notes').text($Row.find('notes').text());
						}
						rowCount++;
					});

	    		   	}
  			};



			// populate next days report using an array as data comes back jumbled

			for (i = 1; i < numofdaysahead+1; i++) { 
				var formattedDate = new Date();
				var nextdate=fixdateformat(formattedDate,i);
				adddaystolist(nextdate);
			}

			//initially hide the extra day info button
			$("#next7").hide;
			var showdates = setTimeout(topandTail, 500);

		}
		// Assign the most recent numeric value for the day of the week to the Old var  ready for comparison
		// at the top of the loop to see if midnight has occured and the day value has changed
		DayDateOld=dayDateNow;

	}


	 // add each extra day to the screen
	function adddaystolist(datetoadd){
		var tempdata="";
  		var moredays= new XMLHttpRequest();

  		moredays.open("GET", locofopeningdata, true);
  		moredays.send();


		moredays.onreadystatechange = function() {
    		   if (this.readyState == 4 && this.status == 200) {


			var rowCount=0;
       		$(moredays.responseText).find('ROW').each(function(){

				var $Row = $(this); 

				// search each row in XML for correct date dd/mm/yyyy
				if ($Row.find('shortdate').text().search(datetoadd)!=-1){
					// populate the info pane on the front page
	     				tempdata+="<tr>";
					var tempcut=$Row.find('longdate').text();
					tempdata+="<td width='40%' rowcount='"+rowCount+"'>"+tempcut.slice(0,-5)+"</td>";
	     				tempdata+="<td width='32%'>"+$Row.find('opening').text()+"</td>";
	     				tempdata+="<td width='32%'>"+$Row.find('staffed').text()+"</td>";
	     				tempdata+="<td width='0%'>"+$Row.find('notes').text()+"</td>";
	     				tempdata+="</tr>";

					//add each row of data to array for sorting
					var x = [{ openinghtml: tempdata, value: rowCount }];
					daysahead.push.apply(daysahead, x);

				}
				rowCount++;
       		});

    		   }
  		};
	}	   


	// generates a date in the correct format and creates dates with
	// any number of integer date offsets
	function fixdateformat(datetofix,offset){

		// add the passed offset to the date coming in, if not zero
		if(offset>0){
			var offsetdate = new Date(datetofix);
			offsetdate.setDate(offsetdate.getDate() + offset);
			datetofix=offsetdate;
		}
		
		var month = datetofix.getMonth() + 1;
		if(month <= 9)
    			month = '0'+month;

		var day= datetofix.getDate();
		if(day <= 9)
	    		day = '0'+day;

		currdate=day+"/"+ month +"/"+ datetofix.getFullYear();
		return currdate;
	}



	//add the next weeks data to the div
	function topandTail(){

		//add whole table with header line
		$("#nextweek").html('<table id="nextdaystable" width="100%"><tr><th width="44%">Date</th><th width="28%">Open</th><th width="28%">Staffed</th><th width="0%"></th></tr></table>');





		// sort the array of opening times 
		daysahead.sort(function (a, b) {
  		if (a.value > b.value) {
    			return 1;
  		}
  		if (a.value < b.value) {
    			return -1;
  		}
  		// a must be equal to b
  		return 0;
		});


		//push each table row in the sorted array into the table 
		for (i = 0; i < daysahead.length; i++) {
			$('#nextdaystable tr:last').after(daysahead[i]["openinghtml"]);
		}

		// clear the data out of the array so its ready for repopulation on the timer
 		daysahead= [];

		//finally add the down arrow so data can be accessed
		$("#next7").html("&#9660;");



	}
});

</script>
