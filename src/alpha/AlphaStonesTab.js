import {startingStones, stoneTable} from './AlphaStoneDictionary'
import AlphaStartingStone from './AlphaStartingStone'
import {formatNumber, numericSort, spaces} from '../utilities'
import { getStartingX } from '../savestate'

export const calcStoneResultForX = (state, grid)=>{
    const stoneLevels = grid.flat().map((id)=>(state.startingStoneLevel[id]||0))
    const stoneLevelCounts = stoneLevels.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map())
    const startingXBonus = [...stoneLevelCounts.entries()].reduce((acc,[level,count])=>(acc+=level === 0 ? 0 : Math.pow(count,level)),0)
    return startingXBonus
}

export const getStoneCalculationForX = (state, grid)=>{
    const stoneLevels = grid.flat().map((id)=>(state.startingStoneLevel[id]||0)).filter((level)=>(level > 0))
    const stoneLevelCounts = stoneLevels.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map())
    const stoneLevelEntries = [...stoneLevelCounts.entries()]
    const xPartText = stoneLevelEntries.map(([level,count], index)=>(level > 0 && <span key={index}>{count}<sup>{level}</sup>{index < stoneLevelEntries.length - 1 && <> + </>}</span>))
    return xPartText
}

const calcLevelBoundaries = (state, grid)=>{
    const dimX = grid.length
    const dimY = grid[0].length
    const stoneLevels = grid.map((row)=>row.map((id)=>(state.startingStoneLevel[id]||0)))

    return stoneLevels.map((row,xIndex)=>row.map((stone,yIndex)=>{
        const neighbours = []
        if (xIndex > 0)
            neighbours.push(stoneLevels[xIndex-1][yIndex])
        if (xIndex + 1 < dimX)
            neighbours.push(stoneLevels[xIndex+1][yIndex])
        if (yIndex > 0)
            neighbours.push(stoneLevels[xIndex][yIndex-1])
        if (yIndex + 1 < dimY)
            neighbours.push(stoneLevels[xIndex][yIndex+1])

        const sortedNeighbours = numericSort(neighbours, true)
        return (sortedNeighbours[0] || 0) + (sortedNeighbours[1] || 0)
    }))
}

export default function AlphaStonesTab({state, popup, updateState}) {

    const changeStoneMode = (mode)=>{
        updateState({name:"changeStoneMode", mode:mode})
    }

    const resetStones = ()=>{
        updateState({name:"resetStones"})
    }

    const xBonus = calcStoneResultForX(state,stoneTable)
    const boundaries = calcLevelBoundaries(state,stoneTable)

    return (
        <div style={{marginLeft:"20px"}}>{<>
            <h2>Starting Stones</h2>
                <p>(a.k.a. "Why am I even doing these?")</p><br/>
                <button onClick={()=>changeStoneMode(1)}>{state.startingStoneMode===1?<b>Increment</b>:<>Increment</>}</button>&nbsp;&nbsp;
                <button onClick={()=>changeStoneMode(-1)}>{state.startingStoneMode===-1?<b>Decrement</b>:<>Decrement</>}</button>&nbsp;&nbsp;
                <button onClick={()=>changeStoneMode(0)}>{state.startingStoneMode===0?<b>Description</b>:<>Description</>}</button>&nbsp;&nbsp;
                <button onClick={resetStones}>Reset</button><br/><br/>
                {stoneTable.map((line,index)=><div key={index}>{line.map((stoneId, indey)=>
                    <AlphaStartingStone key={stoneId} state={state} stone={startingStones[stoneId]} boundary={boundaries[index][indey]} popup={popup} updateState={updateState}/>
                )}</div>)}
                <br/>
                {xBonus > 0 && <div style={{fontSize:"20px",fontWeight:"bold"}}>{spaces()}s<sub>x</sub> = {getStoneCalculationForX(state, stoneTable)} = {formatNumber(xBonus, state.settings.numberFormat)}<br/></div>}
                {xBonus > 1 && <div>{spaces()} s<sub>x</sub> multiplies your starting x<br/></div>}
                {xBonus > 1 && <div>{spaces()} Your total starting x is {formatNumber(getStartingX(state),state.settings.numberFormat, 2)}</div>}
            </>}
        </div>)
}