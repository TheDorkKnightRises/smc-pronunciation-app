import * as React from "react";
import avatar from "../Assets/AvatarImages/1.png";
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import viseme_id_0 from "../Assets/visemes/viseme_id_0.svg";
import viseme_id_1 from "../Assets/visemes/viseme_id_1.svg";
import viseme_id_2 from "../Assets/visemes/viseme_id_2.svg";
import viseme_id_3 from "../Assets/visemes/viseme_id_3.svg";
import viseme_id_4 from "../Assets/visemes/viseme_id_4.svg";
import viseme_id_5 from "../Assets/visemes/viseme_id_5.svg";
import viseme_id_6 from "../Assets/visemes/viseme_id_6.svg";
import viseme_id_7 from "../Assets/visemes/viseme_id_7.svg";
import viseme_id_8 from "../Assets/visemes/viseme_id_8.svg";
import viseme_id_9 from "../Assets/visemes/viseme_id_9.svg";
import viseme_id_10 from "../Assets/visemes/viseme_id_10.svg";
import viseme_id_11 from "../Assets/visemes/viseme_id_11.svg";
import viseme_id_12 from "../Assets/visemes/viseme_id_12.svg";
import viseme_id_13 from "../Assets/visemes/viseme_id_13.svg";
import viseme_id_14 from "../Assets/visemes/viseme_id_14.svg";
import viseme_id_15 from "../Assets/visemes/viseme_id_15.svg";
import viseme_id_16 from "../Assets/visemes/viseme_id_16.svg";
import viseme_id_17 from "../Assets/visemes/viseme_id_17.svg";
import viseme_id_18 from "../Assets/visemes/viseme_id_18.svg";
import viseme_id_19 from "../Assets/visemes/viseme_id_19.svg";
import viseme_id_20 from "../Assets/visemes/viseme_id_20.svg";
import viseme_id_21 from "../Assets/visemes/viseme_id_21.svg";

import {useState} from "react";

import FemaleSpeakers from "../configs/femaleSpeakers";
import { useParams } from "react-router-dom";

const config = require("../configs/azure_config.json");

var visemes_arr = [];

const Avatar = (props) => {

    const visemeMap = {
        0: viseme_id_0,
        1: viseme_id_1,
        2: viseme_id_2,
        3: viseme_id_3,
        4: viseme_id_4,
        5: viseme_id_5,
        6: viseme_id_6,
        7: viseme_id_7,
        8: viseme_id_8,
        9: viseme_id_9,
        10: viseme_id_10,
        11: viseme_id_11,
        12: viseme_id_12,
        13: viseme_id_13,
        14: viseme_id_14,
        15: viseme_id_15,
        16: viseme_id_16,
        17: viseme_id_17,
        18: viseme_id_18,
        19: viseme_id_19,
        20: viseme_id_20,
        21: viseme_id_21
    }

    // define the states
    const [imageIndex, setImageIndex] = useState(0);
    const [selectedVoice, setSelectedVoice] = useState("en-Us-JennyNeural");
    const [sentence, setSelectedSentence] = useState(useParams()["word"]);
    const [avatarVisible, setAvatarVisible] = useState(false);

    const sentences = [
        sentence,
    ]

    const synthesizeSpeech = () => {
        console.log(sentence)
        const speechConfig = sdk.SpeechConfig.fromSubscription(config.SpeechKey, config.SpeechRegion);
        const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig);

        const ssml = `<speak version='1.0' xml:lang='en-US' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts'> \r\n \
                                <voice name='${selectedVoice}'> \r\n \
                                    <mstts:viseme type='redlips_front'/> \r\n \
                                    ${sentence} \r\n \
                                </voice> \r\n \
                            </speak>`;

        // Subscribes to viseme received event
        speechSynthesizer.visemeReceived = function (s, e) {
            window.console.log("(Viseme), Audio offset: " + e.audioOffset / 10000 + "ms. Viseme ID: " + e.visemeId);

            visemes_arr.push(e);
        }

        //subscribing to the async events
        speechSynthesizer.speakSsmlAsync(
            ssml,
            result => {
                if (result.errorDetails) {
                    console.error(result.errorDetails);
                } else {
                    console.log(JSON.stringify(result));
                    visemes_arr.forEach(e => {
                        var duration = (e.audioOffset) / 10000;
                        setTimeout(() => {
                            setImageIndex(e.visemeId);
                        }, duration);
                    })

                }

                visemes_arr = [];
                speechSynthesizer.close();
            },
            error => {
                console.log(error);
                visemes_arr = [];
                speechSynthesizer.close();
            });
    }

    const handleClick = () => {
        const randomIndex = Math.floor(Math.random() * sentences.length);
        setSelectedSentence(sentences[randomIndex]);
        synthesizeSpeech()

    }
    const handleVoiceChange = (event) => {
        setSelectedVoice(event.target.value);
    }

    function toggleVisiblity() {
        var x = document.getElementById("avatarBlock");
        if (x.style.display === "none") {
            x.style.display = "block";
            setAvatarVisible(true);
        } else {
            x.style.display = "none"
            setAvatarVisible(false);
        }
    }

    return (
        <>
        <div className="flexBox">
            <button className="mdl-button mdl-js-button" onClick={() => {handleClick()}}><i className="material-icons">volume_up</i> Play audio</button>
            <button className="mdl-button mdl-js-button" onClick={() => {toggleVisiblity()}}>
                {avatarVisible ? <span><i className="material-icons">visibility_off</i> Hide lip movement</span> : <span><i className="material-icons">visibility</i> Show lip movement</span>}
            </button>
        </div>
        <div id="avatarBlock" style={{display: 'none'}}>
            <div className="options mdl-textfield mdl-js-textfield getmdl-select">
                <select className="mdl-textfield__input" value={selectedVoice} onChange={handleVoiceChange} id="voices" name="voices">
                    {FemaleSpeakers.map((voice) => <option key={voice.label} value={voice.value}>{voice.label}</option>)}
                </select>
            </div>
            <p><i>Now click on Play Audio button above to see lip movement</i></p>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                width="360"
                height="150"
                fill="none"
                viewBox="100 100 300 160"
                {...props}
            >
                <path fill="url(#avatar_svg__b)" d="M0 0h300v300h-200z"/>
                <defs>
                    <pattern
                        id="avatar_svg__a"
                        width={1}
                        height={1}
                        patternContentUnits="objectBoundingBox"
                    >
                        <use xlinkHref="#avatar_svg__c"/>
                    </pattern>
                    <pattern
                        id="avatar_svg__b"
                        width={1}
                        height={1}
                        patternContentUnits="objectBoundingBox"
                    >
                        <use
                            xlinkHref="#avatar_svg__d"
                            transform="scale(.00175)"
                        />
                    </pattern>
                    <image
                        xlinkHref={avatar}
                        id="avatar_svg__c"
                        width={300}
                        height={120}
                    />
                    <image
                        xlinkHref={visemeMap[imageIndex]}
                        id="avatar_svg__d"
                        width={720}
                        height={600}
                    />
                </defs>
            </svg>
        </div>
        </>
        
    );
}
export default Avatar;
