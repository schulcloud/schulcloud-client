import {interpolate} from "./templatestringVarInterpolate.js";

const defaultConfig = {
    url: undefined, // variables: inputValue
    extractResultArray: undefined,
    dataParser: undefined,
    livesearchRootSelector: ".livesearch",
    inputSelector: "input",
    resultTemplateSelector: "template.result",
    resultContainerSelector: ".livesearch-result",
};

// confluence live search
export default function init(config){
    // override default config with user settings
    config = Object.assign(defaultConfig, config);

    const livesearchRoot = document.querySelector(config.livesearchRootSelector);
    const input = livesearchRoot.querySelector(config.inputSelector);
    const livesearchResultTemplateString = livesearchRoot.querySelector(config.resultTemplateSelector).innerHTML;
    const livesearchResultContainer = livesearchRoot.querySelector(config.resultContainerSelector);

    input.addEventListener("input", async () => {
        let resultHtml = "";
        if(input.value.length){
            try{
                const response = await fetch(interpolate(config.url, {
                        inputValue: input.value
                    }), {
                        credentials: "same-origin",
                        cache: "no-cache"
                    }).then((response) => {
                        return response.json();
                    });
                const resultArray = config.extractResultArray(response);
                resultArray.forEach((result) => {
                    resultHtml += interpolate(livesearchResultTemplateString, config.dataParser(result));
                });
            }catch(error){
                // TODO: error handling
            }
        }
        livesearchResultContainer.innerHTML = resultHtml;
    });
}