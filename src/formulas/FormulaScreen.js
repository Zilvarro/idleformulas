import FormulaTable from './FormulaTable'
import {getUnlockMultiplier} from './FormulaButton'
import ValueTable from './FormulaValueTable'
import formulaList from './FormulaDictionary'
import {spaces,formatNumber, secondsToHms} from '../utilities'
import {getInventorySize, differentialTargets, alphaTarget, getAlphaRewardTier} from '../savestate'
import MultiOptionButton from '../MultiOptionButton'
import DropdownOptionButton from '../DropdownOptionButton'

export const shopFormulas=[
  "x'=1",
  "x+1",
  "x''=1",
  "x'''=1",
  "x'''=4",
  "x'''=sqrt(2*#R)",
  "x'''=(#U^2)/12",
  "x''=2",
  "x+5",
  "x''=3",
  "x'=24",
  "x'+x''+x'''",
  "x''=#U",
  "x+10",
  "x'+1",
  "x+20",
  "x'=1000*x''",
  "x+50",
  "x+100",
  "x''+x'''^2",

  "x+1000",
  "x'+3",
  "x''=sqrt(x)",
  "x+x'",
  "x'+220",
  "x'''+1",
  "x'=420K",
  "x''+1",
  "x+50M",
  "x''+130",
  "x=10Q*x'''*x''/x'",

  "x'+x^0.6",
  "x''+10B",
  "x'=5Q*x'''",
  "x'''+log2(x)^2",
  "x+50P",

  "x'''+log2(#F/#E)^13",
  "x'+30S",
  "x''+40P",
  "x'''*sqrt(300S-x''')/500B",
  "x''+1V",
  "x'''+5S",
]

