import AlphaChallengeButton from './AlphaChallengeButton.js'
import {getChallengeBonus} from '../savestate.js'
import { spaces } from '../utilities.js'

export const alphaChallengeTable = ["SLOWPROD","SIMPLEONLY","DECREASE","LIMITED","RESETOTHER","NEWONLY","SMALLINV","COMPLEX","COUNTDOWN","SINGLEUSE","ONESHOT","FULLYIDLE", "FORMULAGOD"]

export const alphaChallengeDictionary = {
    "SLOWPROD": {
        id:"SLOWPROD",
        title:"Slowness",
        description:"Production is 100x slower.",
    },
    "SIMPLEONLY": {
        id:"SIMPLEONLY",
        title:"Simplicity",
        description:"Only simple formulas are available.",
    },
    "DECREASE": {
        id:"DECREASE",
        title:"Decay",
        description:"All x values decay at a rate of 10% per second, rounded up.",
    },
    "LIMITED": {
        id:"LIMITED",
        title:"Limited",
        description:"You can do at most 100 formula applications per x-Reset.",
    },
    "RESETOTHER": {
        id:"RESETOTHER",
        title:"Selfish",
        description:"Applying a formula resets all other x values.",
    },
    "NEWONLY": {
        id:"NEWONLY",
        title:"Trendsetter",
        description:"Formulas from previous x-Resets are no longer available.",
    },
    "SMALLINV": {
        id:"SMALLINV",
        title:"Small Backpack",
        description:"You only have 1 equipment slot, but the first formula apply after a reset is free.",
    },
    "COMPLEX": {
        id:"COMPLEX",
        title:"Complexity",
        description:"Simple formulas are not available, except for Basic formulas.",
    },
    "COUNTDOWN": {
        id:"COUNTDOWN",
        title:"Countdown",
        description:"You must do a reset every 30 seconds.",
    },
    "SINGLEUSE": {
        id:"SINGLEUSE",
        title:"Single Use",
        description:"Each formula can only be used one time per reset.",
    },
    "ONESHOT": {
        id:"ONESHOT",
        title:"One-Shot",
        description:"Basic Resets are disabled.",
    },
    "FULLYIDLE": {
        id:"FULLYIDLE",
        title:"Master of Idle",
        description:"You cannot interact with anything on the Formulas tab.",
        requirement: 5,
    },
    "FORMULAGOD": {
        id:"FORMULAGOD",
        title:"Formula God",
        description:"All previous challenges at once.",
        subChallenges:alphaChallengeTable,
        requirement: 10,
    },
}
export default function AlphaChallengeTab({state, updateState, popup}) {
    const exitAlphaChallenge = ()=>{
        popup.confirm(<>Exit current Challenge?</>,()=>{
            updateState({name: "exitChallenge"})
        }, state.settings.exitChallengePopup === "OFF")
    }
    const openChallengeInfo = ()=>{
        popup.alert(<>All challenges have a 30 minute time limit.
            <br/>Formula Offline Progress is disabled during Challenges.
            <br/>Challenges are NOT ordered by difficulty.
            <br/>Each completed segment grants +15% Formula Efficiency.
            <br/>Every fully completed challenge doubles your Formula Efficiency.
            <br/>"Master of Idle" and "Formula God" give additional secret perks.
        </>)
    }

    const challengeBonus = getChallengeBonus(state)

    //allow "Your {challengeBonus.full} challenge completions and {challengeBonus.segment} segment completions" to be
    //grammatically correct no matter the count of completions
    let challengeCompletions = "completions"
    let segmentCompletions = "completions"
    if(challengeBonus.full === 1)  {
        challengeCompletions = "completion"
    }
    if(challengeBonus.segment === 1) {
        segmentCompletions = "completion"
    }

    return (<div style={{marginLeft:"20px"}}>
        <h2>Challenges</h2>
        Challenges are like normal Alpha Runs, but with additional constraints.<br/> You are rewarded for each successful x-Reset and for completing the entire run!<br/>
        {challengeBonus.full === 13 ? <>You completed all challenges, boosting your Formula Efficiency by {challengeBonus.bonus.toFixed(2)}.</>: <>Your {challengeBonus.full} challenge {challengeCompletions} and {challengeBonus.segment} segment {segmentCompletions} boost your Formula Efficiency by {challengeBonus.bonus.toFixed(2)}.</>}
        {state.currentChallenge && <p>You are currently in the "{state.currentChallengeName}" Challenge.</p>}
        <p>
            <button style={{color:"black"}} disabled={!state.insideChallenge} onClick={exitAlphaChallenge}>Exit Challenge</button>
            {spaces()}<button onClick={openChallengeInfo}>About Challenges</button>
        </p>
        {alphaChallengeTable.map((challenge)=>
            <AlphaChallengeButton key={challenge} challenge={alphaChallengeDictionary[challenge]} state={state} updateState={updateState} popup={popup}/>
        )}
    </div>)
}