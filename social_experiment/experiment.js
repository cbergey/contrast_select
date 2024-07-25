function sendDataToServer(data) {
    // Get the jsPsych data in CSV format
    // const csvData = jsPsych.data.get().csv();

    // Send the data to the server
    fetch('http://147.182.195.234:3003/data/social', {
        // fetch('http://localhost:3000/data/social', {
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

const jsPsych = initJsPsych({});
//social_experiment/
const audio_path = '../social_experiment/audio'
const img_path = '../social_experiment/stim_images'

const timeline = [];

const audio_files = [
    "book_adj_boy.m4a",
    "book_adj_girl.m4a",
    "book_no_adj_boy.m4a",
    "book_no_adj_girl.m4a",
    "book_question.m4a",
    "candy_adj_boy.m4a",
    "candy_adj_girl.m4a",
    "candy_no_adj_boy.m4a",
    "candy_no_adj_girl.m4a",
    "candy_question.m4a",
    "final_slide.m4a",
    "hibble_intro.m4a",
    "maze_adj_boy.m4a",
    "maze_adj_girl.m4a",
    "maze_no_adj_boy.m4a",
    "maze_no_adj_girl.m4a",
    "maze_question.m4a",
    "pancake_adj_boy.m4a",
    "pancake_adj_girl.m4a",
    "pancake_no_adj_boy.m4a",
    "pancake_no_adj_girl.m4a",
    "pancake_question.m4a",
    "rock_adj_boy.m4a",
    "rock_adj_girl.m4a",
    "rock_no_adj_boy.m4a",
    "rock_no_adj_girl.m4a",
    "rock_question.m4a",
    "start_button.m4a",
    "toy_adj_boy.m4a",
    "toy_adj_girl.m4a",
    "toy_no_adj_boy.m4a",
    "toy_no_adj_girl.m4a",
    "toy_question.m4a"
  ].map((a) => audio_path + '/' + a)

const img_files = [
    "book_1.png",
    "book_2.png",
    "book_3.png",
    "book_4.png",
    "book_target.png",
    "candy_1.png",
    "candy_2.png",
    "candy_3.png",
    "candy_4.png",
    "candy_target.png",
    "hibble_boy_1.png",
    "hibble_boy_2.png",
    "hibble_boy_3.png",
    "hibble_girl_1.png",
    "hibble_girl_2.png",
    "hibble_girl_3.png",
    "hibble_intro.png",
    "maze_1.png",
    "maze_2.png",
    "maze_3.png",
    "maze_4.png",
    "maze_target.png",
    "pancake_1.png",
    "pancake_2.png",
    "pancake_3.png",
    "pancake_4.png",
    "pancake_target.png",
    "rock_1.png",
    "rock_2.png",
    "rock_3.png",
    "rock_4.png",
    "rock_target.png",
    "toy_1.png",
    "toy_2.png",
    "toy_3.png",
    "toy_4.png",
    "toy_target.png"
  ].map((i) => img_path + '/' + i)  

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
    stimulus: `${audio_path}/start_button.m4a`,
    prompt:'',
    choices: ["START THE GAME!"],
    button_html: '<button style="background-color: green; color: white; border: none; font-size: 20px; padding: 30px 30px; cursor: pointer; border-radius: 10px;">%choice%</button>'
};

const hibble_intro = {
    type: jsPsychAudioButtonResponse,
    stimulus: `${audio_path}/hibble_intro.m4a`,
    prompt: `<p>These are hibbles. They live together in Hibble Valley. Let’s learn about some hibbles!</p>
    <img src = "${img_path}/hibble_intro.png" alt = '${img_path}/hibble_intro.png' width="800vw">`,
    choices: [],
    trial_ends_after_audio: true,
};

const result = ["few", "some", "most", "almost_all"];

const obj_attr = [{
    name: "candy", adj: "kind"
},
{
    name: "rock", adj: "strong"
},
{
    name: "maze", adj: "smart"
},
{
    name: "toy", adj: "helpful"
},
{
    name: "pancake", adj: "hungry"
},
{
    name: "book", adj: "curious"
}];


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
    type: jsPsychAudioButtonResponse,
    stimulus: `${audio_path}/final_slide.m4a`,
    prompt: '<p style = "font-size: calc(2vw)">You finished the game! Thank you so much for playing with us!</p>',
    choices: [], // No response needed
    trial_ends_after_audio: true,
    on_finish: function () {
        // jsPsych.data.displayData('json');

        const response_text = ['few', 'some', 'most', 'almost all']

        const kid_info = jsPsych.data.get().filter({ label: 'info' })["trials"][0].response
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

        data.map((m) => {
            let tmp_obj = {}
            tmp_obj.ID = kid_info.ID,
            tmp_obj.Age = kid_info.Age,
            tmp_obj.object_name = m.object_name,
            tmp_obj.trial_type = m.adj_n,
            tmp_obj.hibble_gender = m.hibble_gender,
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

const create_select = (obj, trial_type, gender) => {
    let prompt = ''
    switch(obj.name) {
        case 'candy':
            prompt = `How many candies do you think most hibbles would share?`
            break;
        case 'rock':
            prompt = `How big of a rock do you think most hibbles could lift?`
            break;
        case 'maze':
            prompt = `How hard of a maze do you think most hibbles could solve?`
            break;
        case 'toy':
            prompt = `How many toys would you think most hibbles would pick up?`
            break;
        case 'pancake':
            prompt = `How many pancakes do you think most hibbles would eat?`
            break;
        case 'book':
            prompt = `How many books would most hibbles would check out?`
            break;
    }
    let selection = []
    for (let i = 1; i <= 4; i ++){
        selection.push(`${obj.name}_${i}.png`)
    }
    return {
        type: jsPsychAudioButtonResponse,
        stimulus: `${audio_path}/${obj.name}_question.m4a`,
        prompt: `<p>${prompt}</p>`,
        choices: selection.map((i, index) => {
            return `<img src = "${img_path}/${i}" alt = '${i}' width="200px">`;
        }),
        data: {
            object_name: `${obj.name}`,
            adj_n: `${trial_type === 'n' ? 'no adj' : 'adj'}`,
            hibble_gender: `${gender === 'He' ? 'male' : 'female'}`,
            label: `trial`
        }
    };
};

const create_hibble_image = (obj, trial_type, gender, hibble_img) => {
    let audio = `${audio_path}/${obj.name}_${trial_type ? 'adj_' : 'no_adj_'}${gender === 'He' ? 'boy' : 'girl'}.m4a`
    let prompt = ''
    switch(obj.name) {
        case 'candy':
            prompt = `Here is a ${trial_type ? obj.adj: ''} hibble. ${gender} shared this many candies with his friend.`
            break;
        case 'rock':
            prompt = `Here is a ${trial_type ? obj.adj: ''} hibble. ${gender} can lift a rock this big.`
            break;
        case 'maze':
            prompt = `Here is a ${trial_type ? obj.adj: ''} hibble. ${gender} can solve this maze.`
            break;
        case 'toy':
            prompt = `Here is a ${trial_type ? obj.adj: ''} hibble. ${gender} picked up this many toys at playtime.`
            break;
        case 'pancake':
            prompt = `Here is a ${trial_type ? obj.adj: ''} hibble. ${gender} ate this many pancakes for breakfast.`
            break;
        case 'book':
            prompt = `Here is a ${trial_type ? obj.adj: ''} hibble. ${gender} checked out this many books from the library.`
            break;
    }
    return {
        type: jsPsychAudioButtonResponse,
        stimulus: audio,
        prompt: `<p>${prompt}</p>
        <div class="grid-container">
            <div></div>
            <img src='${img_path}/${hibble_img}.png' class="responsive" alt="${hibble_img}">
            <img src='${img_path}/${obj.name}_target.png' class="responsive" alt="${obj.name}">
            <div></div>
    </div>`,
        choices: [],
        trial_ends_after_audio: true,
    };
}

// timeline.push(preload_data);
timeline.push(preload_imgs(img_files))
timeline.push(preload_audio(audio_files))
timeline.push(info)
timeline.push(intro)
timeline.push(hibble_intro);

// order of objects
const obj_order = jsPsych.randomization.shuffle([0, 1, 2, 3, 4, 5]);
const boys = jsPsych.randomization.shuffle([1, 2, 3]);
const girls = jsPsych.randomization.shuffle([1, 2, 3]);

// use to store attribute category that already had n/adj trials
let number_adj = 0
let number_n = 0
let number_boy = 0
let number_girl = 0

let numObj = obj_attr.length - 1;
while (numObj >= 0) {
    // getting the random obj
    let obj_index = Number(obj_order[numObj]);
    let obj = obj_attr[obj_index]
    let hibble_img = ''
    let trial_type = jsPsych.randomization.sampleWithReplacement(
        [true, false],
        1
    )[0]; // true adj, false n

    let gender = jsPsych.randomization.sampleWithReplacement(
        ["She", "He"],
        1
    )[0];

    if (trial_type === true){
        if (number_adj < 3){
            number_adj++
        }
        else {
            trial_type = "n"
            number_n++
        }
    } else {
        if (number_n < 3){
            number_n++
        }
        else {
            trial_type = "adj"
            number_adj++
        }
    }

    if (gender === "She"){
        if (number_girl < 3){
            number_girl++
        }
        else {
            gender = "He"
            number_boy++
        }
    } else {
        if (number_boy < 3){
            number_boy++
        }
        else {
            gender = "She"
            number_girl++
        }
    }

    if (gender === 'She'){
        hibble_img = `hibble_girl_${girls[number_girl-1]}`
    } else {
        hibble_img = `hibble_boy_${boys[number_boy-1]}`
    }

    timeline.push(create_hibble_image(obj, trial_type, gender, hibble_img))
    timeline.push(create_select(obj, trial_type, gender))
    numObj--
}

timeline.push(finish_screen);

jsPsych.run(timeline);
