/*
TODO:
Make a compile-to-js method to compile the CLI lang to JavaScript for optional JavaScript execution (probably would have to be through eval() though...).
*/


/*CLIp stands for "CLI parser"*/
"use strict";
let CLIp = {};
(function(){
    let objList = null;
    let modes = {"executionMode":{"value":"readWrite","allowedValues":["writeOnly","readOnly","readWrite"]}};
    CLIp.InitRoot = function(){
        objList = new Object();
        return objList;
    };
    CLIp.ChangeExecutionMode = function(mode/*writeOnly,readOnly,readWrite*/){
        if(modes.executionMode.allowedValues.filter(function(val){return val === mode}).length < 1){
            throw new TypeError("Unrecognized execution mode \"" + mode + "\". Accepted types are: " + modes.executionMode.allowedValues);
        }
        modes.executionMode.value = mode;
        return modes.executionMode.value;
    };
    CLIp.DefineMainObject = function(mainObject){
        if(objList === null){
            throw new Error("Root object is not initiated.");
        }
        if(typeof mainObject === typeof void(0)){
            throw new TypeError("Parameter \"mainObject\" (argument 1) is not defined.");
        }
        if(typeof mainObject !== typeof ""){
            throw new TypeError("Parameter \"mainObject\" (argument 1) must be a string containing the name of the main object.");
        }
        Object.defineProperty(objList,mainObject,{value:{}});
        return objList[mainObject];
    };
    CLIp.BindProperty = function(mainObject,propertyArray){
        if(objList === null){
            throw new Error("Root object is not initiated.");
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
        Object.defineProperty(mainObject,propertyArray[0].toString(),{value:{allowedValues:Array(0),type:"property",value:propertyArray[1]}});
        return mainObject[propertyArray[0]];
    };
    CLIp.BindMethod = function(mainObject,methodArray){
        if(objList === null){
            throw new Error("Root object is not initiated.");
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
        Object.defineProperty(mainObject,methodArray[0].toString(),{value:{type:"method",value:methodArray[1]}});
        return mainObject[methodArray[0]];
    };
    CLIp.BindRestrictiveProperty = function(mainObject,propertyArray){
        if(objList === null){
            throw new Error("Root object is not initiated.");
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
        Object.defineProperty(mainObject,propertyArray[0].toString(),{value:{allowedValues:propertyArray[2],value:propertyArray[1]}});
        return mainObject[propertyArray[0]];
    };
    CLIp.ReturnRoot = function(){
        if(objList === null){
            throw new Error("Root object is not initiated.");
        }
        return objList;
    };
    CLIp.ReturnAllowedValues = function(object){
        if(objList === null){
            throw new Error("Root object is not initiated.");
        }
        if(typeof Object.prototype.toString.call(object) !== typeof Object.prototype.toString.call(Object())){
            throw new TypeError("Parameter \"object\" must be a valid object.");
        }
        return object.allowedValues;
    };
    CLIp.GetMainObject = function(mainObject){
        if(objList === null){
            throw new Error("Root object is not initiated.");
        }
        if(typeof mainObject === typeof void(0)){
            return objList;
        }
        return objList[mainObject];
    };
    CLIp.CheckCommandLegality = function(command){
        if(objList === null){
            throw new Error("Root object is not initiated.");
        }
        /*::->value is valid and can be interpreted as null::null->value (because I'm lazy; I'll do more later). Right now this is just a bunch of if's and then's to check if the statement contains a pointer and if it doesn't contain a pointer or a setter and all.*/
        if(typeof command === typeof void(0)){
            throw new TypeError("Parameter \"command\" (argument 1) is not defined.");
        }
        return new Promise(function(res,rej){
            let validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
            /*Determines whether or not a setter might be found (char starts with "-").*/
            let isSetter = false;
            /*If indeed it is a setter then it will be declared so in this variable.*/
            let setterFound = false;
            /*If a potential pointer is found then it is declared so in this variable.*/
            let isPtr = false;
            let isEscape = false;
            /*Right now strings can only be declared with double quotes, so no single quotes for now.*/
            let isStr = false;
            /*To report if an error occures.*/
            let colNum = 0;
            /*The first loop checks the Syntax of the statement. (Checks the class navigation)*/
            for(let x of command){
                colNum++;
                if(x === "\"" && !isStr){
                    isStr = true;
                    continue;
                }
                if(x === "\"" && isStr){
                    isStr = false;
                    continue;
                }
                if(x === "-" && !isStr){
                    isSetter = true;
                    continue;
                }
                if(x === ">" && isSetter){
                    isSetter = false;
                    setterFound = true;
                }
                if(x !== ">" && isSetter && !isStr){
                    rej(new SyntaxError("(CLIp parser): Expected setter operand \"->\" found \"-" + x + "\" (this is an reserved operand). Column number: " + colNum + "."));
                }
                if(x === ":" && !isPtr && !isStr){
                    isPtr = true;
                    continue;
                }
                if(x === ":" && isPtr && !isStr){
                    isPtr = false;
                    continue;
                }
                if(x !== ":" && isPtr && !isStr){
                    rej(new SyntaxError("(CLIp parser): Expected parent-property pointer \"::\" found \":" + x + " (this is a reserved operand). Column number: " + colNum + "."));
                }
                /*We are only checking for syntax for the class navagation.*/
                if(setterFound === true) continue;
                /*Like any programming language, there are only so many characters allowed. There's not many characters needed in this langauge but since it gets executed in JavaScript I need to make sure it doesn't clash with both my language and JavaScript itself!*/
                if(validChars.filter(function(val){return val === x}).length < 1 && !isSetter && !isPtr && !isStr){
                    rej(new SyntaxError("(CLIp parser): Illegal char: \"" + x + "\". Column number: " + colNum + "."));
                }
            }
            if(isSetter){
                rej(new SyntaxError("(CLIp parser): Unexpected EOS (end of statement): expecting a setter statement found \"-\" (unfinished statement). Column number: " + colNum + "."));
            }
            if(isStr){
                rej(new SyntaxError("(CLIp parser): Unclosed string. Column number: " + colNum + "."));
            }
            if(isPtr){
                rej(new SyntaxError("(CLIp parser): Unexpected EOS (end of statement): expecting a parent-property pointer found \":\" (unfinished statement). Column number: " + colNum + "."));
            }
            /*I only check the last one because under other circumstances it is either an unfinished statement or an illegal character.*/
            if(command.split("")[command.split("").length - 1] === ":"){
                rej(new SyntaxError("(CLIp parser): Unexpected EOS (end of statement): expecting a right-side property after \"::\" (a parent-property pointer) but found EOS instead. Column number: " + colNum + "."));
            }
            /*Read the comment above.*/
            if(command.split("")[command.split("").length - 1] === ">"){
                rej(new SyntaxError("(CLIp parser): Unexpected EOS (end of statement): expecting a right-side value after \"->\" (a property-assign/method-call operator) but found EOS instead. Column number: " + colNum + "."));
            }
            isSetter = false;
            isStr = false;
            isPtr = false;
            setterFound = false;
            colNum = 0;
            /*Second round checks the value of the setter.*/
            for(let x of command){
                colNum++;
                if(x === "\"" && !isStr){
                    isStr = true;
                    continue;
                }
                if(x === "\"" && isStr){
                    isStr = false;
                    continue;
                }
                if(x === "-" && !isStr){
                    isSetter = true;
                    continue;
                }
                if(x === ">" && isSetter && setterFound){
                    rej(new SyntaxError("(CLIp parser): Cannot perform multi-assignment in one statement declaration. Column number: " + colNum + "."));
                }
                if(x === ">" && isSetter && !setterFound){
                    isSetter = false;
                    setterFound = true;
                }
                if(x === ":" && !isPtr && !isStr){
                    isPtr = true;
                    continue;
                }
                if(x === ":" && isPtr && !isStr){
                    isPtr = false;
                    continue;
                }
                /*Like any programming language, there are only so many characters allowed. There's not many characters needed in this langauge but since it gets executed in JavaScript I need to make sure it doesn't clash with both my language and JavaScript itself!*/
                if(validChars.filter(function(val){return val === x}).length < 1 && !isSetter && !isPtr && !isStr && !setterFound){
                    rej(new SyntaxError("(CLIp parser): Illegal char: \"" + x + "\". Column number: " + colNum + "."));
                }
            }
            if(!setterFound && modes.executionMode.value === "writeOnly"){
                /*Later I'm going to change this to a compile-time error or something.*/
                throw new Error("Cannot omit property-assign/method-call operator in  \"write-only\" mode.");
            }
            if(setterFound && modes.executionMode.value === "readOnly"){
                throw new Error("Cannot property-assign/method-call in \"read-only\" mode.");
            }
        });
    };
    CLIp.ParseCLI = function(command){
        if(objList === null){
            throw new Error("Root object is not initiated.");
        }
        if(typeof command === typeof void(0)){
            throw new TypeError("Parameter \"command\" (argument 1) is not defined.");
        }
        let parseClassPtr = function(cmd){
            let obj = {};
        };
        CLIp.CheckCommandLegality(command);
        // if(!command.match(/->/)){
        //     throw new SyntaxError("Parameter \"command\" has a syntax error.");
        // }
        // let splitCommand = command.split("->");
        // if(splitCommand.length < 2){
        //     throw new SyntaxError("Parameter \"command\" has a syntax error.");
        // }
        // let classArray = splitCommand[0].split("::");
        // let objParent = objList;
        // classArray.forEach(function(v){
        //     if(typeof objParent[v] === typeof void(0)){
        //         throw new TypeError("Command not found.");
        //     }
        //     else{
        //         objParent = objParent[v];
        //     }
        // });
        // if(typeof objParent.allowedValues === typeof void(0) && objParent.type !== "method") return;
        // if(objParent.type === "method"){
        //     let args = splitCommand[1].split(";");
        //     if(args.length < 2){
        //         objParent.value(args[0]);
        //     }
        //     else{
        //         objParent.value.apply(null,args);
        //     }
        // }
        // else{
        //   if(objParent.allowedValues.length < 1){
        //       objParent.value = splitCommand[1];
        //   }
        //   else{
        //       if(objParent.allowedValues.filter(function(val){return val === splitCommand[1]}).length < 1){
        //           throw new EvalError("Restricted from setting \"" + classArray[classArray.length - 1] + "\"'s value to \"" + splitCommand[1] + "\" because it violates the allowed types set for the specific property.");
        //       }
        //       else{
        //           objParent.value = splitCommand[1];
        //       }
        //   }  
        // }
    };            
})();