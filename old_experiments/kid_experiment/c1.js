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

function trackProgress() {
    loadedImages++;
     
    if (loadedImages == num_images) {
    	$("#loadingpage").hide()
        showSlide("prestudy");
    }
}

function preloadImage(url) {
	var img=new Image();
	img.addEventListener("load", trackProgress, true)
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

var checkwords = ["modi", "gade", "toma", "blicket"]

var foilwords = ["almo", "vark", "tibo", "larby"]

var trialtypes = [1,2,3,4,5,6]

var training_trialtypes = [1,2]

//-----------------------------------------------


showSlide("loadingpage")
// PRELOAD all our images
var image;
var imgurl = "";
var values = ["few", "some", "most", "almost_all"]
var num_images = shapes.length * all_features.length * 2 + shapes.length * all_features.length * values.length
var loadedImages = 0;

for (i=0; i < shapes.length; i++) {
	for (j =0; j < all_features.length; j++) {
		imgurl = "stim_images/objects/object" + shapes[i] + "_" + all_features[j] + ".PNG";
		image = preloadImage(imgurl);
		imgurl = "stim_images/objects/object" + shapes[i] + "_not_" + all_features[j] + ".PNG";
		image = preloadImage(imgurl);
		for (k = 0; k < values.length; k++) {
			imgurl = "stim_images/prop_selection/object" + shapes[i] + "_" + all_features[j] + "_" + values[k] + ".PNG";
			image = preloadImage(imgurl);
		}
	}
}



// MAIN EXPERIMENT
var experiment = {

	subid: "",

	counter: 1,

	trialtype: 0,

	typicality: "",

	utterance: "",

	shape: "",

	dimension: "",

	featurefirst: false,

	feature: "",

	word: "",

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

	trialsounds: [],

	allstims: [],

	is_training: true,


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
			$("#stage").fadeOut();
		}, 1000);
		

		setTimeout(function() { turk.submit(experiment, true) }, 1500);
		showSlide("finish");
		document.body.style.background = "black";
	},


	//concatenates all experimental variables into a string which represents one "row" of data in the eventual csv, to live in the server
	processOneRow: function() {
		var dataforRound = experiment.subid; 
		dataforRound += "," + experiment.counter + "," + experiment.trialtype + "," + experiment.typicality;
		dataforRound += "," + experiment.utterance;
		dataforRound += "," + experiment.shape + "," + experiment.dimension + "," + experiment.feature + "," + experiment.word[0] + "," + experiment.featurefirst;
		dataforRound += "," + experiment.date + "," + experiment.timestamp + "," + experiment.rtsearch + "," + experiment.rttest + "," + experiment.subage + "\n";
		//experiment.data.push(dataforRound);	
		$.post("https://callab.uchicago.edu/experiments/contrast_select/kid_experiment/datasave.php", {postresult_string : dataforRound});
	},

	
	

	// MAIN DISPLAY FUNCTION
	next: function(phase) {
		$("#none_button").hide();
		$("#some_button").hide();
		$("#most_button").hide();
		$("#all_button").hide();
		$("#instructions").hide();
		$("#object").hide();
		$("#alien").hide();
		$("#bubble").hide();
		$("#speech").hide();
		$("#testingstage").hide();
		$("#trainingstage").hide();
		$( "#totestbutton" ).attr('disabled', true);
		$( "#totestbutton" ).hide();

		if (experiment.counter > (numtrials)) {
			experiment.end();
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
			$("#blank1").attr("src", "stim_images/emptyimage.jpg");
			$("#blank2").attr("src", "stim_images/emptyimage.jpg");
			$("#blank3").attr("src", "stim_images/emptyimage.jpg");
			$("#blank4").attr("src", "stim_images/emptyimage.jpg");
			$("#alien").attr("src", "stim_images/alien1.png");
			$("#bubble").attr("src", "stim_images/speechbubble.jpg");	
			$("#object").attr("src", "stim_images/emptyimage.jpg");
			$("#object").show();
			

			$("#testingstage").fadeOut(500);
			experiment.word = experiment.words.pop();
			experiment.shape = experiment.shapes.pop();
			experiment.feature = experiment.features[experiment.dimension].pop()
			flip = (Math.floor(Math.random() * 2) == 0);
			if (flip) {
				experiment.featurefirst = true;
			} else {
				experiment.featurefirst = false;
			}

			

			setTimeout(function() {
				$("#speech").html("<b>Let's see what I have.</b>");
				sound = experiment.trialsounds[experiment.allstims.indexOf("see1")]
				$("#searchstage").fadeIn(500);
				$("#alien").fadeTo(0,1)
				$("#bubble").fadeTo(0,1)
				$("#speech").fadeTo(0,1)
				setTimeout(function() {sound.play();}, 500)
				experiment.starttime = Date.now();
			}, 500);

			setTimeout(function() {
				$("#bubble").fadeTo(100,0)
				$("#speech").fadeTo(100,0)	
			}, 2500);

			setTimeout(function() {
				if (experiment.featurefirst) {
					$("#object").attr("src", "stim_images/objects/object" + experiment.shape + "_" + experiment.feature + ".PNG");
				} else {
					$("#object").attr("src", "stim_images/objects/object" + experiment.shape + "_not_" + experiment.feature + ".PNG");
				}

				if (experiment.utterance == "adj_noun" && experiment.featurefirst == true) {
					$("#speech").html("<b>It's a " + experiment.feature + " " +  experiment.word[0] + ".</b>");
					sound = experiment.trialsounds[experiment.allstims.indexOf(experiment.feature + "_" + experiment.word[0])]
				} else {
					$("#speech").html("<b>It's a " + experiment.word[0] + ".</b>");
					sound = experiment.trialsounds[experiment.allstims.indexOf(experiment.word[0])]
				} 
				setTimeout(function() {sound.play();}, 500)
				$("#speech").fadeTo(0,1)
				$("#bubble").fadeTo(0,1)
				$("#object").fadeTo(0,1)
			}, 3000)

			setTimeout(function() {
				$("#bubble").fadeTo(100,0)
				$("#speech").fadeTo(100,0)
				$("#object").fadeTo(100,0)
			}, 6000);
			
			setTimeout(function() {
				$("#object").attr("src", "stim_images/emptyimage.jpg");
				$("#speech").html("<b>Let's see what else I have.</b>");
				sound = experiment.trialsounds[experiment.allstims.indexOf("see2")]
				$("#speech").fadeTo(0,1)
				$("#bubble").fadeTo(0,1)
				setTimeout(function() {sound.play();}, 500)
			}, 6500);

			setTimeout(function() {
				$("#bubble").fadeTo(100,0)
				$("#speech").fadeTo(100,0)
			}, 8500);

			setTimeout(function() {
				if (experiment.featurefirst == false) {
					$("#object").attr("src", "stim_images/objects/object" + experiment.shape + "_" + experiment.feature + ".PNG");
				} else {
					$("#object").attr("src", "stim_images/objects/object" + experiment.shape + "_not_" + experiment.feature + ".PNG");
				}
				if (experiment.utterance == "adj_noun" && experiment.featurefirst == false) {
					$("#speech").html("<b>It's a " + experiment.feature + " " +  experiment.word[0] + ".</b>");
					sound = experiment.trialsounds[experiment.allstims.indexOf(experiment.feature + "_" + experiment.word[0])]
				} else {
					$("#speech").html("<b>It's a " + experiment.word[0] + ".</b>");
					sound = experiment.trialsounds[experiment.allstims.indexOf(experiment.word[0])]
				} 
				$("#speech").fadeTo(0,1)
				$("#bubble").fadeTo(0,1)
				$("#object").fadeTo(0,1)
				setTimeout(function() {sound.play();}, 500)
			}, 9000)

			setTimeout(function() {
				$("#bubble").fadeTo(100,0)
				$("#speech").fadeTo(100,0)
				$("#object").fadeTo(100,0)
				$("#alien").fadeTo(100,0)

			}, 12000);

			setTimeout(function() {
				$( "#totestbutton" ).show();
				$( "#totestbutton" ).attr('disabled', false);
			}, 12500)
			



		} else if (phase == "test") {
			$("#trainingstage").fadeOut(500);
			$("#trainingstage").hide();
			experiment.rtsearch = Date.now() - experiment.starttime;

			$("#tinstructions").html("Let's think about all of the " + experiment.word[1] + " on this planet. How many " + experiment.word[1] + " do you think are " + experiment.feature + "?");
			$("#tinstructions").show();

			$("#few_button").attr("src", "stim_images/prop_selection/object" + experiment.shape + "_" + experiment.feature + "_few.PNG");
			$("#some_button").attr("src", "stim_images/prop_selection/object" + experiment.shape + "_" + experiment.feature + "_some.PNG");
			$("#most_button").attr("src", "stim_images/prop_selection/object" + experiment.shape + "_" + experiment.feature + "_most.PNG");
			$("#almost_all_button").attr("src", "stim_images/prop_selection/object" + experiment.shape + "_" + experiment.feature + "_almost_all.PNG");

			$("#few_button").show()
			$("#some_button").show()
			$("#most_button").show()
			$("#almost_all_button").show()

			setTimeout(function() {
				$("#testingstage").fadeIn();
			}, 550);

			experiment.starttime = Date.now();
		}

	},

	training_trial: function() {
		$("#prestudy").hide();
		$("#firstInstructions").hide();
		$("#none_button").hide();
		$("#some_button").hide();
		$("#most_button").hide();
		$("#all_button").hide();
		$("#instructions").hide();
		$("#testingstage").hide();

		if (experiment.training_trialtypes.length == 0) {
			experiment.counter = 1
			experiment.is_training = false
			experiment.preStudy()
		} else {
			experiment.trialtype = experiment.training_trialtypes.pop();

			if (experiment.trialtype%2 == 0) {
				experiment.shape = "banana";
				experiment.word = ["banana", "bananas"]
				experiment.dimension = "color"
				experiment.feature = "yellow"
			} else {
				experiment.shape = "cookie";
				experiment.word = ["cookie", "cookies"]
				experiment.dimension = "shape"
				experiment.feature = "square"
			} 
			experiment.utterance = "training"

			$("#tinstructions").html("Let's think about all of the " + experiment.word[1] + " in the world. How many " + experiment.word[1] + " do you think are " + experiment.feature + "?");
			$("#tinstructions").show();

			$("#few_button").attr("src", "stim_images/prop_selection/" + experiment.shape + "_few.PNG");
			$("#some_button").attr("src", "stim_images/prop_selection/" + experiment.shape + "_some.PNG");
			$("#most_button").attr("src", "stim_images/prop_selection/" + experiment.shape + "_most.PNG");
			$("#almost_all_button").attr("src", "stim_images/prop_selection/" + experiment.shape + "_almost_all.PNG");

			$("#few_button").show()
			$("#some_button").show()
			$("#most_button").show()
			$("#almost_all_button").show()

			setTimeout(function() {
				$("#testingstage").fadeIn();
			}, 1000);

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
			if (experiment.is_training == true) {
				experiment.training_trial()
			} else {
				experiment.next("search");
			}
		}, 550);
	},
	
	checkInput: function() {
		//subject ID
  		if (document.getElementById("subjectID").value.length < 1) {
			$("#checkMessage").html('<font color="red">You must input a subject ID</font>');
			return;
		}
  		experiment.subid = document.getElementById("subjectID").value;

		if (document.getElementById("subjectID").value.length < 1) {
			$("#checkMessage").html('<font color="red">You must input a subject age</font>');
			return;
		}
		experiment.subage = parseInt(document.getElementById("age").value);
		experiment.training_trialtypes = shuffle(training_trialtypes);
		showSlide("loadingpage")

		for (i=0; i < words.length; i++) {
			stimsound = new WebAudioAPISound("audio/" + words[i][0]);
			experiment.trialsounds.push(stimsound);
			experiment.allstims.push(words[i][0]);
			for (j=0; j < all_features.length; j++) {
				stimsound = new WebAudioAPISound("audio/" + all_features[j] + "_" + words[i][0]);
				experiment.trialsounds.push(stimsound);
				experiment.allstims.push(all_features[j] + "_" + words[i][0]);
			}	
		}
		stimsound = new WebAudioAPISound("audio/see1");
		experiment.trialsounds.push(stimsound);
		experiment.allstims.push("see1");
		stimsound = new WebAudioAPISound("audio/see2");
		experiment.trialsounds.push(stimsound);
		experiment.allstims.push("see2");
		stimsound = new WebAudioAPISound("audio/greeting");
		experiment.trialsounds.push(stimsound);
		experiment.allstims.push("greeting");
		$("#loadingpage").hide()
		$("#firstInstructions").show()
	},

	start: function() {

		// put column headers in data file
		experiment.data.push("subid, counter, trialtype, typicality, utterance, shape, dimension, feature, word, featurefirst, date, timestamp, rtsearch, rttest, subage");

		// randomize order of trial types
		experiment.trialtypes = shuffle(trialtypes);
		
		experiment.shapes = shuffle(shapes);
		experiment.words = shuffle(words);
		experiment.features["color"] = shuffle(features["color"])
		experiment.features["size"] = shuffle(features["size"])
		experiment.features["pattern"] = shuffle(features["pattern"])

		setTimeout(function() {
			experiment.next("search");
		}, 1000);
	},
}
