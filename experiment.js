/* ************************************ */
/* Define helper functions */
/* ************************************ */
function assessPerformance() {
	var experiment_data = jsPsych.data.getTrialsOfType('poldrack-categorize')
	var missed_count = 0
	var trial_count = 0
	var correct_count = 0
	var rt_array = []
	var rt = 0
		//record choices participants made
	var choice_counts = {}
	choice_counts[-1] = 0
	for (var k = 0; k < choices.length; k++) {
		choice_counts[choices[k]] = 0
	}
	for (var i = 0; i < experiment_data.length; i++) {
		if (experiment_data[i].possible_responses != 'none') {
			trial_count += 1
			rt = experiment_data[i].rt
			key = experiment_data[i].key_press
			correct = experiment_data[i].correct
			choice_counts[key] += 1
			if(correct) correct_count += 1
			if (rt == -1) {
				missed_count += 1
			} else {
				rt_array.push(rt)
			}
		}
	}
	//calculate average rt
	var avg_rt = -1
	if (rt_array.length !== 0) {
		avg_rt = math.median(rt_array)
	} 
	//calculate whether response distribution is okay
	var responses_ok = true
	Object.keys(choice_counts).forEach(function(key, index) {
		if (choice_counts[key] > trial_count * 0.85) {
			responses_ok = false
		}
	})
	var missed_pct = missed_count/trial_count
	var accuracy = correct_count/trial_count
	var attn_correct_pct = evalAttentionChecks()
	
	credit_var = (missed_pct < 0.4 && avg_rt > 200 && responses_ok && accuracy > 0.6)
	jsPsych.data.addDataToLastTrial({"credit_var": credit_var})
	
	results = {
			missed_pct: missed_pct, 
			accuracy: accuracy, 
			attn_correct_pct: attn_correct_pct, 
			credit_var: credit_var
			};
	
	return(results);
}


function evalAttentionChecks() {
	var check_percent = 1
	if (run_attention_checks) {
		var attention_check_trials = jsPsych.data.getTrialsOfType('attention-check')
		var checks_passed = 0
		for (var i = 0; i < attention_check_trials.length; i++) {
			if (attention_check_trials[i].correct === true) {
				checks_passed += 1
			}
		}
		check_percent = checks_passed / attention_check_trials.length
	}
	return check_percent
}

var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
		'</p></div>'
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = true
var attention_check_thresh = 0.45
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = 0

/*
/* High contrast, color-blind safe colors
/*	RED = #f64747
/*	BLUE = #00bfff
/*	YELLOW = #F1F227
*/

// task specific variables
var congruent_stim = [{
	stimulus: '<div class = centerbox><div class = stroop-stim style = "font-weight:bold;color:#f64747">ROSSO</div></div>',
	data: {
		trial_id: 'stim',
		condition: 'congruent',
		stim_color: 'red',
		stim_word: 'red',
		correct_response: 82
	},
	key_answer: 82
}, {
	stimulus: '<div class = centerbox><div class = stroop-stim style = "font-weight:bold;color:#00bfff">BLU</div></div>',
	data: {
		trial_id: 'stim',
		condition: 'congruent',
		stim_color: 'blue',
		stim_word: 'blue',
		correct_response: 66
	},
	key_answer: 66
},{
	stimulus: '<div class = centerbox><div class = stroop-stim style = "font-weight:bold;color:#F1F227">GIALLO</div></div>',
	data: {
		trial_id: 'stim',
		condition: 'congruent',
		stim_color: 'yellow',
		stim_word: 'yellow',
		correct_response: 89
	},
	key_answer: 89
}];

