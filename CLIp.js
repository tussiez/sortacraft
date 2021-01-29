/*
    Code maintained by Baconman321 (https://repl.it/@baconman321). If you want to use this then please provide appropriate credit.
    
    To be licensed.

*/

/*
TODO:
    Quite a lot.
    
    
    ***Ignore me conversing with myself and move along like any normal person would...
    
    ***Tasks starting with four em-dashes ("*----") represent being accomplished.

    *Make a compile-to-js method to compile the CLI lang to JavaScript for optional JavaScript execution (probably would have to be through eval() though...). (This seems pretty nice. I'm a little worried about the eval though. Well, if the syntax checker does it's job it will filter out all the JavaScript commands (due to the fact that I use a different syntax here than JavaScript). Also, it compiles it to a value-set/method-call command so I don't think it could be too malicious (just don't handle sensitive information and you should be fine. That being said, don't ever handle sensitive information on the client).)
    
    *Make the ability to listen for property changes/method-calls. (This seems very much like candy to a programmer. Yes, I think this is going to be one of the top things to do on my list.)
    
    *Make property change/method-call listeners throw an error if the program attempts to add a listener to a property/method not configuret to do so (in strict mode). (Yes, this is something I made strict mode for).
    
    *Make the ability to call functions with null or undefined and pass them in as arguments (to represent a argumentless function). However, allow them in a string (like "null" instead of null (without paranthesis)) (LOL I have no idea what this means because I wrote it at night). (Rip).
    
    *Make the ability to assign a value of one property/call a method with the value of another property (Allow parent-property pointers after the setter operator). (Hmm, this seems very pratical. I wonder if anyone would use this though. Remember that the people playing the game don't want to learn a programming language, but rather utilize the terminal for *hacks*.)
    
    *Make the above also compatible with the value of assigning a property/callig a method (Allow multiple assignment operators). (Hmmmm, I don't know if I want to do this, I would have to create a logical order system (like PEMDAS but for assignments) and it would just get too messy. Keep dreamin' tho, maybe I might get an idea of how it could work (probably through lexing, but I'd rather not do that)!)
    
    *Make the errors have a prefix with their type in the constructor instead of having to write it every time (E.g: ParsetimeError adds "(CLIp parser): " to the beginning).
    
    *Examine the error types to make sure they actually ARE the right types (I might have a few error types that should be another type I don't know...).
    
    *Find a way to check if a method returns anything (to list it as a void or a whatever you call a function with a return value) (probably will have to be through explicit initialization-time definition). (Yeah, would be nice. I think I'll have to make it be declared when the method itself is declared (I don't want to make a whole JS parser lul))
    
    *----Make the ability to create extra objects (bind main objects to main objects, essentially). (I don't see why I SHOULDN'T do that. Just seems like a bad idea to leave it out because a game might have a lot of commands and the programmer might want to arrange different commands into different groups like "World::ThisInstance::User::Speed->5". Yeah, that makes sense.)
    
    *Allow character escaping. (Especially useful for chat commands (what if someone wanted to quote the greate GigaChad lul). However, I find this more of a terminal language and like I said before, people really only want to use a terminal in-game for *hacks*... so this might not be the best thing to use for chat (it's better to just make your own chat system, it's not that hard).)
    
    *----Make read-only values for properties and something similar for methods (executable, not executable) (For properties that's really easy, I already implemented it I just have to make a function for it. I don't know if I want to do that for methods... why would anyone need something like that for a method?).
    
    *Make properties that can only be changed by the code itself. (Yes, very important. That said, I've got to add a disclaimer in the tutorial saying that read-only values aren't really "read-only" to the user since they can use devtools to edit the value. Again, like I said - don't ever handle sensitive information on the client!)
    
    *Make single quotes valid string declarative operators. (Programming languages have them for a reason (technically in GoLang they are "runes" and in C++ they are for characters and probably the same for many other languages but still - Python, JavaScript, PHP, and many others use them for string alternatives)!)
    
    *Comments? (No way. It's all inlined, so why?)
    
    *Maybe allow whitespace? (That would make things a whole lot more compilicated. What am I just going to make a whole ".clip" file and write CLIp code in there (actually that might be a cool idea...)? The complexity of having to go over each line though... I think I'll stick to inline and no-whitespace code for now)
    
    *If-then statements? (I'm aren't building a programming language bruh... ._. )
    
    *Make function that returns related objects to a string (for autofinish). (Yes, heck yeah boi!)
    
    *----Make the strict mode implementation to check if a property/method/main-object/property-container's name is invalid (by invalid I mean containing an illegal character referring to the legal characters allowed in CLIp. This is to prevent user-accessibility) and if not throw an error (it will just console.warn() if strict mode is disabled)
    
    *Make the ability to change a property's accessibility. Also make a property/method lock function (that is irriversable). (Yes I think I will definately do that.)
    
    *(If users want it added) make it so CLIp functions don't throw errors (for non-critical errors anyways) due to the necessity of extra try...catch blocks. (Yeah, that would be nice. I'd rather wait till users try it though.)
    
    *Possibly add the ability to send in the value from the last execution for method listeners. (I think I might want to ask users if they need it)
    
    *Possibly allow strings on the left-hand side of a statement.

    *NodeJS/module support.
BUGS:

    None ATM (yay!)
    
    
    ***Wow, I am really surprised that I don't have any bugs (that are known anyways). I just hope that this doesn't become a normal feeling for me because then when a bug comes I won't be in the mood to fix it.
    
*/

/*----------------------------------------------------*/

/*
    Honestly the parsing and syntax checking probably isn't the best way to check the legality of the code...
    
    Sigh, I should have done lexing but I didn't find out soon enough. I'd rather not re-write the whole thing when I'm not even going expand the command syntax much.
*/

/*-----------------------------*/

