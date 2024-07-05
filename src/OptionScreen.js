import { Buffer } from "buffer";

import {invitation, newSave, productive, save, version} from './savestate'
import {spaces, notify, secondsToHms, stringifyProperly} from './utilities'
import MultiOptionButton from './MultiOptionButton'
import DropdownOptionButton from "./DropdownOptionButton";

export default function OptionScreen({state, popup, updateState, setTotalClicks}) {
  const saveGame = ()=>{
    save(state)
    notify.success("Game Saved")
  }
  
  // const load = ()=>{
  //   if (state.mileStoneCount < 2) {
  //     updateState({name: "load"})
  //     setTotalClicks((x)=>x+1)
  //   } else {
  //     popup.confirm("This loads your last saved game, your current progress will be lost. Proceed?",()=>{
  //       updateState({name: "load"})
  //       setTotalClicks((x)=>x+1)
  //     })
  //   }
  // }

  const exportGame = ()=>{
    const encodedState = Buffer.from(stringifyProperly(state)).toString("base64");
    const success = ()=>notify.success("Copied to Clipboard")
    const failed = ()=>notify.error("Export failed")
    if(navigator.clipboard)
      navigator.clipboard.writeText(encodedState).then(success, failed)
    else
      fallbackCopyTextToClipboard(encodedState, success, failed)
  }

  const exportAsFile = ()=>{
    const encodedState = Buffer.from(stringifyProperly(state)).toString("base64");
    const element = document.createElement("a")
    const file = new Blob([encodedState], {type: 'text/plain'})
    element.href = URL.createObjectURL(file)
    element.download = "IdleFormulas.txt"
    document.body.appendChild(element)
    element.click()
    element.remove()
  }


  function fallbackCopyTextToClipboard(text, success, failed) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
  
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
  
    try {
      var successful = document.execCommand('copy');
      if (successful)
        success()
      else
        failed()
    } catch (err) {
      failed()
      console.error(err)
    }
  
    document.body.removeChild(textArea);
  }


  const importGame = ()=>{
    popup.prompt("IMPORT", "Paste your savestring here...", ["IMPORT", "CANCEL"], (option, popupState)=>{
      const encodedState = popupState.inputText;
      if (option==="CANCEL" || !encodedState) return

      try {
        const decodedState = JSON.parse(Buffer.from(encodedState,"base64").toString())
        const stateToLoad = {...structuredClone(newSave), ...decodedState, settings:{...structuredClone(newSave.settings), ...decodedState.settings}, saveTimeStamp: Date.now(), currentEnding: decodedState.currentEnding, justLaunched: true}
        popup.confirm("This will overwrite your current save! Are you sure?", ()=>{
          console.log("Attempting to load")
          updateState({name: "load", state: stateToLoad})
          setTotalClicks((x)=>x+1)
          notify.success("Save Imported")
        })
      } catch (error) {
        console.error(error)
        notify.error("IMPORT FAILED")
        return
      }
    })
  }

  const resetSave = ()=>{
    popup.confirm("This resets everything and you do not get anything in return. Are you really sure?",()=>{
      popup.confirm("Are you really really sure?",()=>{
        popup.confirm("Are you totally absolutely enthusiastically sure?",()=>{
          updateState({name: "hardreset"})
          setTotalClicks((x)=>x+1)
          notify.warning("Game Reset")
        })
      })
    })
  }

  const cheat = ()=>{
    updateState({name: "cheat"})
    notify.warning("CHEATER", "You cheated not only the game, but yourself!")
  }

  const chapterJump = ()=>{
    const password = window.prompt("Enter Password:");
    updateState({name: "chapterJump", password: password})
  }

  return (<div style={{marginLeft: "20px"}}>
    <h1>Options</h1>
      <p>
        {spaces()}<button title={"Perform a manual save. The game also automatically saves every 10 seconds"} onClick={saveGame} disabled={state.mileStoneCount < 1}>Manual Save</button><br/><br/>
        {spaces()}<button title={"Exports the current game state as a text string to the clipboard"} onClick={exportGame} disabled={state.mileStoneCount < 1}>Export</button>
        {spaces()}<button title={"Exports the current game state as a text file for download"} onClick={exportAsFile} disabled={state.mileStoneCount < 1}>Export File</button>
        {spaces()}<button title={"Imports a previously exported text string and restores its game state"} onClick={importGame}>Import</button>
        {/* {spaces()}<MultiOptionButton settingName="autoSave" statusList={["ON","OFF"]} state={state} updateState={updateState} setTotalClicks={setTotalClicks}
          description="Auto Save" tooltip="Controls whether the game saves automatically" tooltipList={["Saves automatically every 10 seconds and tries to save (depends on browser) before closing tab","Game is not saved automatically"]}/> */}
      </p>
      {!!window.installPromptPWAevent && <p>{spaces()}<button onClick={()=>{window.installPromptPWAevent.prompt(); window.installPromptPWAevent = null; popup.alert(<>IMPORTANT NOTE:<br/><br/>The game data is still stored in the browser even when using the app.<br/>Therefore deleting the browser cache also resets the app including your save.</>)}}>Install as Web-App</button></p>}
      <p> 
        {/* {spaces()}<button onClick={load}>Load Game</button> */}
        
        {/* {spaces()}<MultiOptionButton settingName="autoLoad" statusList={["ON","OFF"]} state={state} updateState={updateState} setTotalClicks={setTotalClicks}
          description="Auto Load" tooltip="Controls whether the saved game is loaded automatically with the site" tooltipList={["Game is loaded automatically","Game is not loaded automatically"]}/> */}
      </p><p>
        {/* {spaces()}<MultiOptionButton settingName="offlineProgress" statusList={["ON","ACTIVE","OFF"]} state={state} updateState={updateState} setTotalClicks={setTotalClicks}
          description="Offline Progress" tooltip="Controls whether the game calculates progress for offline/inactive time" tooltipList={["Always get offline progress","No offline progress upon load, but inactive periods (minimized tab etc) are considered", "No offline progress, not even after inactive (minimized tab etc) periods of 2+ minutes"]}/> */}
      </p>
      {(state.destinyStars > 1 || state.progressionLayer > 0) && <p>
        {spaces()}<DropdownOptionButton settingName="headerDisplay" statusList={["X","ALPHA",state.destinyStars > 1 && "STARS",state.destinyStars > 1 && "STARLIGHT", "VERTICAL", "HORIZONTAL", "OFF"].filter((x)=>x)} state={state} updateState={updateState} setTotalClicks={setTotalClicks}
          description="Header Display" tooltip="Controls display at the top of the site"/>
      </p>}
      <p>
        {spaces()}<MultiOptionButton settingName="numberFormat" statusList={["LETTER","SCIENTIFIC","AMBIGUOUS"]} state={state} updateState={updateState} setTotalClicks={setTotalClicks}
          description="Number Format" tooltip="Controls how numbers are displayed" tooltipList={["Use letters for thousands: K,M,B,T,Q,P,S,V,O,N,D","Use scientific notation", "Use ambigous notation"]}/>
      </p><p>
        {spaces()}<MultiOptionButton settingName="shopPrices" statusList={["OFF","ON"]} state={state} updateState={updateState} setTotalClicks={setTotalClicks}
          description="Shop Price Labels" tooltip="Controls how formula prices and additional info are shown in Shop" tooltipList={["Shop Prices are only shown in Tooltips","Shop Prices are shown in Label."]}/>
      </p><p>
        {spaces()}<MultiOptionButton settingName="shopScroll" statusList={["ON","OFF"]} state={state} updateState={updateState} setTotalClicks={setTotalClicks}
          description="Shop Scrollbar" tooltip="Controls whether the formula shop has a separate scroll bar" tooltipList={["Shop has a scroll bar","Shop does not have a scroll bar."]}/>
      </p>
      {(state.destinyStars > 1 || state.mailsCompleted["Favorites"] !== undefined) && <p>
        {spaces()}<MultiOptionButton settingName="advancedDisplayModes" statusList={["OFF","ON"]} state={state} updateState={updateState} setTotalClicks={setTotalClicks}
          description="Advanced Display Modes" tooltip="Enables some additional options for filtering the formula shop" tooltipList={["Does not show additional filters","Shows all additional filters."]}/>
      </p>}
      {(state.destinyStars > 1 || state.mailsCompleted["Challenges"] !== undefined) && <p>
        {spaces()}<MultiOptionButton settingName="challengeTabSwitch" statusList={["ON","OFF"]} state={state} updateState={updateState} setTotalClicks={setTotalClicks}
          description="Challenge Tab Switch" tooltip="Controls whether automatic tab switch occurs when starting or finishing a challenge" tooltipList={["Tab is switched automatically","Tab is not switched automatically."]}/>
      </p>}
      <p>
           {/* {spaces()}<MultiOptionButton settingName="showHints" statusList={["ON", "OFF"]} state={state} updateState={updateState} setTotalClicks={setTotalClicks}
          description="Show Hints" tooltip="Controls whether hints are shown" tooltipList={["Hints are shown", "Hints are not shown"]}/>
        {spaces()}<MultiOptionButton settingName="hotKeys" statusList={["ON", "OFF"]} state={state} updateState={updateState} setTotalClicks={setTotalClicks}
          description="Hotkeys" tooltip="Controls whether hotkeys are enabled" tooltipList={["Hotkeys are enabled", "Hints are disabled"]}/> */}
      </p>
      <p>
        {spaces()}<button title={"Starts a new game. This will overwrite your current save file."} onClick={resetSave}>Hard Reset</button>
      </p>
      {false && !productive && <p>
        {spaces()}<button onClick={cheat}>Cheat</button>
      </p>}
      <details>
        <summary>Pop-Up Settings</summary>
        <p>
          {spaces()}<MultiOptionButton settingName="offlineProgressPopup" statusList={["ON","LAUNCH","OFF"]} state={state} updateState={updateState} setTotalClicks={setTotalClicks}
            description="Offline Progress Pop-Up" tooltip="Controls whether the offline progress popup is shown" tooltipList={["Shown at launch and after inactive periods","Only shown at launch/loading", "Never shown"]}/>
        </p>
        {/* <p>
        {spaces()}<MultiOptionButton settingName="valueReduction" statusList={["CONFIRM","WARNING","PREVENT","NEVER","APPLY"]} state={state} updateState={updateState} setTotalClicks={setTotalClicks}
          description="Decreasing Formula" tooltip="Controls behavior when trying to apply a formula that reduces the value" tooltipList={["Show confirmation popup that can be skipped by holding Shift","Apply when Shift is held, show warning otherwise.", "Prevent formula application unless Shift is held", "Never apply", "Always apply"]}/>
        </p> */}
        <p>
        {spaces()}<MultiOptionButton settingName="valueReduction" statusList={["ON","OFF"]} state={state} updateState={updateState} setTotalClicks={setTotalClicks}
          description="Decreasing Formula Pop-Up" tooltip="Controls whether the confirmation popup for decreasing an x value is shown" tooltipList={["Show popup","Do not show popup"]}/>
        </p>
        <p>
          {spaces()}<MultiOptionButton settingName="xResetPopup" statusList={["ON","OFF","SMART","SAFE"]} state={state} updateState={updateState} setTotalClicks={setTotalClicks}
            description="Basic Reset Pop-Up" tooltip="Controls whether the confirmation popup for Basic Resets is shown" tooltipList={["Show popup","Do not show popup","Only show popup when formula unlocks etc possible","Shows two popups when formula unlocks etc possible"]}/>
        </p>
        {(state.destinyStars > 1 || state.progressionLayer > 0) && <p>
          {spaces()}<MultiOptionButton settingName="shopResetPopup" statusList={["ON","OFF"]} state={state} updateState={updateState} setTotalClicks={setTotalClicks}
            description="x-Reset Pop-Up" tooltip="Controls whether the confirmation popup for x-Resets is shown" tooltipList={["Show popup","Do not show popup"]}/>
        </p>}
        {(state.destinyStars > 1 || state.progressionLayer > 0) && <p>
          {spaces()}<MultiOptionButton settingName="alphaResetPopup" statusList={["ON","OFF"]} state={state} updateState={updateState} setTotalClicks={setTotalClicks}
            description="Alpha-Reset Pop-Up" tooltip="Controls whether the confirmation popup for Alpha-Resets is shown" tooltipList={["Show popup","Do not show popup"]}/>
        </p>}
        {(state.destinyStars > 1 || state.progressionLayer > 0) && <p>
          {spaces()}<MultiOptionButton settingName="alphaAbortPopup" statusList={["DOUBLE", "ON","OFF"]} state={state} updateState={updateState} setTotalClicks={setTotalClicks}
            description="Abort Alpha Pop-Up" tooltip="Controls whether the confirmation popup for aborting an Alpha Run is shown" tooltipList={["Show two popups", "Show one popup","Do not show popup"]}/>
        </p>}
        {(state.destinyStars > 1 || state.progressionLayer > 0) && <p>
          {spaces()}<MultiOptionButton settingName="alphaUpgradePopup" statusList={["ON","OFF"]} state={state} updateState={updateState} setTotalClicks={setTotalClicks}
            description="Alpha Upgrade Pop-Up" tooltip="Controls whether the confirmation popup for buying an Alpha Upgrade is shown" tooltipList={["Show popup","Do not show popup"]}/>
        </p>}
        {(state.destinyStars > 1 || state.alphaUpgrades.MEEQ === true) && <p>
          {spaces()}<MultiOptionButton settingName="memorizePopup" statusList={["ON","OFF"]} state={state} updateState={updateState} setTotalClicks={setTotalClicks}
            description="Memorize Pop-Up" tooltip="Controls whether the confirmation popup for memorizing Formula loadouts is shown" tooltipList={["Show popup","Do not show popup"]}/>
        </p>}
        {(state.mailsCompleted["Challenges"] || state.progressionLayer > 0) && <p>
          {spaces()}<MultiOptionButton settingName="exitChallengePopup" statusList={["ON","OFF"]} state={state} updateState={updateState} setTotalClicks={setTotalClicks}
            description="Exit Challenge Pop-Up" tooltip="Controls whether the confirmation popup for exiting Challenges is shown" tooltipList={["Show popup","Do not show popup"]}/>
        </p>}
      </details>
      <br/>
      <details>
        <summary>Hotkey Settings</summary>
        <p>
          {spaces()}<MultiOptionButton settingName="hotkeyApplyFormula" statusList={["ON","OFF"]} state={state} updateState={updateState} setTotalClicks={setTotalClicks}
            description="Apply Formula Hotkeys [1/2/3]" tooltip="Controls whether number keys can be used to apply formulas" tooltipList={["Hotkeys Enabled", "Hotkeys Disabled"]}/>
        </p>
        <p>
        {spaces()}<MultiOptionButton settingName="hotkeyBasicReset" statusList={["ON","OFF"]} state={state} updateState={updateState} setTotalClicks={setTotalClicks}
          description="Basic Reset Hotkey [B]" tooltip="Controls whether the B Key can be pressed to perform a Basic Reset" tooltipList={["Hotkey Enabled", "Hotkey Disabled"]}/>
        </p>
        <p>
        {spaces()}<MultiOptionButton settingName="hotkeyXReset" statusList={["ON","OFF"]} state={state} updateState={updateState} setTotalClicks={setTotalClicks}
          description="x-Reset Hotkey [X]" tooltip="Controls whether the X Key can be pressed to perform an x-Reset" tooltipList={["Hotkey Enabled", "Hotkey Disabled"]}/>
        </p>
        <p>
          {spaces()}<MultiOptionButton settingName="hotkeyDiscardPopup" statusList={["ON","OFF"]} state={state} updateState={updateState} setTotalClicks={setTotalClicks}
            description="Dismiss Popup [Escape]" tooltip="Controls whether the Escape Key can be pressed to close Popups" tooltipList={["Hotkeys Enabled", "Hotkeys Disabled"]}/>
        </p>
        {(state.destinyStars > 1 || state.progressionLayer > 0) && <p>
          {spaces()}<MultiOptionButton settingName="hotkeyAlphaReset" statusList={["ON","OFF"]} state={state} updateState={updateState} setTotalClicks={setTotalClicks}
            description="Alpha-Reset Hotkey [A]" tooltip="Controls whether the A Key can be pressed to perform an Alpha-Reset" tooltipList={["Hotkey Enabled", "Hotkey Disabled"]}/>
        </p>}
        {(state.destinyStars > 1 || state.alphaUpgrades.SAPP) && <p>
          {spaces()}<MultiOptionButton settingName="hotkeyToggleAuto" statusList={["ON","OFF"]} state={state} updateState={updateState} setTotalClicks={setTotalClicks}
            description="Toggle Auto Hotkey [T]" tooltip="Controls whether the T Key can be used to toggle Auto Appliers" tooltipList={["Hotkey Enabled", "Hotkey Disabled"]}/>
        </p>}
        {(state.destinyStars > 1 || state.progressionLayer > 0) && <p>
          {spaces()}<MultiOptionButton settingName="hotkeyAbortRun" statusList={["ON","OFF"]} state={state} updateState={updateState} setTotalClicks={setTotalClicks}
            description="Abort Hotkey [C]" tooltip="Controls whether the C Key can be used to abort the current run" tooltipList={["Hotkey Enabled", "Hotkey Disabled"]}/>
        </p>}
        {(state.destinyStars > 1 || state.mailsCompleted["ResearchAll"] !== undefined) && <p>
          {spaces()}<MultiOptionButton settingName="hotkeyResearchAll" statusList={["ON","OFF"]} state={state} updateState={updateState} setTotalClicks={setTotalClicks}
            description="Research All Hotkey [R]" tooltip="Controls whether the R Key to start all available Research" tooltipList={["Hotkey Enabled", "Hotkey Disabled"]}/>
        </p>}
      </details>


      {state.xValue[0] === 0 && state.mileStoneCount === 0 && (window.location.href.split("/").pop() === "?newgame") &&<p>
        {spaces()}<button onClick={chapterJump}>Chapter Jump</button>
      </p>}
      <br/>
      <p>Version:&nbsp;&nbsp;{version}{!productive && <>&nbsp;&nbsp;[Development Build]</>}</p>
      {state.destinyStartTimeStamp > 0 && 
        (state.destinyEndTimeStamp > 0 ? 
          <>Playtime:&nbsp;&nbsp;{secondsToHms((state.destinyEndTimeStamp - state.destinyStartTimeStamp)/1000)}&nbsp;&nbsp;[Game Finished!]</> 
        :
          <>Playtime:&nbsp;&nbsp;{secondsToHms((Date.now() - state.destinyStartTimeStamp)/1000)}</>)
      }
      {state.destinyStars > 1 && state.destinyRecordMillis <= 30*86400*1000 && <><br/>Record:&nbsp;&nbsp;{secondsToHms(state.destinyRecordMillis/1000)}</>}
      {state.starlightStartTimeStamp > 0 && 
        (state.starlightEndTimeStamp > 0 ? 
          <><br/>Starlight Age:&nbsp;&nbsp;{secondsToHms((state.starlightEndTimeStamp - state.starlightStartTimeStamp)/1000)}&nbsp;&nbsp;[Infinite Starlight!]</> 
        :
          <><br/>Starlight Age:&nbsp;&nbsp;{secondsToHms((Date.now() - state.starlightStartTimeStamp)/1000)}</>)
      }
      <p>This game is created by Zilvarro.</p>
      {state.mileStoneCount >= 3 ? 
        <p><a href={"https://discord.gg/" + invitation} target="_blank" rel="noopener noreferrer">Join the Discord Community</a></p>
        :
        <p><a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer">Must have 3 Milestones to join the Discord &#9785;</a></p>
      }
  </div>)
}