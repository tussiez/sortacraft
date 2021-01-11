/*
TODO:
    Quite a lot.

    *Make a compile-to-js method to compile the CLI lang to JavaScript for optional JavaScript execution (probably would have to be through eval() though...).
    *Make the ability to listen for property changes/method-calls.
    *Make the ability to call functions with null or undefined and pass them in as arguments (to represent a argumentless function). However, allow them in a string (like "null" instead of null (without paranthesis)) (LOL I have no idea what this means I wrote this at night). -- rip
    *Make the ability to assign a value of one property/call a method with the value of another property (Allow parent-property pointers after the setter operator).
    *Make the above also compatible with the value of assigning a property/callig a method (Allow multiple assignment operators).
    *Make the errors have a prefix with their type in the constructor instead of having to write it every time (E.g: ParsetimeError adds "(CLIp parser): " to the beginning).
    *Examine the error types to make sure they actually ARE the right types (I might have a few error types that should be another type I don't know...).
    *Find a way to check if a method returns anything (to list it as a void or a whatever you call a function with a return value) (probably will have to be through user definition).
    *Make the ability to create extra objects (bind main objects to main objects, essentially);
    *Allow character escaping
    *Make read-only values.
    

BUGS:

    *CLIp main-object doesn't allow case-insensitivity.
    
*/

/*----------------------------------------------------*/

/*
    Honestly the parsing and syntax checking probably isn't the best way to check the legality of the code...
*/

/*-----------------------------*/