/*CLIp stands for "CLI parser"*/






/*------------------------------   Terms   ------------------------------*/
/*
    *Commandlet: A command that is either a method/property.
    
    *Commander: A commandlet container (main object/property container).
    
    
    *Compile-time error: An error that occures during compiling CLIp code into JavaScript.
    
    *Runtime Error: An error that occures during CLIp code execution.
    
    *Parsetime Error: An error that occures during the parsing of the CLIp code.
    
    *Initialization error: An error that occures during setting up CLIp (almost always be the programmer's code and not the user's commands).
    
    *Name error: An error that has to do with naming commandlets/commanders. Right now this is only an error in strict mode. When not in strict mode it will warn to the console instead.
    
    *Property: A commandlet of a string type.
    
    *Method: A commandlet of a function type and can be executed.
    
    *Property container: A container holding properties and/or methods.
    
    *Main Object: A property container except that it is *always* bound to the root.
    
    
    
    ***More terms go here when I find them lol.
*/
/*------------------------------           ------------------------------*/
"use strict";
let CLIp = {};
(function(){
    /*Defines the custom errors we need.*/
    
    /*CompiletimeError will be used when compiling to a JavaScript function (it's basically a ParsetimeError but used when compiling CLIp code to JavaScript).*/
    class CompiletimeError extends Error {
      constructor(message, ...args) {
        super(message, ...args);
        this.name = "CompiletimeError";
        this.message = "(CLIp compile-time parser):" + message;
      }
    }
    class RuntimeError extends Error{
        constructor(message,...args){
            super(message,...args);
            this.name = "RuntimeError";
            this.message = "(CLIp runtime-evaluator): " + message;
        }
    }
    class ParsetimeError extends Error{
        constructor(message,...args){
            super(message,...args);
            this.name = "ParsetimeError";
            this.message = "(CLIp parser): " + message;
        }
    }
    class InitializationError extends Error{
        constructor(message,...args){
            super(message,...args);
            this.name = "InitializationError";
            this.message = "(CLIp Initializer): " + message;
        }
    }
    /*For when a property name has an illegal character in it that will collide with user accessibility (in strict mode).*/
    class NameError extends Error{
        constructor(message,...args){
            super(message,...args);
            this.name = "NameError";
            this.message = "(CLIp name-checker): " + message;
        }
    }
    /*Variables needed.*/
    
    
    let objList = null;
    let modes = {"executionMode":{"value":"readWrite","allowedValues":["writeOnly","readOnly","readWrite"]},"strictMode":false,"strictCommandMode":false};
    const _VERSION = "0.0.1";
    
    /*Functions needed*/
    
    function checkPropertyNameLegality(propertyName){
        if(typeof propertyName === typeof void(0)) throw new TypeError("Parameter \"propertyName\" (argument 1) is not defined.");
        if(typeof propertyName !== typeof "") throw new TypeError("Parameter \"propertyName\" (argument 1) is not of type \"string\". Expected string found \"" + propertyName + "\" with type \"" + typeof propertyName + "\".");
        let validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890;".split("");
        propertyName = propertyName.split("");
        let flagRaised = false;
        propertyName.forEach(function(v){
            if(validChars.filter(function(val){return val === v}).length < 1){
                flagRaised = true;
            }
        });
        /*Because we want to check if the property's (or main object or property container) name is "legal" or not. If it isn't legal the flag raised will be set to true, but we want to return false if it's not legal, so we use the "!" operator to switch it around.*/
        return !flagRaised;
    }
    CLIp.InitRoot = function(){
        objList = new Object();
        /*To make sure the user always has a way of getting help.*/
        Object.defineProperty(objList,"CLIp",{value:{type:"clip-help"},enumerable:true});
        Object.defineProperty(objList.CLIp,"About",{value:{type:"property",allowedValues:new Array(0),propertyAccessibility:"read-only",allowSetters:false,value:"CLIp (Stands for \"CLI parser\", pronounced \"Clype\") is a CLI (Command Line Interface) that is programmed in JavaScript. It allows functionality for creating a terminal-like interface for applications (especially online games). CLIp is built and maintained by Baconman321, so check him out (https://repl.it/@baconman321)! If you want a tutorial on how to use CLIp just type into the terminal \"CLIp::OpenTutorial->null\"."},enumerable:true});
        Object.defineProperty(objList.CLIp,"OpenTutorial",{value:{type:"method",allowSetters:false,value:function(){/*Currently I don't have a website for this.*/window.open("");}},enumerable:true});
        Object.defineProperty(objList.CLIp,"VERSION",{value:{type:"property",allowedValues:new Array(0),propertyAccessibility:"read-only",allowSetters:false,value:_VERSION},enumerable:true});
        /*Hmmmmm, Object.freeze seems more reliable than "writable:false" or "configurable:false" (apparently you can edit these values in devtools, but that would be the user's fault then... That said, there probably exists a way to work around Object.freeze in the devtools as well, so I don't trust it. Still, it's more efficient in my opinion.).*/
        Object.freeze(objList.CLIp.About,objList.CLIp.type,objList.CLIp.allowedValues,objList.CLIp.About.value);
        Object.freeze(objList.CLIp.OpenTutorial,objList.CLIp.OpenTutorial.type,objList.CLIp.OpenTutorial.value);
        return objList;
    };
    CLIp.ChangeExecutionMode = function(mode/*writeOnly,readOnly,readWrite*/){
        if(modes.executionMode.allowedValues.filter(function(val){return val === mode}).length < 1){
            throw new InitializationError("Unrecognized execution mode \"" + mode + "\". Accepted types are: " + modes.executionMode.allowedValues);
        }
        modes.executionMode.value = mode;
        return modes.executionMode.value;
    };
    /*Strict mode throws errors in situations where a fault might go unnoticed by the user (like making a command with an illegal character, which is then impossible to call using ParseCLI()).
    
    Current strict mode uses (when strict mode is turned on):
    
        Throws an error if an illegal character is found in a commandlet.
    
        Throws an error when trying to bind/remove a listener to a commandlet not configured to do so.
    
        Throws an error when trying to bind/remove a listener from a read-only value.
    
        Throws an error when a duplicate listener handler is found and "replaceSameListenerHandler" is not set to true.
        
        Throws an error when trying to remove a listener handler that doesn't exist.
    */
    CLIp.EnableStrictMode = function(){
        if(objList === null){
            throw new InitializationError("Root object is not initiated.");
        }
        modes.strictMode = true;
    };
    CLIp.DisableStrictMode = function(){
        if(objList === null){
            throw new InitializationError("Root object is not initiated.");
        }
        modes.strictMode = false;
    };
    /*Strict command mode disallows case-insensitivity (which would treat "CLIp" and "clip" as the same making it easier for users). By default strict command mode is disabled.*/
    CLIp.EnableStrictCommandMode = function(){
        if(objList === null){
            throw new InitializationError("Root object is not initiated.");
        }
        modes.strictCommandMode = true;
    };
    CLIp.DisableStrictCommandMode = function(){
        if(objList === null){
            throw new InitializationError("Root object is not initiated.");
        }
        modes.strictCommandMode = false;
    };
    CLIp.DefineMainObject = function(mainObject){
        if(objList === null){
            throw new InitializationError("Root object is not initiated.");
        }
        if(typeof mainObject === typeof void(0)){
            throw new TypeError("Parameter \"mainObject\" (argument 1) is not defined.");
        }
        if(typeof mainObject !== typeof ""){
            throw new TypeError("Parameter \"mainObject\" (argument 1) must be a string containing the name of the main object.");
        }
        if(!checkPropertyNameLegality(mainObject)){
            if(modes.strictMode){
                throw new NameError("Main object name \"" + mainObject + "\" has an illegal character. Legal characters are lower-case and upper-case alphabet letters and numbers.");
            }
            else{
                console.warn("(CLIp name-checker): Main object name \"" + mainObject + "\"has an illegal character (this will message with user accessibility). Legal characters are lower-case and upper-case alphabet letters and numbers.");
            }
        }
        Object.defineProperty(objList,mainObject,{value:{type:"main-object"},enumerable:true});
        return objList[mainObject];
    };
    CLIp.BindPropertyContainer = function(object,objectName){
        if(typeof object === typeof void(0)){
            throw new TypeError("Paramter \"object\" (argument 1) is not defined.");
        }
        if(typeof objectName === typeof void(0)){
            throw new TypeError("Parameter \"objectName\" (argument 2) is not defined.");
        }
        if(typeof object !== typeof {}){
            throw new TypeError("Parameter \"object\" (argument 1) is not a valid object.");
        }
        if(typeof objectName !== typeof ""){
            throw new TypeError("Parameter \"objectName\" (argument 2) is not of type \"string\".");
        }
        if(!checkPropertyNameLegality(objectName)){
            if(modes.strictMode){
                throw new NameError("Property container name \"" + objectName + "\" has an illegal character. Legal characters are lower-case and upper-case alphabet letters and numbers.");
            }
            else{
                console.warn("(CLIp name-checker): Property container name \"" + objectName + "\"has an illegal character (this will message with user accessibility). Legal characters are lower-case and upper-case alphabet letters and numbers.");
            }
        }
        Object.defineProperty(object,objectName,{value:{type:"property-container"},enumerable:true});
        return object[objectName];
    };
    CLIp.BindProperty = function(mainObject,propertyArray,listenersAllowed){
        if(objList === null){
            throw new InitializationError("Root object is not initiated.");
        }
        if(typeof mainObject === typeof void(0)){
            throw new TypeError("Paramter \"mainObject\" (argument 1) is not defined.");
        }
        if(typeof propertyArray === typeof void(0)){
            throw new TypeError("Parameter \"propertyArray\" (argument 2) is not defined.");
        }
        if(typeof Object.prototype.toString.call(mainObject) !== typeof Object.prototype.toString.call(new Object())){
            throw new TypeError("Parameter \"mainObject (argument 2) is not an object to bind the property to.");
        }
        if(typeof Object.prototype.toString.call(propertyArray) !== typeof Object.prototype.toString.call([])){
            throw new TypeError("Paramter \"propertyArray\" (argument 2) is not a valid array with values containing the name of the property of type \"string\" and the value.");
        }
        if(typeof propertyArray[0] !== typeof ""){
            throw new TypeError("Paramter \"propertyArray\" (argument 2) is not a valid array with values containing the name of the property of type \"string\" and the value.");
        }
        if(typeof propertyArray[1] === typeof {}){
            throw new TypeError("The value cannot be an object. Try using \"CLIp.BindPropertyContainer()\" instead.");
        }
        if(typeof propertyArray[2] !== typeof void(0) && typeof propertyArray[2] !== typeof ""){
            throw new TypeError("Parameter \"propertyArray\" (argument 2) has the property-access value passed in but is not of type \"string\" representing the values \"read-only\" or \"read-write\".");
        }
        if(typeof listenersAllowed !== typeof void(0) && typeof listenersAllowed !== typeof true) throw new TypeError("Parameter \"listenersAllowed\" (arugment 3) is set but not of type \"" + typeof true + "\".");
        if(propertyArray[2] !== "read-only" && propertyArray[2] !== "read-write"){
            if(typeof propertyArray[2] !== typeof void(0)) throw new TypeError("Parameter \"propertyArray\" (argument 2) has the property-access value passed in but is not a string containing the values \"read-only\" or \"read-write\". Instead found a value of type \"" + typeof propertyArray[2] + "\" and a value of " + propertyArray[2] + ".");
        }
        if(typeof propertyArray[2] === typeof void(0)){
            propertyArray[2] = "read-write";
        }
        if(!checkPropertyNameLegality(propertyArray[0])){
            if(modes.strictMode){
                throw new NameError("Property name \"" + propertyArray[0] + "\" has an illegal character. Legal characters are lower-case and upper-case alphabet letters and numbers.");
            }
            else{
                console.warn("(CLIp name-checker): Property name \"" + propertyArray[0] + "\"has an illegal character (this will message with user accessibility). Legal characters are lower-case and upper-case alphabet letters and numbers.");
            }
        }
        if(listenersAllowed){
            Object.defineProperty(mainObject,propertyArray[0].toString(),{value:{type:"property",value:propertyArray[1],allowedValues:new Array(0),propertyAccessibility:propertyArray[2],allowListeners:true,listeners:[]},enumerable:true});
        }
        else{
            Object.defineProperty(mainObject,propertyArray[0].toString(),{value:{type:"property",value:propertyArray[1],allowedValues:new Array(0),propertyAccessibility:propertyArray[2],allowListeners:false},enumerable:true});
        }
        mainObject[propertyArray[0]].__defineSetter__("setValue",function(value){
            this.listeners.forEach(function(v){
                /*Calls the listener and passes in the type as the first argument, the new value as the second, and the current (before being changed) value as the third.*/
                v(this.type,value,this.value);
            }.bind(this));
            /*Since it's a property we just set the value. Nothing more to it!*/
            this.value = value;
        });
        return mainObject[propertyArray[0]];
    };
    CLIp.BindMethod = function(mainObject,methodArray,listenersAllowed){
        if(objList === null){
            throw new InitializationError("Root object is not initiated.");
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
            throw new TypeError("The value cannot be an object. Try using \"CLIp.BindPropertyContainer()\" instead.");
        }
        if(typeof listenersAllowed !== typeof void(0) && typeof listenersAllowed !== typeof true) throw new TypeError("Parameter \"listenersAllowed\" (arugment 3) is set but not of type \"" + typeof true + "\".");
        if(!checkPropertyNameLegality(methodArray[0])){
            if(modes.strictMode){
                throw new NameError("Method name \"" + methodArray[0] + "\" has an illegal character. Legal characters are lower-case and upper-case alphabet letters and numbers.");
            }
            else{
                console.warn("(CLIp name-checker): Method name \"" + methodArray[0] + "\"has an illegal character (this will message with user accessibility). Legal characters are lower-case and upper-case alphabet letters and numbers.");
            }
        }
        if(listenersAllowed){
            Object.defineProperty(mainObject,methodArray[0].toString(),{value:{type:"method",allowListeners:true,listeners:[],value:methodArray[1]},enumerable:true});
        }
        else{
            Object.defineProperty(mainObject,methodArray[0].toString(),{value:{type:"method",allowListeners:false,value:methodArray[1]},enumerable:true});
        }
        mainObject[methodArray[0]].__defineSetter__("setValue",function(value){
            this.listeners.forEach(function(v){
                /*Calls the listener and passes in the new value (because it's a method it passes the array of arguments in) as the first argument, the old value as the second argument and the property type as the third.*/
                v(this.type,value);
            }.bind(this));
            /*Since it's a method then it fires the event listener with just the value and type. Then it will call the function with an array containing the arguments.*/
            this.value.call(null,value);
        });
        return mainObject[methodArray[0]];
    };
    /*Restriction values will be converted to a string. If you want to convert it to a number you will have to use the Number() function.*/
    CLIp.BindRestrictiveProperty = function(mainObject,propertyArray,listenersAllowed){
        if(objList === null){
            throw new InitializationError("Root object is not initiated.");
        }
        if(typeof mainObject === typeof void(0)){
            throw new TypeError("Paramter \"mainObject\" (argument 1) is not defined.");
        }
        if(typeof propertyArray === typeof void(0)){
            throw new TypeError("Parameter \"propertyArray\" (argument 2) is not defined.");
        }
        if(typeof Object.prototype.toString.call(mainObject) !== typeof Object.prototype.toString.call(new Object())){
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
        if(typeof listenersAllowed !== typeof void(0) && typeof listenersAllowed !== typeof true) throw new TypeError("Parameter \"listenersAllowed\" (arugment 3) is set but not of type \"" + typeof true + "\".");
        if(!checkPropertyNameLegality(propertyArray[0])){
            if(modes.strictMode){
                throw new NameError("Property name \"" + propertyArray[0] + "\" has an illegal character. Legal characters are lower-case and upper-case alphabet letters and numbers.");
            }
            else{
                console.warn("(CLIp Initializer): Property name \"" + propertyArray[0] + "\"has an illegal character (this will message with user accessibility). Legal characters are lower-case and upper-case alphabet letters and numbers.");
            }
        }
        if(listenersAllowed){
            Object.defineProperty(mainObject,propertyArray[0].toString(),{value:{type:"property",value:propertyArray[1],allowedValues:propertyArray[2],allowListeners:true,listeners:[]},enumerable:true});
        }
        else{
            Object.defineProperty(mainObject,propertyArray[0].toString(),{value:{type:"property",value:propertyArray[1],allowedValues:propertyArray[2],allowListeners:false},enumerable:true});
        }
        mainObject[propertyArray[0]].__defineSetter__("setValue",function(value){
            this.listeners.forEach(function(v){
                /*Calls the listener and passes in the type as the first argument, the new value as the second, and the current (before being changed) value as the third.*/
                v(this.type,value,this.value);
            }.bind(this));
            /*Since it's a property we just set the value. Nothing more to it!*/
            this.value = value;
        });
        return mainObject[propertyArray[0]];
    };
    CLIp.ReturnRoot = function(){
        if(objList === null){
            throw new InitializationError("Root object is not initiated.");
        }
        return objList;
    };
    CLIp.ReturnAllowedValues = function(object){
        if(objList === null){
            throw new InitializationError("Root object is not initiated.");
        }
        if(typeof Object.prototype.toString.call(object) !== typeof Object.prototype.toString.call(Object())){
            throw new TypeError("Parameter \"object\" must be a valid object.");
        }
        return object.allowedValues;
    };
    CLIp.GetMainObject = function(mainObject){
        if(objList === null){
            throw new InitializationError("Root object is not initiated.");
        }
        if(typeof mainObject === typeof void(0)){
            return objList;
        }
        return objList[mainObject];
    };
    CLIp.BindListener = function(object,callback,replaceSameListenerHandler){
        if(typeof object === typeof void(0)) throw new TypeError("Parameter \"object\" (argument 1) is not defined.");
        if(typeof callback === typeof void(0)) throw new TypeError("Parameter \"callback\" (argument 2) is not defined.");
        if(typeof Object.prototype.toString.call(object) !== typeof Object.prototype.toString.call({})) throw new TypeError("Parameter \"object\" (argument 1) is not a valid object.");
        if(typeof callback !== typeof function(){}) throw new TypeError("Parameter \"callback\" (argument 2) is not a valid function.");
        if(object.type === "property-container" || object.type === "main-object") throw new InitializationError("Cannot add a listener to an object with a type \"property-container\" or \"main-object\" (this might be added in a later version).");
        if(object.type !== "property" && object.type !== "method") throw new InitializationError("Cannot add a listener to an object without a valid or non-existing type.");
        if(typeof replaceSameListenerHandler !== typeof void(0) && typeof replaceSameListenerHandler !== typeof true) throw new InitializationError("Parameter \"replaceSameListenerHandler\" (argument 3) is set but not of type \"" + typeof true + "\".");
        if(object.allowListeners !== true && modes.strictMode === true) throw new InitializationError("Cannot add a listener to an object not explicitly configured to do so in strict mode.");
        /*In strict mode that will save a lot of time and memory. Imagine waiting for a property to change that never will (lol).*/
        if(object.propertyAccessibility === "read-only" && modes.strictMode) throw new InitializationError("Cannot add a listener to an object with a property accessibility of \"read-only\" in strict mode.");
        if(typeof object.listeners === typeof void(0)){
            Object.defineProperty(object,"listeners",{value:[],enumerable:true});
        }
        let hasCallback = false;
        object.listeners.forEach(function(v){
            if(v === callback){
                if(modes.strictMode === true && !replaceSameListenerHandler){
                    throw new InitializationError("Cannot declare a listener on the property/method in strict mode because another listener of the same function exists and \"replaceSameListenerHandler\" is not set to true!");
                }
                hasCallback = true;
            }
        });
        /*Make sure it has a setter.*/
        if(typeof object.__lookupSetter__("setValue") === typeof void(0)){
            if(object.type === "property"){
                object.__defineSetter__("setValue",function(value){
                    this.listeners.forEach(function(v){
                        /*Calls the listener and passes in the type as the first argument, the new value as the second, and the current (before being changed) value as the third.*/
                        v(this.type,value,this.value);
                    }.bind(this));
                    /*Since it's a property we just set the value. Nothing more to it!*/
                    this.value = value;
                });
            }
            else if(object.type === "method"){
                object.__d__defineSetter__("setValue",function(value){
                   this.listeners.forEach(function(v){
                       /*Calls the listener and passes in the new value (because it's a method it passes the array of arguments in) as the first argument, the old value as the second argument and the property type as the third.*/
                       v(this.type,value);
                   }.bind(this));
                   /*Since it's a method then it fires the event listener with just the value and type. Then it will call the function with an array containing the arguments.*/
                   this.value.call(null,value); 
                });
            }
        }
        if(hasCallback && replaceSameListenerHandler){
            let callbackIndex = object.listeners.indexOf(callback);
            object.listeners[callbackIndex] = callback;
            return object.listeners;
        }
        else{
            /*It won't do anything if "replaceSameListenerHandler" is set to false and strict mode is not enabled. That's why I highly recommend you have strict mode enabled. It may be a pain in the... you-know-what, but it helps with your code neatness and efficiency overall in the long-run.*/
            return object.listeners;
        }
        object.listeners.push(callback);
        
        return object.listeners;
    };
    CLIp.RemoveListener = function(object,callback){
        if(typeof object === typeof void(0)) throw new TypeError("Parameter \"object\" (argument 1) is not defined.");
        if(typeof callback === typeof void(0)) throw new TypeError("Parameter \"callback\" (argument 2) is not defined.");
        if(typeof Object.prototype.toString.call(object) !== typeof Object.prototype.toString.call({})) throw new TypeError("Parameter \"object\" (argument 1) is not a valid object.");
        if(typeof callback !== typeof function(){}) throw new TypeError("Parameter \"callback\" (argument 2) is not a valid function.");
        if(object.type === "property-container" || object.type === "main-object") throw new InitializationError("Cannot remove a listener to an object with a type \"property-container\" or \"main-object\" (this might be added in a later version).");
        if(object.type !== "property" && object.type !== "method") throw new InitializationError("Cannot remove a listener to an object without a valid or non-existing type.");
        if(object.allowListeners !== true && modes.strictMode === true) throw new InitializationError("Cannot remove a listener to an object not explicitly configured to do so in strict mode.");
        if(object.propertyAccessibility === "read-only" && modes.strictMode) throw new InitializationError("Cannot remove a listener to an object with a property accessibility of \"read-only\" in strict mode.");
        if(!object.listeners) return object.listeners;
        let callbackIndx = object.listeners.indexOf(callback);
        if(callbackIndx === -1 && modes.strictMode) throw new InitializationError("Cannot remove the listener in strict mode because the listener doesn't exist!");
        if(callbackIndx === -1 && !modes.strictMode) return object.listeners;
        object.listeners.splice(callbackIndx,1);
        return object.listeners;
    };
    /*Basically checks the command syntax (if you want to check it yourself).*/
    CLIp.CheckCommandLegality = function(command){
        if(objList === null){
            throw new InitializationError("Root object is not initiated.");
        }
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
                    rej(new SyntaxError("Cannot perform multi-assignment in single statement declaration. Column number: " + (i + 1) + "."));
                    return;
                }
                else if(x === ">" && isSetter && operatorLast){
                    rej(new SyntaxError("Cannot use a parent-property pointer on an operator. Column number: " + (i + 1) + "."));
                    return;
                }
                else if(x === ">" && isSetter && !setterFound){
                    operatorLast = true;
                    isSetter = false;
                    setterFound = true;
                    continue;
                }
                else if(x !== ">" && isSetter && !isStr){
                    rej(new SyntaxError("Expected setter operator \"->\" found \"-" + x + "\" (this does not correlate to a valid operator). Column number: " + (i + 1) + "."));
                    return;
                }
                if(x === ":" && ptrFound){
                    rej(new SyntaxError("Cannot point to invalid property. Expected value found \":\" instead. Did you use more than two consecutive colons? Column number: " + (i + 1) + "."));
                    return;
                }
                else if(x === ":" && isPtr && !isStr && operatorLast){
                    rej(new SyntaxError("Invalid assignment of operator. Column number: " + (i + 1) + "."));
                    return;
                }
                else if(x === ":" && !isPtr && !isStr){
                    if(validChars.filter(function(val){return val === command[i - 1]}).length < 1){
                        if(typeof command[i - 1] === typeof void(0)){
                            rej(new SyntaxError("Expected a parent value before a pointer and found nothing (Left-hand side value for parent-property pointer not found). Column number: " + (i + 1) + "."));
                            return;
                        }
                        rej(new SyntaxError("Expected parent value before a pointer found \"" + command[i - 1] + "\" (this is not a valid character to represent a parent for a parent-property pointer). Column number: " + (i + 1) + "."));
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
                    rej(new SyntaxError("Expected parent-property pointer \"::\" found \":" + x + "\" (this does not correlate to a valid operator). Column number: " + (i + 1) + "."));
                    return;
                }
                if(x === ";" && !setterFound){
                    rej(new SyntaxError("CLIp parser): Argument seperator not allowed on Left-hand side of setter operator. Column number: " + (i + 1) + "."));
                    return;
                }
                /*Like any programming language, there are only so many characters allowed. There's not many characters needed in this langauge but since it gets executed in JavaScript I need to make sure it doesn't clash with both my language and JavaScript itself!*/
                if(validChars.filter(function(val){return val === x}).length < 1 && !isSetter && !isPtr && !isStr){
                    rej(new SyntaxError("Illegal character: \"" + x + "\". Column number: " + (i + 1) + "."));
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
                rej(new SyntaxError("Unexpected EOS (end of statement): expecting a setter operator found \"-\" (unfinished operator). Column number: " + command.length + "."));
                return;
            }
            if(isStr){
                rej(new SyntaxError("Unclosed string. Column number: " + unclosedStrNum + "."));
            }
            if(isPtr){
                rej(new SyntaxError("Unexpected EOS (end of statement): expecting a parent-property pointer found \":\" (unfinished operator). Column number: " + command.length + "."));
                return;
            }
            /*I only check the last one because under other circumstances it is either an unfinished statement or an illegal character.*/
            if(command.split("")[command.split("").length - 1] === ":"){
                rej(new SyntaxError("Unexpected EOS (end of statement): expecting a Right-hand side property after \"::\" (a parent-property pointer) but found EOS instead. Column number: " + command.length + "."));
                return;
            }
            /*Read the comment above.*/
            if(command.split("")[command.split("").length - 1] === ">"){
                rej(new SyntaxError("Unexpected EOS (end of statement): expecting a right-side value after \"->\" (a setter operator) but found EOS instead. Column number: " + command.length + "."));
                return;
            }
            res(command);
        });
    };
    /*For autocomplete (most games might want this to make sure the user can see the commands relevant to what they are typing).*/
    CLIp.GetRelativeCommands = function(command,properSyntaxEnforced,trimNum){
        if(typeof command === typeof void(0)){
            throw new TypeError("Parameter \"command\" (argument 1) is not defined.");
        }
        if(typeof properSyntaxEnforced !== typeof void(0) && typeof properSyntaxEnforced !== typeof false){
            throw new TypeError("Parameter \"properSyntaxEnforced\" (argument 2) is set but is not of type \"" + typeof true + "\".");
        }
        if(typeof trimNum !== typeof void(0) && typeof trimNum !== typeof 1){
            throw new TypeError("Parameter \"trimNum\" (argument 3) is set but  not of type \"" + typeof 1 + "\".");
        }
        command = command.toString();
        let parseAndGet = function(cmd){
            /*This is where we store our results!*/
            let resArr;
            /*We are basically recreating the parsing process but this time we are trying to find relative commands.*/
            let parentPropArr = [];
            let store = new Array(0);
            let setterFound = false;
            cmd.split("");
            for(let i = 0;i<cmd.length;i++){
                let x = cmd[i];
                if(x === "\""){
                    return [0,new ParsetimeError("Strings are not allowed on Left-hand side of setter operator.")];
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
            let travelObj = function(obj,startingName){
                if(typeof obj !== typeof new Object()){
                    console.log(typeof obj);
                    throw new TypeError("Parameter \"obj\" (argument 1) is not of type \"" + typeof new Object() + "\".");
                }
                return new Promise(function(res,rej){
                    let objList = [];
                    let treeCrawl = function(obj,scope){
                        /*We are only searching for objects. Looks like they gave us a property/method.*/
                        if(obj.value){
                            res(objList);
                            return;
                        }
                        /*For each property in the object.*/
                        // console.log("Received an object to crawl. Object is: " + JSON.stringify(obj));
                        for(let prop in obj){
                            /*If it's another object push that one onto the list to crawl (unless it's a property/method object_.*/
                            if(typeof obj[prop] === typeof new Object() && typeof obj[prop].value === typeof void(0)){
                                /*We don't want metadata about the properties/methods/containers.*/
                                if(prop === "type" || prop === "allowedValues" || prop === "propertyAccessability" || prop === "allowListeners" || prop === "listeners" || prop === "setValue" || prop === "value") continue;
                                // console.log("Object contains another object! " + JSON.stringify(obj[prop]));
                                treeCrawl(obj[prop],(scope + "::" + prop));
                            }
                            else{
                                /*We don't want metadata about the properties/methods/containers.
                                I don't know if we really need this here though...
                                Edit: Yes we do!
                                */
                                if(prop === "type" || prop === "allowedValues" || prop === "propertyAccessability" || prop === "allowListeners" || prop === "listeners" || prop === "setValue" || prop === "value") continue;
                                objList.push(scope + "::" + prop);
                                res(objList);
                            }
                        }
                    };
                    treeCrawl(obj,startingName);
                });
            };
            let objVal = objList;
            parentPropArr.forEach(function(v,i){
                if(i >= parentPropArr.length - 1){
                    if(typeof objVal[v] === typeof void(0)){
                        /*They probably haven't finished typing. Let's try to see what it matches using regex.*/
                        /*If strict command mode is on then it has to be case-sensitive.*/
                        if(modes.strictCommandMode){
                            /*We use RegExp because we want to match all of the possible occurrences.*/
                            /*Quick note: You have to backslash the regex expression it because it's in a string (I have no idea why though...).*/
                            let regexMatch = new RegExp("\^" + v,"g");
                            console.log(regexMatch);
                            let matchResArr = [];
                            for(let prop in objVal){
                                /*No metadata plz ;D*/
                                if(prop === "type" || prop === "allowedValues" || prop === "propertyAccessability" || prop === "allowListeners" || prop === "listeners" || prop === "setValue" || prop === "value") continue;
                                let match = regexMatch.test(prop);
                                if(match){
                                    matchResArr.push(prop);
                                }
                            }
                            let matchArr = [];
                            matchResArr.forEach(function(v){
                                console.log("traveling");
                                /*Woahohohoho, that's a lot for the second argument of the travelObj function. Let's break it down (so I remember lol).
                                Step 1: It creates a new array (the .map() creates a new array so as to not modify the original array).
                                
                                Step 2: It splices all but the last argument (because .splice() returns the spliced values, we want to work with that instead of just splicing the last value).
                                
                                Step 3: It joins the array with "::".
                                
                                Step 4: It adds "::" (for the value that is about to be added. It doesn't get added if the parent property array is only 1 in length because then it's a root object).
                                
                                Step 5: It adds v (which replaces the last value because the last value will be whatever the user is typing. Therefore, we want to make sure that it searches the actual value that was found with regex).
                                */
                                if(parentPropArr.length < 2){
                                    travelObj(objVal[v],parentPropArr.map(function(val){return val;}).splice(0,parentPropArr.length - 1).join("::") + v).then(function(res){
                                        res.forEach(function(v){
                                            matchArr.push(v);
                                        });
                                    });
                                }
                                else{
                                    travelObj(objVal[v],parentPropArr.map(function(val){return val;}).splice(0,parentPropArr.length - 1).join("::") + "::" + v).then(function(res){
                                        res.forEach(function(v){
                                            matchArr.push(v);
                                        });
                                    });
                                }
                            });
                            resArr = matchArr;
                        }
                        else{
                            /*We use RegExp because we want to match all of the possible occurrences (and make it case-insensitive).*/
                            /*Quick note: You have to backslash the regex expression it because it's in a string (I have no idea why though...).*/
                            let regexMatch = new RegExp("\^" + v,"gi");
                            let matchResArr = [];
                            for(let prop in objVal){
                                /*No metadata plz ;D*/
                                if(prop === "type" || prop === "allowedValues" || prop === "propertyAccessability" || prop === "allowListeners" || prop === "listeners" || prop === "setValue" || prop === "value") continue;
                                let match = regexMatch.test(prop);
                                if(match){
                                    matchResArr.push(prop);
                                }
                            }
                            let matchArr = [];
                            matchResArr.forEach(function(v){
                                console.log("traveling");
                                /*Woahohohoho, that's a lot for the second argument of the travelObj function. Let's break it down (so I remember lol).
                                Step 1: It creates a new array (the .map() creates a new array so as to not modify the original array).
                                
                                Step 2: It splices all but the last argument (because .splice() returns the spliced values, we want to work with that instead of just splicing the last value).
                                
                                Step 3: It joins the array with "::".
                                
                                Step 4: It adds "::" (for the value that is about to be added. It doesn't get added if the parent property array is only 1 in length because then it's a root object).
                                
                                Step 5: It adds v (which replaces the last value because the last value will be whatever the user is typing. Therefore, we want to make sure that it searches the actual value that was found with regex).
                                */
                                if(parentPropArr.length < 2){
                                    travelObj(objVal[v],parentPropArr.map(function(val){return val;}).splice(0,parentPropArr.length - 1).join("::") + v).then(function(res){
                                        res.forEach(function(v){
                                            matchArr.push(v);
                                        });
                                    });
                                }
                                else{
                                    travelObj(objVal[v],parentPropArr.map(function(val){return val;}).splice(0,parentPropArr.length - 1).join("::") + "::" + v).then(function(res){
                                        res.forEach(function(v){
                                            matchArr.push(v);
                                        });
                                    });
                                }
                            });
                            resArr = matchArr;
                        }
                    }
                    else{
                        /*If it's a property/method (or something not found) then do nothing (we don't need to crawl those because they can't hold any objects).*/
                        if(typeof objVal[v] !== typeof new Object()) return;
                        console.log("traveling");
                        travelObj(objVal[v],parentPropArr.join("::")).then(function(res){
                            resArr = res;
                            return res;
                        });
                    }
                }
                else{
                    objVal = objVal[v];
                }
            });
            return resArr;
        };
        if(properSyntaxEnforced){
            return CLIp.CheckCommandLegality(command).then(function(cmd){
                let res = parseAndGet(cmd);
                if(Array.isArray(res)){
                    return [1,res];
                }
                else{
                    return [0,void(0)];
                }
            }).catch(function(err){
                return [0,err];
            });
        }
        else{
        }
    };
    CLIp.ParseCLI = function(command){
        if(objList === null){
            throw new InitializationError("Root object is not initiated.");
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
                        rej(new ParsetimeError("Strings are not allowed on Left-hand side of setter operator."));
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
                            if(indx.toLowerCase() === v.toLowerCase()){
                                v = indx;
                            }
                        }
                    }
                    if(typeof objProp[v] === typeof void(0)){
                        /*Technically this should be at runtime, but hey compiled languages alert if something isn't defind during compile-time and not runtime so I guess it's fine.*/
                        rej(new ParsetimeError("Property \"" + v + "\" is not defined."));
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
                /*We need to check if the object is a method, property or main-object (or if the "type" even exists. If it doesn't it shouldn't be setttable). Note that main objects are not changable or executable.*/
                if(prop.type === "main-object" || prop.type === "property-container"){
                    if(startCollecting) rej(new ParsetimeError("Cannot set or execute a main object/property container."));
                }
                if(typeof prop.type === typeof void(0) && startCollecting){
                    rej(new ParsetimeError("Property's type cannot be determined (\"property\",\"method\", \"property-container\" or \"main-object\") meaning that it is not changable (Main objects and property-containers are not changable)."));
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
                            rej(new ParsetimeError("Parent-property pointers are not allowed on the Right-hand side of a setter operator. Column number: " + (i + 1) + "."));
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
                            rej(new ParsetimeError("Parent-property pointers are not allowed on the Right-hand side of a setter operator. Column number: " + (i + 1) + "."));
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
                            if(prop.propertyAccessibility && prop.propertyAccessibility === "read-only"){
                                type = "Read-Only Value";
                            }
                            else{
                                type = "Changable Value";
                            }
                        }
                        else if(type === "main-object"){
                            type = "Main Property Container";
                        }
                        else if(type === "property-container"){
                            type = "Property Container";
                        }
                        else if(type === "clip-help"){
                            type = "Official CLIp help commands";
                        }
                        else{
                            type = "Unknown";
                        }
                        if(type === "Property Container" || type === "Main Property Container" || type === "Official CLIp help commands"){
                            res([type,JSON.stringify(prop)]);
                        }
                        else{
                            res([type,prop.value]);
                        }
                        
                    }
                    else{
                        if(typeof prop.allowedValues !== typeof void(0)){
                            if(prop.allowedValues.length > 0){
                                if(prop.allowedValues.filter(function(allowedVal){if(modes.strictCommandMode === true){return allowedVal === val}else{return allowedVal.toLowerCase() === val.toLowerCase();}}).length < 1){
                                    /*Because it doesn't indent between the commas (gotta make it look neat!).*/
                                    let allowedValsStr = "";
                                    prop.allowedValues.forEach(function(v,i,arr){
                                        if(i < arr.length - 1){
                                            allowedValsStr += v + ", ";
                                        }
                                        else{
                                            allowedValsStr += v;
                                        }
                                    });
                                    rej(new RuntimeError("Cannot set property's value to \"" + val + "\" because it violates the allowed values for the property (\"" + allowedValsStr + "\")."));
                                    return;
                                }
                            }
                        }
                        let result;
                        if(typeof prop.__lookupSetter__("setValue") !== typeof void(0)){
                            if(isProp){
                                if(prop.propertyAccessibility && prop.propertyAccessibility === "read-only"){
                                    rej(new RuntimeError("Cannot change the property's value because it is read-only."));
                                    return;
                                }
                                prop.setValue = val;
                                result = prop.value;
                            }
                            else{
                                /*Passes in an array that will later be executed by the setter.*/
                                result = prop.setValue = val;
                            }
                        }
                        else{
                            if(isProp){
                                if(prop.propertyAccessibility && prop.propertyAccessibility === "read-only"){
                                    rej(new RuntimeError("Cannot change the property because it is read-only."));
                                    return;
                                }
                                prop.value = val;
                                result = prop.value;
                            }
                            else{
                                result = prop.value.apply(null,val);
                            }
                        }
                        let type = prop.type;
                        if(type === "method"){
                            type = "Executable Command";
                        }
                        else if(type === "property"){
                            if(prop.propertyAccessibility && prop.propertyAccessibility === "read-only"){
                                type = "Read-Only Value";
                            }
                            else{
                                type = "Changable Value";
                            }
                        }
                        else if(type === "main-object"){
                            type = "Main Property Container";
                        }
                        else if(type === "property-container"){
                            type = "Property Container";
                        }
                        else if(type === "clip-help"){
                            type = "Official CLIp help commands";
                        }
                        else{
                            type = "Unknown";
                        }
                        res([type,result]);
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