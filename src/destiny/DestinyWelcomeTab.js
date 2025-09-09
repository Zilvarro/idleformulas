import { getStarLightRate } from "../progresscalculation"
import { formatNumber, logB } from "../utilities"
import { starConstellations, constellationList, constellationPrices} from "./DestinyConstellationDictionary"
import DestinyConstellationButton from "./DestinyConstellationButton"

const starlightDictionary = {
    single: {
        id: "single",
        title: "Gaze at the night sky",
        description: "When everything seems hopeless, a single ray of Starlight may strike your eye",
        currency: "starLight",
        costBase: 0,
        costMultiplier: 1,
        maxAmount: 1e6,
        className: undefined,
        hideAmount: true,
        useDefaultStyle: true,
        resetsForAuto: Infinity,
    },
    adder: {
        id: "adder",
        title: "Astral Glance",
        description: "Each Astral Glance produces one Starlight per Second",
        currency: "lightAdder",
        costBase: 100,
        costMultiplier: 1.15,
        maxAmount: 1000,
        className: "fbutton",
        resetsForAuto: 1,
    },
    doubler: {
        id: "doubler",
        title: "Shooting Star",
        description: "Each Shooting Star doubles Starlight gained from Astral Glances",
        currency: "lightDoubler",
        costBase: 10000,
        costMultiplier: 8,
        maxAmount: 1000,
        className: "fbutton",
        resetsForAuto: 2,
    },
    raiser: {
        id: "raiser",
        title: "Luminous Moon",
        description: "Each Luminous Moon multiplies Starlight gain by the number of Destiny Stars",
        currency: "lightRaiser",
        costBase: 1000000,
        costMultiplier: 1000,
        maxAmount: 1000,
        className: "fbutton",
        resetsForAuto: 3,
    },
}

const getUpgradeLevelByStarlight = (upgrade, starLight)=>{
    if (starLight === Infinity)
        return 1000
//  debugger
    const level =  Math.max(0, 1 + logB(upgrade.costMultiplier, Math.min((starLight + 1) * 5000, 1.6e308) / upgrade.costBase))
    
    return Math.floor(Math.min(1000, level))
}

export const autoBuyStarlightUpgrades = (state) => {
    let upgradeList
    if (state.starLightInfiniteResetCount === 0)
        upgradeList = []
    else if (state.starLightInfiniteResetCount === 1)
        upgradeList = ["adder"]
    else if (state.starLightInfiniteResetCount === 2)
        upgradeList = ["adder","doubler"]
    else if (state.starLightInfiniteResetCount >= 3)
        upgradeList = ["adder","doubler","raiser"]
    for (const upgradeName of upgradeList) {
        const upgrade = starlightDictionary[upgradeName]
        const actualCost = Math.floor(upgrade.costBase * Math.pow(upgrade.costMultiplier, state[upgrade.currency]) * (state.constellationCount < 12 ? Math.pow(0.5, state.constellationCount) : 1/5000) )
        if (state.starLight >= actualCost)
            state[upgrade.currency] = getUpgradeLevelByStarlight(upgrade, state.starLight) //Math.min(state[upgrade.currency] + 1, 1000)
    }
}