/*CLIp stands for "CLI parser"*/
"use strict";
let CLIp = {};
(function(){
    /*Defines the custom errors we need.*/
    
    /*CompiletimeError will be used when compiling to a JavaScript function (it's basically a ParsetimeError but used when compiling CLIp code to JavaScript).*/
    class CompiletimeError extends Error {
      constructor(message, ...args) {
        super(message, ...args);
        this.name = "CompiletimeError";
        this.message = message;
      }
    }
    class RuntimeError extends Error{
        constructor(message,...args){
            super(message,...args);
            this.name = "RuntimeError";
            this.message = message;
        }
    }
    class ParsetimeError extends Error{
        constructor(message,...args){
            super(message,...args);
            this.name = "ParsetimeError";
            this.message = message;
        }
    }
    class InitializationError extends Error{
        constructor(message,...args){
            super(message,...args);
            this.name = "InitializationError";
            this.message = message;
        }
    }
    let objList = null;
    let modes = {"executionMode":{"value":"readWrite","allowedValues":["writeOnly","readOnly","readWrite"]},"strictMode":false,"strictCommandMode":false};
    CLIp.InitRoot = function(){
        objList = new Object();
        /*To make sure the user always has a way of getting help.*/
        Object.defineProperty(objList,"CLIp",{value:{type:"CLIp-Help",enumerable:true,writable:false,configurable:false}});
        Object.defineProperty(objList["CLIp"],"About",{value:{type:"property",allowedValues:[""],value:"CLIp (Stands for \"CLI parser\", pronounced \"Clype\") is a CLI (Command Line Interface) that is programmed in JavaScript.\nIt allows functionality for creating a terminal-like interface for applications (especially online games).\n\nCLIp is built and maintained by Baconman321, so check him out (https://repl.it/@baconman321)! If you want a tutorial on how to use CLIp just type into the terminal \"CLIp::OpenTutorial->null\"."},enumerable:true,writable:false,configurable:false});
        Object.defineProperty(objList["CLIp"],"OpenTutorial",{value:{type:"method",value:function(){/*Currently I don't have a website for this.*/window.open("");}},enumerable:true,writable:false,configurable:false});
        return objList;
    };
    CLIp.ChangeExecutionMode = function(mode/*writeOnly,readOnly,readWrite*/){
        if(modes.executionMode.allowedValues.filter(function(val){return val === mode}).length < 1){
            throw new InitializationError("(CLIp Initializer): Unrecognized execution mode \"" + mode + "\". Accepted types are: " + modes.executionMode.allowedValues);
        }
        modes.executionMode.value = mode;
        return modes.executionMode.value;
    };
    CLIp.EnableStrictMode = function(){
        if(objList === null){
            throw new InitializationError("(CLIp Initializer): Root object is not initiated.");
        }
        modes.strictMode = true;
    };
    CLIp.DisableStrictMode = function(){
        if(objList === null){
            throw new InitializationError("(CLIp Initializer): Root object is not initiated.");
        }
        modes.strictMode = false;
    };
    CLIp.enableStrictCommandMode = function(){
        modes.strictCommandMode = true;
    };
    CLIp.disableStrictCommandMode = function(){
        modes.strictCommandMode = false;
    };
    CLIp.DefineMainObject = function(mainObject){
        if(objList === null){
            throw new InitializationError("(CLIp Initializer): Root object is not initiated.");
        }
        if(typeof mainObject === typeof void(0)){
            throw new TypeError("Parameter \"mainObject\" (argument 1) is not defined.");
        }
        if(typeof mainObject !== typeof ""){
            throw new TypeError("Parameter \"mainObject\" (argument 1) must be a string containing the name of the main object.");
        }
        Object.defineProperty(objList,mainObject,{value:{type:"Main-object"},enumerable:true});
        return objList[mainObject];
    };
    CLIp.BindProperty = function(mainObject,propertyArray){
        if(objList === null){
            throw new InitializationError("(CLIp Initializer): Root object is not initiated.");
        }
        if(typeof mainObject === typeof void(0)){
            throw new TypeError("Paramter \"mainObject\" (argument 1) is not defined.");
        }
        if(typeof propertyArray === typeof void(0)){
            throw new TypeError("Parameter \"propertyArray\" (argument 2) is not defined.");
        }
        if(typeof Object.prototype.toString.call(mainObject) !== typeof Object.prototype.toString.call(Object())){
            throw new TypeError("Parameter \"mainObject (argument 2) is not an object to bind the property to.");
        }
        if(typeof Object.prototype.toString.call(propertyArray) !== typeof Object.prototype.toString.call([])){
            throw new TypeError("Paramter \"propertyArray\" (argument 2) is not a valid array with values containing the name of the property of type \"string\" and the value.");
        }
        if(typeof propertyArray[0] !== typeof ""){
            throw new TypeError("Paramter \"propertyArray\" (argument 2) is not a valid array with values containing the name of the property of type \"string\" and the value.");
        }
        if(typeof Object.prototype.toString.call(propertyArray[1]) === typeof Object.prototype.toString.call({})){
            throw new TypeError("The value cannot be an object. Try using \"defineMainObject()\" instead.");
        }
        Object.defineProperty(mainObject,propertyArray[0].toString(),{value:{type:"property",value:propertyArray[1],allowedValues:new Array(0)},enumerable:true});
        return mainObject[propertyArray[0]];
    };
    CLIp.BindMethod = function(mainObject,methodArray){
        if(objList === null){
            throw new InitializationError("(CLIp Initializer): Root object is not initiated.");
        }
        if(typeof mainObject === typeof void(0)){
            throw new TypeError("Paramter \"mainObject\" (argument 1) is not defined.");
        }
        if(typeof methodArray === typeof void(0)){
            throw new TypeError("Parameter \"methodArray\" (argument 2) is not defined.");
        }
        if(typeof Object.prototype.toString.call(mainObject) !== typeof Object.prototype.toString.call(Object())){
            throw new TypeError("Parameter \"mainObject (argument 2) is not an object to bind the property to.");
        }
        if(typeof methodArray[0] !== typeof ""){
            throw new TypeError("Paramter \"methodArray\" (argument 2) is not a valid array with values containing the name of the method of type \"string\" and the method of type \"function\".");
        }
        if(typeof methodArray[1] !== typeof function(){}){
            throw new TypeError("Paramter \"methodArray\" (argument 2) is not a valid array with values containing the name of the method of type \"string\" and the method of type \"function\".");
        }
        if(typeof methodArray[0] !== typeof ""){
            throw new TypeError("Paramter \"propertyArray\" (argument 2) is not a valid array with values containing the name of the property of type \"string\" and the value.");
        }
        if(typeof methodArray[1] === typeof {}){
            throw new TypeError("The value cannot be an object. Try using \"defineMainObject()\" instead.");
        }
        Object.defineProperty(mainObject,methodArray[0].toString(),{value:{type:"method",value:methodArray[1]},enumerable:true});
        return mainObject[methodArray[0]];
    };
    /*Restriction values will be converted to a string. If you want to convert it to a number you will have to use the Number() function.*/
    CLIp.BindRestrictiveProperty = function(mainObject,propertyArray){
        if(objList === null){
            throw new InitializationError("(CLIp Initializer): Root object is not initiated.");
        }
        if(typeof mainObject === typeof void(0)){
            throw new TypeError("Paramter \"mainObject\" (argument 1) is not defined.");
        }
        if(typeof propertyArray === typeof void(0)){
            throw new TypeError("Parameter \"propertyArray\" (argument 2) is not defined.");
        }
        if(typeof Object.prototype.toString.call(mainObject) !== typeof Object.prototype.toString.call(Object())){
            throw new TypeError("Parameter \"mainObject (argument 2) is not an object to bind the property to.");
        }
        if(typeof Object.prototype.toString.call(propertyArray) !== typeof Object.prototype.toString.call([])){
            throw new TypeError("Paramter \"propertyArray\" (argument 2) is not a valid array with values containing the name of the property of type \"string\",the value and an array containing the allowed values.");
        }
        if(typeof Object.prototype.toString.call(propertyArray[0]) !== typeof Object.prototype.toString.call("")){
            throw new TypeError("Paramter \"propertyArray\" (argument 2) is not a valid array with values containing the name of the property of type \"string\",the value and an array containing the allowed values.");
        }
        if(typeof propertyArray[1] === typeof void(0)){
            throw new TypeError("Paramter \"propertyArray\" (argument 2) is not a valid array with values containing the name of the property of type \"string\",the value and an array containing the allowed values.");
        }
        if(typeof Object.prototype.toString.call(propertyArray[2]) !== typeof Object.prototype.toString.call([])){
            throw new TypeError("Paramter \"propertyArray\" (argument 2) is not a valid array with values containing the name of the property of type \"string\",the value and an array containing the allowed values.");
        }
        Object.defineProperty(mainObject,propertyArray[0].toString(),{value:{type:"property",value:propertyArray[1],allowedValues:propertyArray[2]},enumerable:true});
        return mainObject[propertyArray[0]];
    };
    CLIp.ReturnRoot = function(){
        if(objList === null){
            throw new InitializationError("(CLIp Initializer): Root object is not initiated.");
        }
        return objList;
    };
    CLIp.ReturnAllowedValues = function(object){
        if(objList === null){
            throw new InitializationError("(CLIp Initializer): Root object is not initiated.");
        }
        if(typeof Object.prototype.toString.call(object) !== typeof Object.prototype.toString.call(Object())){
            throw new TypeError("Parameter \"object\" must be a valid object.");
        }
        return object.allowedValues;
    };
    CLIp.GetMainObject = function(mainObject){
        if(objList === null){
            throw new InitializationError("(CLIp Initializer): Root object is not initiated.");
        }
        if(typeof mainObject === typeof void(0)){
            return objList;
        }
        return objList[mainObject];
    };
    CLIp.CheckCommandLegality = function(command){
        if(objList === null){
            throw new InitializationError("(CLIp Initializer): Root object is not initiated.");
        }
        /*::->value is valid and can be interpreted as null::null->value (because I'm lazy; I'll do more later). Right now this is just a bunch of if's and then's to check if the statement contains a pointer and if it doesn't contain a pointer or a setter and all.*/
        if(typeof command === typeof void(0)){
            throw new TypeError("Parameter \"command\" (argument 1) is not defined.");
        }
        return new Promise(function(res,rej){
            let validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890;".split("");
            /*Determines whether or not a setter might be found (character starts with "-").*/
            let isSetter = false;
            /*If indeed it is a setter then it will be declared so in this variable.*/
            let setterFound = false;
            /*If a potential pointer is found then it is declared so in this variable.*/
            let isPtr = false;
            /*If a pointer is found.*/
            let ptrFound = false;
            /*If something is escaped (for later).*/
            let isEscape = false;
            /*Determines the last operator found (for errors)*/
            let operatorLast = false;
            /*Determines the line in which a possible unclosed string might be (for errors)*/
            let unclosedStrNum = 0;
            /*Right now strings can only be declared with double quotes, so no single quotes for now.*/
            let isStr = false;
            /*To report if an error occures.*/
            command.split("");
            for(let i = 0;i<command.length;i++){
                let x = command[i];
                if(x === "\"" && !isStr){
                    isStr = true;
                    unclosedStrNum = i + 1;
                    continue;
                }
                else if(x === "\"" && isStr){
                    isStr = false;
                    continue;
                }
                if(x === "-" && !isStr){
                    isSetter = true;
                    continue;
                }
                if(x === ">" && isSetter && setterFound && !operatorLast){
                    operatorLast = true;
                    rej(new SyntaxError("(CLIp parser): Cannot perform multi-assignment in single statement declaration. Column number: " + (i + 1) + "."));
                    return;
                }
                else if(x === ">" && isSetter && operatorLast){
                    rej(new SyntaxError("(CLIp parser): Cannot use a parent-property pointer on an operator. Column number: " + (i + 1) + "."));
                    return;
                }
                else if(x === ">" && isSetter && !setterFound){
                    operatorLast = true;
                    isSetter = false;
                    setterFound = true;
                    continue;
                }
                else if(x !== ">" && isSetter && !isStr){
                    rej(new SyntaxError("(CLIp parser): Expected setter operator \"->\" found \"-" + x + "\" (this does not correlate to a valid operator). Column number: " + (i + 1) + "."));
                    return;
                }
                if(x === ":" && ptrFound){
                    rej(new SyntaxError("(CLIp parser): Cannot point to invalid property. Expected value found \":\" instead. Did you use more than two consecutive colons? Column number: " + (i + 1) + "."));
                    return;
                }
                else if(x === ":" && isPtr && !isStr && operatorLast){
                    rej(new SyntaxError("(CLIp parser): Invalid assignment of operator to operator. Column number: " + (i + 1) + "."));
                    return;
                }
                else if(x === ":" && !isPtr && !isStr){
                    if(validChars.filter(function(val){return val === command[i - 1]}).length < 1){
                        if(typeof command[i - 1] === typeof void(0)){
                            rej(new SyntaxError("(CLIp parser): Expected a parent value before a pointer and found nothing (Left-hand side value for parent-property pointer not found). Column number: " + (i + 1) + "."));
                            return;
                        }
                        rej(new SyntaxError("(CLIp parser): Expected parent value before a pointer found \"" + command[i - 1] + "\" (this is not a valid character to represent a parent for a parent-property pointer). Column number: " + (i + 1) + "."));
                        return;
                    }
                    isPtr = true;
                    ptrFound = false;
                    continue;
                }
                else  if(x === ":" && isPtr && !isStr){
                    isPtr = false;
                    ptrFound = true;
                    operatorLast = true;
                    continue;
                }
                else if(x !== ":" && isPtr && !isStr){
                    rej(new SyntaxError("(CLIp parser): Expected parent-property pointer \"::\" found \":" + x + "\" (this does not correlate to a valid operator). Column number: " + (i + 1) + "."));
                    return;
                }
                if(x === ";" && !setterFound){
                    rej(new SyntaxError("CLIp parser): Argument seperator not allowed on Left-hand side of setter operator. Column number: " + (i + 1) + "."));
                    return;
                }
                /*Like any programming language, there are only so many characters allowed. There's not many characters needed in this langauge but since it gets executed in JavaScript I need to make sure it doesn't clash with both my language and JavaScript itself!*/
                if(validChars.filter(function(val){return val === x}).length < 1 && !isSetter && !isPtr && !isStr){
                    rej(new SyntaxError("(CLIp parser): Illegal character: \"" + x + "\". Column number: " + (i + 1) + "."));
                    return;
                }
                else{
                    /*Making sure it doesn't trigger on an operator character.*/
                    if(validChars.filter(function(val){return val === x}).length > 0 && !isStr){
                        operatorLast = false;
                        ptrFound = false;
                    }
                }
            }
            if(isSetter){
                rej(new SyntaxError("(CLIp parser): Unexpected EOS (end of statement): expecting a setter operator found \"-\" (unfinished operator). Column number: " + command.length + "."));
                return;
            }
            if(isStr){
                rej(new SyntaxError("(CLIp parser): Unclosed string. Column number: " + unclosedStrNum + "."));
            }
            if(isPtr){
                rej(new SyntaxError("(CLIp parser): Unexpected EOS (end of statement): expecting a parent-property pointer found \":\" (unfinished operator). Column number: " + command.length + "."));
                return;
            }
            /*I only check the last one because under other circumstances it is either an unfinished statement or an illegal character.*/
            if(command.split("")[command.split("").length - 1] === ":"){
                rej(new SyntaxError("(CLIp parser): Unexpected EOS (end of statement): expecting a Right-hand side property after \"::\" (a parent-property pointer) but found EOS instead. Column number: " + command.length + "."));
                return;
            }
            /*Read the comment above.*/
            if(command.split("")[command.split("").length - 1] === ">"){
                rej(new SyntaxError("(CLIp parser): Unexpected EOS (end of statement): expecting a right-side value after \"->\" (a setter operator) but found EOS instead. Column number: " + command.length + "."));
                return;
            }
            res(command);
        });
    };
    CLIp.ParseCLI = function(command){
        if(objList === null){
            throw new InitializationError("(CLIp Initializer): Root object is not initiated.");
        }
        if(typeof command === typeof void(0)){
            throw new TypeError("Parameter \"command\" (argument 1) is not defined.");
        }
        if(command.length < 1) return "";
        let parseStatementPtr = function(cmd){
            return new Promise(function(res,rej){
                let parentPropArr = [];
                let store = new Array(0);
                let setterFound = false;
                cmd.split("");
                for(let i = 0;i<cmd.length;i++){
                    let x = cmd[i];
                    if(x === "\""){
                        rej(new ParsetimeError("(CLIp parser): Strings are not allowed on Left-hand side of assignment operator."));
                        return;
                    }
                    if(x === ":" && cmd[i - 1] === ":"){
                        parentPropArr.push(store.join(""));
                        store = new Array(0);
                    }
                    else if(x === ":"){
                    }
                    else if(x === ">" && cmd[i - 1] === "-"){
                        setterFound = true;
                        break;
                    }
                    else if(x === "-"){
                    }
                    else{
                        store.push(x);
                    }
                }
                parentPropArr.push(store.join(""));
                store = new Array(0);
                /*Wouldn't these be a RuntimeError? IDK...*/
                if(!setterFound && modes.executionMode.value === "writeOnly"){
                    rej(new ParsetimeError("Cannot omit setter operator in  \"write-only\" mode."));
                    return;
                }
                else if(setterFound && modes.executionMode.value === "readOnly"){
                    rej(new ParsetimeError("Cannot set use setter operator in \"read-only\" mode."));
                    return;
                }
                let objProp = objList;
                parentPropArr.forEach(function(v){
                    if(modes.strictCommandMode === false){
                        for(let indx in objProp){
                            console.log(indx);
                            if(indx.toLowerCase() === v.toLowerCase()){
                                v = indx;
                            }
                        }
                    }
                    if(typeof objProp[v] === typeof void(0)){
                        console.log("Checking 2");
                        console.log(v);
                        console.log(objProp);
                        console.log(objProp[v]);
                        rej(new ParsetimeError("(CLIp parser): Property \"" + v + "\" is not defined."));
                        return;
                    }
                    else{
                        objProp = objProp[v];
                    }
                });
                res([cmd,objProp]);
            });
        };
        let parseStatementSetter = function(cmd,prop){
            return new Promise(function(res,rej){
                cmd.split("");
                let setterSide = new Array(0);
                let startCollecting = false;
                let isStr = false;
                /*To parse the code on the Right-hand side of the setter operator.*/
                for(let i = 0;i<cmd.length;i++){
                    let x = cmd[i];
                    if(x === "\"" && !isStr){
                        isStr = true;
                    }
                    else if(x === "\"" && isStr){
                        isStr = false;
                    }
                    if(x === ">" && cmd[i - 1] === "-" && !isStr){
                        startCollecting = true;
                        continue;
                    }
                    if(startCollecting){
                        setterSide.push(x);
                    }
                }
                let isProperty = false;
                /*We need to check if the object is a method, property or Main-object (or if the "type" even exists. If it doesn't it shouldn't be setttable). Note that main objects are not changable or executable.*/
                if(prop.type === "Main-object" && startCollecting){
                    rej(new ParsetimeError("(CLIp parser): Cannot set or execute a main object."));
                }
                if(typeof prop.type === typeof void(0) && startCollecting){
                    rej(new ParsetimeError("(CLIp parser): Property's type cannot be determined (\"property\",\"method\" or \"Main-object\") meaning that it is not changable (Main objects are not changable)."));
                    return;
                }
                if(prop.type === "method"){
                    isProperty = false;
                }
                else{
                    isProperty = true;
                }
                let storedValues = new Array(0);
                let storedArgs = new Array(0);
                let arg = new Array(0);
                /*If the object is a method we need to split the arguments on a semicolon.*/
                if(isProperty){
                    let isStr = false;
                    for(let i = 0;i<setterSide.length;i++){
                        let x = setterSide[i];
                        /*Right now I have no use for this because I am not checking for any illegal characters. I expect the syntax check to make sure that any "illegal" characters are inside a string.*/
                        /*Actually, I do! I do not allow parent-property pointers after the setter operator, but it's fine if it is in a string.*/
                        if(x === "\"" && !isStr){
                            isStr = true;
                        }
                        else if(x === "\"" && isStr){
                            isStr = false;
                        }
                        if(x === ":" && !isStr){
                            rej(new ParsetimeError("(CLIp parser): Parent-property pointers are not allowed on the Right-hand side of a setter operator. Column number: " + (i + 1) + "."));
                            return;
                        }
                        /*We don't want to store the quotation mark*/
                        if(x !== "\""){
                            storedValues.push(x);
                        }
                    }
                }
                else{
                    let isStr = false;
                    for(let i = 0;i<setterSide.length;i++){
                        let x = setterSide[i];
                        /*Right now I have no use for this because I am not checking for any illegal characters. I expect the syntax check to make sure that any "illegal" characters are inside a string.*/
                        /*Actually, I do! I do not allow parent-property pointers after the setter operator, but it's fine if it is in a string.*/
                        if(x === "\"" && !isStr){
                            isStr = true;
                        }
                        else if(x === "\"" && isStr){
                            isStr = false;
                        }
                        if(x === ":" && !isStr){
                            rej(new ParsetimeError("(CLIp parser): Parent-property pointers are not allowed on the Right-hand side of a setter operator. Column number: " + (i + 1) + "."));
                            return;
                        }
                        /*We don't want to store the quotation mark*/
                        if(x !== "\"" && x !== ";"){
                            arg.push(x);
                        }
                        else if(x === ";" && !isStr){
                            storedArgs.push(arg.join(""));
                            arg = new Array(0);
                        }
                    }
                    /*Technically the best way of doing it is "arg1;arg2", but someone could also do "arg1;arg2;" which is perfectly valid and would result in the second argument already being stored. Because of this we should check if it is already stored or not (by determing if "arg" as already been pushed into the "storedArgs" array).*/
                    if(arg.length > 0){
                        storedArgs.push(arg.join(""));
                        arg = new Array(0);
                    }
                }
                /*The reason we do !startCollecting is because it returns "false" if a setter isn't found and we are checking if it is only asking for the return value. Sure we could just have instead checked for if it wants to set something but that's just what I thought about first.*/
                if(isProperty){
                    res([cmd,prop,storedValues.join(""),isProperty,!startCollecting]);
                }
                else{
                    res([cmd,prop,storedArgs,isProperty,!startCollecting]);
                }
            });
        };
        let execStatement = function(cmd,prop,val,isProp,returnValueOnly){
            return new Promise(function(res,rej){
                try{
                    if(returnValueOnly){
                        let type = prop.type;
                        if(type === "method"){
                            type = "Executable Command";
                        }
                        else if(type === "property"){
                            type = "Changable Value";
                        }
                        else if(type === "Main-object"){
                            type = "Property Container";
                        }
                        else if(type === "CLIp-Help"){
                            type = "Official CLIp help commands";
                        }
                        else{
                            type = "Unknown";
                        }
                        if(type === "Property Container" || type === "Official CLIp help commands"){
                            res("(" + type + ") " + "\"" + JSON.stringify(prop) + "\"");
                        }
                        else{
                            res("(" + type + ") " + "\"" + prop.value + "\"");
                        }
                        
                    }
                    else{
                        if(typeof prop.allowedValues !== typeof void(0)){
                            if(prop.allowedValues.length > 0){
                                if(prop.allowedValues.filter(function(allowedVal){if(modes.strictCommandMode === true){return allowedVal === val}else{return allowedVal.toLowerCase() === val.toLowerCase();}}).length < 1){
                                    /*Because it doesn't indent the commas (gotta make it look neat!).*/
                                    let allowedValsStr = "";
                                    prop.allowedValues.forEach(function(v,i,arr){
                                        if(i < arr.length - 1){
                                            allowedValsStr += v + ", ";
                                        }
                                        else{
                                            allowedValsStr += v;
                                        }
                                    });
                                    rej(new RuntimeError("(CLIp runtime-checker): Cannot set property's value to \"" + val + "\" because it violates the allowed values for the property (\"" + allowedValsStr + "\")."));
                                    return;
                                }
                            }
                        }
                        let result;
                        if(isProp){
                            prop.value = val;
                            result = prop.value;
                        }
                        else{
                            result = prop.value.apply(null,val);
                        }
                        res(result);
                    }
                }
                catch(err){
                    rej(err);
                }
            });
        };
        return new Promise(function(res,rej){
            CLIp.CheckCommandLegality(command).then(function(c){
                return parseStatementPtr(c);
            }).then(function([cmd,prop]){
                return parseStatementSetter(cmd,prop);
            }).then(function([cmd,prop,val,isProp,returnValueOnly]){
                return execStatement(cmd,prop,val,isProp,returnValueOnly);
            }).then(function(result){
                res(result);
            }).catch(function(err){
                rej(err);
            });
        });
    };            
})();