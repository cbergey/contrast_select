// Overview: (i) Parameters (ii) Helper Functions (iii) Control Flow

// ---------------- PARAMETERS ------------------

var numtrials = 6;

// ---------------- HELPER ------------------

// show slide function
function showSlide(id) {
  $(".slide").hide(); //jquery - all elements with class of slide - hide
  $("#"+id).show(); //jquery - element with given id - show
}

//array shuffle function
shuffle = function (o) { //v1.0
	for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
}

getCurrentDate = function() {
	var currentDate = new Date();
	var day = currentDate.getDate();
	var month = currentDate.getMonth() + 1;
	var year = currentDate.getFullYear();
	return (month + "/" + day + "/" + year);
}

getCurrentTime = function() {
	var currentTime = new Date();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();

	if (minutes < 10) minutes = "0" + minutes;
	return (hours + ":" + minutes);
}

function preloadImage(url) {
	var img=new Image();
	img.src=url;
}


// STIMULI AND TRIAL TYPES

var shapes = ["1","2","3","4","5","6"];

var features = {"color": ["red", "blue"], "pattern": ["spotted", "striped"], "size": ["tall", "wide"]};

var all_features = ["red", "blue", "spotted", "striped", "tall", "wide"]

var dimensions = ["color", "size", "pattern"]

var colors = ["red", "blue"]

var patterns = ["spotted", "striped"]

var sizes = ["wide", "tall"]

var words = [["modi","modis"], ["blicket","blickets"], ["wug","wugs"], ["toma", "tomas"], ["gade", "gades"], ["sprock", "sprocks"]];

var checkwords = ["wug", "gade", "toma", "blicket"]

var foilwords = ["almo", "vark", "tibo", "larby"]

var trialtypes = [1,2,3,4,5,6]

//-----------------------------------------------

showSlide("prestudy");

