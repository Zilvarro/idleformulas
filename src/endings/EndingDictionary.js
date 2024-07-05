const evilActions = [
    {
        title: "STEAL SOME CANDY",
        durationSeconds: 3,
        headerText: <>The World Formula lets you get away with anything!</>,
    },
    {
        title: "STEAL SOME MONEY",
        durationSeconds: 3,
    },
    {
        title: "MISGENDER SOMEONE",
        durationSeconds: 3,
    },
    {
        title: "SELL DRUGS",
        durationSeconds: 3,
    },
    {
        title: "KILL THE ANIMALS",
        durationSeconds: 3,
    },
    {
        title: "EVADE TAXES",
        durationSeconds: 3,
    },
    {
        title: "ROB A BANK",
        durationSeconds: 3,
    },
    {
        title: "BLOW UP A BRIDGE",
        durationSeconds: 3,
    },
    {
        title: "KILL SOMEONE", //1 per 10 Seconds
        durationSeconds: 10,
        repeat: 2,
        progress: 1,
    },
    {
        title: "HIRE AN ASSASSIN", //1 per Second
        durationSeconds: 1,
        repeat: 19,
        generator: "Assassins"
    },
    {
        title: "HIRE A KILLER", //100 per Second
        durationSeconds: 2,
        repeat: 13,
        generator: "Killers"
    },
    {
        title: "HIRE A TERRORIST", //10000 per Second
        durationSeconds: 3,
        repeat: 7,
        generator: "Terrorists"
    },
    {
        title: "FEED WORLD FORMULA",
        durationSeconds: 1,
        repeat: 9,
        headerText: <>You can feed your evil energy into the World Formula!</>,
    },
    {
        title: "ENHANCE WORLD FORMULA",
        durationSeconds: 10,
        headerText: <>The World Formula has absorbed enough evil energy to be enhanced!</>,
    },
    {
        title: "ELIMINATE HALF OF POPULATION",
        durationSeconds: 5,
        split: 2,
        requirement: 7999999988,
        headerText: <>The World Formula is at maximum power!</>,
    },
    {
        title: "KILL A PERSON",
        progress: 1,
        durationSeconds: 10,
        requirement: 7999999999,
        headerText: <>Your hirees are dead! Even the World Formula is disgusted by your actions and refuses to help.<br/><br/>You will have to finish this completely on your own.</>
    },
    {
        title: "KILL A PERSON",
        progress: 1,
        durationSeconds: 10,
        hesitance: true,
    },
    {
        title: "You are Dead!",
        durationSeconds: 3,
        headerText: <>~Evil Ending~</>,
        teaseHeaderText: <>~???? ??????~</>,
        quoteText: <>&ldquo;It is a man’s own mind, not his enemy or foe, that lures him to evil ways.&rdquo;</>,
        quoteAuthor: <>&ndash;Buddha</>,
        final:true,
        endingName:"evil",
    },
]
const evilGenerators = [
    {
        title: "Assassins",
        production: 1,
    },
    {
        title: "Killers",
        production: 100,
    },
    {
        title: "Terrorists",
        production: 10000,
    }
]
const goodActions = [
    {
        title: "LISTEN TO A FRIEND",
        durationSeconds: 3,
        headerText: <>The World Formula lets you achieve anything!</>,
    },
    {
        title: "HELP AN ELDERLY PERSON",
        durationSeconds: 3,
    },
    {
        title: "DONATE CLOTHES",
        durationSeconds: 3,
    },
    {
        title: "SPREAD JOY",
        durationSeconds: 3,
    },
    {
        title: "SAVE THE ANIMALS",
        durationSeconds: 3,
    },
    {
        title: "STOP CLIMATE CHANGE",
        durationSeconds: 3,
    },
    {
        title: "SOLVE WORLD HUNGER",
        durationSeconds: 3,
    },
    {
        title: "ACHIEVE WORLD PEACE",
        durationSeconds: 3,
    },
    {
        title: "CURE AN ILLNESS", //1 per 10 Seconds
        durationSeconds: 10,
        progress: 1,
        repeat: 2,
    },
    {
        title: "HIRE A RESEARCHER", //1 per 10 Seconds
        durationSeconds: 5,
        repeat: 3,
        generator: "Researchers"
    },
    {
        title: "HIRE A SCIENTIST", //1 per 2 Seconds
        durationSeconds: 5,
        repeat: 7,
        generator: "Scientists"
    },
    {
        title: "HIRE A GENIUS", //3 per Second
        durationSeconds: 5,
        repeat: 11,
        generator: "Geniuses"
    },
    {
        title: "FEED WORLD FORMULA",
        durationSeconds: 1,
        feedingBonus: 1,
        repeat: 9,
        headerText: <>You can feed your good energy into the World Formula!</>,
    },
    {
        title: "ENHANCE WORLD FORMULA",
        durationSeconds: 10,
        headerText: <>The World Formula has absorbed enough good energy to be enhanced!</>,
    },
    {
        title: "CURE HALF",
        durationSeconds: 5,
        requirement: 29988,
        split: 2,
        headerText: <>The World Formula is at maximum power!</>,
    },
    {
        title: "CURE AN ILLNESS",
        durationSeconds: 15,
        requirement: 29999,
        progress: 1,
        headerText: <>Those last Illnesses are really tough. Neither your hirees nor the World Formula are able to cure them! <br/><br/>You will have to finish this completely on your own.</>,
    },
    {
        title: "CURE AN ILLNESS",
        durationSeconds: 60,
        progress: 1,
    },
    {
        title: "You are Cured!",
        endingName:"good",
        durationSeconds: 3,
        headerText: <>~Good Ending~</>,
        teaseHeaderText: <>~???? ??????~</>,
        quoteText: <>&ldquo;You don't need to save the world.<br/>You just need to save one person.<br/>And it is okay if that person is you.&rdquo;</>,
        quoteAuthor: undefined,
        final:true,
    },
]
const goodGenerators = [
    {
        title: "Researchers",
        production: 0.1,
    },
    {
        title: "Scientists",
        production: 1,
    },
    {
        title: "Geniuses",
        production: 10,
    }
]

