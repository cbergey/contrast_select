function sendDataToServer(data) {
    // Get the jsPsych data in CSV format
    // const csvData = jsPsych.data.get().csv();

    // Send the data to the server
    fetch('http://147.182.195.234:3000/data', {
        // fetch('http://localhost:3000/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.text())
        .then(data => {
            alert('data stored successfully')
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occur when store data, data will be downloaded as json locally')
            // Handle the fetch error, then download JSON locally as a fallback

            // Example JSON data to download locally
            const jsonString = JSON.stringify(data);

            // Create a Blob from the JSON string
            const blob = new Blob([jsonString], { type: "application/json" });

            // Create an object URL from the Blob
            const url = URL.createObjectURL(blob);

            // Create a link element
            const link = document.createElement('a');
            link.href = url;
            link.download = 'data.json'; // Filename for the downloaded file

            // Append the link to the document body
            document.body.appendChild(link);

            // Programmatically click the link to trigger the download
            link.click();

            // Remove the link from the document body
            document.body.removeChild(link);

            // Revoke the object URL to free up memory
            URL.revokeObjectURL(url);
        });
}

const jsPsych = initJsPsych({
    // on_finish: function () {
    //     // jsPsych.data.displayData('json');

    //     const response_text = ['few', 'some', 'most', 'almost all']

    //     const kid_info = jsPsych.data.get().filter({ label: 'info' })["trials"][0].response

    //     const p_banana = jsPsych.data.get().filter({ label: 'p_banana' })["trials"][0].response
    //     const p_cookie = jsPsych.data.get().filter({ label: 'p_cookie' })["trials"][0].response

    //     const data = jsPsych.data.get().filter({ label: 'trial' })["trials"]

    //     const data_clean = []
    //     let currentDate = new Date();

    //     // Get date and time
    //     let year = currentDate.getFullYear();
    //     let month = currentDate.getMonth() + 1;
    //     let day = currentDate.getDate();
    //     let hours = currentDate.getHours();
    //     let minutes = currentDate.getMinutes();
    //     let seconds = currentDate.getSeconds();

    //     let curr_date = `${year}-${month}-${day}`;
    //     let curr_time = `${hours}:${minutes}:${seconds}`;

    //     data_clean.push({
    //         ID: kid_info.ID,
    //         Age: kid_info.Age,
    //         object_name: 'banana',
    //         object_number: 'na',
    //         trial_type: 'practice',
    //         response_index: p_banana,
    //         response_text: response_text[p_banana],
    //         attr_category: 'na',
    //         attr_name: 'na',
    //         date: curr_date,
    //         time: curr_time
    //     })

    //     data_clean.push({
    //         ID: kid_info.ID,
    //         Age: kid_info.Age,
    //         object_name: 'cookie',
    //         object_number: 'na',
    //         trial_type: 'practice',
    //         response_index: p_cookie,
    //         response_text: response_text[p_cookie],
    //         attr_category: 'na',
    //         attr_name: 'na',
    //         date: curr_date,
    //         time: curr_time
    //     })

    //     data.map((m) => {
    //         let tmp_obj = {}
    //         tmp_obj.ID = kid_info.ID,
    //         tmp_obj.Age = kid_info.Age,
    //         tmp_obj.object_name = m.object_name,
    //         tmp_obj.object_number = m.object_number
    //         tmp_obj.attr_category = m.attr_category
    //         tmp_obj.attr_name = m.attr_name
    //         tmp_obj.trial_type = m.adj_n
    //         tmp_obj.response_index = m.response
    //         tmp_obj.response_text = response_text[m.response]
    //         tmp_obj.date = curr_date
    //         tmp_obj.time = curr_time

    //         data_clean.push(tmp_obj)
    //     })

    //     console.log(data_clean)

    //     console.log(data)
    //     sendDataToServer(data_clean)
    // },
});

const timeline = [];

const info = {
    type: jsPsychSurveyText,
    preamble: "Enter relevant information below:",
    questions: [
        { prompt: "Subject ID:", name: "ID", required: true },
        { prompt: "Subject Age:", name: "Age", required: true },
    ],
    button_label: ["Begin"],
    data: {
        label: 'info'
    }
};

const intro = {
    type: jsPsychAudioButtonResponse,
    stimulus: 'audio/intro.m4a',
    prompt:
        `<p>In this game, you'll learn about some things from an alien planet.` +
        ` But first, let's practice thinking about some things from planet Earth. Are you ready? Press the green button to begin.</p>`,
    choices: ["Next"],
    button_html: '<button style="background-color: green; color: white; border: none; font-size: 20px; padding: 15px 30px; cursor: pointer; border-radius: 10px;">%choice%</button>'
};

const practice_banana = {
    type: jsPsychAudioButtonResponse,
    stimulus: 'audio/banana_prompt.m4a',
    prompt: `<p>Let's think about all of the bananas in the world. How many bananas do you think are yellow?</p>`,
    choices: [
        `<img src = "stim_images/prop_selection/banana_few.PNG" alt = 'banana_few' width="200px" height="200px">`,
        `<img src = "stim_images/prop_selection/banana_some.PNG" alt = 'banana_some' width="200px" height="200px">`,
        `<img src = "stim_images/prop_selection/banana_most.PNG" alt = 'banana_most' width="200px" height="200px">`,
        `<img src = "stim_images/prop_selection/banana_almost_all.PNG" alt = 'banana_almostall' width="200px" height="200px">`,
    ],
    data: {
        label: 'p_banana'
    }
};

const practice_cookie = {
    type: jsPsychAudioButtonResponse,
    stimulus: 'audio/cookie_prompt.m4a',
    prompt: `<p>Let's think about all of the cookies in the world. How many cookies do you think are square?</p>`,
    choices: [
        `<img src = "stim_images/prop_selection/cookie_few.PNG" alt = 'cookie_few' width="200px" height="200px">`,
        `<img src = "stim_images/prop_selection/cookie_some.PNG" alt = 'cookie_some' width="200px" height="200px">`,
        `<img src = "stim_images/prop_selection/cookie_most.PNG" alt = 'cookie_most' width="200px" height="200px">`,
        `<img src = "stim_images/prop_selection/cookie_almost_all.PNG" alt = 'cookie_almostall' width="200px" height="200px">`,
    ],
    data: {
        label: 'p_cookie'
    }
};
const blip_intro = {
    // on_start: function (trail) {
    //     const audio = new Audio("sound/tmp_sound.mp3");
    //     audio.addEventListener("error", function (event) {
    //         console.error("Error loading audio file:", event);
    //     });

    //     audio
    //         .play()
    //         .then(() => {
    //             console.log("Audio is playing");
    //         })
    //         .catch((error) => {
    //             console.error("Error playing audio:", error);
    //         });
    // },
    type: jsPsychAudioButtonResponseIntro,
    stimulus: "audio/blip_prompt.m4a",
    greeting: "audio/greeting.m4a",
    prompt: `<p>In this game, you'll learn about some things from an alien planet.
Blip the alien will show and talk about some things on her planet, and you'll make guesses about what those things are usually like.
Tap on Blip to start learning about what's on Blip's planet.</p>`,
    choices: [`<div class = "blip-intro-grid">
    <div></div>
    <img src="stim_images/alien1.png" class="responsive max-width" alt="Alien Image" >
    <div class="image-container responsive">
        <img src="stim_images/speechbubble.jpg" alt="Speech Bubble" class="responsive">
        <div class="overlay-text" id="overlay-text">
            "Hi, I'm Blip!"
        </div>
    </div>
    <div></div>
</div>`],
// button_html: '<button class = "jspsych-btn" style = "border: none"></button>'
};

const other_resources = [] // stores all other resources to preload
const objs = []; // stores img path for all the stimulus
const props = []; // stores img path for all the options
const result = ["few", "some", "most", "almost_all"];

const audioPaths = [
    "audio/wug.m4a",
    "audio/banana_prompt.m4a",
    "audio/blicket 2.m4a",
    "audio/blicket_blue_prompt.m4a",
    "audio/blicket_red_prompt.m4a",
    "audio/blicket_spotted_prompt.m4a",
    "audio/blicket_striped_prompt.m4a",
    "audio/blicket_tall_prompt.m4a",
    "audio/blicket_wide_prompt.m4a",
    "audio/blicket.m4a",
    "audio/blip_prompt.m4a",
    "audio/blue_blicket.m4a",
    "audio/blue_gade.m4a",
    "audio/blue_modi.m4a",
    "audio/blue_sprock.m4a",
    "audio/blue_toma.m4a",
    "audio/blue_wug.m4a",
    "audio/cookie_prompt.m4a",
    "audio/gade_blue_prompt.m4a",
    "audio/gade_red_prompt.m4a",
    "audio/gade_spotted_prompt.m4a",
    "audio/gade_striped_prompt.m4a",
    "audio/gade_tall_prompt.m4a",
    "audio/gade_wide_prompt.m4a",
    "audio/gade.m4a",
    "audio/greeting.m4a",
    "audio/intro.m4a",
    "audio/modi_blue_prompt.m4a",
    "audio/modi_red_prompt.m4a",
    "audio/modi_spotted_prompt.m4a",
    "audio/modi_striped_prompt.m4a",
    "audio/modi_tall_prompt.m4a",
    "audio/modi_wide_prompt.m4a",
    "audio/modi.m4a",
    "audio/red_blicket.m4a",
    "audio/red_gade.m4a",
    "audio/red_modi.m4a",
    "audio/red_sprock.m4a",
    "audio/red_toma.m4a",
    "audio/red_wug.m4a",
    "audio/see1.m4a",
    "audio/see2.m4a",
    "audio/spotted_blicket.m4a",
    "audio/spotted_gade.m4a",
    "audio/spotted_modi.m4a",
    "audio/spotted_sprock.m4a",
    "audio/spotted_toma.m4a",
    "audio/spotted_wug.m4a",
    "audio/sprock_blue_prompt.m4a",
    "audio/sprock_red_prompt.m4a",
    "audio/sprock_spotted_prompt.m4a",
    "audio/sprock_striped_prompt.m4a",
    "audio/sprock_tall_prompt.m4a",
    "audio/sprock_wide_prompt.m4a",
    "audio/sprock.m4a",
    "audio/striped_blicket.m4a",
    "audio/striped_gade.m4a",
    "audio/striped_modi.m4a",
    "audio/striped_sprock.m4a",
    "audio/striped_toma.m4a",
    "audio/striped_wug.m4a",
    "audio/tall_blicket.m4a",
    "audio/tall_gade.m4a",
    "audio/tall_modi.m4a",
    "audio/tall_sprock.m4a",
    "audio/tall_toma.m4a",
    "audio/tall_wug.m4a",
    "audio/toma_blue_prompt.m4a",
    "audio/toma_red_prompt.m4a",
    "audio/toma_spotted_prompt.m4a",
    "audio/toma_striped_prompt.m4a",
    "audio/toma_tall_prompt.m4a",
    "audio/toma_wide_prompt.m4a",
    "audio/toma.m4a",
    "audio/wide_blicket.m4a",
    "audio/wide_gade.m4a",
    "audio/wide_modi.m4a",
    "audio/wide_sprock.m4a",
    "audio/wide_toma.m4a",
    "audio/wide_wug.m4a",
    "audio/wug_blue_prompt.m4a",
    "audio/wug_red_prompt.m4a",
    "audio/wug_spotted_prompt.m4a",
    "audio/wug_striped_prompt.m4a",
    "audio/wug_tall_prompt.m4a",
    "audio/wug_wide_prompt.m4a"
];

const attr = [
    { name: "blue", category: "color", index: 0 },
    { name: "red", category: "color", index: 1 },
    { name: "spotted", category: "pattern", index: 2 },
    { name: "striped", category: "pattern", index: 3 },
    { name: "tall", category: "body", index: 4 },
    { name: "wide", category: "body", index: 5 },
];
const obj_names = ["gade", "wug", "sprock", "modi", "toma", "blicket"];
for (let i = 1; i <= 6; i++) {
    let path = `stim_images/objects/object${i}`;
    let prop_path = `stim_images/prop_selection/object${i}`;
    let obj = [
        [`${path}_not_blue.PNG`, `${path}_blue.PNG`],
        [`${path}_not_red.PNG`, `${path}_red.PNG`],
        [`${path}_not_spotted.PNG`, `${path}_spotted.PNG`],
        [`${path}_not_striped.PNG`, `${path}_striped.PNG`],
        [`${path}_not_tall.PNG`, `${path}_tall.PNG`],
        [`${path}_not_wide.PNG`, `${path}_wide.PNG`],
    ];
    let prop = [];
    for (let j = 0; j < 6; j++) {
        let tmp_store = [];
        for (let r = 0; r < result.length; r++) {
            tmp_store.push(`${prop_path}_${attr[j].name}_${result[r]}.PNG`);
        }
        prop.push(tmp_store);
    }

    objs.push(obj);
    props.push(prop);
}

other_resources.push(
    [
        'stim_images/alien1.png',
        'stim_images/speechbubble.jpg',
        "stim_images/prop_selection/banana_few.PNG",
        "stim_images/prop_selection/banana_some.PNG",
        "stim_images/prop_selection/banana_most.PNG",
        "stim_images/prop_selection/banana_almost_all.PNG",
        "stim_images/prop_selection/cookie_few.PNG",
        "stim_images/prop_selection/cookie_some.PNG",
        "stim_images/prop_selection/cookie_most.PNG",
        "stim_images/prop_selection/cookie_almost_all.PNG",
    ]
)

console.log(props);

/**
 * Preload an array of images
 * @param {Array} imgs
 * @returns jspsych preload objs
 */
const preload_imgs = (imgs) => {
    return {
        type: jsPsychPreload,
        images: imgs,
        show_detailed_errors: true,
        auto_preload: false,
        message: 'Loading images, please wait...',
        show_progress_bar: true,
    };
};

const preload_audio = (audioFiles) => {
    return {
        type: jsPsychPreload,
        audio: audioFiles,
        show_detailed_errors: true,
        auto_preload: true,
        message: 'Loading audio, please wait...',
        show_progress_bar: true,
    };
};

var finish_screen = {
    type: jsPsychHtmlButtonResponse,
    stimulus: '<p style = "font-size: calc(2vw)">You have finished the game. Thank you for your participation!</p>',
    choices: [], // No response needed
    trial_duration: 5000, // Display for 5 seconds
    on_finish: function () {
        // jsPsych.data.displayData('json');

        const response_text = ['few', 'some', 'most', 'almost all']

        const kid_info = jsPsych.data.get().filter({ label: 'info' })["trials"][0].response

        const p_banana = jsPsych.data.get().filter({ label: 'p_banana' })["trials"][0].response
        const p_cookie = jsPsych.data.get().filter({ label: 'p_cookie' })["trials"][0].response

        const data = jsPsych.data.get().filter({ label: 'trial' })["trials"]

        const data_clean = []
        let currentDate = new Date();

        // Get date and time
        let year = currentDate.getFullYear();
        let month = currentDate.getMonth() + 1;
        let day = currentDate.getDate();
        let hours = currentDate.getHours();
        let minutes = currentDate.getMinutes();
        let seconds = currentDate.getSeconds();

        let curr_date = `${year}-${month}-${day}`;
        let curr_time = `${hours}:${minutes}:${seconds}`;

        data_clean.push({
            ID: kid_info.ID,
            Age: kid_info.Age,
            object_name: 'banana',
            object_number: 'na',
            trial_type: 'practice',
            response_index: p_banana,
            response_text: response_text[p_banana],
            attr_category: 'na',
            attr_name: 'na',
            date: curr_date,
            time: curr_time
        })

        data_clean.push({
            ID: kid_info.ID,
            Age: kid_info.Age,
            object_name: 'cookie',
            object_number: 'na',
            trial_type: 'practice',
            response_index: p_cookie,
            response_text: response_text[p_cookie],
            attr_category: 'na',
            attr_name: 'na',
            date: curr_date,
            time: curr_time
        })

        data.map((m) => {
            let tmp_obj = {}
            tmp_obj.ID = kid_info.ID,
            tmp_obj.Age = kid_info.Age,
            tmp_obj.object_name = m.object_name,
            tmp_obj.object_number = m.object_number
            tmp_obj.attr_category = m.attr_category
            tmp_obj.attr_name = m.attr_name
            tmp_obj.trial_type = m.adj_n
            tmp_obj.response_index = m.response
            tmp_obj.response_text = response_text[m.response]
            tmp_obj.date = curr_date
            tmp_obj.time = curr_time

            data_clean.push(tmp_obj)
        })

        console.log(data_clean)

        console.log(data)
        sendDataToServer(data_clean)
    }
  };

/**
 * Create the selection frame
 * @param {Array} imgs array of each images for selection
 * @param {number} obj_index index of object
 * @param {number} attr_index index of attribute
 * @param {String} trial_type trial type for data storage
 * @returns
 */
const create_select = (imgs, obj_index, attr_index, trial_type) => {
    return {
        type: jsPsychAudioButtonResponse,
        stimulus: `audio/${obj_names[obj_index]}_${attr[attr_index].name}_prompt.m4a`,
        prompt: `<p>Let's think about all of the ${obj_names[obj_index]}s on this planet. How many ${obj_names[obj_index]}s do you think are ${attr[attr_index].name}?</p>`,
        choices: imgs.map((i, index) => {
            return `<img src = "${i}" alt = 'cookie_few responsive' width="200px">`;
        }),
        data: {
            object_name: `${obj_names[obj_index]}`,
            object_number: `${obj_index + 1}`,
            attr_category: `${attr[attr_index].category}`,
            attr_name: `${attr[attr_index].name}`,
            adj_n: `${trial_type}`,
            label: `trial`
        }
    };
};

/**
 * Create the small animation for each trial
 * @param {Array} frames array of objs representing each frame
 * @param {number} attr_1 order of stimulus image shown
 * @param {number} attr_2 order of stimulus image shown
 * @param {number} obj_index index of object
 * @param {number} attr_index index of attribute
 * @param {string} trial_type adj/n trial
 * @returns
 */
const create_muti_image = (
    frames,
    attr_1,
    attr_2,
    obj_index,
    attr_index,
    trial_type
) => {
    var res = {
        timeline: [
            {
                type: jsPsychAudioButtonResponseAnime,
                stimulus: jsPsych.timelineVariable("audio"),
                prompt: function () {
                    var current_frame = jsPsych.timelineVariable("images");
                    let show_image = jsPsych.timelineVariable("show_image");

                    const tran_pass = jsPsych.timelineVariable("tran_pass");
                    const statement_pass = jsPsych.timelineVariable("statement_pass");
                    let transition = `<div class = "grid-container">
                    <img src="stim_images/alien1.png" class="responsive" alt="Alien Image">
                    <div class="image-container responsive fade-in-out">
                        <img src="stim_images/speechbubble.jpg" alt="Speech Bubble" class="responsive">
                        <div class="overlay-text" id="overlay-text">
                            ${tran_pass
                            ? "Let's see what else I have"
                            : "Let's see what I have"
                        }
                        </div>
                    </div>
                    <img src="${current_frame[0]
                        }" class="stim fade-in-out" style="visibility: hidden" alt="Current Frame">
                </div>`;
                    let statement = "";
                    if (trial_type === "n") {
                        // noun
                        statement = `<div class = "grid-container">
            <img src="stim_images/alien1.png" class="responsive">
            <div class="image-container responsive fade-in-out">
                <img src="stim_images/speechbubble.jpg" alt="speech" class="responsive">
                <div class="overlay-text" id="overlay-text">${statement_pass
                                ? `It's a ${obj_names[obj_index]}`
                                : `It's a ${obj_names[obj_index]}`
                            }</div>
            </div>
            <img src="${current_frame[0]}" class="stim fade-in-out">
        </div>`;
                    } else {
                        // adj.
                        statement = `<div class = "grid-container">
            <img src="stim_images/alien1.png" class="responsive">
            <div class="image-container responsive fade-in-out">
                <img src="stim_images/speechbubble.jpg" alt="speech" class="responsive">
                <div class="overlay-text" id="overlay-text">${statement_pass
                                ? `It's a ${attr_2 === 0 ? "" : attr[attr_index].name} ${obj_names[obj_index]
                                }`
                                : `It's a ${attr_1 === 0 ? "" : attr[attr_index].name} ${obj_names[obj_index]
                                }`
                            }</div>
            </div>
            <img src="${current_frame[0]}" class="stim fade-in-out">
        </div>`;
                    }

                    if (!show_image) {
                        return transition;
                    }

                    return statement;
                },
                choices: [],
                trial_duration: 3000,
                // on_start: function (trial) {
                //     // console.log('triggered')
                //     const audio = new Audio(jsPsych.timelineVariable("audio"));
                //     audio.addEventListener("error", function (event) {
                //         console.error("Error loading audio file:", event);
                //     });

                //     //   trial.trial_duration = audio.duration * 10000 + 5000;

                //     audio
                //         .play()
                //         .then(() => {
                //             console.log("Audio is playing");
                //         })
                //         .catch((error) => {
                //             console.error("Error playing audio:", error);
                //         });
                // },
            },
        ],
        timeline_variables: frames,
    };
    return res;
};

// timeline.push(preload_data);
timeline.push(preload_imgs(other_resources))
timeline.push(preload_imgs(props))
timeline.push(preload_imgs(objs))
timeline.push(preload_audio(audioPaths))
timeline.push(info)
timeline.push(intro)
timeline.push(practice_banana)
timeline.push(practice_cookie);
timeline.push(blip_intro);

// order of objects
const obj_order = jsPsych.randomization.shuffle([0, 1, 2, 3, 4, 5]);
const attr_order = jsPsych.randomization.shuffle(attr);

// use to store attribute category that already had n/adj trials
let n_trial_set = new Set();
let adj_trial_set = new Set();

let numObj = objs.length - 1;
while (numObj >= 0) {
    // getting the random obj
    let obj_index = Number(obj_order[numObj]);

    let curr_attr = attr_order[numObj];
    // random select attribute
    let attr_index = curr_attr.index; // index of images
    let attr_img = objs[obj_index][attr_index];

    // console.log(attr_img)
    // timeline.push(preload_res(attr_img));

    // assemble animation
    let rand1 = Math.floor(Math.random() * 2);
    let rand2 = 1 - rand1;

    let trial_type = jsPsych.randomization.sampleWithReplacement(
        ["n", "adj"],
        1
    )[0];
    // determine n./adj. trial
    if (trial_type === "n" && n_trial_set.has(curr_attr.category)) {
        trial_type = "adj";
    }

    if (trial_type === "adj" && adj_trial_set.has(curr_attr.category)) {
        trial_type = "n";
    }
    let audio1, audio2
    if (trial_type === "adj") {
        adj_trial_set.add(curr_attr.category);
        audio1 = `${rand1 === 0 ? `audio/${obj_names[obj_index]}.m4a`: `audio/${curr_attr.name}_${obj_names[obj_index]}.m4a`}`
        audio2 = `${rand2 === 0 ? `audio/${obj_names[obj_index]}.m4a`: `audio/${curr_attr.name}_${obj_names[obj_index]}.m4a`}`
    } else {
        n_trial_set.add(curr_attr.category);
        audio1 = `audio/${obj_names[obj_index]}.m4a`
        audio2 = `audio/${obj_names[obj_index]}.m4a`
    }

    let frames = [
        {
            images: [attr_img[rand1]],
            audio: "audio/see1.m4a",
            tran_pass: false,
            statement_pass: false,
            show_image: false,
        },
        {
            images: [attr_img[rand1]],
            audio: audio1,
            tran_pass: false,
            statement_pass: false,
            show_image: true,
        },
        {
            images: [attr_img[rand2]],
            audio: "audio/see2.m4a",
            tran_pass: true,
            statement_pass: false,
            show_image: false,
        },
        {
            images: [attr_img[rand2]],
            audio: audio2,
            tran_pass: false,
            statement_pass: true,
            show_image: true,
        },
    ];

    // logging info about each trial
    console.log(`Trial_${5 - numObj}-------------------`);
    console.log("obj_index: " + obj_index);
    console.log("attr_index: " + attr_index);
    console.log(`Order of img: ${rand1}/${rand2}`);
    console.log(`Category & trial_type: ${curr_attr.category}:${trial_type}`);

    timeline.push(
        create_muti_image(frames, rand1, rand2, obj_index, attr_index, trial_type)
    );
    // timeline.push(preload_res(props[obj_index][attr_index]));
    timeline.push(
        create_select(props[obj_index][attr_index], obj_index, attr_index, trial_type)
    );

    numObj--;
}

timeline.push(finish_screen);

jsPsych.run(timeline);