// MAIN EXPERIMENT
var experiment = {

	subid: "",

	counter: 1,

	trialtype: 0,

	typicality: "",

	utterance: "",

	shape: "",

	dimension: "",

	feature: "",

	word: "",

	numclicks: 0,

	date: getCurrentDate(),
		//the date of the experiment
		timestamp: getCurrentTime(),
		//the time that the trial was completed at 

		shapes: [],

		features: {},

		words: [],

		trialtypes: [],

		rttrain: [],

		rtsearch: [],

		rttest: [],

		data: [],

		attnselected: "",

		attncheckscore: 0,


		preStudy: function() {

			document.body.style.background = "white";
			$("#prestudy").hide();
			setTimeout(function () {
				showSlide("secondInstructions")
			}, 100);
		},

		startExperiment: function() {

			document.body.style.background = "white";
			$("#secondInstructions").hide();
			setTimeout(function () {
				experiment.start();
			}, 100);
		},


	//the end of the experiment
	end: function () {
		setTimeout(function () {
			$("#colorcheck").fadeOut();
		}, 100);

		setTimeout(function() { turk.submit(experiment, true) }, 1500);
		showSlide("finish");
		document.body.style.background = "black";
	},



	//concatenates all experimental variables into a string which represents one "row" of data in the eventual csv, to live in the server
	processOneRow: function() {
		var dataforRound = experiment.subid; 
		dataforRound += "," + experiment.counter + "," + experiment.trialtype + "," + experiment.typicality;
		dataforRound += "," + experiment.utterance;
		dataforRound += "," + experiment.shape + "," + experiment.feature + "," + experiment.word[0];
		dataforRound += "," + experiment.date + "," + experiment.timestamp + "," + experiment.rtsearch + "," + experiment.rttest + "," + experiment.attncheckscore + "\n";
		experiment.data.push(dataforRound);	
	},

	attnCheck: function() {
		setTimeout(function () {
			$("#stage").fadeOut();
		}, 100);

		showSlide("attnCheck")
		
	},
	

	// MAIN DISPLAY FUNCTION
	next: function(phase) {
		$("#sliderlabel").hide();
		$("#selector").hide();
		$("#object").hide();
		$("#none_button").hide();
		$("#some_button").hide();
		$("#most_button").hide();
		$("#all_button").hide();
		$("#instructions").hide();
		$("#testingstage").hide();
		$("#trainingstage").hide();

		if (experiment.counter > (numtrials)) {
			experiment.attnCheck();
			return;
		}

		experiment.trialtype = experiment.trialtypes[experiment.counter - 1];

		if (experiment.trialtype%2 == 0) {
			experiment.utterance = "adj_noun";
		} else {
			experiment.utterance = "noun";
		} 

		if (experiment.trialtype == 1 || experiment.trialtype == 2) {
			experiment.dimension = "size";
		} else if (experiment.trialtype == 3 || experiment.trialtype == 4) {
			experiment.dimension = "pattern";
		} else if (experiment.trialtype == 5 || experiment.trialtype == 6) {
			experiment.dimension = "color";
		}

		if (phase == "search") {

			experiment.numclicks = 0;
			

			clickDisabled = true;
			$( "#totestbutton" ).attr('disabled', true);

			experiment.word = experiment.words.pop();
			experiment.shape = experiment.shapes.pop();
			experiment.feature = experiment.features[experiment.dimension].pop()
			
			$("#object").attr("src", "stim-images/objects/object" + experiment.shape + "_" + experiment.feature + ".PNG");

			if (experiment.utterance == "adj_noun") {
				$("#prompt").html("Look at the <b>" + experiment.feature + " " +  experiment.word[0] + "</b>.<br> Click on the <b>" + experiment.feature + " " +  experiment.word[0] + "</b>.");
			} else if (experiment.utterance == "noun") {
				$("#prompt").html("Look at the <b>" + experiment.word[0] + "</b>.<br> Click on the <b>" + experiment.feature + " " +  experiment.word[0] + "</b>.");
			} 
			
			$("#object").show();
			$("#prompt").show()
			$("#totestbutton").show()
			$("#searchstage").fadeIn(250);

			setTimeout(function() {
				clickDisabled = false;
				$( "#totestbutton" ).attr('disabled', false);
			}, 500);

			experiment.starttime = Date.now();



		} else if (phase == "test") {
			$("#object").hide();
			$("#prompt").hide();
			$("#trainingstage").hide();
			$("#totestbutton").hide();
			

			clickDisabled = true;

			$("#tinstructions").html("On this planet, how many <b>" + experiment.word[1] + "</b> do you think are <b>" + experiment.feature + "</b>?");
			$("#tinstructions").show();
	    	//$("#targetimg").attr("src", "stim-images/object" + experiment.shape + "_" + experiment.feature + ".PNG");
	    	//$("#targetimg").show()
	    	$("#none_button").attr("src", "stim-images/prop_selection/object" + experiment.shape + "_none.PNG");
	    	$("#some_button").attr("src", "stim-images/prop_selection/object" + experiment.shape + "_" + experiment.feature + "_some.PNG");
	    	$("#most_button").attr("src", "stim-images/prop_selection/object" + experiment.shape + "_" + experiment.feature + "_most.PNG");
	    	$("#all_button").attr("src", "stim-images/prop_selection/object" + experiment.shape + "_" + experiment.feature + "_all.PNG");

	    	$("#none_button").show()
	    	$("#some_button").show()
	    	$("#most_button").show()
	    	$("#all_button").show()

	    	$("#testingstage").fadeIn();
	    	experiment.starttime = Date.now();
	    }

	},

	handleClick: function(rating) {
		experiment.typicality = rating;
		experiment.rttest = Date.now() - experiment.starttime;
		experiment.timestamp = getCurrentTime()
		experiment.processOneRow();
		experiment.counter++;

		$("#testingstage").fadeOut(500);
		setTimeout(function() {
			experiment.next("search");
		}, 550);
	},

	
	start: function() {

		// put column headers in data file
		experiment.data.push("subid, condition, counter, trialtype, typicality, utterance, shape, dimension, feature, word, date, timestamp, rtsearch, rttest, attncheckscore");

		// randomize order of trial types
		experiment.trialtypes = shuffle(trialtypes);
		experiment.shapes = shuffle(shapes);
		experiment.words = shuffle(words);
		experiment.features["color"] = shuffle(features["color"])
		experiment.features["size"] = shuffle(features["size"])
		experiment.features["pattern"] = shuffle(features["pattern"])

		var imagedict = {};
		var image;
		var imgurl = "";
		var imgname = "";
		var values = ["some", "most", "all"]

		for (i=0; i < experiment.shapes.length; i++) {
			for (j =0; j < all_features.length; j++) {
				imgurl = "stim-images/objects/object" + experiment.shapes[i] + "_" + all_features[j] + ".PNG";
				imgname = "object" + experiment.shapes[i] + "_" + all_features[j];
				image = preloadImage(imgurl);
				imagedict[imgname] = image;
				imgurl = "stim-images/prop_selection/object" + experiment.shapes[i] + "_none.PNG";
				imgname = "object" + experiment.shapes[i] + "_none";
				image = preloadImage(imgurl);
				imagedict[imgname] = image;
				for (k = 0; k < values.length; k++) {
					imgurl = "stim-images/prop_selection/object" + experiment.shapes[i] + "_" + all_features[j] + "_" + values[k] + ".PNG";
					imgname = "object" + experiment.shapes[i] + "_" + all_features[j] + "_" + values[k];
					image = preloadImage(imgurl);
					imagedict[imgname] = image;
				}
			}
		}

		// when we move forward in the trial, get the rt, add a line of data, add to the counter
		$( "#nexttrialbutton" ).click(function() {
			experiment.rttest = Date.now() - experiment.starttime;
			experiment.timestamp = getCurrentTime()
			experiment.processOneRow();
			experiment.counter++;
			$("#testingstage").fadeOut(500);
			setTimeout(function() {
				experiment.next("search");
			}, 550);
			
		});

		$( "#totestbutton" ).click(function() {
			experiment.rtsearch = Date.now() - experiment.starttime;
			$("#trainingstage").fadeOut(500);
			setTimeout(function() {
				experiment.next("test");
			}, 550);
			
		});


		$( "#tosearchbutton" ).click(function() {
			experiment.rttrain = Date.now() - experiment.starttime;
			$("#trainingstage").fadeOut(500);
			setTimeout(function() {
				experiment.next("search");
			}, 550);
			
		});

		$("#slider").slider({
			change: function(event, ui) {
				$("#custom-handle").show();
				clickDisabled = false;
				$( "#nexttrialbutton" ).attr('disabled', false);
			}
		});

		setTimeout(function() {
			experiment.next("search");
		}, 1000);
	},


}