export default function DestinyWelcomeTab({state, popup, updateState}) {
    
    const claimFirstStar = ()=>{
        updateState({name:"claimFirstStar"})
    }
    const performDestinyReset = ()=>{
        popup.confirm(<>DESTINY RESET<br/><br/>Reset the entire game for a Destiny Star. You lose everything that is not part of the Destiny Tab. Making a backup beforehand is highly recommended!<br/><br/>Also there are no new features, this is just a New Game Plus.<br/><br/>PERFORM DESTINY RESET?</>,()=>{
            updateState({name:"performDestinyReset"})
        })
    }
    const resetStarlight = ()=>{
        if (state.starLight !== Infinity)
            return
        popup.confirm("This will reset your Starlight and Starlight upgrades, but you will keep all Constellations.",()=>{
            updateState({name:"completeConstellation", constellation: undefined})
        })
    }

    const adder = starlightDictionary["adder"]
    const adderCost = Math.floor(adder.costBase * Math.pow(adder.costMultiplier, state[adder.currency]) * (state.constellationCount < 12 ? Math.pow(0.5, state.constellationCount) : 1/5000))

    return (
        <div style={{marginLeft:"20px"}}>
            {<>
                {state.destinyStars < 1 && <><h2>You finished the game!</h2><p>Claim this Destiny Star as a reward!</p><br/><button onClick={claimFirstStar}><b>CLAIM DESTINY STAR</b></button></>}
                {state.destinyStars >= 1 && <>
                    <h2>Destiny Stars</h2>
                    <p>You have {state.destinyStars} Destiny Star{state.destinyStars !== 1 && "s"}.<br/>They multiply the speed of the previous layers.<br/><br/>{state.destinyStars < 10 && state.progressionLayer >= 2 && <>Perform a Destiny Reset to receive another Destiny Star immediately.</>}{state.destinyStars < 10 && state.progressionLayer < 2 && <>Complete the True Ending again to unlock the next Destiny Reset</>}</p>
                    {state.progressionLayer >= 2 && <button onClick={performDestinyReset} className="fbutton" style={{ backgroundColor:"#FFFF88", fontWeight:"bold", width:"280px"}} ><b>{"CHANGE YOUR DESTINY"}</b></button>}
                    <br/><h2>Starlight</h2>
                    <h3>&lambda; = {formatNumber(Math.floor(state.starLight),state.settings.numberFormat,3)}</h3>
                    You get {formatNumber(getStarLightRate(state),state.settings.numberFormat,3)} Starlight per Second!<br/>
                    {/* This is calculated by {state.lightAdder} * 2<sup>&nbsp;{state.lightDoubler}</sup> * {state.destinyStars}<sup>&nbsp;{state.lightRaiser}</sup>.<br/> */}
                    {constellationPrices[state.constellationCount] < Infinity && <>The night sky can hold up to {formatNumber(constellationPrices[state.constellationCount],state.settings.numberFormat)} Starlight.<br/></>}
                    {/* <button onClick={()=>buyLight("destinyStars",0)}>+ 1 Star</button><br/>
                    <button onClick={()=>passTime(3600)}>+ 1 Hour</button><br/>
                    <button onClick={()=>passTime(24*3600)}>+ 1 Day</button><br/>
                    <div>Passed Time: {secondsToHms(state.passedTime / 1000)}</div> */}
                    <br/>
                    <DestinyStarlightButton upgrade={starlightDictionary["adder"]} state={state} updateState={updateState} popup={popup}/>
                    <DestinyStarlightButton upgrade={starlightDictionary["doubler"]} state={state} updateState={updateState} popup={popup}/>
                    <DestinyStarlightButton upgrade={starlightDictionary["raiser"]} state={state} updateState={updateState} popup={popup}/><br/>
                    {getStarLightRate(state) === 0 && state.starLight < adderCost && <><DestinyStarlightButton upgrade={starlightDictionary["single"]} state={state} updateState={updateState} popup={popup}/><br/></>}
                    {state.lightRaiser > 0 && state.destinyStars <= 1 && <b>!!! Luminous Moons do nothing unless &#9733; &ge; 2 !!!<br/></b>}
                    {(state.starLight === Infinity || state.starLightInfiniteResetCount > 0) && <><button onClick={resetStarlight} disabled={state.starLight !== Infinity} title="Reset Starlight and Starlight Upgrades">Reset Starlight</button>&nbsp;&nbsp;
                        {state.starLight !== Infinity && <>Need: &lambda;=Infinity&nbsp;&nbsp;</>}
                        {state.starLightInfiniteResetCount === 0 && <>Unlocks Auto Astral Glances!</>}
                        {state.starLightInfiniteResetCount === 1 && <>Unlocks Auto Shooting Stars!</>}
                        {state.starLightInfiniteResetCount === 2 && <>Unlocks Auto Luminous Moons!</>}
                        {state.starLightInfiniteResetCount >=3 && state.starlightRecordMillis > 120000 && <>Get &lambda;=Infinity within 2 minutes</>}
                        {state.starLightInfiniteResetCount >=3 && state.starlightRecordMillis <= 120000 && !state.mailsReceived["Eternal"] && <>Max out all Starlight Upgrades</>}
                    </>}
                    {/* {getStarLightRate(state) < 20 && <><button onClick={()=>updateState({name:"buyLightUpgrade", currency:"starLight", cost:0})}>Gaze at the night sky</button><br/><br/></>} */}
                    <h2>Star Constellations</h2>
                    {state.constellationCount < 12 ? <>Fill the entire night sky with Starlight to complete a Star Constellation.<br/><br/>{state.constellationCount > 0 && <>Each Constellation halves the prices of Starlight Upgrades and increases the Starlight cap tenfold.<br/></>}</> : <>All Star Constellations are complete. Congratulations!<br/><br/>The prices of Starlight Upgrades are divided by 5000 and the Starlight cap is removed entirely.<br/></>}
                    
                    {constellationList.map((id)=><DestinyConstellationButton key={id} popup={popup} constellation={starConstellations[id]} state={state} updateState={updateState}/>)}<br/><br/>
                </>}
            </>}
        </div>)
}

function DestinyStarlightButton({state, updateState, upgrade, popup}) {
    const actualCost = Math.floor(upgrade.costBase * Math.pow(upgrade.costMultiplier, state[upgrade.currency]) * (state.constellationCount < 12 ? Math.pow(0.5, state.constellationCount) : 1/5000) )
    const hasAuto = (state.starLightInfiniteResetCount >= upgrade.resetsForAuto)

    const buyLight = (currency,cost)=>{
        if (hasAuto && !isMaxxed)
            popup.alert("Don't stress it. Automation takes care of buying this for you!")
        if (hasAuto || state.starLight < cost || isMaxxed)
            return
        if (!state[currency])
            popup.alert(upgrade.description)
        updateState({name:"buyLightUpgrade", currency:currency, cost: cost})
    }
    const isMaxxed = state[upgrade.currency] >= upgrade.maxAmount
    const buttonStyle={
        margin:"2px",
        border:"0px", 
        padding:"0px", 
        fontWeight: "bold",
        width:"180px", 
        height: upgrade.useDefaultStyle ? "30px" : "50px", 
        fontSize:"16px",
        backgroundColor: isMaxxed ? "#ffff88" : "#ffffff",
        color: "#000000",
        textAlign: "center",
        verticalAlign: "middle",
        lineHeight: upgrade.useDefaultStyle ? "30px" : "50px",
        display: "inline-block",
        userSelect: "none",
    }

    return <><div title={upgrade.description} className="fbutton" style={buttonStyle} onClick={()=>buyLight(upgrade.currency, actualCost)} disabled={isMaxxed || state.starLight < actualCost}>{upgrade.title}{!upgrade.hideAmount && <>&nbsp;({state[upgrade.currency]})</>}</div>{state[upgrade.currency] < 1000 && actualCost > 0 && <>&nbsp;&nbsp;{hasAuto ? <>Need</>:<>Cost</>}: &lambda;={formatNumber(actualCost,state.settings.numberFormat)}</>}<br/></>
}
