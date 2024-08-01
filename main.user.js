// ==UserScript==
// @name         イオンネットスーパー便利キット
// @namespace    https://github.com/kouhei-ioroi/aeon-netsuper-extension
// @version      2024-08-01-v3
// @description  イオンネットスーパーの使い勝手をちょっと良くします
// @author       Kouhei Ioroi
// @match        https://shop.aeon.com/netsuper/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aeon.com
// @grant        none
// ==/UserScript==

function 要素追加(price_container, unit, classname = false){
    let pTag;
    let inTag;
    inTag = document.createElement("div");
    pTag = price_container.querySelector("div.x-calc-unit-price");
    if(pTag){
        if(classname){inTag.classList.add("x-calculated-unit")};
        inTag.textContent = unit;
        pTag.appendChild(inTag);
    }else{
        pTag = document.createElement("div");
        pTag.classList.add("x-calc-unit-price");
        inTag.textContent = unit;
        if(classname){inTag.classList.add("x-calculated-unit")};
        pTag.appendChild(inTag);
        price_container.appendChild(pTag);
    }
}

function ページャー判定調整(){
// ページャーのaタグサイズを親のli.itemに併せて拡張し当たり判定を改善します
    document.querySelectorAll("div.pages li.item a.page").forEach((i)=>{
        i.style.width="100%";
        i.style.height="100%";
    })
}

function 売り切れ非表示(){
// 売り切れ商品を非表示します
    let counter = 0
    document.querySelectorAll("li.item.product.product-item button[class=out-stock]").forEach((i)=>{
        counter = counter + 1;
        i.closest("li.item.product.product-item").style.display="none";
    });
    if(counter > 0){
        document.querySelectorAll("p.toolbar-amount").forEach((i)=>{
            let currentText = i.innerText;
            let splittedText = currentText.split("/")
            i.innerText = splittedText[0] + "(内" + counter + "件売り切れの為非表示)/" + splittedText[1];
        })
    }
}

function 係数単価算出(unit1, unit2){
// 係数あたりの単価を表示します
    let regex = new RegExp("[0-9]{1,}(|\.[0-9]{1,})" + unit1 + "|[0-9]{1,}(|\.[0-9]{1,})" + unit2);
    document.querySelectorAll("li.item.product.product-item a.product-item-link").forEach((i)=>{
        i.innerText.split(" ").forEach((x)=>{
            if(regex.test(x)){
                let net
                if(new RegExp("[0-9]{1,}(|\.[0-9]{1,})" + unit2).test(x)){
                    if(new RegExp("×[0-9]{1,}(|\.[0-9]{1,})").test(x)){
                        net = (x.match("[0-9]{1,}(|\.[0-9]{1,})" + unit2)[0].replace(unit2,"")*x.match("×[0-9]{1,}")[0].replace("×",""))*1000;
                    }else{
                        net = (x.match("[0-9]{1,}(|\.[0-9]{1,})" + unit2)[0].replace(unit2,""))*1000;
                    }
                }else{
                    if(new RegExp("×[0-9]{1,}(|\.[0-9]{1,})").test(x)){
                        net = x.match("[0-9]{1,}(|\.[0-9]{1,})" + unit1)[0].replace(unit1,"")*x.match("×[0-9]{1,}")[0].replace("×","");
                    }else{
                        net = x.match("[0-9]{1,}(|\.[0-9]{1,})" + unit1)[0].replace(unit1,"");
                    }
                }
                let price_container = i.closest("div.product-item-details").querySelector("div.price-container");
                let price = price_container.querySelector("span.floor-tax").innerText.replace(",","");
                let priceper100gnet = Math.round((price / net)*100);
                let unit = priceper100gnet + "円/100" + unit1;
                要素追加(price_container,unit);
            }
        })
    })
}

function 単価算出(単位){
// 各単位の単価を表示します
    let regex;
    if(単位=="×"){
        regex = new RegExp(単位+"[0-9]{1,}");
    }else{
        regex = new RegExp("[0-9]{1,}"+単位);
    }
    document.querySelectorAll("li.item.product.product-item a.product-item-link").forEach((i)=>{
        i.innerText.split(" ").forEach((x)=>{
            if(regex.test(x)){
                let net
                if(単位=="×"){
                     net = x.match(単位 + "[0-9]{1,}")[0].replace(単位,"");
                }else{
                     net = x.match("[0-9]{1,}"+単位)[0].replace(単位,"");
                }
                if(net>1){
                    let price_container = i.closest("div.product-item-details").querySelector("div.price-container");
                    let price = price_container.querySelector("span.floor-tax").innerText.replace(",","");
                    let priceper100gnet = Math.round((price / net));
                    let unit
                    if(単位=="×"){
                        unit = "単" + priceper100gnet + "円";
                        if(!price_container.querySelector("div.x-calculated-unit")){要素追加(price_container,unit,true)};
                    }else{
                        unit = priceper100gnet + "円/1"+単位;
                        要素追加(price_container,unit,true);
                    }
                }
            }
        })
    })
}

(function() {
    'use strict';
    ページャー判定調整();
    売り切れ非表示();
    係数単価算出("g", "kg");
    係数単価算出("ml", "L");
    ["P","本","杯","袋","個","枚","貫","切","包","食","パック","カップ","×"].forEach((x)=>{
        単価算出(x);
    })
})();