var incongruent_stim = [{
	stimulus: '<div class = centerbox><div class = stroop-stim style = "font-weight:bold;color:#f64747">BLU</div></div>',
	data: {
		trial_id: 'stim',
		condition: 'incongruent',
		stim_color: 'red',
		stim_word: 'blue',
		correct_response: 82
	},
	key_answer: 82
}, {
	stimulus: '<div class = centerbox><div class = stroop-stim style = "font-weight:bold;color:#f64747">GIALLO</div></div>',
	data: {
		trial_id: 'stim',
		condition: 'incongruent',
		stim_color: 'red',
		stim_word: 'yellow',
		correct_response: 82
	},
	key_answer: 82
}, {
	stimulus: '<div class = centerbox><div class = stroop-stim style = "font-weight:bold;color:#00bfff">ROSSO</div></div>',
	data: {
		trial_id: 'stim',
		condition: 'incongruent',
		stim_color: 'blue',
		stim_word: 'red',
		correct_response: 66
	},
	key_answer: 66
}, {
	stimulus: '<div class = centerbox><div class = stroop-stim style = "font-weight:bold;color:#00bfff">GIALLO</div></div>',
	data: {
		trial_id: 'stim',
		condition: 'incongruent',
		stim_color: 'blue',
		stim_word: 'yellow',
		correct_response: 66
	},
	key_answer: 66
}, {
	stimulus: '<div class = centerbox><div class = stroop-stim style = "font-weight:bold;color:#F1F227">ROSSO</div></div>',
	data: {
		trial_id: 'stim',
		condition: 'incongruent',
		stim_color: 'yellow',
		stim_word: 'red',
		correct_response: 89
	},
	key_answer: 89
}, {
	stimulus: '<div class = centerbox><div class = stroop-stim style = "font-weight:bold;color:#F1F227">BLU</div></div>',
	data: {
		trial_id: 'stim',
		condition: 'incongruent',
		stim_color: 'yellow',
		stim_word: 'blue',
		correct_response: 89
	},
	key_answer: 89
}];
// High proportion congruency: twice as many congruent as incongruent
var stims = [].concat(congruent_stim, congruent_stim, congruent_stim, congruent_stim, incongruent_stim)
var practice_len = 18
var practice_stims = jsPsych.randomization.repeat(stims, practice_len / 18, true)
var exp_len = 72
var test_stims = jsPsych.randomization.repeat(stims, exp_len / 18, true)
var choices = [66, 82, 89]
var exp_stage = 'practice'

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up attention check node
var attention_check_block = {
	type: 'attention-check',
	data: {
		trial_id: "attention_check"
	},
	timing_response: 7500,
	response_ends_trial: true,
	timing_post_trial: 1000
}

var attention_node = {
	timeline: [attention_check_block],
	conditional_function: function() {
		return run_attention_checks
	}
}

/* define static blocks */
var response_keys =
	'<ul class="list-text"><li><span class = "large" style = "color:#f64747;font-weight:bold">WORD</span>: "R key"</li><li><span class = "large" style = "color:#00bfff;font-weight:bold">WORD</span>: "B key"</li><li><span class = "large" style = "color:#F1F227;font-weight:bold">WORD</span>: "Y key"</li></ul>'


var feedback_instruct_text =
	'<div class = centerbox><p class = block-text>Iniziamo il Color Match game! l\' attenzione è importante qui, quindi assicurati di avere <u><strong>cinque minuti</strong></u> liberi per non interrompere!</p> <p class = block-text>Premi <strong>enter</strong> per continuare.</p></div>'
var feedback_instruct_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "instruction"
	},
	cont_key: [13],
	text: getInstructFeedback,
	timing_post_trial: 0,
	timing_response: 180000
};

/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instructions_block = {
	type: 'poldrack-instructions',
	data: {
		trial_id: "instruction"
	},
	pages: [
		'<div class = centerbox style="height:80vh"><p class = block-text>In questo gioco vedrai parole  "colorate"  (ROSSO, BLU, VERDE, GIALLO) apparire una alla volta. l\' "Inchiostro" delle parole sarà colorato. Per esempio, vedrai: <span class = "large" style = "color:#f64747;font-weight:bold">ROSSO</span>, <span class = "large" style = "color:#00bfff;font-weight:bold">BLU</span> or <span class = "large" style = "color:#f64747;font-weight:bold">BLU</span>.</p><p class = block-text>Il tuo compito è premere il tasto corrispondente al<strong><u>font colore</u></strong> della parola. Rispondi il più <u><strong>velocemente e accuratamente</strong></u> possibile. I tasti sono i seguenti:</p>' +
		response_keys + '</div>'
	],
	allow_keys: false,
	show_clickable_nav: true,
	timing_post_trial: 1000
};
var instructions_block2 = {
	type: 'poldrack-instructions',
	data: {
		trial_id: "instruction2"
	},
	pages: [
		'<div class = centerbox style="height:80vh"><p class = block-text>metti gli indici sulla tastiera come ritieni opportuno. Un suggerimento può essere.</p><p><img src="recommended_finger_placement.svg" alt="Recommended finger placement diagram"></p></div>'
	],
	allow_keys: false,
	show_clickable_nav: true,
	timing_post_trial: 1000
};

