/*UNFINISHED! DO NOT USE (collision problems)!!!*/
/*CLIp stands for "CLI parser"*/
"use strict";
let CLIp = {};
(function(){
    let objList = null;
    CLIp.initRoot = function(){
        objList = new Object();
        return objList;
    };
    CLIp.defineMainObject = function(mainObject){
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
    CLIp.bindProperty = function(mainObject,propertyArray){
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
    CLIp.bindMethod = function(mainObject,methodArray){
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
    CLIp.bindLimitedProperty = function(mainObject,propertyArray){
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
    }
    CLIp.returnRoot = function(){
        return objList;
    };
    CLIp.returnAllowedValues = function(object){
        if(typeof Object.prototype.toString.call(object) !== typeof Object.prototype.toString.call(Object())){
            throw new TypeError("Parameter \"object\" must be a valid object.");
        }
        return object.allowedValues;
    };
    CLIp.getMainObject = function(mainObject){
        if(typeof mainObject === typeof void(0)){
            return objList;
        }
        return objList[mainObject];
    };
    CLIp.parseCLI = function(command){
        if(typeof command === typeof void(0)){
            throw new TypeError("Parameter \"command\" (argument 1) is not defined.");
        }
        if(!command.match(/->/)){
            throw new SyntaxError("Parameter \"command\" has a syntax error.");
        }
        let splitCommand = command.split("->");
        if(splitCommand.length < 2){
            throw new SyntaxError("Parameter \"command\" has a syntax error.");
        }
        let classArray = splitCommand[0].split("::");
        let objParent = objList;
        classArray.forEach(function(v){
            if(typeof objParent[v] === typeof void(0)){
                throw new TypeError("Command not found.");
            }
            else{
                objParent = objParent[v];
            }
        });
        if(typeof objParent.allowedValues === typeof void(0) && objParent.type !== "method") return;
        if(objParent.type === "method"){
            let args = splitCommand[1].split(";");
            if(args.length < 2){
                objParent.value(args[0]);
            }
            else{
                let evalStr = "";
                args.forEach(function(v,i){
                    if(i === args.length - 1){
                        evalStr += v;
                    }
                    else{
                        evalStr += v + ",";
                    }
                    
                });
                eval("objParent.value(" + evalStr + ");");
                console.log(evalStr);
            }
        }
        else{
          if(objParent.allowedValues.length < 1){
              objParent.value = splitCommand[1];
          }
          else{
              if(objParent.allowedValues.filter(function(val){return val === splitCommand[1]}).length < 1){
                  throw new EvalError("Restricted from setting \"" + classArray[classArray.length - 1] + "\"'s value to \"" + splitCommand[1] + "\" because it violates the allowed types set for the specific property.");
              }
              else{
                  objParent.value = splitCommand[1];
              }
          }  
        }
    };
})();