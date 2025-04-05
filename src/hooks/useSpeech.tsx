export const useSpeech = () => {
    const synth = window.speechSynthesis;

    return {
        sayCheckoutRequirement: (number: number) => {
            synth.speak(new SpeechSynthesisUtterance(`you require ${number} `));
        },
    };
};