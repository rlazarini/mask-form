'use strict';

function init(){
    function _mF(form,obj) {
        var fullList = $byAttr('mask', '', form);
        $bindElm(fullList, 'keyup change', function(e) {$cMF(this, obj, e)})
    }

    function $cMF(inputSelector, obj, evt) {
        if ($keyCodeValidate(evt)) return;
        var mask            = ''
        ,   input           = inputSelector
        ,   inputValue      = inputSelector.value
        ,   inputType       = inputSelector.getAttribute('type')      || inputSelector.type
        ,   inputDataType   = inputSelector.getAttribute('data-type') || inputSelector.dataset.type
        ,   reverseMask     = false
        ,   currencyMask    = false
        ,   literalPattern  = /[0\*]/
        ,   charPattern     = /[a-zA-Z]/
        ,   numberPattern   = /[0-9]/
        ,   excludePattern  = /[^0-9]/g
        ,   monetary        = inputSelector.getAttribute('data-monetary') || inputSelector.dataset.monetary || 'R$'
        ,   imperial        = inputSelector.getAttribute('data-monetary-imperial') || inputSelector.dataset.monetaryImperial || false
        ,   revertMonetary  = inputSelector.getAttribute('data-monetary-revert') || inputSelector.dataset.monetaryRevert || false
        ,   newValue        = ''
        ,   objMask         = (obj) ? obj[inputDataType] || obj[inputType] : '';
        
        // CPF MASK
        if (inputType === 'cpf' || inputDataType === 'cpf') {
            mask = (!objMask) ? '000.000.000-00' : objMask;
        }

        // TELEFONE (FIXO/MOVEL) MASK
        else if (inputType === 'phone' || inputDataType === 'phone') {
            mask = (!objMask) ? '(00) 00000-0000' : objMask;
        }

        // CEP MASK
        else if (inputType === 'zipcode' || inputDataType === 'zipcode') {
            mask = (!objMask) ? '00000-000' : objMask;
        }

        // DATE MASK
        else if (inputType === 'date' || inputDataType === 'date') {
            mask = (!objMask) ? '00/00/0000' : objMask;
        }

        // MONEY
        else if (inputType === 'currency' || inputDataType === 'currency') {
            mask = (!objMask) ? '000.000.000.000.000.000.000,00' : objMask;
            mask = (imperial) ? (mask.replace(/\,/g,'_+_+_+_+').replace(/\./g,',').replace(/\_\+\_\+\_\+\_\+/g,'.')) : mask;
            reverseMask = true;
            currencyMask = true;
        }

        // CUSTOM MASK
        else if (obj[inputDataType] || obj[inputType]) {
            mask = objMask;
            if (mask.indexOf('A') >= 0) {
                literalPattern = /[0-A]/;
            }
        }

        if (currencyMask === true) {
            inputValue = inputValue.replace(monetary, '');
        }

        if(reverseMask === true) {
            // Inverte a mascara para fazer as verificações
            mask = mask.split("").reverse().join("");

            // Mascara inversa é só pra números, então remove qualquer ZERO no inicio
            // Funciona com conteúdo colado e inserido
            while (inputValue[0] === '0') {
                inputValue = inputValue.substr(1);
            }

            // Limpa, inverte e transforma o INPUT em array
            inputValue = inputValue.replace(excludePattern, '').split("").reverse();
            // Cria array para retorno de campo tratado
            var returnArray = [];

            // vId = Posição do ponteiro no Input
            // mId = Posição do ponteiro na máscara
            // mSeparatorCount = Quantidade de vezes que um caracter especial da máscara aparece
            for (var vId = 0, mId = 0, mSeparatorCount = 0 ; vId < inputValue.length ; vId++) {
                // Ponteiro da máscara é sempre igual ao ponteiro do Input + a quantidade de
                // caracteres especiais já utilizados.
                mId = vId + mSeparatorCount;
                if (mask[mId].match(literalPattern) === null) {
                    // Se é encontrado um caracter especial na máscara, adicionamos o mesmo
                    // ao array de retorno e incrementamos o contador.
                    returnArray.push(mask[mId]);
                    mSeparatorCount++
                }
                // Adicionamos caracter do Input
                returnArray.push(inputValue[vId]);
            }

            // Invertemos o array de retorno, convertemos em string e retornamos como novo valor
            newValue = returnArray.reverse().join("");
        } else if ((inputType === 'phone' || inputDataType === 'phone') && inputValue.length <= mask.length) {
            newValue = inputValue.replace(/\D/g,"");
            newValue = newValue.replace(/^(\d\d)(\d)/g,"($1) $2");
            if (inputValue.length <= mask.length - 1) {
                newValue = newValue.replace(/(\d{4})(\d)/,"$1-$2");
            } else {
                newValue = newValue.replace(/(\d{5})(\d)/,"$1-$2");
            }
        } else if (inputType === 'number') {
            newValue = inputValue.replace(/\D/g,"");
        } else {
            for (var vId = 0, mId = 0 ; mId < mask.length ; mId++) {
                if (mId >= inputValue.length)
                    break;
                if (mask[mId] === '0' && inputValue[vId].match(numberPattern) === null) {
                    break;
                }

                if (mask[mId] === 'A' && inputValue[vId].match(charPattern) === null) {
                    break;
                }
                console.log("mask[mId] :: ", mask[mId])
                console.log("inputValue[vId] :: ", inputValue[vId])
                if (mask[mId].match(literalPattern) === null) {
                    if (inputValue[vId] !== mask[mId]) {
                        newValue += mask[mId];
                        mId++;
                    }
                }
                newValue += inputValue[vId++];
            }
        }

        if (currencyMask === true) {
            newValue = (revertMonetary) ? newValue + ' ' + monetary.replace(/ /g, '') : monetary.replace(/ /g, '') + ' ' + newValue;
        }

        input.value = newValue;
    }

    function $byAttr(attr, value, elms){
        elms = elms || document;
        var search = elms.getElementsByTagName('*')
        ,   found = [];

        for (var i = 0, lgt = search.length, cur = search[i]; i < lgt; i++, cur = search[i]) {
            if(!cur.attributes[attr]) continue;
            if(!!value && cur.attributes[attr].value != value) continue;
            found.push(cur);
        }

        return found.length === 1 ? found[0] : (found.length === 0 ? false : found);
    }

    function $getElm(sel, all, key, searchIn){
        searchIn = typeof searchIn == 'string' ? $getElm(searchIn) : searchIn;
        searchIn = (!sel.match(/^#/) && searchIn) || document;
        if(sel.match(/^#/)){
            return searchIn.getElementById(sel.replace(/^#/, ''));
        } else if (sel.match(/^\./)){
            var el = searchIn.getElementsByClassName(sel.replace(/^\./, ''));
            return all ? el : el[key || 0];
        } else {
            var el = searchIn.getElementsByTagName(sel)
            return all ? el : el[key || 0];
        }
    }

    function $bindElm(elms, evt, callback){
        if(typeof elms == 'string') elms = $getElm(elms, true);
        evt = evt.split(' ');
        elms = Array.isArray(elms) || $isNodeList(elms) ? elms : [elms];
        for(var i = 0, lgt = elms.length; i < lgt; i++){
            for(var j = 0, jlgt = evt.length; j < jlgt; j++){
                elms[i].addEventListener(evt[j], callback);
            }
        }
    }

    function $isNodeList(nodes) {
        var stringRepr = Object.prototype.toString.call(nodes);

        return typeof nodes === 'object' &&
            /^\[object (HTMLCollection|NodeList|Object)\]$/.test(stringRepr) &&
            (typeof nodes.length === 'number') &&
            (nodes.length === 0 || (typeof nodes[0] === "object" && nodes[0].nodeType > 0));
    }

    function $keyCodeValidate(evt) {
        var keycode = evt.keyCode ? evt.keyCode : (evt.charCode ? evt.charCode : evt.which)
        ,   keys = {
            8:true,
            9:true,
            13:true,
            16:true,
            17:true,
            18:true,
            37:true,
            38:true,
            39:true,
            40:true,
            45:true,
            46:true
        };
        return keys[keycode];
    }

    return {
        _maskForm : _mF
    }
}

try {
    module.exports = init();
} catch(err){
    // using like a library
    window.maskForm = init();
}