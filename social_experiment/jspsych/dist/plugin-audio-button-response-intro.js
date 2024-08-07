var jsPsychAudioButtonResponseIntro = (function (jspsych) {
    'use strict';

    const info = {
        name: "audio-button-response",
        parameters: {
            /** The audio to be played. */
            stimulus: {
                type: jspsych.ParameterType.AUDIO,
                pretty_name: "Stimulus",
                default: undefined,
            },
            greeting: {
                type: jspsych.ParameterType.AUDIO,
                pretty_name: "Greeting",
                default: undefined,
            },
            /** Array containing the label(s) for the button(s). */
            choices: {
                type: jspsych.ParameterType.STRING,
                pretty_name: "Choices",
                default: undefined,
                array: true,
            },
            /** The HTML for creating button. Can create own style. Use the "%choice%" string to indicate where the label from the choices parameter should be inserted. */
            button_html: {
                type: jspsych.ParameterType.HTML_STRING,
                pretty_name: "Button HTML",
                default: '<button class="jspsych-btn" style = "border: none">%choice%</button>',
                array: true,
            },
            /** Any content here will be displayed below the stimulus. */
            prompt: {
                type: jspsych.ParameterType.HTML_STRING,
                pretty_name: "Prompt",
                default: null,
            },
            /** The maximum duration to wait for a response. */
            trial_duration: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Trial duration",
                default: null,
            },
            /** Vertical margin of button. */
            margin_vertical: {
                type: jspsych.ParameterType.STRING,
                pretty_name: "Margin vertical",
                default: "0px",
            },
            /** Horizontal margin of button. */
            margin_horizontal: {
                type: jspsych.ParameterType.STRING,
                pretty_name: "Margin horizontal",
                default: "8px",
            },
            /** If true, the trial will end when user makes a response. */
            response_ends_trial: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "Response ends trial",
                default: true,
            },
            /** If true, then the trial will end as soon as the audio file finishes playing. */
            trial_ends_after_audio: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "Trial ends after audio",
                default: false,
            },
            /**
             * If true, then responses are allowed while the audio is playing.
             * If false, then the audio must finish playing before a response is accepted.
             */
            response_allowed_while_playing: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "Response allowed while playing",
                default: false,
            },
            /** The delay of enabling button */
            enable_button_after: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Enable button after",
                default: 0,
            },
        },
    };
    /**
     * **audio-button-response**
     *
     * jsPsych plugin for playing an audio file and getting a button response
     *
     * @author Kristin Diep
     * @see {@link https://www.jspsych.org/plugins/jspsych-audio-button-response/ audio-button-response plugin documentation on jspsych.org}
     */
    class AudioButtonResponsePlugin {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
        }
        trial(display_element, trial, on_load) {
            // hold the .resolve() function from the Promise that ends the trial
            let trial_complete;
            // setup stimulus
            var context = this.jsPsych.pluginAPI.audioContext();
            // store response
            var response = {
                rt: null,
                button: null,
            };
            // record webaudio context start time
            var startTime;
            // load audio file
            this.jsPsych.pluginAPI
                .getAudioBuffer(trial.stimulus)
                .then((buffer) => {
                    if (context !== null) {
                        this.audio = context.createBufferSource();
                        this.audio.buffer = buffer;
                        this.audio.connect(context.destination);
                    }
                    else {
                        this.audio = buffer;
                        this.audio.currentTime = 0;
                    }
                    setupTrial();
                })
                .catch((err) => {
                    console.error(`Failed to load audio file "${trial.stimulus}". Try checking the file path. We recommend using the preload plugin to load audio files.`);
                    console.error(err);
                });
            const setupTrial = () => {
                // set up end event if trial needs it
                if (trial.trial_ends_after_audio) {
                    this.audio.addEventListener("ended", end_trial);
                }
                // enable buttons after audio ends if necessary
                if (!trial.response_allowed_while_playing && !trial.trial_ends_after_audio) {
                    this.audio.addEventListener("ended", enable_buttons);
                }
                var html = ''
                //show prompt if there is one
                if (trial.prompt !== null) {
                    html += trial.prompt;
                }
                //display buttons
                var buttons = [];
                if (Array.isArray(trial.button_html)) {
                    if (trial.button_html.length == trial.choices.length) {
                        buttons = trial.button_html;
                    }
                    else {
                        console.error("Error in audio-button-response plugin. The length of the button_html array does not equal the length of the choices array");
                    }
                }
                else {
                    for (var i = 0; i < trial.choices.length; i++) {
                        buttons.push(trial.button_html);
                    }
                }
                html += '<div id="jspsych-audio-button-response-btngroup">';
                for (var i = 0; i < trial.choices.length; i++) {
                    var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
                    html +=
                        '<div class="jspsych-audio-button-response-button" style="cursor: pointer; display: inline-block; margin:' +
                        trial.margin_vertical +
                        " " +
                        trial.margin_horizontal +
                        '" id="jspsych-audio-button-response-button-' +
                        i +
                        '" data-choice="' +
                        i +
                        '">' +
                        str +
                        "</div>";
                }
                html += "</div>";
                //   //show prompt if there is one
                //   if (trial.prompt !== null) {
                //       html += trial.prompt;
                //   }
                display_element.innerHTML = html;
                if (trial.response_allowed_while_playing) {
                    disable_buttons();
                    enable_buttons();
                }
                else {
                    disable_buttons();
                }
                // start time
                startTime = performance.now();
                // start audio
                if (context !== null) {
                    startTime = context.currentTime;
                    this.audio.start(startTime);
                }
                else {
                    this.audio.play();
                }
                // end trial if time limit is set
                if (trial.trial_duration !== null) {
                    this.jsPsych.pluginAPI.setTimeout(() => {
                        end_trial();
                    }, trial.trial_duration);
                }
                on_load();
            };
            // function to handle responses by the subject
            function after_response(choice) {
                // measure rt
                var endTime = performance.now();
                var rt = Math.round(endTime - startTime);
                if (context !== null) {
                    endTime = context.currentTime;
                    rt = Math.round((endTime - startTime) * 1000);
                }
                response.button = parseInt(choice);
                response.rt = rt;
                // disable all the buttons after a response
                disable_buttons();
                if (trial.response_ends_trial) {
                    end_trial();
                }
            }
            // function to end trial when it is time
            const end_trial = () => {
                // kill any remaining setTimeout handlers
                this.jsPsych.pluginAPI.clearAllTimeouts();
                // stop the audio file if it is playing
                // remove end event listeners if they exist
                if (context !== null) {
                    this.audio.stop();
                }
                else {
                    this.audio.pause();
                }
                this.audio.removeEventListener("ended", end_trial);
                this.audio.removeEventListener("ended", enable_buttons);
                // gather the data to store for the trial
                var trial_data = {
                    rt: response.rt,
                    stimulus: trial.stimulus,
                    response: response.button,
                };
                // clear the display
                display_element.innerHTML = "";
                // move on to the next trial
                this.jsPsych.finishTrial(trial_data);
                trial_complete();
            };
            const enable_buttons_with_delay = (delay) => {
                this.jsPsych.pluginAPI.setTimeout(enable_buttons_without_delay, delay);
            };
            const button_response = (e) => {
                var choice = e.currentTarget.getAttribute("data-choice"); // don't use dataset for jsdom compatibility
                this.jsPsych.pluginAPI
                  .getAudioBuffer(trial.greeting)
                  .then((buffer) => {
                    let audio;
                    let context = this.jsPsych.pluginAPI.audioContext();

                    if (context !== null) {
                      audio = context.createBufferSource();
                      audio.buffer = buffer;
                      audio.connect(context.destination);
                      audio.start(0);
                      audio.onended = () => {
                        after_response(choice); 
                    };
                    } else {
                      audio = new Audio();
                      audio.src = trial.stimulus;
                      audio.currentTime = 0;
                      audio.play();
                      audio.addEventListener('ended', () => {
                        after_response(choice);
                    });
                    }
                    // Store audio in a property or use it directly as needed
                    // this.audio = audio;
                  })
                  .catch((err) => {
                    console.error(
                      `Failed to load audio file "${trial.stimulus}". Try checking the file path. We recommend using the preload plugin to load audio files.`
                    );
                    console.error(err);
                  });
                
        }
        function disable_buttons() {
        var btns = document.querySelectorAll(".jspsych-audio-button-response-button");
        for (var i = 0; i < btns.length; i++) {
            var btn_el = btns[i].querySelector("button");
            if (btn_el) {
                btn_el.disabled = true;
            }
            btn_el.style.backgroundColor = 'white';
            btns[i].removeEventListener("click", button_response);
        }
    }
    function enable_buttons_without_delay() {
        var btns = document.querySelectorAll(".jspsych-audio-button-response-button");
        for (var i = 0; i < btns.length; i++) {
            var btn_el = btns[i].querySelector("button");
            if (btn_el) {
                btn_el.disabled = false;
            }
            btns[i].addEventListener("click", button_response);
        }
    }
    function enable_buttons() {
        if (trial.enable_button_after > 0) {
            enable_buttons_with_delay(trial.enable_button_after);
        }
        else {
            enable_buttons_without_delay();
        }
    }
    return new Promise((resolve) => {
        trial_complete = resolve;
    });
}
      simulate(trial, simulation_mode, simulation_options, load_callback) {
    if (simulation_mode == "data-only") {
        load_callback();
        this.simulate_data_only(trial, simulation_options);
    }
    if (simulation_mode == "visual") {
        this.simulate_visual(trial, simulation_options, load_callback);
    }
}
create_simulation_data(trial, simulation_options) {
    const default_data = {
        stimulus: trial.stimulus,
        rt: this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true) +
            trial.enable_button_after,
        response: this.jsPsych.randomization.randomInt(0, trial.choices.length - 1),
    };
    const data = this.jsPsych.pluginAPI.mergeSimulationData(default_data, simulation_options);
    this.jsPsych.pluginAPI.ensureSimulationDataConsistency(trial, data);
    return data;
}
simulate_data_only(trial, simulation_options) {
    const data = this.create_simulation_data(trial, simulation_options);
    this.jsPsych.finishTrial(data);
}
simulate_visual(trial, simulation_options, load_callback) {
    const data = this.create_simulation_data(trial, simulation_options);
    const display_element = this.jsPsych.getDisplayElement();
    const respond = () => {
        if (data.rt !== null) {
            this.jsPsych.pluginAPI.clickTarget(display_element.querySelector(`div[data-choice="${data.response}"] button`), data.rt);
        }
    };
    this.trial(display_element, trial, () => {
        load_callback();
        if (!trial.response_allowed_while_playing) {
            this.audio.addEventListener("ended", respond);
        }
        else {
            respond();
        }
    });
}
  }
AudioButtonResponsePlugin.info = info;

return AudioButtonResponsePlugin;

}) (jsPsychModule);