const trueActions = [
    {
        title: "ADD 1",
        durationSeconds: 1,
        repeat: 4,
        getValue: (r)=>(r),
        headerText: <>The World Formula makes numbers go up!</>
    },
    {
        title: "ROUND UP GENEROUSLY",
        durationSeconds: 5,
        getValue: ()=>100,
        setAmount: 100,
    },
    {
        title: "MULTIPLY BY 2",
        durationSeconds: 1,
        repeat: 19,
        getValue: (r)=>(100*Math.pow(2,r)),
    },
    {
        title: "ROUND UP GENEROUSLY",
        durationSeconds: 5,
        getValue: (r)=>1e10,
    },
    {
        title: "RAISE BY 2",
        repeat: 18,
        getValue: (r)=>("1e"+10*Math.pow(2,r)),
        durationSeconds: 1,
    },
    {
        title: "RAISE BY 2",
        repeat: 18,
        getValue: (r)=>{
            const numbertext = Math.pow(2,r+19).toExponential()
            const prefix = numbertext.charAt(0)
            const suffix = numbertext.split("+")[1]
            return (prefix + "ee" + suffix)
        },
        durationSeconds: 1,
    },
    {
        title: "ROUND UP GENEROUSLY",
        durationSeconds: 5,
        getValue: ()=>"1eee5"
    },
    {
        title: "FEED WORLD FORMULA",
        durationSeconds: 1,
        repeat: 9,
        headerText:<>You can feed your incremental energy into the World Formula!</>,
    },
    {
        title: "ENHANCE WORLD FORMULA",
        durationSeconds: 10,
        headerText: <>The World Formula has absorbed enough incremental energy to be enhanced!</>,
    },
    {
        title: "ADD ANOTHER E",
        durationSeconds: 1,
        repeat: 29,
        getValue: (r)=>("1" + ("e").repeat(r+3) + "5"),
        headerText: <>The World Formula is at maximum power!</>,
    },
    {
        title: "ROUND UP GENEROUSLY",
        durationSeconds: 10,
        getValue: (r)=>("1" + ("e").repeat(500) + "5"),
    },
    {
        title: "LOOK AT YOUR CREATION",
        durationSeconds: 10,
    },
    {
        title: "BE SATISFIED WITH IT",
        durationSeconds: 10,
    },
    {
        title: "FEEL THE HAPPINESS",
        durationSeconds: 10,
    },
    {
        title: "FIND INNER PEACE",
        durationSeconds: 30,
    },
    {
        title: "TAKE A DEEP BREATH",
        durationSeconds: 10,
        headerText: <>The World Formula is at maximum power!<br/><br/>You found inner peace!</>,
    },
    {
        title: "FIND INNER PEACE",
        durationSeconds: 5,
        headerText: <>The World Formula is at maximum power!<br/><br/>You found inner peace!</>,
    },
    {
        title: "FIND INNER PEACE",
        durationSeconds: 5,
        headerText: <>The World Formula is at maximum power!<br/><br/>You found 2 inner peaces!</>,
    },
    {
        title: "FIND INNER PEACE",
        durationSeconds: 5,
        headerText: <>The World Formula is at maximum power!<br/><br/>You found 3 inner peaces!</>,
    },
    {
        title: "FIND INNER PEACE",
        durationSeconds: 5,
        headerText: <>The World Formula is at maximum power!<br/><br/>You found 4 inner peaces!</>,
    },
    {
        title: "FIND INNER PEACE",
        durationSeconds: 5,
        headerText: <>The World Formula is at maximum power!<br/><br/>You found 5 inner peaces!</>,
    },
    {
        title: "PIECE THE PEACES TOGETHER",
        durationSeconds: 5,
        headerText: <>The World Formula is at maximum power!<br/><br/>You found 6 inner peaces!</>,
    },
    {
        title: "PREPARE TO MOVE ON",
        getValue: ()=>0,
        durationSeconds: 30,
        headerText: <>The World Formula is at maximum power!<br/><br/>You solved the peace puzzle!</>,
    },
    {
        title: "MOVE ON",
        getValue: ()=>0,
        durationSeconds: 10,
        headerText: <></>,
    },
    {
        title: "You Win!",
        durationSeconds: 3,
        headerText: <>~True Ending~</>,
        teaseHeaderText: <>~???? ??????~</>,
        quoteText: <>&ldquo;Incremental progress leads to long-lasting results.&rdquo;</>,
        quoteAuthor: <>&ndash;Frank Sonnenberg</>,
        buttonText: "THE END",
        buttonText2: "But I still want more :(",
        endingName:"true",
        endingName2:"world",
        final:true,
    }
]