export default function FormulaScreen({state, updateState, setTotalClicks, popup}) {
    const resetXValues = ()=>{
      const isProgressAvailable = state.xValue[0] >= nextUnlockCost || state.xValue[0] >= differentialTarget || state.xValue[0] >= alphaTarget
      popup.confirm("Your x values are reset, but you can change your equipped formulas.",()=>{
        popup.confirm("Your x is high enough to unlock something or progress instead. Do you still want to do a Basic Research?",()=>{
          updateState({name: "resetXValues"})
          setTotalClicks((x)=>x+1)
        }, state.settings.xResetPopup === "OFF" || state.settings.xResetPopup === "ON" || !isProgressAvailable)
      }, state.settings.xResetPopup === "OFF" || state.settings.xResetPopup === "SMART")
    }
    
    const resetShop = ()=>{
      const shopMultipliers = [4, 12, 8000, 1]
      const shopMultiplier = shopMultipliers[state.highestXTier]
      popup.confirm("A new differential of x and its formulas become available, but the shop is reset and the unlock cost for all non-basic formulas is " + shopMultiplier + " times as high.",()=>{
          updateState({name: "upgradeXTier"})
          setTotalClicks((x)=>x+1)
      }, state.settings.shopResetPopup === "OFF")
    }
    
    const performAlphaReset = ()=>{
      popup.confirm(state.progressionLayer === 0 ? "You lose all your differentials but you join the Academy and gain a powerful Alpha Token." : "Perform an Alpha Reset?",()=>{
        updateState({name: "alphaReset"})
        setTotalClicks((x)=>x+1)
      }, state.settings.alphaResetPopup === "OFF")
    }

    const abortAlphaReset = ()=>{
      popup.confirm(state.insideChallenge ? "Abort run and exit the current Challenge?" : "Abort the current Alpha Run?",()=>{
        popup.confirm("Do you really want to abort the run?",()=>{
          updateState({name: "alphaReset", isAbort: true})
          setTotalClicks((x)=>x+1)
        }, state.settings.alphaAbortPopup !== "DOUBLE")
      }, state.settings.alphaAbortPopup === "OFF")
    }

    const negativeSpaceInfo = ()=>{
      popup.alert(<>When an x value becomes negative, you enter Negative Space.<br/>While in Negative Space: x-Resets, Alpha-Resets and Challenge Completions are disabled.<br/>You can leave Negative Space by doing a Basic Reset or aborting your run.</>)
    }

    const completeChallenge = ()=>{
      updateState({name: "alphaReset"})
      setTotalClicks((x)=>x+1)
    }

    const getWorldFormula = ()=>{
      updateState({name: "startEnding", endingName:"worldselect"})
      setTotalClicks((x)=>x+1)
    }

    const memorize = ()=>{
      popup.confirm("Save this loadout for later use?", ()=>{
        updateState({name: "memorize"})
      }, state.settings.memorizePopup === "OFF")
    }

    const remember = ()=>{
      updateState({name: "remember"})
    }

    const selectLoadout = (index)=>{
      updateState({name: "selectLoadout", index:index})
    }

    const clearLoadout = ()=>{
      updateState({name: "clearLoadout"})
    }

    const toggleAutoApply = ()=>{
      updateState({name:"toggleAutoApply", all:true})
    }

    const sResetNames = ["x'", "x''", "x'''", "Alpha"]
    const sResetName = sResetNames[state.highestXTier]


    const differentialTarget = differentialTargets[state.highestXTier]
  
    const inventoryFormulas = Object.assign(new Array(getInventorySize(state)).fill(), state.myFormulas)

    const progressBarWidth = Math.min(100 * Math.log10(Math.max(state.xValue[0],1)) / Math.log10(alphaTarget),99).toFixed(0) + "%"

    const alphaRewardTier = getAlphaRewardTier(state.xValue[0])
    const xhs = state.xHighScores[3]
    const alphaTargetList = ["MINIMUM","1e40",xhs >= 1e40 && "1e50",xhs >= 1e50 && "1e60",xhs >= 1e60 && "1e70",xhs >= 1e70 && "1e80",xhs >= 1e80 && "1e90",xhs >= 1e90 && "1e100"].filter((x)=>x)

    const nextUnlockCost = state.autoUnlockIndex < shopFormulas.length ? formulaList[shopFormulas[state.autoUnlockIndex]].unlockCost * getUnlockMultiplier(formulaList[shopFormulas[state.autoUnlockIndex]],state) : Infinity

    const hashtagU = state.myFormulas.some((formulaName)=>formulaList[formulaName].hashtagU)
    const hashtagB = state.myFormulas.some((formulaName)=>formulaList[formulaName].hashtagB)
    const hashtagF = state.myFormulas.some((formulaName)=>formulaList[formulaName].hashtagF)
    const hashtagE = state.myFormulas.some((formulaName)=>formulaList[formulaName].hashtagE)

    let displayFilter = ()=>true
    switch (state.settings.shopFilter) {
      case "DEFAULT":
        displayFilter = (formulaName)=>(state.shopFavorites[state.highestXTier][formulaName] !== -1) //Not Hidden
        break;
      case "FAVORITES":
        displayFilter = (formulaName)=>(state.shopFavorites[state.highestXTier][formulaName] === 1) //Only Favorites
        break;
      case "HIDDEN":
        displayFilter = (formulaName)=>(state.shopFavorites[state.highestXTier][formulaName] === -1) //Only Hidden
        break;
      case "X":
        displayFilter = (formulaName)=>(formulaList[formulaName].targetLevel === 0 && state.shopFavorites[state.highestXTier][formulaName] !== -1) //Non-Hidden X
        break;
      case "X'":
        displayFilter = (formulaName)=>(formulaList[formulaName].targetLevel === 1 && state.shopFavorites[state.highestXTier][formulaName] !== -1) //Non-Hidden X'
        break;
      case "X''":
        displayFilter = (formulaName)=>(formulaList[formulaName].targetLevel === 2 && state.shopFavorites[state.highestXTier][formulaName] !== -1) //Non-Hidden X''
        break;
      case "X'''":
        displayFilter = (formulaName)=>(formulaList[formulaName].targetLevel === 3 && state.shopFavorites[state.highestXTier][formulaName] !== -1) //Non-Hidden X'''
        break;
      default: //ALL + EDIT
        break;
    }
    if (state.mailsCompleted["Favorites"] === undefined) //Not yet unlocked
      displayFilter = ()=>true

    return (<div style={{color: "#99FF99", marginLeft: "10px"}}>
        <div className="row" style={{marginTop:"0px"}}><div className="column">
        <h2 style={{marginTop:"0px"}}>x values</h2>
            <ValueTable values={state.xValue} diffs={state.avgXPerSecond} baseName={"x"} maxTier={state.highestXTier} numberFormat={state.settings.numberFormat}/>
            <br/>
            {!state.insideChallenge && state.xValue[0] >= Infinity ?
              <>{spaces()}<button onClick={getWorldFormula}><b>DISCOVER THE WORLD FORMULA</b></button><br/><br/></>
            :
              <>{(state.progressionLayer > 0 || state.highestXTier > 0 || state.formulaUnlockCount >= 4) &&
                <>{spaces()}<button style={{color:"black"}} onClick={resetXValues} disabled={state.activeChallenges.FULLYIDLE || state.activeChallenges.ONESHOT || !state.anyFormulaUsed}>Basic Reset</button>{state.progressionLayer === 0 && state.highestXTier === 0 && state.xResetCount === 0 && <span style={{color:"#00FF00", fontWeight:"bold"}}>{spaces()}&larr; Reset x, but you can adapt your equipped formulas.</span>}</>
              }
              {(state.progressionLayer > 0 || (state.xValue[0] >= differentialTarget)) && state.highestXTier < 3 &&
                <>{spaces()}<button style={{color:"black"}} disabled={state.inNegativeSpace || state.activeChallenges.FULLYIDLE || state.xValue[0] < differentialTarget} onClick={resetShop}>{sResetName}-Reset</button>{state.progressionLayer === 0 && <span style={{color:"#00FF00", fontWeight:"bold"}}>{spaces()}&larr; Reset the shop for a new differential</span>}</>
              }
              {state.progressionLayer >= 1 && !state.insideChallenge && state.highestXTier === 3 &&
                <>{spaces()}<button style={{color:"black"}} disabled={state.inNegativeSpace || state.activeChallenges.FULLYIDLE || state.xValue[0] < alphaTarget} onClick={performAlphaReset}>&alpha;-Reset</button></>
              }
              {state.insideChallenge && state.highestXTier === 3 && state.xValue[0] >= alphaTarget &&
                <>{spaces()}<button style={{color:"black"}} disabled={state.inNegativeSpace || state.activeChallenges.FULLYIDLE} onClick={completeChallenge}><b>Complete Challenge</b></button></>
              }
              {state.progressionLayer >= 1 && !(state.insideChallenge && state.highestXTier === 3 && state.xValue[0] >= alphaTarget) &&
                <>{spaces()}<button style={{color:"black"}} disabled={state.activeChallenges.FULLYIDLE} onClick={abortAlphaReset}>Abort</button></>
              }</>
            }

          <h2>My Formulas</h2>
          <FormulaTable state={state} updateState={updateState} popup={popup} setTotalClicks={setTotalClicks} formulaNames={inventoryFormulas} context="my"/>
          {state.progressionLayer === 0 && state.formulaUnlockCount >= 2 && state.highestXTier === 0 && 
            <p>Hint: Apply formulas repeatedly by holding the button or using the 1/2/3 keys.</p>
          }
          <p>
            {(state.alphaUpgrades.MEEQ) && <>
              <button onClick={memorize} style={{color:"black"}} disabled={state.activeChallenges.FULLYIDLE} title={"Saves equip layout so you can use it again later"}>Memorize</button>
              &nbsp;&nbsp;<button onClick={remember} style={{color:"black"}}disabled={state.activeChallenges.FULLYIDLE || state.anyFormulaUsed} title={"Loads saved equip layout for current x-Reset"}>Remember</button>
              &nbsp;&nbsp;<button onClick={clearLoadout} style={{color:"black"}} disabled={state.activeChallenges.FULLYIDLE} title={"Unequips all unused formulas"}>Unequip</button>
            </>}
            {(state.alphaUpgrades.SAPP) && <>
              &nbsp;&nbsp;<button onClick={toggleAutoApply} style={{color:"black"}}disabled={state.activeChallenges.FULLYIDLE} title={"Activate/Deactivate all Auto Appliers"}>Auto</button>
            </>}
            {(state.alphaUpgrades.MEMS) && <><br/><br/>
              <button onClick={()=>selectLoadout(0)} style={{color:"black"}} disabled={state.activeChallenges.FULLYIDLE} title={"Select Loadout A"}>{state.selectedLayout === 0 ? <div style={{fontWeight:900}}>Loadout A</div> : <>Loadout A</>}</button>
              {spaces()}<button onClick={()=>selectLoadout(1)} style={{color:"black"}} disabled={state.activeChallenges.FULLYIDLE} title={"Select Loadout B"}>{state.selectedLayout === 1 ? <div style={{fontWeight:900}}>Loadout B</div> : <>Loadout B</>}</button>
              {spaces()}<button onClick={()=>selectLoadout(2)} style={{color:"black"}} disabled={state.activeChallenges.FULLYIDLE} title={"Select Loadout C"}>{state.selectedLayout === 2 ? <div style={{fontWeight:900}}>Loadout C</div> : <>Loadout C</>}</button>
            </>}
          </p>
          {state.alphaUpgrades.SRES && <><MultiOptionButton disabled={state.activeChallenges.FULLYIDLE} settingName="autoResetterS" statusList={["ON","OFF"]} state={state} updateState={updateState} setTotalClicks={setTotalClicks}
            description="X Resetter"/></>}
          {state.alphaUpgrades.AREM && <>{spaces()}<MultiOptionButton disabled={state.activeChallenges.FULLYIDLE} settingName="autoRemembererActive" statusList={["ON","OFF"]} state={state} updateState={updateState} setTotalClicks={setTotalClicks}
            description="Rememberer"/></>}
          {(state.alphaUpgrades.SRES || state.alphaUpgrades.AREM) &&<><br/><br/></>}
          
          {state.alphaUpgrades.ARES && <><MultiOptionButton disabled={state.activeChallenges.FULLYIDLE} settingName="autoResetterA" statusList={["ON","OFF"]} state={state} updateState={updateState} setTotalClicks={setTotalClicks}
            description="Alpha Resetter"/></>}
          {state.alphaUpgrades.ARES && <>{spaces()}<DropdownOptionButton disabled={state.activeChallenges.FULLYIDLE} settingName="alphaThreshold" statusList={alphaTargetList} state={state} updateState={updateState} setTotalClicks={setTotalClicks}
            description="Target"/></>}
          {(state.alphaUpgrades.SRES || state.alphaUpgrades.AREM) && <><br/><br/></>}

            {state.inNegativeSpace && <p><b>You are in Negative Space!</b>{spaces()}<button onClick={negativeSpaceInfo}>About Negative Space</button></p>}
            {state.progressionLayer === 0 && state.highestXTier === 0 && state.formulaUnlockCount < 4 && <p>Unlock {4 - state.formulaUnlockCount} more formula{state.formulaUnlockCount !== 3 && "s"} to enable Basic Resets</p>}
            {state.currentChallenge && <p>You are currently in the "{state.currentChallengeName}" Challenge.{state.currentChallengeTime > 600e3 && <> (Time Limit: {secondsToHms(1800-state.currentChallengeTime/1000)})</>}</p>}
            {state.activeChallenges.COUNTDOWN && <p>Countdown: {secondsToHms(30 - state.millisSinceCountdown / 1000)}</p>}
            {state.activeChallenges.LIMITED && <p>You can apply {100 - state.formulaApplyCount} more formulas.</p>}
            {(state.xResetCount > 0 || state.highestXTier > 0 || state.progressionLayer > 0) && state.highestXTier < 3 && state.xValue[0] < differentialTarget && <p>Reach x={formatNumber(differentialTarget, state.settings.numberFormat)} for the next x-Reset</p>}
            {(state.xResetCount > 0 || state.highestXTier > 0) && state.progressionLayer === 0 && state.highestXTier < 3 && state.xValue[0] >= differentialTarget && <p style={{color:"#00FF00", fontWeight:"bold"}}>{sResetName}-Reset is now available! (See button above!)</p>}
            {state.progressionLayer > 0 && !state.insideChallenge && !state.inNegativeSpace && state.xValue[0] > differentialTarget && <p>{sResetName}-Reset High Score: x={formatNumber(state.xHighScores[state.highestXTier], state.settings.numberFormat,3)}</p>}
            {state.activeChallenges.FORMULAGOD && <p>Formula God High Score: x={formatNumber(state.formulaGodScores[0], state.settings.numberFormat,3)}</p>}
            {state.progressionLayer >= 1 && state.highestXTier === 3 && state.xValue[0] < alphaTarget && !state.insideChallenge && <p>Reach x={formatNumber(alphaTarget, state.settings.numberFormat)} to perform an &alpha;-Reset</p>}
            {state.highestXTier === 3 && state.xValue[0] < alphaTarget && state.insideChallenge && <p>Reach x={formatNumber(alphaTarget,state.settings.numberFormat)} to complete the challenge</p>}
            {state.progressionLayer >= 1 && state.highestXTier === 3 && !state.inNegativeSpace && !state.insideChallenge && state.xValue[0] >= alphaTarget && <p>Alpha Reset for {alphaRewardTier.alpha * Math.pow(2,state.baseAlphaLevel)} &alpha;.{alphaRewardTier.next && <>&nbsp;(Next: {alphaRewardTier.nextAlpha * Math.pow(2,state.baseAlphaLevel)} &alpha; at x={formatNumber(alphaRewardTier.next)})</>}</p>}
            {(state.progressionLayer > 0 || state.highestXTier > 0) && state.autoUnlockIndex < shopFormulas.length && state.xValue[0] < nextUnlockCost && (nextUnlockCost <= alphaTarget || state.progressionLayer > 0) && <p>Next Formula at x={formatNumber(nextUnlockCost, state.settings.numberFormat)}</p>}
            {(state.progressionLayer > 0 || state.highestXTier > 0) && state.autoUnlockIndex < shopFormulas.length && state.xValue[0] >= nextUnlockCost && <p>New Formula available</p>}
            {state.progressionLayer === 0 && state.autoUnlockIndex < shopFormulas.length && nextUnlockCost > alphaTarget && <p>Almost done! Let's fill this bar! (at x={formatNumber(alphaTarget, state.settings.numberFormat)})</p>}
            <p></p>
            {state.progressionLayer === 0 && (state.xValue[0] >= alphaTarget ?
                <div><button onClick={performAlphaReset} style={{backgroundColor:"#99FF99", fontWeight:"bold", border:"2px solid", height:"25px", width:"280px"}}>
                  JOIN THE ACADEMY
                </button></div>
            : 
              <div style={{color:"#000000", backgroundColor:"#ffffff", border:"2px solid", height:"25px",width:"280px"}}>
                <div style={{backgroundColor:"#99FF99", border:"0px", height:"25px", width:progressBarWidth}}></div>
              </div>
            )}
            {hashtagU && <>#U = {formatNumber(state.formulaUnlockCount, state.settings.numberFormat, 3)}&nbsp;&nbsp;(Unlocked Formulas)<br/></>}
            {hashtagB && <>#B = {formatNumber(state.xResetCount, state.settings.numberFormat, 3)}&nbsp;&nbsp;(Basic Resets)<br/></>}
            {hashtagF && <>#F = {formatNumber(state.formulaApplyCount, state.settings.numberFormat, 3)}&nbsp;&nbsp;(Formula Applications)<br/></>}
            {hashtagE && <>#E = {formatNumber(state.myFormulas.length, state.settings.numberFormat, 3)}&nbsp;&nbsp;(Equipped Formulas)<br/></>}
        </div><div className="column">
        <h2 style={{marginTop:"0px"}}>Shop {state.myFormulas.length >= getInventorySize(state) && <>{spaces()}[FULL INVENTORY]</>}</h2>
          {state.mailsCompleted["Favorites"] !== undefined && <p><DropdownOptionButton visible={true} settingName="shopFilter" statusList={state.settings.advancedDisplayModes === "ON" ? ["DEFAULT","ALL","FAVORITES","HIDDEN","X","X'","X''","X'''","EDIT"] : ["DEFAULT","ALL","FAVORITES","HIDDEN","EDIT"]} state={state} updateState={updateState} setTotalClicks={setTotalClicks} description="Display Mode"/></p>}
          <div style={state.settings.shopScroll === "ON" ? {overflow:"auto", height:"70vh"} : {}}>
            <FormulaTable state={state} updateState={updateState} popup={popup} setTotalClicks={setTotalClicks} formulaNames={shopFormulas.filter(displayFilter)}/>
          </div>
        </div></div>
    </div>)
}