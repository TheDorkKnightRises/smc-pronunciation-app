# Sound and Music computing project

This react project contains the user interface for mispronunciation evaluation.

The backend repo can be found <a href="https://github.com/AnjuGopalkrishnan/pronunciation-evaluation-smc/tree/main">here</a>

## Setup

1. Ensure that you have node 21.0.0 & npm version of 10.2.1
2. Refer to the following documentation for setting up azure TTS sdk:
* <a href = "https://learn.microsoft.com/en-us/azure/ai-services/speech-service/quickstarts/setup-platform?tabs=macos%2Cubuntu%2Cdotnetcli%2Cdotnet%2Cjre%2Cmaven%2Cnodejs%2Cmac%2Cpypi&pivots=programming-language-javascript">Install speech SDK</a>
* <a href = "https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-speech-synthesis?tabs=browserjs%2Cterminal&pivots=programming-language-javascript"> How to synthesize speech </a>
* <a href = "https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-speech-synthesis-viseme?tabs=visemeid&pivots=programming-language-javascript"> Get facial positions with visemes </a>
* Ensure that the ./src/config/azure_config.json key is updated accordingly

## How to run

```
//this installs all the required packages
npm install 

//this starts the react SPA
npm start 
```