const worldActions = [
    {
        title: "MOVE ON",
        durationSeconds: 10,
    },
    {
        title: "MOVE ON",
        durationSeconds: 10,
        headerText: <>Hey, why are you back here?</>,
    },
    {
        title: "MOVE ON",
        durationSeconds: 10,
        headerText: <>Anyways, there isn't anything left for you to do.</>,
    },
    {
        title: "MOVE ON",
        durationSeconds: 10,
        headerText: <>You should really move on from this game.</>,
    },
    {
        title: "MOVE ON",
        durationSeconds: 10,
    },
    {
        title: "MOVE ON.",
        durationSeconds: 10,
    },
    {
        title: "MOVE ON..",
        durationSeconds: 10,
    },
    {
        title: "MOVE ON...",
        barColor: "#ff7777",
        durationSeconds: 30,
    },
    {
        title: "MOVE ON TO THE NEXT LAYER",
        barColor: "#ff7777",
        finishOnClick: true,
        endingName: "world"
    },
]
export const endingList = {
    good: {
        title:<>Cure the World</>,
        titlestring: "Cure the World",
        teaseTitle:<>???? ??? ?????</>,
        actions:goodActions,
        generators:goodGenerators,
        currencyName: "Illnesses: ",
        currencyGoal: 30000,
        productionName: "CpS",
        ascending: -1,
    },
    evil: {
        title:<>Extinction</>,
        titlestring: "Extinction",
        teaseTitle:<>??????????</>,
        actions:evilActions,
        generators:evilGenerators,
        currencyName: "World Population: ", 
        currencyGoal: 8000000000,
        productionName: "KpS",
        ascending: -1,
        generatorDecay: true,
    },
    true: {
        title:<>Numbers and Games</>,
        titlestring: "Numbers and Games",
        teaseTitle:<>??????? ??? ?????</>,
        actions:trueActions,
        generators:[],
        currencyName: "x = ",
        currencyGoal: Infinity,
        productionName: "",
        ascending: 1,
        valueBased: true,
    },
    world: {
        actions:worldActions,
        generators:[],
        currencyName: "x = ",
        currencyGoal: 1000,
        productionName: "",
        ascending: 1,
        valueBased: true,
    },
    skipped: {
        title:"No Ambitions",
        titlestring: "No Ambitions",
        teaseTitle:"?? ?????????",
    actions:[{
        title: "You are Speedrunning!",
        durationSeconds: 3,
        headerText: <>~Skipped Ending~</>,
        quoteText: <>&ldquo;With great power comes great responsibility.&rdquo;</>,
        teaseHeaderText: <>~??????? ??????~</>,
        storyText: <>Who cares about the story anyway?<br/>You just finished World Formula Any%!</>,
        final:true,
        endingName:"skipped",
        instaDestiny:true,
    }]},
    logarithm: {titlestring: "Depressed Logarithm", actions:[{
        title: "Depressed Logarithm",
        teaseTitle:"????????? ?????????",
        durationSeconds: 3,
        headerText: <>~Bad Ending~</>,
        teaseHeaderText: <>~??? ??????~</>,
        storyText: <>That poor logarithm was in need of some positivity.<br/>You failed to provide that.</>,
        final:true,
        endingName:"logarithm",
        instaDestiny:true,
    }]},
    negative: {titlestring: "Negative Hell", actions:[{
        title: "Negative Hell",
        teaseTitle:"???????? ????",
        durationSeconds: 3,
        headerText: <>~Bad Ending~</>,
        teaseHeaderText: <>~??? ??????~</>,
        storyText: <>As you venture into the depths below Negative Space, you find yourself trapped in Negative Hell.<br/>Be more careful next time!</>,
        final:true,
        endingName:"negative",
        instaDestiny:true,
    }]},
    divide: {titlestring: "The not so Great Divide", actions:[{
        title: "The not so Great Divide",
        teaseTitle:"??? ??? ?? ????? ??????",
        durationSeconds: 3,
        headerText: <>~Bad Ending~</>,
        teaseHeaderText: <>~??? ??????~</>,
        storyText: <>As soon as you divide by zero the universe implodes.</>,
        final:true,
        endingName:"divide",
        instaDestiny:true,
    }]},
    imaginary: {titlestring: "Too Complex", actions:[{
        title: "Too Complex",
        teaseTitle:"??? ???????",
        durationSeconds: 3,
        headerText: <>~Bad Ending~</>,
        teaseHeaderText: <>~??? ??????~</>,
        storyText: <>This game cannot handle roots of negative numbers.<br/>So I need to leave the rest of this story to your imagination.</>,
        final:true,
        endingName:"imaginary",
        instaDestiny:true,
    }]},
    infinite: {titlestring: "Infinite Problems", actions:[{
        title: "Infinite Problems",
        teaseTitle:"???????? ????????",
        durationSeconds: 3,
        headerText: <>~Bad Ending~</>,
        teaseHeaderText: <>~??? ??????~</>,
        storyText: <>There are infinitely many things that can go wrong when doing maths.<br/>Be more careful next time!.</>,
        final:true,
        endingName:"infinite",
        instaDestiny:true,
    }]},
    timeout: {titlestring: "Timed Out", actions:[{
        title: "Timed Out",
        teaseTitle:"????? ???",
        durationSeconds: 3,
        headerText: <>~Bad Ending~</>,
        teaseHeaderText: <>~??? ??????~</>,
        storyText: <>Sometimes, when things are not working out favorably, it is best to quit early.<br/>Instead of wasting time like you just did.</>,
        final:true,
        endingName:"timeout",
        instaDestiny:true,
    }]},
}

export const orderedEndings = ["timeout","divide","imaginary","logarithm","infinite","negative","good","evil","skipped","true"]