var instruction_node = {
	timeline: [feedback_instruct_block, instructions_block, instructions_block2],
	/* This function defines stopping criteria */
	loop_function: function(data) {
		for (i = 0; i < data.length; i++) {
			if ((data[i].trial_type == 'poldrack-instructions') && (data[i].rt != -1)) {
				rt = data[i].rt
				sumInstructTime = sumInstructTime + rt
			}
		}
		if (sumInstructTime <= instructTimeThresh * 1000) {
			feedback_instruct_text =
				'Troppo veloce.  Prenditi il tuo tempo e si certo di aver compreso le istruzioni.  Premi <strong>enter</strong> per continuare.'
			return true
		} else if (sumInstructTime > instructTimeThresh * 1000) {
			feedback_instruct_text = 'Done with instructions. Premi <strong>enter</strong> per continuare.'
			return false
		}
	}
}

var end_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "end",
    	exp_id: 'stroop'
	},
	timing_response: 180000,
	text: '<div class = centerbox><p class = center-block-text>Grazie!</p><p class = center-block-text>Premi <strong>enter</strong> per continuare.</p></div>',
	cont_key: [13],
	timing_post_trial: 0,
	on_finish: assessPerformance
};

var start_practice_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "practice_intro"
	},
	timing_response: 180000,
	text: '<div class = centerbox><p class = block-text>Facciamo un pò di prove. Ricorda, premi il tasto corrispondente <strong><u>font color</u></strong> alla parola. </p><p class = block-text></p><p class = block-text>Premi <strong>enter</strong> per iniziare la prova.</p></div>',
	cont_key: [13],
	timing_post_trial: 1000
};

var start_test_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "test_intro"
	},
	timing_response: 180000,
	text: '<div class = centerbox><p class = center-block-text>Grande! Ora che hai fatto un pò di pratica, Iniziamo per davvero!. Ricordati di rispondere il più <u><strong>velocemente e accurato</strong></u> possibile. </p><p class = center-block-text>Premi <strong>enter</strong> per iniziare il test.</p></div>',
	cont_key: [13],
	timing_post_trial: 1000,
	on_finish: function() {
		exp_stage = 'test'
	}
};

var fixation_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
	is_html: true,
	choices: 'none',
	data: {
		trial_id: "fixation"
	},
	timing_post_trial: 500,
	timing_stim: 500,
	timing_response: 500,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({'exp_stage': exp_stage})
	},
}

/* create experiment definition array */
stroop_experiment = []
stroop_experiment.push(instruction_node)
stroop_experiment.push(start_practice_block)
	/* define test trials */
for (i = 0; i < practice_len; i++) {
	stroop_experiment.push(fixation_block)
	var practice_block = {
		type: 'poldrack-categorize',
		practice_trial: i,
		stimulus: practice_stims.stimulus[i],
		data: practice_stims.data[i],
		key_answer: practice_stims.key_answer[i],
		is_html: true,
		correct_text: '<div class = fb_box><div class = center-text><font size = 20>corretto</font></div></div>',
		incorrect_text: '<div class = fb_box><div class = center-text><font size = 20>ERROR!</font></div></div>',
		timeout_message: '<div class = fb_box><div class = center-text><font size = 20>Più VELOCE!</font></div></div>',
		choices: choices,
		timing_response: 1500,
		timing_stim: -1,
		timing_feedback_duration: 500,
		show_stim_with_feedback: true,
		response_ends_trial: true,
		timing_post_trial: 250,
		on_finish: function() {
			jsPsych.data.addDataToLastTrial({
				trial_id: 'stim',
				exp_stage: 'practice'
			})
		}
	}
	stroop_experiment.push(practice_block)
}

stroop_experiment.push(start_test_block)
	/* define test trials */
for (i = 0; i < exp_len; i++) {
	stroop_experiment.push(fixation_block)
	var test_block = {
		type: 'poldrack-categorize',
		stimulus: test_stims.stimulus[i],
		data: test_stims.data[i],
		key_answer: test_stims.key_answer[i],
		is_html: true,
		correct_text: '<div class = fb_box><div class = center-text><font size = 20>corretto</font></div></div>',
		incorrect_text: '<div class = fb_box><div class = center-text><font size = 20>ERROR!</font></div></div>',
		timeout_message: '<div class = fb_box><div class = center-text><font size = 20>Più VELOCE!</font></div></div>',
		choices: choices,
		timing_response: 1500,
		timing_stim: -1,
		timing_feedback_duration: 500,
		show_stim_with_feedback: true,
		response_ends_trial: true,
		timing_post_trial: 250,
		on_finish: function() {
			jsPsych.data.addDataToLastTrial({
				trial_id: 'stim',
				exp_stage: 'test'
			})
		}
	}
	stroop_experiment.push(test_block)
	if(i == exp_len/2) stroop_experiment.push(attention_node)
}
stroop_experiment.push(end_block)