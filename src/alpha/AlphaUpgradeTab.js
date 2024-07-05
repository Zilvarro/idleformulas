import { spaces, secondsToHms, formatNumber} from '../utilities'
import AlphaUpgradeButton from './AlphaUpgradeButton'

const alphaUpgradeTable = ["SLOT","PALP","SRES","ARES","BR1","AAPP","FREF","SAPP","OAPP","BR2","AUNL","MEEQ","AREM","MEMS"]

export const countAlphaUpgrades=(state)=>{
    return alphaUpgradeTable.filter((x)=>state.alphaUpgrades[x]).length
}

export default function AlphaScreen({state, updateState, popup, setTotalClicks}) {
      
const alphaUpgradeDictionary = {
    "AAPP": {
        id:"AAPP",
        title:"Auto Applier",
        description:"Applies a formula for you twice per second, if beneficial. Rate can be further upgraded.",
        cost:1,
    },
    "FREF": {
        id:"FREF",
        requires: "AAPP",
        title:"Formula Refund",
        description:"Applying formulas does not reduce x.",
        cost:2,
    },
    "SAPP": {
        id:"SAPP",
        requires: "FREF",
        title:"Super Applier",
        description:"Auto Applier can handle multiple formulas simultaneously.",
        cost:4,
    },
    "OAPP": {
        id:"OAPP",
        requires: "SAPP",
        title:"Offline Applier",
        description:"Auto Applier works offline.",
        cost:1000,
    },
    "AUNL": {
        id:"AUNL",
        title:"Auto Unlocker",
        description:"Automatically unlocks formulas. Unlocking formulas does not reduce x.",
        cost:1,
    },
    "MEEQ": {
        id:"MEEQ",
        requires: "AUNL",
        title:"Memorize Equip",
        description:"One Equipment loadout can be saved and loaded for each stage.",
        cost:2,
    },
    "AREM": {
        id:"AREM",
        requires: "MEEQ",
        title:"Auto Rememberer",
        description:"Memorized equipment is automatically loaded when differentials are unlocked.",
        cost:4,
    },
    "MEMS": {
        id:"MEMS",
        requires: "AREM",
        title:"Better Memory",
        description:"Up to three different Equipment loadouts can be saved.",
        cost:10000,
    },
    "SLOT": {
        id:"SLOT",
        title:"Formula Slot",
        description:"Grants an additional formula equipment slot.",
        cost:1,
    },
    "PALP": {
        id:"PALP",
        requires: "SLOT",
        title:"Passive Alpha",
        description:"Gain Alpha Tokens passively in Intervals of the fastest Alpha-Reset (min 1/day). Works offline!",
        cost:2,
    },
    "SRES": {
        id:"SRES",
        requires: "PALP",
        title:"X Resetter",
        description:"Automatically performs x-Resets.",
        cost:4,
    },
    "ARES": {
        id:"ARES",
        requires: "SRES",
        title:"Alpha Resetter",
        description:"Automatically performs Alpha-Resets. Can also complete Challenges.",
        cost:100,
    },
    "BR1": {
        fixed: <br/>
    },
    "BR2": {
        fixed: <br/>
    },
}

const applierRates = [2,5,10, 10]
const applierCosts = [1,3,10, Infinity]
const applierLevel = state.autoApplyLevel
let boughtSomething = false

const upgradeApplierRate = ()=>{
    if (boughtSomething || state.alpha < applierCosts[applierLevel + 1]) return
    boughtSomething = true
    updateState({name:"upgradeApplierRate", level:applierLevel + 1, rate:applierRates[applierLevel + 1], cost:applierCosts[applierLevel + 1] })
}
const baseAlphaMultiplier = Math.pow(2,state.baseAlphaLevel)
const baseAlphaUpgradeCost = Math.pow(5,state.baseAlphaLevel + 1)
const upgradeBaseAlpha = ()=>{
    if (boughtSomething || state.alpha < baseAlphaUpgradeCost) return
    boughtSomething = true
    updateState({name:"upgradeBaseAlpha", level:state.baseAlphaLevel + 1, cost:baseAlphaUpgradeCost })
}

return (
    <div style={{marginLeft:"20px"}}>{<>
        <h2>Alpha Upgrades</h2>
        {alphaUpgradeTable.map((upgrade)=><AlphaUpgradeButton key={upgrade} upgrade={alphaUpgradeDictionary[upgrade]} state={state} popup={popup} updateState={updateState}/>)}
        <br/><br/>
        <h2>Info</h2>
        <p>You have {formatNumber(state.alpha, state.settings.numberFormat,2)} Alpha Token{state.alpha !== 1 && "s"}!</p>
        <p>Time in current Alpha Run: {secondsToHms(state.currentAlphaTime / 1000)}{state.isFullyIdle && <> (Fully Idle)</>}</p>
        {state.bestAlphaTime<1e50 && <p>Fastest Alpha Run: {secondsToHms(state.bestAlphaTime / 1000, true)}</p>}
        {state.clearedChallenges.FULLYIDLE && <>
            <p>Best Fully Idle: {formatNumber(state.bestIdleTimeAlpha, state.settings.numberFormat, 2)}&alpha; in {secondsToHms(state.bestIdleTime  / 1000, true)}</p>
        </>}
        {state.alphaUpgrades.PALP && ((state.passiveAlphaInterval <= 1000) ? <p>Passive Alpha Tokens: {formatNumber(Math.floor(1000 / state.passiveAlphaInterval),state.settings.numberFormat,2)}/s</p> :<p>Next Passive Alpha Token: {secondsToHms(Math.max(0,((state.passiveAlphaInterval - state.passiveAlphaTime) / 1000)))}</p>)}
        {state.alphaUpgrades.AAPP && <p>Auto Applier Rate: {state.autoApplyRate}/s{spaces()}{applierLevel<2 && <button style={{color:"black"}} disabled={state.alpha < applierCosts[applierLevel + 1]} onClick={upgradeApplierRate}>Upgrade for {applierCosts[applierLevel + 1]} &alpha;</button>}</p>}
        <p>Base &alpha;-Reset Tokens: {formatNumber(baseAlphaMultiplier,state.settings.numberFormat,2)}&nbsp;&nbsp;{state.baseAlphaLevel<12 && <button style={{color:"black"}} disabled={state.alpha < baseAlphaUpgradeCost} onClick={upgradeBaseAlpha}>Double for {formatNumber(baseAlphaUpgradeCost,state.settings.numberFormat,2)} &alpha;</button>}</p>
        </>}
    </div>)
}