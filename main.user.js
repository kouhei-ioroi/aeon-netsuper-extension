// ==UserScript==
// @name         イオンネットスーパー便利キット
// @namespace    https://github.com/kouhei-ioroi/aeon-netsuper-extension
// @version      2024-08-01
// @description  イオンネットスーパーの使い勝手をちょっと良くします
// @author       Kouhei Ioroi
// @match        https://shop.aeon.com/netsuper/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aeon.com
// @grant        none
// ==/UserScript==

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

function グラム単価算出(){
// 100グラムあたりの単価を表示します
    let regex = new RegExp("[0-9]{2,}g|[0-9]{1,}kg");
    document.querySelectorAll("li.item.product.product-item a.product-item-link").forEach((i)=>{
        i.innerText.split(" ").forEach((x)=>{
            if(regex.test(x)){
                let net
                if(new RegExp("[0-9]{1,}kg").test(x)){
                    if(new RegExp("×[0-9]{1,}").test(x)){
                        net = (x.match("[0-9]{1,}kg")[0].replace("kg","")*x.match("×[0-9]{1,}")[0].replace("×",""))*1000;
                    }else{
                        net = (x.match("[0-9]{1,}kg")[0].replace("kg",""))*1000;
                    }
                }else{
                    if(new RegExp("×[0-9]{1,}").test(x)){
                        net = x.match("[0-9]{2,}g")[0].replace("g","")*x.match("×[0-9]{1,}")[0].replace("×","");
                    }else{
                        net = x.match("[0-9]{2,}g")[0].replace("g","");
                    }
                }
                let price_container = i.closest("div.product-item-details").querySelector("div.price-container");
                let price = price_container.querySelector("span.floor-tax").innerText.replace(",","");
                let priceper100gnet = Math.round((price / net)*100);
                let 単位 = "00g";
                let pTag;
                pTag = price_container.querySelector("p.x-calc-unit-price");
                if(pTag){
                    pTag.textContent = pTag.textContent + "\n" + priceper100gnet + "円/1"+単位;
                }else{
                    pTag = document.createElement("p");
                    pTag.classList.add("x-calc-unit-price");
                    pTag.textContent = priceper100gnet + "円/1"+単位;
                    price_container.appendChild(pTag);
                }
            }
        })
    })
}

function リットル単価算出(){
// 100mlあたりの単価を表示します
    let regex = new RegExp("[0-9]{2,}ml|[0-9]{1,}L");
    document.querySelectorAll("li.item.product.product-item a.product-item-link").forEach((i)=>{
        i.innerText.split(" ").forEach((x)=>{
            if(regex.test(x)){
                let net
                if(new RegExp("[0-9]{1,}L").test(x)){
                    if(new RegExp("×[0-9]{1,}").test(x)){
                        net = (x.match("[0-9]{1,}L")[0].replace("L","")*x.match("×[0-9]{1,}")[0].replace("×",""))*1000;
                    }else{
                        net = (x.match("[0-9]{1,}L")[0].replace("L",""))*1000;
                    }
                }else{
                    if(new RegExp("×[0-9]{1,}").test(x)){
                        net = x.match("[0-9]{2,}ml")[0].replace("ml","")*x.match("×[0-9]{1,}")[0].replace("×","");
                    }else{
                        net = x.match("[0-9]{2,}ml")[0].replace("ml","");
                    }
                }
                let price_container = i.closest("div.product-item-details").querySelector("div.price-container");
                let price = price_container.querySelector("span.floor-tax").innerText.replace(",","");
                let priceper100gnet = Math.round((price / net)*100);
                let 単位 = "00ml";
                let pTag;
                pTag = price_container.querySelector("p.x-calc-unit-price");
                if(pTag){
                    pTag.textContent = pTag.textContent + "\n" + priceper100gnet + "円/1"+単位;
                }else{
                    pTag = document.createElement("p");
                    pTag.classList.add("x-calc-unit-price");
                    pTag.textContent = priceper100gnet + "円/1"+単位;
                    price_container.appendChild(pTag);
                }
            }
        })
    })
}

function 単価算出(単位){
// 各単位の単価を表示します
    let regex = new RegExp("[0-9]{1,}"+単位);
    document.querySelectorAll("li.item.product.product-item a.product-item-link").forEach((i)=>{
        i.innerText.split(" ").forEach((x)=>{
            if(regex.test(x)){
                let net = x.match("[0-9]{1,}"+単位)[0].replace(単位,"");
                let price_container = i.closest("div.product-item-details").querySelector("div.price-container");
                let price = price_container.querySelector("span.floor-tax").innerText.replace(",","");
                let priceper100gnet = Math.round((price / net));
                let pTag;
                pTag = price_container.querySelector("p.x-calc-unit-price");
                if(pTag){
                    pTag.textContent = pTag.textContent + "\n" + priceper100gnet + "円/1"+単位;
                }else{
                    pTag = document.createElement("p");
                    pTag.classList.add("x-calc-unit-price");
                    pTag.textContent = priceper100gnet + "円/1"+単位;
                    price_container.appendChild(pTag);
                }
            }
        })
    })
}

(function() {
    'use strict';
    ページャー判定調整();
    売り切れ非表示();
    グラム単価算出();
    リットル単価算出();
    単価算出("本");
    単価算出("杯");
    単価算出("袋");
    単価算出("個");
    単価算出("パック");
    単価算出("カップ");
    単価算出("P");
    単価算出("枚");
})();
